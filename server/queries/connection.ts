import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: PostgresJsDatabase<typeof fullSchema>;

export function getDb() {
  if (!instance) {
    const client = postgres(env.databaseUrl, {
      // Compatible avec le pooler Supabase (transaction mode).
      prepare: false,
      ssl: env.databaseUrl.includes("localhost") ? false : "require",
      max: 1,
    });
    instance = drizzle(client, { schema: fullSchema });
  }
  return instance;
}
