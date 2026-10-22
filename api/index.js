// Fonction serverless Vercel unique pour toute l'API.
// Le code serveur TypeScript vit dans server/ et est bundlé par esbuild
// (`npm run build` → dist/vercel.js) : Vercel n'a donc jamais à compiler
// le TypeScript du serveur (pas d'alias @contracts/@db ni d'imports
// sans extension à résoudre côté plateforme).
export { default } from "../dist/vercel.js";
