import config from '@payload-config'
import { getPayload } from 'payload'
import { getCurrentAppUser } from '@/lib/current-user'
import { askOpenAI } from '@/lib/openai'
import { assertFoodAnalysis, normalizeProfile, type ScanMode } from '@/lib/nutrition-domain'
import type { User } from '@/payload-types'

const modes = new Set<ScanMode>(['camera', 'label', 'gallery', 'voice', 'text'])

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const mode = form.get('mode')
    if (typeof mode !== 'string' || !modes.has(mode as ScanMode)) {
      return Response.json({ message: 'Unsupported scan mode.' }, { status: 400 })
    }
    const profile = normalizeProfile(JSON.parse(String(form.get('profile') || '{}')))
    const description = String(form.get('description') || '')
      .trim()
      .slice(0, 1000)
    const image = form.get('image')
    const system = `You are NutriScan, a cautious nutrition assistant. Estimate visible or described food without claiming medical diagnosis. Return JSON only with: name, calories, protein, carbs, fat, fiber, sugar, saturatedFat, sodium (grams), confidence (1-100), nutriScore (A-E), personalizedScore (1-100), scoreLabel, explanation, positives (string array), cautions (string array), ingredients (string array). Personalize for goal "${profile.goal}", conditions ${JSON.stringify(profile.healthConditions)}, and allergies ${JSON.stringify(profile.allergies)}. Mention uncertainty.`
    let userContent: string | Array<Record<string, unknown>> = description
      ? `Analyze this ${mode} meal description: ${description}`
      : `Analyze the food in this ${mode} input.`
    let vision = false
    if (image instanceof File && image.size > 0) {
      if (image.size > 8 * 1024 * 1024 || !image.type.startsWith('image/')) {
        return Response.json({ message: 'Upload a food image under 8 MB.' }, { status: 400 })
      }
      const data = Buffer.from(await image.arrayBuffer()).toString('base64')
      userContent = [
        { type: 'text', text: description || `Analyze this ${mode} food image.` },
        { type: 'image_url', image_url: { url: `data:${image.type};base64,${data}` } },
      ]
      vision = true
    }
    const raw = await askOpenAI(
      [
        { role: 'system', content: system },
        { role: 'user', content: userContent },
      ],
      { json: true, vision },
    )
    const result = assertFoodAnalysis(JSON.parse(raw), profile)
    const user = await getCurrentAppUser()
    if (user) {
      const payload = await getPayload({ config })
      await payload.create({
        collection: 'food-scans',
        data: {
          owner: user.id,
          mode: mode as ScanMode,
          foodName: result.name,
          result: JSON.parse(JSON.stringify(result)),
          personalizedScore: result.personalizedScore,
        },
        user: user as unknown as User,
        overrideAccess: false,
        draft: false,
      })
    }
    return Response.json(result)
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'Food analysis failed.' },
      { status: 502 },
    )
  }
}
