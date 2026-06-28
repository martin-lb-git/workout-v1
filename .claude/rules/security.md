---
description: Auth proxy, variables sensibles, validation des inputs
alwaysApply: true
---

## Auth — proxy Vercel + cookie HttpOnly

Le JWT est géré exclusivement via un cookie HttpOnly posé par Xano. Une Vercel Edge Function (`api/proxy.ts`) lit ce cookie côté serveur et l'injecte en `Authorization: Bearer` vers Xano.

Voir le détail complet du flux dans @.claude/knowledge/auth-proxy.md.

### Règles absolues

- Jamais `localStorage`, `sessionStorage`, mémoire React, ou variable JS pour stocker le token
- Le cookie est envoyé automatiquement par le navigateur — Axios ne l'injecte pas manuellement
- Ne jamais logger le token dans la console
- Ne jamais inclure le token dans une URL ou un paramètre de requête
- Toute requête Xano passe par `/api/proxy/*` — jamais d'appel direct à Xano
- Si Xano ne reçoit pas le token, le fix est côté proxy ou CORS, jamais côté JS

### Logout

Le proxy intercepte `POST /auth/logout` et retourne `Set-Cookie: token=; Max-Age=0` — Xano n'a pas cet endpoint, ne pas en créer un.

### AuthContext

Expose `user: User | null` (profil complet) et `isAuthenticated: boolean` — jamais le token.

## Variables d'environnement

- Toutes les variables sensibles dans `.env` — jamais commitées, dans `.gitignore`
- Préfixe obligatoire `VITE_` pour que Vite les expose
- `.env.example` commité sans valeurs réelles — sert de template
- En prod : saisir les variables directement dans Vercel Settings → Environment Variables

Tout ce qui est préfixé `VITE_` est visible dans le bundle JS final.
Les secrets vraiment sensibles restent côté serveur Xano, jamais dans un `.env` React.

La variable `XANO_BASE_URL` (sans préfixe `VITE_`) est utilisée uniquement dans `api/proxy.ts` côté serveur — elle n'est jamais exposée au navigateur.

## Validation des inputs

Valider les inputs côté front ET côté Xano — jamais l'un sans l'autre.
