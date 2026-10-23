import * as jose from "jose";
import { Session } from "@contracts/constants";
import { env } from "../lib/env";

const JWT_ALG = "HS256";

export type SessionPayload = {
  userId: number;
};

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
  try {
    const secret = new TextEncoder().encode(env.sessionSecret);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
    });
    const userId = payload.userId;
    if (
      typeof userId !== "number" ||
      !Number.isSafeInteger(userId) ||
      userId <= 0
    ) {
      return null;
    }
    return { userId };
  } catch {
    return null;
  }
}
