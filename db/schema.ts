import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  boolean,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── NAEYA : demandes de création d'entreprise ────────────────────────────────

export const companyRequests = mysqlTable("company_requests", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 20 }).notNull().unique(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  legalForm: mysqlEnum("legalForm", ["EI", "SARL"]).notNull(),
  status: mysqlEnum("status", [
    "RECUE",
    "EN_ETUDE",
    "DOCUMENTS_ATTENDUS",
    "EN_INSTRUCTION",
    "FINALISEE",
    "REJETEE",
  ])
    .default("RECUE")
    .notNull(),
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type CompanyRequest = typeof companyRequests.$inferSelect;
export type InsertCompanyRequest = typeof companyRequests.$inferInsert;

// Historique des changements de statut (traçabilité)
export const requestEvents = mysqlTable("request_events", {
  id: serial("id").primaryKey(),
  requestId: bigint("requestId", { mode: "number", unsigned: true }).notNull(),
  status: varchar("status", { length: 30 }).notNull(),
  comment: text("comment"),
  createdBy: bigint("createdBy", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RequestEvent = typeof requestEvents.$inferSelect;

// Messages du formulaire de contact
export const contactMessages = mysqlTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  handled: boolean("handled").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
