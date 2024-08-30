import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const shorter = sqliteTable(
  'shorter',
  {
    id: integer('id').primaryKey(),
    url: text('url').notNull().unique(),
    slug: text('slug').notNull().unique(),
    shortUrl: text('short_url'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull()
  },
  (table) => ({
    slugIdx: index('slug_idx').on(table.slug),
    urlIdx: index('url_idx').on(table.url)
  })
)
