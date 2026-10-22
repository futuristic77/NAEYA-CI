import app from "./app";

// Vercel Functions — signature Web Standard officiellement supportée par le
// runtime Node.js de Vercel : la plateforme appelle fetch() avec une Request
// et consomme la Response retournée (aucun listen() n'est exécuté).
export default {
  fetch(request: Request): Response | Promise<Response> {
    return app.fetch(request);
  },
};
