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

const appId = optional("APP_ID");
const appSecret = optional("APP_SECRET");
const sessionSecret =
  optional("SESSION_SECRET") ||
  appSecret ||
  (isProduction ? "" : "naeya-development-session-secret-do-not-use-in-production");

if (isProduction && !sessionSecret) {
  throw new Error("SESSION_SECRET is required in production");
}
if (isProduction && Buffer.byteLength(sessionSecret) < 32) {
  throw new Error("SESSION_SECRET must contain at least 32 bytes");
}

const kimiAuthUrl = optional("KIMI_AUTH_URL");
const kimiOpenUrl = optional("KIMI_OPEN_URL");

export const env = {
  appId,
  appSecret,
  sessionSecret,
  isProduction,
  databaseUrl: required("DATABASE_URL"),
  kimiAuthUrl,
  kimiOpenUrl,
  kimiEnabled: Boolean(appId && appSecret && kimiAuthUrl && kimiOpenUrl),
  ownerUnionId: optional("OWNER_UNION_ID"),
};
