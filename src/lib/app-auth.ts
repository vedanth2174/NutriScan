import config from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

const APP_SESSION_COOKIE = 'app-session'

export function appSessionCookie(token: string, request: Request, maxAge = 7 * 24 * 60 * 60) {
  const secure = process.env.NODE_ENV === 'production' || new URL(request.url).protocol === 'https:'
  return `${APP_SESSION_COOKIE}=${token}; HttpOnly; ${secure ? 'Secure; ' : ''}SameSite=Lax; Path=/; Max-Age=${maxAge}`
}
const USERS_COLLECTION = 'users' as const

type AppUser = {
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

export function createAppAuth() {
  return {
    async currentUser(): Promise<AppUser | null> {
      const token = (await cookies()).get(APP_SESSION_COOKIE)?.value
      if (!token) return null

      const payload = await getPayload({ config })
      const authHeaders = new Headers({ Authorization: `JWT ${token}` })
      const { user } = await payload.auth({ headers: authHeaders })
      if (!user || user.collection !== 'users') return null
      return user as AppUser
    },

    async login(email: string, password: string) {
      const payload = await getPayload({ config })
      const result = await payload.login({
        collection: USERS_COLLECTION,
        data: { email, password },
      })
      if (!result.token || !result.user || result.user.collection !== 'users') {
        throw new Error('Unable to sign in.')
      }
      return { token: result.token, user: result.user as AppUser }
    },

    async signup(name: string, email: string, password: string) {
      const payload = await getPayload({ config })
      await payload.create({
        collection: USERS_COLLECTION,
        data: { name, email, password },
        overrideAccess: false,
      })
      return this.login(email, password)
    },
  }
}

export const appAuth = createAppAuth()
export { APP_SESSION_COOKIE }
