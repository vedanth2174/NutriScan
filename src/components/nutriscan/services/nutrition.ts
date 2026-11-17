export {
  defaultNutritionProfile,
  type BarcodeFoodAnalysis,
  type FoodAnalysis,
  type MealFoodAnalysis,
  type NutritionProfile,
  type ScanMode,
} from '@/lib/nutrition-domain'

import {
  defaultNutritionProfile,
  type BarcodeFoodAnalysis,
  type FoodAnalysis,
  type MealFoodAnalysis,
  type NutritionProfile,
  type ScanMode,
} from '@/lib/nutrition-domain'

async function readResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => ({}))) as T & { message?: string }
  if (!response.ok) throw new Error(body.message || 'The request could not be completed.')
  return body
}

export const nutritionService = {
  async analyzeFood(
    mode: Exclude<ScanMode, 'barcode'>,
    profile: NutritionProfile = defaultNutritionProfile,
    options: { image?: File; description?: string } = {},
  ): Promise<MealFoodAnalysis> {
    const form = new FormData()
    form.set('mode', mode)
    form.set('profile', JSON.stringify(profile))
    if (options.image) form.set('image', options.image)
    if (options.description) form.set('description', options.description)
    return readResponse<MealFoodAnalysis>(
      await fetch('/api/nutrition/analyze', { method: 'POST', body: form }),
    )
  },
  async lookupBarcode(code: string): Promise<BarcodeFoodAnalysis> {
    return readResponse<BarcodeFoodAnalysis>(
      await fetch('/api/nutrition/barcode', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code }),
      }),
    )
  },

  async getScanHistory(): Promise<{
    scans: Array<{
      id: number
      mode: ScanMode
      barcode?: string | null
      foodName: string
      brand?: string | null
      personalizedScore?: number | null
      result: FoodAnalysis
      createdAt: string
    }>
    total: number
  }> {
    return readResponse(
      await fetch('/api/nutrition/history'),
    )
  },

  async parseLabel(image: Blob): Promise<string[]> {
    const result = await this.analyzeFood('label', defaultNutritionProfile, {
      image: new File([image], 'label.jpg', { type: image.type || 'image/jpeg' }),
    })
    return result.ingredients
  },
  async askAI(message: string): Promise<string> {
    const body = await readResponse<{ answer: string }>(
      await fetch('/api/nutrition/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message, threadId: 'default' }),
      }),
    )
    return body.answer
  },
}
