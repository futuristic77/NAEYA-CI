import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  boolean,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const legalFormEnum = pgEnum("legal_form", ["EI", "SARL"]);
export const requestStatusEnum = pgEnum("request_status", [
  "RECUE",
  "EN_ETUDE",
  "DOCUMENTS_ATTENDUS",
  "EN_INSTRUCTION",
  "FINALISEE",
  "REJETEE",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  avatar: text("avatar"),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── NAEYA : demandes de création d'entreprise ────────────────────────────────

export const companyRequests = pgTable("company_requests", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 20 }).notNull().unique(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  legalForm: legalFormEnum("legalForm").notNull(),
  status: requestStatusEnum("status").default("RECUE").notNull(),
  // Porteur de projet
  fullName: varchar("fullName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  // Projet
  projectName: varchar("projectName", { length: 255 }).notNull(),
  activity: text("activity").notNull(),
  activitySector: varchar("activitySector", { length: 120 }).notNull(),
  // Spécifique SARL (null pour EI)
  capital: bigint("capital", { mode: "number" }),
  associatesCount: bigint("associatesCount", { mode: "number" }),
  managerName: varchar("managerName", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type CompanyRequest = typeof companyRequests.$inferSelect;
export type InsertCompanyRequest = typeof companyRequests.$inferInsert;

// Historique des changements de statut (traçabilité)
export const requestEvents = pgTable("request_events", {
  id: serial("id").primaryKey(),
  requestId: bigint("requestId", { mode: "number" }).notNull(),
  status: varchar("status", { length: 30 }).notNull(),
  comment: text("comment"),
  createdBy: bigint("createdBy", { mode: "number" }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
});

export type RequestEvent = typeof requestEvents.$inferSelect;

// Messages du formulaire de contact
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  handled: boolean("handled").default(false).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
