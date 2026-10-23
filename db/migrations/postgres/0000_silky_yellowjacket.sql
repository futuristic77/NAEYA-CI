CREATE TYPE "public"."legal_form" AS ENUM('EI', 'SARL');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('RECUE', 'EN_ETUDE', 'DOCUMENTS_ATTENDUS', 'EN_INSTRUCTION', 'FINALISEE', 'REJETEE');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "company_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference" varchar(20) NOT NULL,
	"userId" bigint NOT NULL,
	"legalForm" "legal_form" NOT NULL,
	"status" "request_status" DEFAULT 'RECUE' NOT NULL,
	"fullName" varchar(255) NOT NULL,
	"phone" varchar(30) NOT NULL,
	"email" varchar(320) NOT NULL,
	"city" varchar(120) NOT NULL,
	"projectName" varchar(255) NOT NULL,
	"activity" text NOT NULL,
	"activitySector" varchar(120) NOT NULL,
	"capital" bigint,
	"associatesCount" bigint,
	"managerName" varchar(255),
	"notes" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "company_requests_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(30),
	"subject" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"handled" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "request_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"requestId" bigint NOT NULL,
	"status" varchar(30) NOT NULL,
	"comment" text,
	"createdBy" bigint,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(320),
	"passwordHash" varchar(255),
	"avatar" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"lastSignInAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
