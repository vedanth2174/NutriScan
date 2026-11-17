
import config from '@payload-config'
import { getPayload } from 'payload'
import { getCurrentAppUser } from '@/lib/current-user'
import type { User } from '@/payload-types'

export async function GET() {
  try {
    const user = await getCurrentAppUser()

    if (!user) {
      return Response.json(
        { message: 'Please sign in to view your scan history.' },
        { status: 401 },
      )
    }

    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'food-scans',
      where: {
        owner: {
          equals: user.id,
        },
      },
      sort: '-createdAt',
      limit: 50,
      depth: 0,
      user: user as unknown as User,
      overrideAccess: false,
    })

    return Response.json({
      scans: result.docs,
      total: result.totalDocs,
    })
  } catch (error) {
    console.error('[Scan History API] Failed:', error)

    return Response.json(
      { message: 'Could not load scan history.' },
      { status: 500 },
    )
  }
}
