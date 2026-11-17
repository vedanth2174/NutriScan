async function csrfToken() {
  const response = await fetch('/api/auth/csrf', { cache: 'no-store' })
  if (!response.ok) throw new Error('Could not start authentication.')
  const body = (await response.json()) as { csrfToken?: unknown }
  if (typeof body.csrfToken !== 'string' || !body.csrfToken) {
    throw new Error('Authentication is unavailable.')
  }
  return body.csrfToken
}

export async function startGoogleSignIn() {
  const csrf = await csrfToken()
  const response = await fetch('/api/auth/signin/google', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-auth-return-redirect': '1',
    },
    body: new URLSearchParams({ csrfToken: csrf, callbackUrl: '/' }),
  })
  const body = (await response.json().catch(() => null)) as { url?: unknown } | null
  if (!response.ok || typeof body?.url !== 'string' || body.url.includes('error=')) {
    throw new Error('Google sign-in could not start.')
  }
  window.location.assign(body.url)
}

export async function endAuthSession() {
  const csrf = await csrfToken()
  const response = await fetch('/api/auth/signout', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-auth-return-redirect': '1',
    },
    body: new URLSearchParams({ csrfToken: csrf, callbackUrl: '/' }),
  })
  if (!response.ok) throw new Error('Sign-out failed.')
}
