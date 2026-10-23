import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";

function optional(name: string): string {
  return process.env[name] ?? "";
}

function required(name: string): string {
  const value = optional(name);
  if (!value && isProduction) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const sessionSecret =
  optional("SESSION_SECRET") ||
  (isProduction ? "" : "naeya-development-session-secret-do-not-use-in-production");

if (isProduction && !sessionSecret) {
  throw new Error("SESSION_SECRET is required in production");
}
if (isProduction && Buffer.byteLength(sessionSecret) < 32) {
  throw new Error("SESSION_SECRET must contain at least 32 bytes");
}

export const env = {
  isProduction,
  sessionSecret,
  databaseUrl: required("DATABASE_URL"),
  ownerEmail: optional("OWNER_EMAIL").trim().toLowerCase(),
};
