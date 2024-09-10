import { service } from '@services/image'
import { service as shortenService } from '@services/shorter'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { tryAsync } from 'try-handler'

export const imageController = () => ({
  optimize: async ({ req, json }: Context) => {
    const { file, width, height, quality = 90 } = await req.json()
    if (!file || !width || !height || !quality) {
      const missing = !file
        ? 'file'
        : !width
        ? 'width'
        : !height
        ? 'height'
        : 'quality'
      throw new HTTPException(400, {
        message: `Missing required parameter: ${missing}`
      })
    }

    const [error, data] = await tryAsync(() =>
      service().optimizeImage({ file, width, height, quality })
    )

    if (error) {
      throw new HTTPException(500, { message: error.message })
    }

    if (!data) {
      throw new HTTPException(500, { message: 'Failed to optimize image' })
    }

    const [saveError, shortUrl] = await tryAsync(() =>
      service().saveImage({ imageBuffer: data })
    )

    if (saveError) throw new HTTPException(500, { message: saveError.message })

    const short = new URL(req.url).origin + '/api/image/' + shortUrl

    return json({ url: short })
  },
  image: async ({ req, json, res }: Context) => {
    const { slug } = req.param()
    if (!slug) throw new HTTPException(400, { message: 'Slug not found' })

    const [error, data] = await tryAsync(() =>
      shortenService().getShorterWithImages(slug)
    )
    if (error) throw new HTTPException(401, { message: error.message })
    if (!data) throw new HTTPException(404, { message: 'Not found' })
    const { images } = data
    if (!images) throw new HTTPException(404, { message: 'Image not found' })

    const buffer = Buffer.from(images.data, 'base64')
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp'
      }
    })
  }
})
