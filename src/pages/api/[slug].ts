import type { APIRoute } from 'astro'
import { service } from '@services/shorter'
import { tryAsync } from 'try-handler'
export const prerender = false

export const GET: APIRoute = async ({ params, redirect }) => {
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
    service().findShorterBySlug(slug)
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

  return redirect(data.url)
}

