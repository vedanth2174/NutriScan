import { appSessionCookie } from '@/lib/app-auth'

export async function POST(request: Request) {
  return new Response(null, {
    status: 204,
    headers: { 'set-cookie': appSessionCookie('', request, 0) },
  })
}
