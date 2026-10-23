import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
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

export async function createPasswordUser(input: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  const role =
    env.ownerEmail && input.email === env.ownerEmail ? "admin" : "user";
  await getDb().insert(schema.users).values({
    name: input.name,
    email: input.email,
    passwordHash: input.passwordHash,
    role,
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
