import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { getDb } from "./queries/connection";
import { contactMessages } from "@db/schema";
import { createRouter, publicQuery, adminQuery } from "./middleware";

const contactInput = z.object({
  name: z.string().trim().min(2).max(255),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().min(2).max(255),
  message: z.string().trim().min(10).max(5000),
});

export const contactRouter = createRouter({
  // Public : envoyer un message
  send: publicQuery.input(contactInput).mutation(async ({ input }) => {
    await getDb().insert(contactMessages).values({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      subject: input.subject,
      message: input.message,
    });
    return { ok: true };
  }),

  // Admin : lister et traiter les messages
  adminList: adminQuery.query(async () => {
    return getDb()
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }),

  markHandled: adminQuery
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await getDb()
        .update(contactMessages)
        .set({ handled: true })
        .where(eq(contactMessages.id, input.id));
      return { ok: true };
    }),
});
