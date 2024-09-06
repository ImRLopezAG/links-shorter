import { index, pgTable, text, serial } from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'

export const shorter = pgTable(
  'shorter',
  {
    id: serial('id').primaryKey(),
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

export const images = pgTable('images', {
  id: serial('id').primaryKey(),
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
