import { describe, expect, it } from "vitest";
import { isUnauthorizedError } from "./auth-error";

describe("isUnauthorizedError", () => {
  it("recognizes tRPC unauthorized and forbidden errors", () => {
    expect(isUnauthorizedError({ data: { code: "UNAUTHORIZED" } })).toBe(true);
    expect(isUnauthorizedError({ data: { code: "FORBIDDEN" } })).toBe(true);
    expect(
      isUnauthorizedError({ shape: { data: { code: "UNAUTHORIZED" } } }),
    ).toBe(true);
  });

  it("ignores unrelated or malformed errors", () => {
    expect(isUnauthorizedError({ data: { code: "INTERNAL_SERVER_ERROR" } })).toBe(
      false,
    );
    expect(isUnauthorizedError(new Error("network"))).toBe(false);
    expect(isUnauthorizedError(null)).toBe(false);
    expect(isUnauthorizedError(undefined)).toBe(false);
  });
});
