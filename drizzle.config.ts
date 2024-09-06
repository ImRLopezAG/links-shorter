import { type Config } from 'drizzle-kit'
import { env } from 'node:process'
export default {
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL || 'postgres://user:pass@localhost:5432/db'
  }
} satisfies Config
