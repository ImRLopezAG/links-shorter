import { db, images } from '@/db'
import sharp from 'sharp'
import { tryAsync } from 'try-handler'
import * as shorter from './shorter'

interface ImageProps {
  width: number
  height: number
  quality: number
  file: string
}

interface Image {
  imageBuffer: Buffer
}

export const service = () => ({
  async optimizeImage({ width, height, quality, file }: ImageProps) {
    const fileBuffer = Buffer.from(file, 'base64')
    const convert = sharp(fileBuffer)
      .resize({ width, height, fit: 'inside' })
      .toFormat('webp', { quality, lossless: false })
    return await convert.toBuffer()
  },
  async saveImage({ imageBuffer }: Image) {
    const data = imageBuffer.toString('base64')
    const url = `data:image/webp;base64,${data.split('//')[1]}`
    const [error, short_url] = await tryAsync(() =>
      shorter.service().createShorter(url)
    )
    if (error || !short_url) throw new Error('Failed to save image on shorter')
    const short = short_url[0]
    if (!short) throw new Error('Failed to save image on read model')

    const [insertError] = await tryAsync(() =>
      db.insert(images).values({
        slug: short.short || '',
        data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    )
    if (insertError) throw new Error('Failed to save image on write model')

    return short.short || ''
  }
})
