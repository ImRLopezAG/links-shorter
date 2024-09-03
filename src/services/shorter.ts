import { db, shorter } from '@/db'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
export const service = () => ({
  async createShorter(url: string) {
    const slug = nanoid(6)
    return await db
      .insert(shorter)
      .values({
        url,
        slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning({ short: shorter.slug })
  },
  async findShorterBySlug(slug: string) {
    return await db.query.shorter.findFirst({
      where: ({ slug: slug_ }, { eq }) => eq(slug_, slug)
    })
  },
  async findShorterByUrl(url: string) {
    return await db.query.shorter.findFirst({
      where: ({ url: url_ }, { eq }) => eq(url_, url)
    })
  },
  async updateShorter(slug: string, url: string) {
    return await db
      .update(shorter)
      .set({
        url,
        updatedAt: new Date().toISOString()
      })
      .where(eq(shorter.slug, slug))
      .run()
  },
  async deleteShorter(slug: string) {
    return await db.delete(shorter).where(eq(shorter.slug, slug)).run()
  },
  async listShorter() {
    return await db.query.shorter.findMany()
  },
  async getShorterWithImages(slug: string) {
    return await db.query.shorter.findFirst({
      where: ({ slug: slug_ }, { eq }) => eq(slug_, slug),
      with: {
        images: true
      }
    })
  }
})
