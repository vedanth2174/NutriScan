import config from '@payload-config'
import { getPayload } from 'payload'
import { auth } from '@/auth'
import { appAuth } from './app-auth'

export type CurrentAppUser = {
  id: number
  collection: 'users'
  email?: string
  name?: string
  nutritionProfile?: {
    goal?: string
    healthConditions?: unknown
    allergies?: unknown
  }
}

export async function getCurrentAppUser(): Promise<CurrentAppUser | null> {
  const localUser = await appAuth.currentUser()
  if (localUser) return localUser

  if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) return null

  const session = await auth()
  const payloadUserId = (session?.user as { payloadUserId?: string } | undefined)?.payloadUserId
  if (!payloadUserId) return null

  const payload = await getPayload({ config })
  try {
    const user = await payload.findByID({
      collection: 'users',
      id: payloadUserId,
      overrideAccess: true,
    })
    return { ...(user as CurrentAppUser), collection: 'users' }
  } catch {
    return null
  }
}
