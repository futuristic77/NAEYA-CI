type ErrorWithCode = {
  data?: { code?: unknown };
  shape?: { data?: { code?: unknown } };
};

export function isUnauthorizedError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const candidate = error as ErrorWithCode;
  const code = candidate.data?.code ?? candidate.shape?.data?.code;
  return code === "UNAUTHORIZED" || code === "FORBIDDEN";
}
