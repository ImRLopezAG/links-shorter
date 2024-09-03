import { createClient, type Client } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { env } from 'node:process'
import * as schema from './schema'

const dbUrl = env.DB_URL ?? 'file:./src/db/db.sqlite'
const globalForDb = globalThis as unknown as {
  client: Client | undefined
}

export const client = globalForDb.client ?? createClient({ url: dbUrl })
if (process.env.NODE_ENV !== 'production') globalForDb.client = client

export const db = drizzle(client, { schema })
