CREATE TABLE "request_documents" (
  "id" serial PRIMARY KEY NOT NULL,
  "requestId" bigint NOT NULL,
  "uploadedBy" bigint NOT NULL,
  "originalName" varchar(255) NOT NULL,
  "mimeType" varchar(120) NOT NULL,
  "sizeBytes" bigint NOT NULL,
  "storagePath" text NOT NULL,
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
  "deletedAt" timestamp with time zone,
  "deletedBy" bigint,
  CONSTRAINT "request_documents_storagePath_unique" UNIQUE("storagePath")
);
--> statement-breakpoint
CREATE INDEX "request_documents_request_idx" ON "request_documents" USING btree ("requestId");
