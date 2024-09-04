import { createClient, type Client } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { env } from 'node:process'
import * as schema from './schema'

const dbUrl = env.DB_URL ?? 'file:./src/db/db.sqlite'

export const client = createClient({ url: dbUrl })

export const db = drizzle(client, { schema })
