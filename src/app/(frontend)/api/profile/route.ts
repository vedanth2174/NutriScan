import config from '@payload-config'
import { getPayload } from 'payload'
import { getCurrentAppUser } from '@/lib/current-user'
import { normalizeProfile } from '@/lib/nutrition-domain'
import type { User } from '@/payload-types'

export async function PATCH(request: Request) {
  const user = await getCurrentAppUser()
  if (!user) return Response.json({ message: 'Sign in to save your profile.' }, { status: 401 })
  try {
    const body = (await request.json()) as Record<string, unknown>
    const profile = normalizeProfile(body.profile)
    const payload = await getPayload({ config })
    const payloadUser = user as unknown as User
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        onboardingComplete: true,
        nutritionProfile: {
          goal: profile.goal,
          healthConditions: profile.healthConditions,
          allergies: profile.allergies,
        },
      },
      user: payloadUser,
      overrideAccess: false,
      draft: false,
    })
    await payload.create({
      collection: 'assessments',
      data: {
        owner: user.id,
        responses: JSON.parse(JSON.stringify(body.responses ?? profile)),
        goal: profile.goal,
        healthConditions: profile.healthConditions,
        allergies: profile.allergies,
      },
      user: payloadUser,
      overrideAccess: false,
      draft: false,
    })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ message: 'Your profile could not be saved.' }, { status: 400 })
  }
}
