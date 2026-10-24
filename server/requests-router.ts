import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, eq, desc, isNull } from "drizzle-orm";
import { getDb } from "./queries/connection";
import {
  companyRequests,
  requestDocuments,
  requestEvents,
} from "@db/schema";
import { createRouter, authedQuery, adminQuery } from "./middleware";
import {
  createSignedUrl,
  deleteObject,
  StorageNotConfiguredError,
  StorageError,
  uploadObject,
} from "./lib/storage";
import {
  LEGAL_FORMS,
  REQUEST_STATUSES,
  requiresCapital,
  requiresManager,
  tracksAssociates,
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

const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
const MAX_DOCUMENTS_PER_REQUEST = 20;
const ALLOWED_DOCUMENT_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const documentInput = z.object({
  requestId: z.number().int().positive(),
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().max(120),
  dataBase64: z.string().min(1).max(14_500_000),
});

function safeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "document";
  return (
    Array.from(base)
      .filter((character) => {
        const code = character.codePointAt(0) ?? 0;
        return code > 31 && code !== 127;
      })
      .join("")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 180) || "document"
  );
}

function hasExpectedSignature(data: Buffer, mimeType: string): boolean {
  if (mimeType === "application/pdf") return data.subarray(0, 5).toString() === "%PDF-";
  if (mimeType === "image/jpeg") return data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
  if (mimeType === "image/png") {
    return data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (mimeType === "image/webp") {
    return data.subarray(0, 4).toString() === "RIFF" && data.subarray(8, 12).toString() === "WEBP";
  }
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return data[0] === 0x50 && data[1] === 0x4b && data[2] === 0x03 && data[3] === 0x04;
  }
  if (mimeType === "application/msword") {
    return data.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
  }
  return false;
}

function storageTrpcError(error: unknown): TRPCError {
  if (error instanceof StorageNotConfiguredError) {
    return new TRPCError({
      code: "PRECONDITION_FAILED",
      message: error.message,
    });
  }
  if (error instanceof StorageError) {
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    });
  }
  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Le stockage des documents est momentanément indisponible.",
  });
}

async function accessibleRequest(
  requestId: number,
  userId: number,
  isAdmin: boolean,
) {
  const db = getDb();
  const [request] = await db
    .select()
    .from(companyRequests)
    .where(eq(companyRequests.id, requestId))
    .limit(1);
  if (!request || (!isAdmin && request.userId !== userId)) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Dossier introuvable." });
  }
  return request;
}

async function activeDocuments(requestId: number) {
  return getDb()
    .select()
    .from(requestDocuments)
    .where(
      and(
        eq(requestDocuments.requestId, requestId),
        isNull(requestDocuments.deletedAt),
      ),
    )
    .orderBy(desc(requestDocuments.createdAt));
}

export const requestsRouter = createRouter({
  // Créer une demande (utilisateur connecté)
  create: authedQuery.input(requestInput).mutation(async ({ ctx, input }) => {
    if (requiresCapital(input.legalForm)) {
      if (input.capital === undefined || input.capital <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Le capital social est requis pour cette forme juridique.",
        });
      }
    }
    if (requiresManager(input.legalForm)) {
      if (!input.managerName || input.managerName.length < 3) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Le nom du gérant/président/représentant est requis pour cette forme juridique.",
        });
      }
    }
    if (tracksAssociates(input.legalForm) && input.associatesCount !== undefined) {
      if (input.associatesCount < 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Le nombre d'associés doit être au moins égal à 1.",
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
      capital: requiresCapital(input.legalForm) ? (input.capital ?? null) : null,
      associatesCount: tracksAssociates(input.legalForm)
        ? (input.associatesCount ?? null)
        : null,
      managerName: requiresManager(input.legalForm)
        ? (input.managerName ?? null)
        : null,
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

      return {
        request,
        events,
        documents: await activeDocuments(request.id),
      };
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
      return {
        request,
        events,
        documents: await activeDocuments(request.id),
      };
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

  uploadDocument: authedQuery
    .input(documentInput)
    .mutation(async ({ ctx, input }) => {
      const request = await accessibleRequest(
        input.requestId,
        ctx.user.id,
        ctx.user.role === "admin",
      );
      if (!ALLOWED_DOCUMENT_MIME.has(input.mimeType)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Format de document non accepté. Utilisez PDF, JPG, PNG, WEBP ou Word.",
        });
      }
      const data = Buffer.from(input.dataBase64, "base64");
      if (!data.length || data.length > MAX_DOCUMENT_BYTES) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Le document doit peser au maximum 10 Mo.",
        });
      }
      if (!hasExpectedSignature(data, input.mimeType)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Le contenu du document ne correspond pas au format annoncé.",
        });
      }
      const existing = await activeDocuments(request.id);
      if (existing.length >= MAX_DOCUMENTS_PER_REQUEST) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Le nombre maximal de documents pour ce dossier est atteint.",
        });
      }

      const originalName = safeFileName(input.fileName);
      const storagePath = `requests/${request.id}/${crypto.randomUUID()}-${originalName}`;
      try {
        await uploadObject(storagePath, data, input.mimeType);
      } catch (error) {
        throw storageTrpcError(error);
      }

      const db = getDb();
      try {
        const [document] = await db
          .insert(requestDocuments)
          .values({
            requestId: request.id,
            uploadedBy: ctx.user.id,
            originalName,
            mimeType: input.mimeType,
            sizeBytes: data.length,
            storagePath,
          })
          .returning();
        return { document };
      } catch (error) {
        await deleteObject(storagePath).catch(() => undefined);
        throw error;
      }
    }),

  documentDownloadUrl: authedQuery
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const [document] = await db
        .select()
        .from(requestDocuments)
        .where(eq(requestDocuments.id, input.id))
        .limit(1);
      if (!document || document.deletedAt) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Document introuvable." });
      }
      await accessibleRequest(
        document.requestId,
        ctx.user.id,
        ctx.user.role === "admin",
      );
      try {
        const url = await createSignedUrl(document.storagePath, 300);
        return { url, name: document.originalName, mimeType: document.mimeType };
      } catch (error) {
        throw storageTrpcError(error);
      }
    }),

  removeDocument: authedQuery
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [document] = await db
        .select()
        .from(requestDocuments)
        .where(eq(requestDocuments.id, input.id))
        .limit(1);
      if (!document) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Document introuvable." });
      }
      await accessibleRequest(
        document.requestId,
        ctx.user.id,
        ctx.user.role === "admin",
      );
      if (document.deletedAt) return { ok: true };
      try {
        await deleteObject(document.storagePath);
      } catch (error) {
        throw storageTrpcError(error);
      }
      await db
        .update(requestDocuments)
        .set({ deletedAt: new Date(), deletedBy: ctx.user.id })
        .where(eq(requestDocuments.id, document.id));
      return { ok: true };
    }),

  purgeDocuments: adminQuery
    .input(z.object({ requestId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await accessibleRequest(input.requestId, ctx.user.id, true);
      const documents = await activeDocuments(input.requestId);
      const db = getDb();
      let deleted = 0;
      for (const document of documents) {
        try {
          await deleteObject(document.storagePath);
        } catch (error) {
          throw storageTrpcError(error);
        }
        await db
          .update(requestDocuments)
          .set({ deletedAt: new Date(), deletedBy: ctx.user.id })
          .where(eq(requestDocuments.id, document.id));
        deleted += 1;
      }
      return { deleted };
    }),
});
