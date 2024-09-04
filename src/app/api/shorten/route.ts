import { service } from '@services/shorter'
import type { NextRequest } from 'next/server'

import { tryAsync } from 'try-handler'

const validateUrl = (url: string) => {
  const urlRegex = /^(http|https):\/\/[^ "]+$/
  return urlRegex.test(url)
}

export const POST = async (req: NextRequest): Promise<Response> => {
  const hostUrl = req.headers.get('host') || 'http://localhost:3000'
  const { url: longUrl } = await req.json()

  if (!validateUrl(longUrl))
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    })

  const [error, data] = await tryAsync(() => service().createShorter(longUrl))

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

  const short = `${hostUrl}/${data[0]?.short}`

  return new Response(JSON.stringify({ url: short }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
