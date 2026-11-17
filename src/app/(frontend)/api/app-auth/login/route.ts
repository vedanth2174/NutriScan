import { appAuth, appSessionCookie } from '@/lib/app-auth'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    if (!email || !password) {
      return Response.json(
        { ok: false, message: 'Email and password are required.' },
        { status: 400 },
      )
    }
    const { token, user } = await appAuth.login(email, password)
    const response = Response.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email },
    })
    response.headers.append('set-cookie', appSessionCookie(token, request))
    return response
  } catch {
    return Response.json({ ok: false, message: 'Invalid email or password.' }, { status: 401 })
  }
}
