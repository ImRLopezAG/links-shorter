import { service } from '@services/image'
import type { APIRoute } from 'astro'
import { tryAsync } from 'try-handler'

export const prerender = false

export const POST: APIRoute = async ({ request, url }): Promise<Response> => {
  const { host, protocol } = url
  const hostUrl = `${protocol}//${host}`
  const { file, width, height, quality } = await request.json()
  if (!file || !width || !height || !quality) {
    const missing = !file ? 'file' : !width ? 'width' : !height ? 'height' : 'quality'
    return new Response(
      JSON.stringify({
        error: `Missing required parameter: ${missing}`
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  const [error, data] = await tryAsync(() =>
    service().optimizeImage({ file, width, height, quality })
  )

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  if (!data) {
    return new Response(JSON.stringify({ error: 'Failed to optimize image' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const [saveError, shortUrl] = await tryAsync(() =>
    service().saveImage({ imageBuffer: data, hostUrl })
  )

  if (saveError) {
    return new Response(JSON.stringify({ error: saveError.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  return new Response(JSON.stringify({ url: shortUrl }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
