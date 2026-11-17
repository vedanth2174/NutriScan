import { appAuth, appSessionCookie } from '@/lib/app-auth'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const errors: Record<string, string> = {}
    if (name.length < 2 || name.length > 80) errors.name = 'Enter your name.'
    if (!emailPattern.test(email)) errors.email = 'Enter a valid email address.'
    if (password.length < 8 || password.length > 128) {
      errors.password = 'Use at least 8 characters.'
    }
    if (Object.keys(errors).length) {
      return Response.json({ ok: false, errors }, { status: 400 })
    }

    const { token, user } = await appAuth.signup(name, email, password)
    const response = Response.json({ ok: true, user: { id: user.id, name, email } })
    response.headers.append('set-cookie', appSessionCookie(token, request))
    return response
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    const duplicate = /already exists|duplicate key|unique constraint|email.*taken/i.test(detail)
    if (!duplicate) console.error('[APP SIGNUP ERROR]', error)
    return Response.json(
      {
        ok: false,
        message: duplicate
          ? 'An account with this email already exists.'
          : 'Account creation failed. Check the server configuration and logs.',
      },
      { status: duplicate ? 409 : 500 },
    )
  }
}
