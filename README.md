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

React 19 + TypeScript + Vite + Tailwind CSS · tRPC 11 + Hono · Drizzle ORM + MySQL · Authentification OAuth (sessions JWT, rôles `user` / `admin` vérifiés côté serveur).

## Structure

```
api/          Backend Hono + routers tRPC (auth, requests, contact)
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
npm run db:push        # synchroniser le schéma MySQL
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

Le build de production bundle le serveur (`dist/boot.js`) et le frontend (`dist/public/`). Le serveur écoute sur le port 3000 et sert les deux.

## Identité visuelle

Palette : bleu électrique `#173DFF`, orange signal `#F08A24`, bleu encre `#17233D`, ivoire minéral `#F1EBDD`. Typographies : Space Grotesk (titres) et Archivo (texte). Le wordmark SVG dans `src/components/Logo.tsx` est une recréation d'après la planche de marque — remplacer par le fichier vectoriel officiel dès qu'il est disponible.

## Reste à faire (prochaines étapes)

- Intégration du paiement sécurisé (mobile money / carte).
- Dépôt de documents clients en stockage objet privé (URLs signées, jamais dans le dépôt ni en base).
- Notifications e-mail/SMS aux changements de statut.
- Promotion d'un compte administrateur (rôle `admin` en base).
