const REQUIRED = ["DATABASE_URL", "SESSION_SECRET"];

export default {
  fetch() {
    const missing = REQUIRED.filter((name) => !process.env[name]);
    return Response.json(
      { ok: missing.length === 0, missing },
      { status: missing.length === 0 ? 200 : 503 },
    );
  },
};
