import { describe, expect, it } from "vitest";
import { signSessionToken, verifySessionToken } from "./session";

describe("session tokens", () => {
  it("signs and verifies a user id", async () => {
    const token = await signSessionToken({ userId: 42 });
    expect(await verifySessionToken(token)).toEqual({ userId: 42 });
  });

  it("rejects a tampered token", async () => {
    const token = await signSessionToken({ userId: 42 });
    const tampered = token.slice(0, -2) + (token.endsWith("a") ? "bb" : "aa");
    expect(await verifySessionToken(tampered)).toBeNull();
  });

  it("rejects an empty token", async () => {
    expect(await verifySessionToken("")).toBeNull();
  });
});
