import { drizzle } from 'drizzle-orm/node-postgres'
import { env } from 'node:process'
import { Client } from 'pg'
import * as schema from './schema'

const connectionString =
  env.DATABASE_URL || 'postgres://user:pass@localhost:5432/db'

const client = new Client({ connectionString })

export const db = drizzle(client, { schema })
