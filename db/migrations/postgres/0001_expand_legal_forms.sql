CREATE TYPE "public"."legal_form_new" AS ENUM(
  'EI',
  'SARL',
  'SARLU',
  'SA',
  'SAS',
  'SASU',
  'SNC',
  'SCS',
  'SCI_COMMERCIALE',
  'SUCCURSALE',
  'BUREAU_REPRESENTATION'
);
--> statement-breakpoint
ALTER TABLE "company_requests" ALTER COLUMN "legalForm" TYPE "public"."legal_form_new" USING "legalForm"::text::"public"."legal_form_new";
--> statement-breakpoint
ALTER TYPE "public"."legal_form" RENAME TO "legal_form_old";
--> statement-breakpoint
ALTER TYPE "public"."legal_form_new" RENAME TO "legal_form";
--> statement-breakpoint
DROP TYPE "public"."legal_form_old";
