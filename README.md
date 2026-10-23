# NAEYA CI

**Votre idée prend forme.** — Plateforme ivoirienne d'accompagnement à la création d'entreprise (entreprise individuelle et SARL).

> NAEYA est un service **privé** d'accompagnement, indépendant du portail officiel du CEPICI. L'immatriculation définitive d'une entreprise est prononcée uniquement par les autorités compétentes.

## Fonctionnalités (MVP)

- **Accueil** — présentation de NAEYA, des deux parcours et de la méthode.
- **Services** — détail des offres EI / SARL avec la liste des documents requis.
- **Demande de création** — formulaire guidé en 4 étapes (forme juridique, identité, projet, récapitulatif) avec validation côté client et serveur (Zod).
- **Espace client** (`/dossier`) — suivi du statut de ses demandes et historique complet.
- **Espace administrateur** (`/admin`) — gestion des demandes (changement de statut avec commentaire tracé) et des messages de contact.
- **FAQ / Contact** — FAQ en accordéon et formulaire de contact persistant en base.
- **PWA** — manifeste installable, service worker (cache-first pour les assets, réseau seul pour l'API), icônes SVG.
- **Paiement** — non inclus volontairement : l'architecture (statuts, référence de dossier) est prête pour une intégration ultérieure.

## Stack

React 19 + TypeScript + Vite + Tailwind CSS · tRPC 11 + Hono · Drizzle ORM + PostgreSQL (Supabase) · Authentification e-mail/mot de passe (sessions JWT, rôles `user` / `admin` vérifiés côté serveur).

## Structure

```
server/       Backend Hono + routers tRPC (auth, requests, contact)
api/index.js  Fonction serverless Vercel (réexporte le serveur bundlé dist/vercel.js)
contracts/    Types et données métier partagés (parcours, statuts, documents)
db/           Schéma Drizzle (users, company_requests, request_events, contact_messages)
src/
  pages/      Accueil, Services, Demande, Dossier, Admin, FAQ, Contact, Login
  components/ Layout (nav mobile), Logo, StatusBadge
public/       manifest.webmanifest, sw.js, icônes PWA
```

## Installation et lancement

```bash
npm install
cp .env.example .env   # renseigner les valeurs réelles
npm run db:push        # synchroniser le schéma PostgreSQL
npm run dev            # http://localhost:3000 (frontend + API, HMR)
```

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement (port 3000) |
| `npm run build` | Build de production (`dist/`) |
| `npm start` | Serveur de production |
| `npm run check` | Vérification TypeScript |
| `npm run test` | Tests Vitest |
| `npm run db:push` | Sync schéma → base (développement) |

## Sécurité

- Aucune clé secrète dans le frontend : seules les variables `VITE_*` (non sensibles) sont exposées.
- Toutes les autorisations (accès dossier, administration) sont vérifiées côté serveur.
- Les réponses d'erreur restent génériques ; les traces serveur ne sont jamais renvoyées au client.
- `.env` est ignoré par Git — ne jamais le commiter.

## Déploiement

Le build de production (`npm run build`) génère trois sorties :

- `dist/public/` — frontend statique ;
- `dist/boot.js` — serveur autonome (VPS / Docker), qui écoute sur le port 3000 et sert les deux ;
- `dist/vercel.js` — handler serverless consommé par `api/index.js` pour Vercel.

### Vercel

Le déploiement Vercel est piloté par `vercel.json` (build `npm run build`, sortie `dist/public`). Les requêtes `/api/*` sont servies par la fonction `api/index.js`, le reste par les fichiers statiques avec repli SPA vers `index.html`. Les variables `SESSION_SECRET` (32 octets minimum), `DATABASE_URL` et, pour le premier administrateur, `OWNER_EMAIL`, doivent être définies dans les réglages du projet Vercel (obligatoires en production).

`DATABASE_URL` doit être l'URL PostgreSQL fournie par Supabase (pooler de transaction, port 6543, avec `sslmode=require`). Le pilote `postgres` est configuré avec `prepare: false`, compatible avec le pooler Supabase.

## Authentification

- Inscription et connexion par e-mail et mot de passe ; les mots de passe sont hachés avec scrypt et ne sont jamais renvoyés au navigateur.
- La session est signée côté serveur avec `SESSION_SECRET` et stockée dans un cookie HttpOnly `naeya_sid`, Secure en production et SameSite=Lax.
- Le rôle `admin` est attribué au compte dont l'e-mail correspond à `OWNER_EMAIL` au moment de l'inscription.
- Les migrations PostgreSQL sont générées dans `db/migrations/postgres/`. Les anciens scripts MySQL de `db/migrations/` ne s'appliquent plus à Supabase. Pour initialiser une base PostgreSQL vide, utiliser `npm run db:push` ou appliquer la migration générée après sauvegarde.
- Les comptes créés via l'ancien fournisseur OAuth externe ne peuvent plus se connecter : l'identifiant fournisseur est supprimé. Leur nom et leur rôle restent en base ; une réinitialisation de mot de passe assistée est nécessaire si leur e-mail est absent.
- Cette première version n'envoie pas de confirmation d'adresse ni de lien de réinitialisation ; ces parcours nécessitent un service e-mail configuré avant un lancement grand public.
- Le projet ne contient aucun appel à un modèle de langage. OpenRouter n'est donc pas requis ; il ne remplacerait pas un fournisseur d'identité OAuth.

## Identité visuelle

Palette : bleu électrique `#173DFF`, orange signal `#F08A24`, bleu encre `#17233D`, ivoire minéral `#F1EBDD`. Typographies : Space Grotesk (titres) et Archivo (texte). Le wordmark SVG dans `src/components/Logo.tsx` est une recréation d'après la planche de marque — remplacer par le fichier vectoriel officiel dès qu'il est disponible.

## Reste à faire (prochaines étapes)

- Intégration du paiement sécurisé (mobile money / carte).
- Dépôt de documents clients en stockage objet privé (URLs signées, jamais dans le dépôt ni en base).
- Notifications e-mail/SMS aux changements de statut.
- Promotion d'un compte administrateur (rôle `admin` en base).
