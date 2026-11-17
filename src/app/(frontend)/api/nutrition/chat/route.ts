import config from '@payload-config'
import { getPayload } from 'payload'
import { getCurrentAppUser } from '@/lib/current-user'
import { askOpenAI } from '@/lib/openai'
import type { User } from '@/payload-types'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    if (!message || message.length > 2000) {
      return Response.json({ message: 'Enter a message under 2,000 characters.' }, { status: 400 })
    }
    const user = await getCurrentAppUser()
    const profile = user?.nutritionProfile
    const answer = await askOpenAI([
      {
        role: 'system',
        content: `You are NutriBites, a concise evidence-aware nutrition co-pilot. Give practical Indian and global food suggestions. Do not diagnose or replace a clinician. User profile: ${JSON.stringify(profile || {})}. Clearly state uncertainty and recommend professional care for medical red flags.`,
      },
      { role: 'user', content: message },
    ])

    if (user) {
      const payload = await getPayload({ config })
      const threadId =
        typeof body.threadId === 'string' && body.threadId.length <= 80 ? body.threadId : 'default'
      for (const item of [
        { role: 'user', content: message },
        { role: 'assistant', content: answer },
      ] as const) {
        await payload.create({
          collection: 'chat-messages',
          data: { owner: user.id, threadId, ...item },
          user: user as unknown as User,
          overrideAccess: false,
          draft: false,
        })
      }
    }
    return Response.json({ answer })
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'NutriBites is unavailable.' },
      { status: 502 },
    )
  }
}
