import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, desc } from "drizzle-orm";
import { getDb } from "./queries/connection";
import { companyRequests, requestEvents } from "@db/schema";
import { createRouter, authedQuery, adminQuery } from "./middleware";
import {
  LEGAL_FORMS,
  REQUEST_STATUSES,
} from "@contracts/naeya";

const phoneRegex = /^[+0-9 ().-]{8,20}$/;

const requestInput = z.object({
  legalForm: z.enum(LEGAL_FORMS),
  fullName: z.string().trim().min(3).max(255),
  phone: z.string().trim().regex(phoneRegex, "Numéro de téléphone invalide"),
  email: z.string().trim().email().max(320),
  city: z.string().trim().min(2).max(120),
  projectName: z.string().trim().min(2).max(255),
  activity: z.string().trim().min(10).max(5000),
  activitySector: z.string().trim().min(2).max(120),
  capital: z.number().int().min(0).max(1_000_000_000_000).optional(),
  associatesCount: z.number().int().min(1).max(100).optional(),
  managerName: z.string().trim().max(255).optional(),
  notes: z.string().trim().max(2000).optional(),
});

function generateReference() {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `NY-${year}-${rand}`;
}

export const requestsRouter = createRouter({
  // Créer une demande (utilisateur connecté)
  create: authedQuery.input(requestInput).mutation(async ({ ctx, input }) => {
    if (input.legalForm === "SARL") {
      if (input.capital === undefined || input.capital <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Le capital social est requis pour une SARL.",
        });
      }
      if (!input.managerName || input.managerName.length < 3) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Le nom du gérant est requis pour une SARL.",
        });
      }
    }

    const db = getDb();
    const reference = generateReference();

    await db.insert(companyRequests).values({
      reference,
      userId: ctx.user.id,
      legalForm: input.legalForm,
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      city: input.city,
      projectName: input.projectName,
      activity: input.activity,
      activitySector: input.activitySector,
      capital: input.legalForm === "SARL" ? (input.capital ?? null) : null,
      associatesCount:
        input.legalForm === "SARL" ? (input.associatesCount ?? null) : null,
      managerName: input.legalForm === "SARL" ? (input.managerName ?? null) : null,
      notes: input.notes ?? null,
    });

    const [created] = await db
      .select()
      .from(companyRequests)
      .where(eq(companyRequests.reference, reference))
      .limit(1);

    if (created) {
      await db.insert(requestEvents).values({
        requestId: created.id,
        status: "RECUE",
        comment: "Demande enregistrée sur la plateforme NAEYA.",
        createdBy: ctx.user.id,
      });
    }

    return { reference, id: created?.id };
  }),

  // Mes demandes (espace client)
  mine: authedQuery.query(async ({ ctx }) => {
    return getDb()
      .select()
      .from(companyRequests)
      .where(eq(companyRequests.userId, ctx.user.id))
      .orderBy(desc(companyRequests.createdAt));
  }),

  // Détail d'une de mes demandes + historique
  byId: authedQuery
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const [request] = await db
        .select()
        .from(companyRequests)
        .where(eq(companyRequests.id, input.id))
        .limit(1);

      if (!request || request.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Dossier introuvable." });
      }

      const events = await db
        .select()
        .from(requestEvents)
        .where(eq(requestEvents.requestId, request.id))
        .orderBy(requestEvents.createdAt);

      return { request, events };
    }),

  // ── Administration ────────────────────────────────────────────────────────
  adminList: adminQuery.query(async () => {
    return getDb()
      .select()
      .from(companyRequests)
      .orderBy(desc(companyRequests.createdAt));
  }),

  adminById: adminQuery
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [request] = await db
        .select()
        .from(companyRequests)
        .where(eq(companyRequests.id, input.id))
        .limit(1);
      if (!request) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Dossier introuvable." });
      }
      const events = await db
        .select()
        .from(requestEvents)
        .where(eq(requestEvents.requestId, request.id))
        .orderBy(requestEvents.createdAt);
      return { request, events };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(REQUEST_STATUSES),
        comment: z.string().trim().max(2000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [request] = await db
        .select()
        .from(companyRequests)
        .where(eq(companyRequests.id, input.id))
        .limit(1);
      if (!request) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Dossier introuvable." });
      }
      await db
        .update(companyRequests)
        .set({ status: input.status })
        .where(eq(companyRequests.id, input.id));
      await db.insert(requestEvents).values({
        requestId: input.id,
        status: input.status,
        comment: input.comment ?? null,
        createdBy: ctx.user.id,
      });
      return { ok: true };
    }),
});
