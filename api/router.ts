import { authRouter } from "./auth-router";
import { requestsRouter } from "./requests-router";
import { contactRouter } from "./contact-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  requests: requestsRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
