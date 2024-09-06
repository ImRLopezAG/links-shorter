import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from 'node:process'

import * as schema from './schema'

const connectionString = env.DB_URL || 'postgres://user:pass@localhost:5432/db'

const client =  postgres(connectionString)

export const db = drizzle(client, { schema })
