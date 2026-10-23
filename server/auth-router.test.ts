import { describe, expect, it } from "vitest";
import { authRouter } from "./auth-router";
import type { TrpcContext } from "./context";

function createContext(host: string): TrpcContext {
  return {
    req: new Request(`https://${host}/api/trpc/auth.logout`, {
      method: "POST",
      headers: { host },
    }),
    resHeaders: new Headers(),
  };
}

describe("auth.logout", () => {
  it("clears the session cookie without requiring an authenticated user", async () => {
    const ctx = createContext("naeya-ci.vercel.app");
    const caller = authRouter.createCaller(ctx);

    await expect(caller.logout()).resolves.toEqual({ success: true });

    const setCookie = ctx.resHeaders.get("set-cookie");
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain("naeya_sid=;");
    expect(setCookie).toContain("Max-Age=0");
    expect(setCookie).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
    expect(setCookie).toContain("Path=/");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("Secure");
    expect(setCookie).toContain("SameSite=Lax");
  });

  it("does not mark the cleared cookie Secure on localhost", async () => {
    const ctx = createContext("localhost:3000");
    const caller = authRouter.createCaller(ctx);

    await expect(caller.logout()).resolves.toEqual({ success: true });

    const setCookie = ctx.resHeaders.get("set-cookie");
    expect(setCookie).toBeTruthy();
    expect(setCookie).not.toContain("Secure");
  });
});
