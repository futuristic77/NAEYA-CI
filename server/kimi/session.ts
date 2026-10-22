import * as jose from "jose";
import { env } from "../lib/env";
import { Session } from "@contracts/constants";
import type { SessionPayload } from "./types";

const JWT_ALG = "HS256";

export async function signSessionToken(
  payload: SessionPayload,
): Promise<string> {
  const secret = new TextEncoder().encode(env.sessionSecret);
  const expiresAt =
    Math.floor(Date.now() / 1000) + Math.floor(Session.maxAgeMs / 1000);
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(secret);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  if (!token) return null;

  const secrets = [...new Set([env.sessionSecret, env.appSecret].filter(Boolean))];
  for (const value of secrets) {
    try {
      const secret = new TextEncoder().encode(value);
      const { payload } = await jose.jwtVerify(token, secret, {
        algorithms: [JWT_ALG],
      });
      const userId =
        typeof payload.userId === "number" &&
        Number.isSafeInteger(payload.userId) &&
        payload.userId > 0
          ? payload.userId
          : undefined;
      const unionId =
        typeof payload.unionId === "string" && payload.unionId.length > 0
          ? payload.unionId
          : undefined;
      const clientId =
        typeof payload.clientId === "string" ? payload.clientId : undefined;
      if ((!userId && !unionId) || !clientId) return null;
      return { userId, unionId, clientId };
    } catch {
      // Try the legacy APP_SECRET after the dedicated session secret.
    }
  }
  return null;
}
