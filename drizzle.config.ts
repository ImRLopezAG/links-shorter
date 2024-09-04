import { type Config } from 'drizzle-kit'
import { env } from 'node:process'
export default {
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DB_URL ?? 'file:./src/db/db.sqlite'
  },
  tablesFilter: ['translations_*']
} satisfies Config
