import config from '@payload-config'
import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export async function syncGoogleUser(profile: {
  sub?: string
  email?: string
  name?: string
  picture?: string
}) {
  if (!profile.sub) throw new Error('Google returned no stable user identifier.')
  if (!profile.email) throw new Error('Google did not provide an email address.')
  const payload = await getPayload({ config })
  const byProvider = await payload.find({
    collection: 'users',
    where: { googleProviderId: { equals: profile.sub } },
    limit: 1,
    overrideAccess: true,
  })
  if (byProvider.docs[0]) return byProvider.docs[0]

  const byEmail = await payload.find({
    collection: 'users',
    where: { email: { equals: profile.email } },
    limit: 1,
    overrideAccess: true,
  })
  if (byEmail.docs[0]) {
    return payload.update({
      collection: 'users',
      id: byEmail.docs[0].id,
      data: {
        googleProviderId: profile.sub,
        avatarURL: profile.picture,
        name: profile.name || (byEmail.docs[0] as { name?: string }).name || 'NutriScan user',
      },
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'users',
    data: {
      email: profile.email,
      name: profile.name || 'NutriScan user',
      avatarURL: profile.picture,
      googleProviderId: profile.sub,
      password: randomBytes(32).toString('base64url'),
    },
    overrideAccess: true,
    draft: false,
  })
}

const googleConfigured = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: googleConfigured ? [Google] : [],
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === 'google' && profile) {
        const user = await syncGoogleUser({
          sub: profile.sub ?? undefined,
          email: profile.email ?? undefined,
          name: profile.name ?? undefined,
          picture: profile.picture ?? undefined,
        })
        token.payloadUserId = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as typeof session.user & { payloadUserId?: string }).payloadUserId =
          token.payloadUserId as string | undefined
      }
      return session
    },
  },
})
