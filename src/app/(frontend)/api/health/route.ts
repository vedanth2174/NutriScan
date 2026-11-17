import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
    return Response.json({ status: 'ok', database: 'connected' }, { headers: { 'cache-control': 'no-store' } })
  } catch (error) {
    console.error('[HEALTH CHECK]', error)
    return Response.json(
      { status: 'error', database: 'unavailable' },
      { status: 503, headers: { 'cache-control': 'no-store' } },
    )
  }
}
