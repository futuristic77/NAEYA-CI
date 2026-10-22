import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertUser } from "@db/schema";
import { getDb } from "./connection";
import { env } from "../lib/env";

export async function findUserById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);
  return rows.at(0);
}

export async function findUserByEmail(email: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  return rows.at(0);
}

export async function findUserByUnionId(unionId: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.unionId, unionId))
    .limit(1);
  return rows.at(0);
}

export async function createPasswordUser(input: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  await getDb().insert(schema.users).values({
    unionId: null,
    name: input.name,
    email: input.email,
    passwordHash: input.passwordHash,
    role: "user",
  });
  const user = await findUserByEmail(input.email);
  if (!user) throw new Error("Created account could not be loaded");
  return user;
}

export async function updateLastSignInAt(id: number) {
  await getDb()
    .update(schema.users)
    .set({ lastSignInAt: new Date() })
    .where(eq(schema.users.id, id));
}

export async function upsertUser(data: InsertUser) {
  const values = { ...data };
  if (!values.unionId) throw new Error("OAuth user is missing its provider ID");

  const updateSet: Partial<InsertUser> = {
    lastSignInAt: new Date(),
    ...data,
  };

  if (values.role === undefined && values.unionId === env.ownerUnionId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  await getDb()
    .insert(schema.users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });

  const user = await findUserByUnionId(values.unionId);
  if (!user) throw new Error("OAuth account could not be loaded");
  return user;
}
