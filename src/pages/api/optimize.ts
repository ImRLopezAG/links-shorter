import { service } from '@services/image'
import type { APIRoute } from 'astro'
import { tryAsync } from 'try-handler'

export const prerender = false

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  const { file, width, height, quality } = await request.json()
  if (!file || !width || !height || !quality) {
    return new Response(
      JSON.stringify({
        error: 'Missing parameters, allowed: file, width, height, quality'
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

  return new Response(data, {
    status: 200,
    headers: {
      'Content-Type': 'image/webp'
    }
  })
}
