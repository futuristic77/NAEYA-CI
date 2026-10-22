export const Session = {
  cookieName: "naeya_sid",
  legacyCookieName: "kimi_sid",
  maxAgeMs: 30 * 24 * 60 * 60 * 1000,
} as const;

export const ErrorMessages = {
  unauthenticated: "Authentication required",
  insufficientRole: "Insufficient permissions",
} as const;

export const Paths = {
  login: "/login",
  signup: "/signup",
  oauthCallback: "/api/oauth/callback",
} as const;
