export const GET = async () =>
  new Response('Service is working ✅', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
