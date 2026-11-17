import { auth } from '@/auth'
import config from '@payload-config'
import { getPayload } from 'payload'
import { createHash, randomBytes } from 'node:crypto'

export async function GET() {
  const session = await auth()

  const payloadUserId = (
    session?.user as { payloadUserId?: string } | undefined
  )?.payloadUserId

  if (!payloadUserId) {
    return new Response('Authentication failed.', { status: 401 })
  }

  const payload = await getPayload({ config })

  const user = await payload.findByID({
    collection: 'users',
    id: payloadUserId,
    overrideAccess: true,
  })

  if (!user) {
    return new Response('User not found.', { status: 404 })
  }

  const code = randomBytes(32).toString('base64url')
  const codeHash = createHash('sha256').update(code).digest('hex')

  const pool = (payload.db as unknown as {
    pool: {
      query: (
        query: string,
        values: unknown[],
      ) => Promise<unknown>
    }
  }).pool

  await pool.query(
    `INSERT INTO oauth_handoffs (code_hash, payload_user_id, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '2 minutes')`,
    [codeHash, String(user.id)],
  )

  return Response.redirect(
    `com.nutriscan.app://auth/callback?code=${encodeURIComponent(code)}`,
  )
}