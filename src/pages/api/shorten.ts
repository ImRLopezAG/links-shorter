import { service } from '@services/shorter'
import type { APIRoute } from 'astro'
import { tryAsync } from 'try-handler'

export const prerender = false

const validateUrl = (url: string) => {
  const urlRegex = /^(http|https):\/\/[^ "]+$/
  return urlRegex.test(url)
}

export const POST: APIRoute = async ({ url, request }): Promise<Response> => {
  const { host, protocol } = url
  const hostUrl = `${protocol}//${host}`
  const { url: longUrl } = await request.json()

  if (!validateUrl(longUrl))
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    })

  const [error, data] = await tryAsync(() =>
    service().createShorter(longUrl, hostUrl)
  )

  if (error || !data) {
    if (error?.message.includes('UNIQUE')) {
      return new Response(JSON.stringify({ error: 'URL already shortened' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  return new Response(JSON.stringify(data[0]), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
