
export type ScanMode = 'camera' | 'barcode' | 'label' | 'gallery' | 'voice' | 'text'

export interface NutritionProfile {
  healthConditions: string[]
  allergies: string[]
  goal: string
}

interface FoodAnalysisBase {
  name: string
  brand?: string
  barcode?: string
  image?: string
  servingSize?: string
  explanation: string
  positives: string[]
  cautions: string[]
  ingredients: string[]
  healthConditions: string[]
}

export interface MealFoodAnalysis extends FoodAnalysisBase {
  source: 'meal'
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  saturatedFat: number
  sodium: number
  confidence: number
  nutriScore: 'A' | 'B' | 'C' | 'D' | 'E'
  personalizedScore: number
  scoreLabel: string
}

export interface BarcodeFoodAnalysis extends FoodAnalysisBase {
  source: 'barcode'
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  fiber: number | null
  sugar: number | null
  saturatedFat: number | null
  sodium: number | null
  confidence: number
  nutriScore: 'A' | 'B' | 'C' | 'D' | 'E' | null
  personalizedScore: number | null
  scoreLabel: string | null
}

export type FoodAnalysis = MealFoodAnalysis | BarcodeFoodAnalysis

export const defaultNutritionProfile: NutritionProfile = {
  healthConditions: ['PCOS'],
  allergies: ['Peanuts', 'Lactose sensitivity'],
  goal: 'Fat loss',
}

export function normalizeProfile(value: unknown): NutritionProfile {
  const profile =
    value && typeof value === 'object'
      ? (value as Record<string, unknown>)
      : {}

  const strings = (input: unknown) =>
    Array.isArray(input)
      ? input
          .filter((item): item is string => typeof item === 'string')
          .slice(0, 20)
      : []

  return {
    healthConditions: strings(profile.healthConditions),
    allergies: strings(profile.allergies),
    goal:
      typeof profile.goal === 'string' && profile.goal.trim()
        ? profile.goal.trim().slice(0, 120)
        : defaultNutritionProfile.goal,
  }
}

export function assertFoodAnalysis(
  value: unknown,
  profile: NutritionProfile,
): MealFoodAnalysis {
  if (!value || typeof value !== 'object') {
    throw new Error('AI returned an invalid food analysis.')
  }

  const item = value as Record<string, unknown>

  const number = (key: string, fallback = 0) => {
    const result = Number(item[key])
    return Number.isFinite(result) ? result : fallback
  }

  const strings = (key: string) =>
    Array.isArray(item[key])
      ? (item[key] as unknown[])
          .filter((entry): entry is string => typeof entry === 'string')
          .slice(0, 12)
      : []

  const score = Math.max(
    1,
    Math.min(100, Math.round(number('personalizedScore', 60))),
  )

  const grade = String(item.nutriScore || 'C').toUpperCase()

  return {
    source: 'meal',
    name: String(item.name || 'Analyzed meal').slice(0, 160),
    calories: Math.max(0, Math.round(number('calories'))),
    protein: Math.max(0, number('protein')),
    carbs: Math.max(0, number('carbs')),
    fat: Math.max(0, number('fat')),
    fiber: Math.max(0, number('fiber')),
    sugar: Math.max(0, number('sugar')),
    saturatedFat: Math.max(0, number('saturatedFat')),
    sodium: Math.max(0, number('sodium')),
    confidence: Math.max(
      1,
      Math.min(100, Math.round(number('confidence', 70))),
    ),
    nutriScore: ['A', 'B', 'C', 'D', 'E'].includes(grade)
      ? (grade as MealFoodAnalysis['nutriScore'])
      : 'C',
    personalizedScore: score,
    scoreLabel:
      typeof item.scoreLabel === 'string'
        ? item.scoreLabel.slice(0, 80)
        : score >= 80
          ? 'Great fit'
          : score >= 65
            ? 'Good fit'
            : score >= 45
              ? 'Occasional choice'
              : 'Limit for you',
    explanation: String(
      item.explanation ||
        'Analysis is based on the visible meal and your profile.',
    ).slice(0, 800),
    positives: strings('positives'),
    cautions: strings('cautions'),
    ingredients: strings('ingredients'),
    healthConditions: profile.healthConditions,
  }
}
