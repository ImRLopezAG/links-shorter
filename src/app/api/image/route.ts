import { service } from '@services/image'
import { NextRequest } from 'next/server'
import { tryAsync } from 'try-handler'

export const POST = async (req: NextRequest): Promise<Response> => {
  const hostUrl = req.headers.get('host') || 'http://localhost:3000'

  const { file, width, height, quality = 90 } = await req.json()
  if (!file || !width || !height || !quality) {
    const missing = !file
      ? 'file'
      : !width
      ? 'width'
      : !height
      ? 'height'
      : 'quality'
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
    service().saveImage({ imageBuffer: data })
  )

  if (saveError) {
    return new Response(JSON.stringify({ error: saveError.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const short = `${hostUrl}/api/image/${shortUrl}`

  return new Response(JSON.stringify({ url: short }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
