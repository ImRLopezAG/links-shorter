import { service } from '@services/shorter'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { tryAsync } from 'try-handler'

const validateUrl = (url: string) => {
  const urlRegex = /^(http|https):\/\/[^ "]+$/
  return urlRegex.test(url)
}

export const shortenController = () => ({
  shorten: async ({ req, json }: Context) => {
    const { url } = await req.json()
    if (!validateUrl(url))
      throw new HTTPException(400, { message: 'Invalid URL' })

    const [error, data] = await tryAsync(() => service().createShorter(url))

    if (error || !data) {
      if (error?.message.includes('UNIQUE')) {
        throw new HTTPException(400, { message: 'URL already shortened' })
      }
      throw new HTTPException(500, { message: 'Internal server error' })
    }

    const short = new URL(req.url).origin + '/' + data[0]?.short

    return json({ url: short })
  },
  redirect: async ({ req, redirect }: Context) => {
    const { slug } = req.param()
    const [error, data] = await tryAsync(() =>
      service().findShorterBySlug(slug)
    )
    if (error || !data)
      throw new HTTPException(404, { message: 'URL not found' })

    return redirect(data.url)
  }
})
