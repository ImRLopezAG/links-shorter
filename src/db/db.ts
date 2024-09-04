import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { env } from 'node:process'
import * as schema from './schema'

const dbUrl = env.DB_URL ?? './src/db/db.sqlite'

export const client = new Database(dbUrl)

export const db = drizzle(client, { schema })
