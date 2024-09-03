import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { relations } from 'drizzle-orm'

export const shorter = sqliteTable(
  'shorter',
  {
    id: integer('id').primaryKey(),
    url: text('url').notNull().unique(),
    slug: text('slug').notNull().unique(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull()
  },
  (table) => ({
    slugIdx: index('slug_idx').on(table.slug),
    urlIdx: index('url_idx').on(table.url)
  })
)

export const images = sqliteTable('images', {
  id: integer('id').primaryKey(),
  slug: text('slug')
    .notNull()
    .references(() => shorter.slug),
  data: text('data').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
})

export const slugImages = relations(shorter, ({ one }) => ({
  images: one(images, {
    fields: [shorter.slug],
    references: [images.slug]
  })
}))
