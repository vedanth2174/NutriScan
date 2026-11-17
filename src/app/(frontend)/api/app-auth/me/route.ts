import { getCurrentAppUser } from '@/lib/current-user'

export async function GET() {
  const user = await getCurrentAppUser()
  return Response.json(
    user ? { user: { id: user.id, name: user.name, email: user.email } } : { user: null },
    { headers: { 'cache-control': 'no-store' } },
  )
}
