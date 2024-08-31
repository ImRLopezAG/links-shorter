import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { loadEnvFile } from 'node:process'
import { tryAsync } from 'try-handler'
import { service } from './service'

loadEnvFile('.env')

if (!process.env.PORT) throw new Error('PORT is not defined in .env file')

const PORT = parseInt(process.env.PORT, 10)

const app = new Hono()

const serviceInstance = service()

app.get('/', (c) => {
  return c.text('Service is running correctly ✅')
})

app.post('/shorten', async ({ req, json }) => {
  const { url } = await req.json()
  if (!validateUrl(url)) return json({ error: 'Invalid URL' }, { status: 400 })
  const protocol = process.env.NODE_ENV?.toLocaleLowerCase().includes('prod')
    ? 'https://'
    : 'http://'
  const hostUrl = `${protocol}${req.header('host')}`
  const [error, data] = await tryAsync(() =>
    serviceInstance.createShorter(url, hostUrl)
  )
  console.log(error)
  if (error || !data) {
    if (error?.includes('UNIQUE')) {
      return json({ error: 'URL already shortened' }, { status: 400 })
    }
    return json({ error: 'Internal server error' }, { status: 500 })
  }
  return json(data[0].short)
}).basePath('/api')

app.get('/shorten/:slug', async ({ json, req, text }) => {
  const { slug } = req.param()
  const [error, shorter] = await tryAsync(() =>
    serviceInstance.findShorterBySlug(slug)
  )
  if (error) return json({ error: 'Internal server error' }, { status: 500 })
  if (!shorter) return json({ error: 'Not found' }, { status: 404 })
  return json(shorter)
}).basePath('/api')

app.get('/:slug', async ({ text, req, json }) => {
  const { slug } = req.param()
  const [error, shorter] = await tryAsync(() =>
    serviceInstance.findShorterBySlug(slug)
  )
  if (error) return json({ error: 'Internal server error' }, { status: 500 })
  if (!shorter) return json({ error: 'Not found' }, { status: 404 })
  return text(shorter.url)
})

console.log(`Server is running on port http://localhost:${PORT}`)

serve({
  fetch: app.fetch,
  port: PORT
})

