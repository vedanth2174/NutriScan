import type { FoodAnalysis, NutritionProfile } from './nutrition-domain'

type OpenFoodFactsProduct = {
  product_name?: string
  brands?: string
  image_front_url?: string
  image_url?: string
  serving_size?: string
  ingredients_text?: string
  allergens?: string
  allergens_tags?: string[]
  nutriscore_grade?: string
  nutriments?: Record<string, number | string | undefined>
}

const numberValue = (value: number | string | undefined) => {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(value ?? '0')
  return Number.isFinite(parsed) ? parsed : 0
}
const clamp = (value: number) => Math.max(1, Math.min(100, Math.round(value)))

const allergyAliases: Record<string, string[]> = {
  peanut: ['peanut', 'peanuts', 'groundnut', 'groundnuts', 'arachis'],
  lactose: [
    'dairy',
    'milk',
    'lactose',
    'whey',
    'casein',
    'caseinate',
    'butter',
    'cream',
    'cheese',
    'milk powder',
    'milk solids',
    'ghee',
  ],
  gluten: ['wheat', 'barley', 'rye', 'spelt', 'semolina', 'durum', 'malt', 'gluten'],
  shellfish: [
    'shellfish',
    'crustacean',
    'shrimp',
    'prawn',
    'crab',
    'lobster',
    'crayfish',
    'mussel',
    'clam',
    'oyster',
    'scallop',
  ],
  egg: ['egg', 'eggs', 'albumin', 'ovalbumin'],
  soy: ['soy', 'soya', 'soybean', 'soybeans'],
  sesame: ['sesame', 'tahini'],
  'tree nut': [
    'tree nut',
    'tree nuts',
    'nut',
    'nuts',
    'almond',
    'cashew',
    'walnut',
    'pecan',
    'pistachio',
    'hazelnut',
    'macadamia',
    'brazil nut',
  ],
}

const normalizeWords = (value: string) =>
  ` ${value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()} `

const includesTerm = (source: string, term: string) => source.includes(normalizeWords(term))

function aliasesForAllergy(allergy: string) {
  const normalized = normalizeWords(allergy)
  const aliasGroup = Object.entries(allergyAliases).find(
    ([key, aliases]) =>
      includesTerm(normalized, key) || aliases.some((alias) => includesTerm(normalized, alias)),
  )
  if (aliasGroup) return aliasGroup[1]

  const specificTerms = normalized
    .trim()
    .split(/\s+/)
    .filter(
      (term) =>
        term.length >= 3 && !['allergy', 'allergic', 'sensitivity', 'intolerance'].includes(term),
    )
  return specificTerms.length ? specificTerms : [allergy]
}

export function findAllergyMatches(product: OpenFoodFactsProduct, allergies: string[]) {
  const ingredientSource = normalizeWords(
    [
      product.ingredients_text,
      product.allergens,
      ...(product.allergens_tags ?? []).map((tag) => tag.replace(/^[a-z]{2}:/, '')),
    ]
      .filter(Boolean)
      .join(' '),
  )
  if (!ingredientSource.trim()) return []

  return allergies
    .map((allergy) => ({
      allergy,
      ingredients: aliasesForAllergy(allergy).filter((alias) =>
        includesTerm(ingredientSource, alias),
      ),
    }))
    .filter((match) => match.ingredients.length > 0)
}

export function personalizeProduct(
  product: OpenFoodFactsProduct,
  barcode: string,
  profile: NutritionProfile,
): FoodAnalysis {
  const nutrients = product.nutriments ?? {}
  const protein = numberValue(nutrients.proteins_100g)
  const carbs = numberValue(nutrients.carbohydrates_100g)
  const fat = numberValue(nutrients.fat_100g)
  const fiber = numberValue(nutrients.fiber_100g)
  const sugar = numberValue(nutrients.sugars_100g)
  const saturatedFat = numberValue(nutrients['saturated-fat_100g'])
  const sodium = numberValue(nutrients.sodium_100g) || numberValue(nutrients.salt_100g) / 2.5
  const calories =
    numberValue(nutrients['energy-kcal_100g']) || numberValue(nutrients.energy_100g) / 4.184
  let score = 72
  const positives: string[] = []
  const cautions: string[] = []
  const allergyMatches = findAllergyMatches(product, profile.allergies)

  if (protein >= 10) {
    score += Math.min(10, protein / 2)
    positives.push(`${Math.round(protein)}g protein supports fullness`)
  }
  if (fiber >= 3) {
    score += Math.min(10, fiber * 1.5)
    positives.push(`${fiber.toFixed(1)}g fiber supports steadier energy`)
  }
  if (sugar <= 5) {
    score += 5
    positives.push('Low in sugar')
  } else {
    score -= Math.min(22, (sugar - 5) * 1.25)
    cautions.push(`${sugar.toFixed(1)}g sugar per 100g`)
  }
  if (saturatedFat > 3) {
    score -= Math.min(16, (saturatedFat - 3) * 1.4)
    cautions.push(`${saturatedFat.toFixed(1)}g saturated fat per 100g`)
  }
  if (sodium > 0.4) {
    score -= Math.min(16, (sodium - 0.4) * 18)
    cautions.push(`${Math.round(sodium * 1000)}mg sodium per 100g`)
  }

  const conditionNotes: string[] = []
  for (const condition of profile.healthConditions) {
    if ((condition === 'Diabetes' || condition === 'PCOS') && sugar > 8) {
      score -= Math.min(16, (sugar - 8) * 0.7)
      conditionNotes.push(`its sugar level is less suitable for ${condition}`)
    }
    if (condition === 'High BP' && sodium > 0.3) {
      score -= Math.min(18, sodium * 14)
      conditionNotes.push('the sodium level needs care with high blood pressure')
    }
    if (condition === 'Thyroid' && fiber >= 3) score += 3
  }
  if (profile.goal === 'Fat loss' && protein >= 10) score += 4

  if (allergyMatches.length) {
    score = Math.min(score, 10)
    for (const match of allergyMatches) {
      cautions.unshift(
        `Allergy warning: ${match.allergy} matches ${[...new Set(match.ingredients)].join(', ')}`,
      )
    }
  } else if (profile.allergies.length && !product.ingredients_text?.trim()) {
    cautions.unshift('Ingredient list unavailable; allergy safety could not be verified')
  }

  const personalizedScore = clamp(score)
  const scoreLabel = allergyMatches.length
    ? 'Allergy warning'
    : personalizedScore >= 80
      ? 'Great fit'
      : personalizedScore >= 65
        ? 'Good fit'
        : personalizedScore >= 45
          ? 'Occasional choice'
          : 'Limit for you'
  const grade = product.nutriscore_grade?.toUpperCase()

  return {
    source: 'barcode',
    name: product.product_name?.trim() || 'Unknown packaged food',
    brand: product.brands?.split(',')[0]?.trim(),
    barcode,
    image: product.image_front_url || product.image_url,
    servingSize: product.serving_size,
    calories: Math.round(calories),
    protein,
    carbs,
    fat,
    fiber,
    sugar,
    saturatedFat,
    sodium,
    confidence: 99,
    nutriScore: ['A', 'B', 'C', 'D', 'E'].includes(grade ?? '')
      ? (grade as FoodAnalysis['nutriScore'])
      : personalizedScore >= 80
        ? 'A'
        : personalizedScore >= 65
          ? 'B'
          : personalizedScore >= 50
            ? 'C'
            : personalizedScore >= 35
              ? 'D'
              : 'E',
    personalizedScore,
    scoreLabel,
    explanation: allergyMatches.length
      ? `This product's ingredient information matches your saved ${allergyMatches
          .map((match) => match.allergy)
          .join(
            ' and ',
          )} profile. Avoid it unless the package and a qualified clinician confirm it is safe for you.`
      : `For your ${profile.healthConditions.join(' and ') || 'health'} profile, ${
          positives.slice(0, 2).join(' and ').toLowerCase() || 'it offers limited protein and fiber'
        }; however, ${
          conditionNotes[0] ?? cautions[0]?.toLowerCase() ?? 'no major nutrition flags were found'
        }.`,
    positives: positives.length ? positives : ['No major positive nutrients identified'],
    cautions: cautions.length ? cautions : ['No major nutrition flags'],
    ingredients:
      product.ingredients_text
        ?.split(',')
        .map((ingredient) => ingredient.trim())
        .filter(Boolean)
        .slice(0, 12) ?? [],
    healthConditions: profile.healthConditions,
  }
}
