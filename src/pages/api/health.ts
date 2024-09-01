import type { APIRoute } from 'astro'
export const prerender = false

export const GET: APIRoute = async () =>
  new Response('Service is working ✅', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
