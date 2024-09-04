import { service } from '@services/shorter'
import type { NextRequest } from 'next/server'
import { tryAsync } from 'try-handler'

export const GET = async (
  _: NextRequest,
  { params }: { params: { slug: string } }
) => {
  const { slug } = params
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug not found' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  const [error, data] = await tryAsync(() =>
    service().getShorterWithImages(slug)
  )
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  if (!data) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  const { images } = data
  if (!images) {
    return new Response(JSON.stringify({ error: 'Image not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const buffer = Buffer.from(images.data, 'base64')
  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/webp'
    }
  })
}
