
import https from 'node:https'

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'qwen/qwen3.8-27b'

type GroqMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string | Array<Record<string, unknown>>
}

function postToGroq(body: string, key: string) {
  return new Promise<{ body: string; status: number }>((resolve, reject) => {
    const request = https.request(
      GROQ_ENDPOINT,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'content-length': Buffer.byteLength(body),
          'content-type': 'application/json',
        },
      },
      (response) => {
        let responseBody = ''
        response.setEncoding('utf8')
        response.on('data', (chunk) => {
          responseBody += chunk
        })
        response.on('end', () => {
          resolve({ body: responseBody, status: response.statusCode ?? 503 })
        })
      },
    )

    request.setTimeout(30_000, () =>
      request.destroy(new Error('Groq request timed out.')),
    )
    request.on('error', reject)
    request.end(body)
  })
}

export async function askOpenAI(
  messages: GroqMessage[],
  options: { json?: boolean; vision?: boolean } = {},
) {
  const key = process.env.APP_GROQ_API_KEY

  if (!key) throw new Error('Groq is not configured.')

  const requestBody = JSON.stringify({
    model: GROQ_MODEL,
    messages,
    temperature: 0.25,
    max_completion_tokens: 1200,
    ...(options.json ? { response_format: { type: 'json_object' } } : {}),
  })

  let response: Awaited<ReturnType<typeof postToGroq>> | undefined

  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await postToGroq(requestBody, key)

    if (
      response.status < 400 ||
      (response.status !== 429 && response.status < 500)
    ) {
      break
    }

    await new Promise((resolve) => setTimeout(resolve, 300 * 2 ** attempt))
  }

  if (!response || response.status >= 400) {
    const providerMessage = response?.body.slice(0, 300).replaceAll(/\s+/g, ' ')

    console.error(
      `Groq request failed with ${response?.status ?? 503}${providerMessage ? `: ${providerMessage}` : '.'}`,
    )

    throw new Error(`Groq request failed with ${response?.status ?? 503}.`)
  }

  const body = JSON.parse(response.body) as {
    choices?: Array<{ message?: { content?: string }; finish_reason?: string }>
  }

  const content = body.choices?.[0]?.message?.content?.trim()

  if (!content) {
    const reason = body.choices?.[0]?.finish_reason
    throw new Error(
      reason ? `Groq could not answer (${reason}).` : 'Groq returned no answer.',
    )
  }

  return content
}
