import { db, shorter } from '@/db'
import { eq } from 'drizzle-orm'
import { createHash } from 'node:crypto'
export const service = () => ({
  async createShorter(url: string, hostUrl: URL | string) {
    const slug = createHash('md5').update(url).digest('hex').substring(0, 8);
    return await db
      .insert(shorter)
      .values({
        url,
        slug,
        shortUrl: `${hostUrl}/${slug}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning({ short: shorter.shortUrl })
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
  }
})
