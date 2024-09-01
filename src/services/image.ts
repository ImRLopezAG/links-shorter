import sharp from 'sharp'

interface ImageProps {
  width: number
  height: number
  quality: number
  file: string
}

export const service = () => ({
  async optimizeImage({ width, height, quality, file }: ImageProps) {
    const fileBuffer = Buffer.from(file, 'base64')
    const convert = sharp(fileBuffer)
      .resize({ width, height, fit: 'inside' })
      .toFormat('webp', { quality, lossless: false })

    return await convert.toBuffer()
  }
})
