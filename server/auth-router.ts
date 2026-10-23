import * as cookie from "cookie";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Session } from "@contracts/constants";
import type { User } from "@db/schema";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import {
  createPasswordUser,
  findUserByEmail,
  updateLastSignInAt,
} from "./queries/users";
import {
  DUMMY_PASSWORD_HASH,
  hashPassword,
  verifyPassword,
} from "./auth/password";
import { signSessionToken } from "./auth/session";
import type { TrpcContext } from "./context";

const signInInput = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(128),
});

const signUpInput = signInInput.extend({
  name: z.string().trim().min(2).max(255),
  password: z.string().min(12).max(128),
});

function publicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
}

async function setSessionCookie(
  ctx: TrpcContext,
  userId: number,
) {
  const token = await signSessionToken({ userId });
  const options = getSessionCookieOptions(ctx.req.headers);
  ctx.resHeaders.append(
    "set-cookie",
    cookie.serialize(Session.cookieName, token, {
      httpOnly: true,
      path: options.path,
      sameSite: "lax",
      secure: options.secure,
      maxAge: Session.maxAgeMs / 1000,
    }),
  );
}

function isDuplicateEntry(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "23505"
  );
}

function accountConflict() {
  return new TRPCError({
    code: "CONFLICT",
    message: "Cette adresse e-mail ne peut pas être utilisée. Connectez-vous ou choisissez une autre adresse.",
  });
}

export const authRouter = createRouter({
  me: authedQuery.query(({ ctx }) => publicUser(ctx.user!)),

  signUp: publicQuery
    .input(signUpInput)
    .mutation(async ({ input, ctx }) => {
      const email = input.email.trim().toLowerCase();
      const passwordHash = await hashPassword(input.password);
      const existing = await findUserByEmail(email);
      if (existing) throw accountConflict();

      let user: User;
      try {
        user = await createPasswordUser({
          name: input.name.trim(),
          email,
          passwordHash,
        });
      } catch (error) {
        if (isDuplicateEntry(error)) throw accountConflict();
        throw error;
      }

      await setSessionCookie(ctx, user.id);
      return publicUser(user);
    }),

  signIn: publicQuery
    .input(signInInput)
    .mutation(async ({ input, ctx }) => {
      const email = input.email.trim().toLowerCase();
      const user = await findUserByEmail(email);
      const hash = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
      const passwordMatches = await verifyPassword(input.password, hash);

      if (!user || !user.passwordHash || !passwordMatches) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Adresse e-mail ou mot de passe incorrect.",
        });
      }

      await updateLastSignInAt(user.id);
      await setSessionCookie(ctx, user.id);
      return publicUser(user);
    }),

  logout: publicQuery.mutation(async ({ ctx }) => {
    const options = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: true,
        path: options.path,
        sameSite: "lax",
        secure: options.secure,
        maxAge: 0,
        expires: new Date(0),
      }),
    );
    return { success: true };
  }),
});
