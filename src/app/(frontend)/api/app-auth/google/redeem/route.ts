import config from '@payload-config'
import { appSessionCookie } from '@/lib/app-auth'
import { getPayload, createAuthToken, createPayloadRequest } from 'payload'
import { createHash } from 'node:crypto'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { code?: unknown }

    if (typeof body.code !== 'string' || body.code.length > 200) {
      return Response.json(
        { ok: false, message: 'Invalid sign-in code.' },
        { status: 400 },
      )
    }

    const codeHash = createHash('sha256')
      .update(body.code)
      .digest('hex')

    const payload = await getPayload({ config })

    const pool = (payload.db as unknown as {
      pool: {
        query: (
          query: string,
          values: unknown[],
        ) => Promise<{
          rows: Array<{ payload_user_id: string }>
        }>
      }
    }).pool

    // Atomic one-time redemption. Only one request can consume this code.
    const result = await pool.query(
      `DELETE FROM oauth_handoffs
       WHERE code_hash = $1
         AND expires_at > NOW()
       RETURNING payload_user_id`,
      [codeHash],
    )

    const handoff = result.rows[0]

    if (!handoff) {
      return Response.json(
        { ok: false, message: 'Sign-in code expired or already used.' },
        { status: 401 },
      )
    }

    const user = await payload.findByID({
      collection: 'users',
      id: handoff.payload_user_id,
      overrideAccess: true,
    })

    if (!user || !user.email) {
      return Response.json(
        { ok: false, message: 'User account unavailable.' },
        { status: 401 },
      )
    }

    const authUser = {
      ...user,
      collection: 'users',
    }

    const req = await createPayloadRequest({
      payload,
      user: authUser as never,
    })

    const authResult = await createAuthToken({
      collectionConfig: payload.collections.users.config,
      email: user.email,
      req,
      user: authUser as never,
    })

    const response = Response.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })

    response.headers.append(
      'set-cookie',
      appSessionCookie(authResult.token, request),
    )

    return response
  } catch (error) {
    console.error('[Google handoff redemption]', error)

    return Response.json(
      { ok: false, message: 'Could not complete Google sign-in.' },
      { status: 500 },
    )
  }
}