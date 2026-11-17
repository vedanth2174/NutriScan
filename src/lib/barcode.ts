import type { BarcodeFoodAnalysis, NutritionProfile } from "./nutrition-domain";

type OpenFoodFactsProduct = {
  product_name?: string;
  brands?: string;
  image_front_url?: string;
  image_url?: string;
  serving_size?: string;
  ingredients_text?: string;
  allergens?: string;
  allergens_tags?: string[];
  nutriscore_grade?: string;
  nutriments?: Record<string, number | string | undefined>;
};

function numberValue(value: number | string | undefined): number | null {
  if (value === undefined || value === null || value === "") return null;

  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

const clamp = (value: number) => Math.max(1, Math.min(100, Math.round(value)));

const allergyAliases: Record<string, string[]> = {
  peanut: ["peanut", "peanuts", "groundnut", "groundnuts", "arachis"],
  lactose: [
    "dairy",
    "milk",
    "lactose",
    "whey",
    "casein",
    "caseinate",
    "butter",
    "cream",
    "cheese",
    "milk powder",
    "milk solids",
    "ghee",
  ],
  gluten: [
    "wheat",
    "barley",
    "rye",
    "spelt",
    "semolina",
    "durum",
    "malt",
    "gluten",
  ],
  shellfish: [
    "shellfish",
    "crustacean",
    "shrimp",
    "prawn",
    "crab",
    "lobster",
    "crayfish",
    "mussel",
    "clam",
    "oyster",
    "scallop",
  ],
  egg: ["egg", "eggs", "albumin", "ovalbumin"],
  soy: ["soy", "soya", "soybean", "soybeans"],
  sesame: ["sesame", "tahini"],
  "tree nut": [
    "tree nut",
    "tree nuts",
    "nut",
    "nuts",
    "almond",
    "cashew",
    "walnut",
    "pecan",
    "pistachio",
    "hazelnut",
    "macadamia",
    "brazil nut",
  ],
};

const normalizeWords = (value: string) =>
  ` ${value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()} `;

const includesTerm = (source: string, term: string) =>
  source.includes(normalizeWords(term));

function aliasesForAllergy(allergy: string) {
  const normalized = normalizeWords(allergy);

  const aliasGroup = Object.entries(allergyAliases).find(
    ([key, aliases]) =>
      includesTerm(normalized, key) ||
      aliases.some((alias) => includesTerm(normalized, alias)),
  );

  if (aliasGroup) return aliasGroup[1];

  const specificTerms = normalized
    .trim()
    .split(/\s+/)
    .filter(
      (term) =>
        term.length >= 3 &&
        !["allergy", "allergic", "sensitivity", "intolerance"].includes(term),
    );

  return specificTerms.length ? specificTerms : [allergy];
}

export function findAllergyMatches(
  product: OpenFoodFactsProduct,
  allergies: string[],
) {
  const ingredientSource = normalizeWords(
    [
      product.ingredients_text,
      product.allergens,
      ...(product.allergens_tags ?? []).map((tag) =>
        tag.replace(/^[a-z]{2}:/, ""),
      ),
    ]
      .filter(Boolean)
      .join(" "),
  );

  if (!ingredientSource.trim()) return [];

  return allergies
    .map((allergy) => ({
      allergy,
      ingredients: aliasesForAllergy(allergy).filter((alias) =>
        includesTerm(ingredientSource, alias),
      ),
    }))
    .filter((match) => match.ingredients.length > 0);
}

function decodeHtmlEntities(value: string): string {
  return value.replace(
    /&(#(?:x[\da-f]+|\d+)|amp|quot|apos|lt|gt);/gi,
    (entity, code: string) => {
      if (code.startsWith("#")) {
        const isHex = code[1]?.toLowerCase() === "x";
        const number = Number.parseInt(
          code.slice(isHex ? 2 : 1),
          isHex ? 16 : 10,
        );

        if (
          Number.isInteger(number) &&
          number >= 0 &&
          number <= 0x10ffff &&
          !(number >= 0xd800 && number <= 0xdfff)
        ) {
          return String.fromCodePoint(number);
        }

        return entity;
      }

      const entities: Record<string, string> = {
        amp: "&",
        quot: '"',
        apos: "'",
        lt: "<",
        gt: ">",
      };

      return entities[code.toLowerCase()] ?? entity;
    },
  );
}

export function personalizeProduct(
  product: OpenFoodFactsProduct,
  barcode: string,
  profile: NutritionProfile,
): BarcodeFoodAnalysis {
  const nutrients = product.nutriments ?? {};

  const protein = numberValue(nutrients.proteins_100g);
  const carbs = numberValue(nutrients.carbohydrates_100g);
  const fat = numberValue(nutrients.fat_100g);
  const fiber = numberValue(nutrients.fiber_100g);
  const sugar = numberValue(nutrients.sugars_100g);
  const saturatedFat = numberValue(nutrients["saturated-fat_100g"]);

  const sodiumDirect = numberValue(nutrients.sodium_100g);
  const salt = numberValue(nutrients.salt_100g);

  const sodium =
    sodiumDirect !== null ? sodiumDirect : salt !== null ? salt / 2.5 : null;

  const energyKcal = numberValue(nutrients["energy-kcal_100g"]);
  const energyKj = numberValue(nutrients.energy_100g);

  const calories =
    energyKcal !== null
      ? Math.round(energyKcal)
      : energyKj !== null
        ? Math.round(energyKj / 4.184)
        : null;

  const requiredNutrients = [
    protein,
    carbs,
    fat,
    sugar,
    saturatedFat,
    sodium,
    calories,
  ];

  const hasCompleteScoringData = requiredNutrients.every(
    (value) => value !== null,
  );

  const allergyMatches = findAllergyMatches(product, profile.allergies);

  const positives: string[] = [];
  const cautions: string[] = [];
  const conditionNotes: string[] = [];

  let personalizedScore: number | null = null;
  let scoreLabel: string | null = null;

  if (hasCompleteScoringData) {
    let score = 72;

    if (protein! >= 10) {
      score += Math.min(10, protein! / 2);
      positives.push(`${Math.round(protein!)}g protein supports fullness`);
    }

    if (fiber !== null && fiber >= 3) {
      score += Math.min(10, fiber * 1.5);
      positives.push(`${fiber.toFixed(1)}g fiber supports steadier energy`);
    }

    if (sugar! <= 5) {
      score += 5;
      positives.push("Low in sugar");
    } else {
      score -= Math.min(22, (sugar! - 5) * 1.25);
      cautions.push(`${sugar!.toFixed(1)}g sugar per 100g`);
    }

    if (saturatedFat! > 3) {
      score -= Math.min(16, (saturatedFat! - 3) * 1.4);
      cautions.push(`${saturatedFat!.toFixed(1)}g saturated fat per 100g`);
    }

    if (sodium! > 0.4) {
      score -= Math.min(16, (sodium! - 0.4) * 18);
      cautions.push(`${Math.round(sodium! * 1000)}mg sodium per 100g`);
    }

    for (const condition of profile.healthConditions) {
      if ((condition === "Diabetes" || condition === "PCOS") && sugar! > 8) {
        score -= Math.min(16, (sugar! - 8) * 0.7);
        conditionNotes.push(
          `its sugar level is less suitable for ${condition}`,
        );
      }

      if (condition === "High BP" && sodium! > 0.3) {
        score -= Math.min(18, sodium! * 14);
        conditionNotes.push(
          "the sodium level needs care with high blood pressure",
        );
      }

      if (condition === "Thyroid" && fiber !== null && fiber >= 3) {
        score += 3;
      }
    }

    if (profile.goal === "Fat loss" && protein! >= 10) {
      score += 4;
    }

    personalizedScore = clamp(score);
  }

  if (allergyMatches.length) {
    personalizedScore =
      personalizedScore === null ? null : Math.min(personalizedScore, 10);

    for (const match of allergyMatches) {
      cautions.unshift(
        `Allergy warning: ${match.allergy} matches ${[
          ...new Set(match.ingredients),
        ].join(", ")}`,
      );
    }

    scoreLabel = "Allergy warning";
  } else if (personalizedScore !== null) {
    scoreLabel =
      personalizedScore >= 80
        ? "Great fit"
        : personalizedScore >= 65
          ? "Good fit"
          : personalizedScore >= 45
            ? "Occasional choice"
            : "Limit for you";
  }

  if (profile.allergies.length && !product.ingredients_text?.trim()) {
    cautions.unshift(
      "Ingredient list unavailable; allergy safety could not be verified",
    );
  }

  if (personalizedScore === null) {
    cautions.unshift(
      "Insufficient nutrition data for a reliable personalized score",
    );
  }

  const grade = product.nutriscore_grade?.trim().toUpperCase();

  const validGrade =
    grade && ["A", "B", "C", "D", "E"].includes(grade)
      ? (grade as BarcodeFoodAnalysis["nutriScore"])
      : null;

  const availableFields = [
    product.product_name,
    product.brands,
    calories,
    protein,
    carbs,
    fat,
    fiber,
    sugar,
    saturatedFat,
    sodium,
    product.ingredients_text,
    validGrade,
  ];

  const confidence = Math.round(
    (availableFields.filter(
      (value) => value !== null && value !== undefined && value !== "",
    ).length /
      availableFields.length) *
      100,
  );

  return {
    source: "barcode",
    name: product.product_name?.trim() || "Unknown packaged food",
    brand: product.brands?.split(",")[0]?.trim() || undefined,
    barcode,
    image: product.image_front_url || product.image_url,
    servingSize: product.serving_size,
    calories,
    protein,
    carbs,
    fat,
    fiber,
    sugar,
    saturatedFat,
    sodium,
    confidence,
    nutriScore: validGrade,
    personalizedScore,
    scoreLabel,
    explanation: allergyMatches.length
      ? `The available ingredient information matches your saved ${allergyMatches
          .map((match) => match.allergy)
          .join(
            " and ",
          )} profile. Do not assume the product is safe based on this database match alone; verify the package label.`
      : personalizedScore === null
        ? "The product record does not contain enough nutrition information to calculate a reliable personalized score. Check the product package for complete nutrition details."
        : `For your ${profile.healthConditions.join(" and ") || "health"} profile, ${
            positives.slice(0, 2).join(" and ").toLowerCase() ||
            "no major positive nutrients were identified"
          }; however, ${
            conditionNotes[0] ??
            cautions[0]?.toLowerCase() ??
            "no major nutrition flags were found in the available data"
          }.`,
    positives,
    cautions,
    ingredients: product.ingredients_text?.trim()
      ? [
          decodeHtmlEntities(product.ingredients_text)
            .replace(/\s+/g, " ")
            .trim(),
        ]
      : [],
    healthConditions: profile.healthConditions,
  };
}
