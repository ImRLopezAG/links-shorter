import { service } from '@/service'
import type { APIRoute } from 'astro'
import { tryAsync } from 'try-handler'

const validateUrl = (url: string) => {
  const urlRegex = /^(http|https):\/\/[^ "]+$/
  return urlRegex.test(url)
}

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  const { url } = await request.json().catch(() => ({}))
  const [error, shorter] = await tryAsync(() =>
    service().createShorter(url, '')
  )
  if (error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500
    })
  if (!shorter)
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
  return new Response(JSON.stringify(shorter))
}
