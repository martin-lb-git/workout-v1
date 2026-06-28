---
description: Architecture complète du flux d'authentification Xano via proxy Vercel
alwaysApply: true
---

## Pourquoi le proxy existe

Xano auth via cookie HttpOnly. Le front est sur Vercel (origine différente de Xano). Problème : les cookies HttpOnly cross-origin ne peuvent pas être lus en JS — seul le navigateur les gère. Mais Xano attend `Authorization: Bearer <token>`.

Solution : `api/proxy.ts` (Vercel Edge Function) intercepte toutes les requêtes `/api/proxy/*`, lit le cookie `token` côté serveur (autorisé), l'injecte en `Authorization: Bearer` et forward vers Xano.

## Ce que fait le proxy (api/proxy.ts)

1. Rewrite `/api/proxy/<path>` → `XANO_BASE_URL/<path>`
2. Lit le cookie `token` par nom exact (pas regex) dans le header `cookie`
3. Injecte `Authorization: Bearer <token>` si le cookie existe
4. Transfère `X-Data-Source` si présent (staging)
5. Strip les headers CORS de Xano (Vercel gère les siens)
6. **Force `Path=/` sur tous les `Set-Cookie`** — voir "Problème double token" ci-dessous

## Flux login

1. `POST /api/proxy/auth/login` → proxy forward à Xano
2. Xano retourne body `{ token, role }` + `Set-Cookie: token=<val>; HttpOnly; ...`
3. Proxy force `Path=/` sur le `Set-Cookie` → navigateur stocke le cookie sur tout le domaine
4. `AuthContext.login()` ignore le body entièrement (`login()` retourne `void` dans `auth.ts`)
5. `me()` est appelé immédiatement après → cookie présent → Xano retourne `{ user: { ... } }`
6. `AuthContext` stocke le `User` complet et passe `isAuthenticated = true`

## Flux refresh de page

`AuthProvider` appelle `me()` dans un `useEffect` au montage :
- Cookie absent → Xano 401 → `isAuthenticated = false` — **normal, ne pas alarmer**
- Cookie présent → Xano retourne le user → `isAuthenticated = true`, `user` chargé

La 401 sur `GET /auth/me` au refresh est donc attendue et ne signale aucun bug.

## Flux logout

Le proxy intercepte `POST /auth/logout` **avant** d'appeler Xano (Xano n'a pas cet endpoint) :

```ts
return new Response(JSON.stringify({ ok: true }), {
  headers: { 'Set-Cookie': 'token=; Max-Age=0; Path=/; SameSite=None; Secure; HttpOnly' },
})
```

Le navigateur efface le cookie. `AuthContext` passe `isAuthenticated = false`, `user = null`.

## Problème double token - infos

Avant le fix, Xano retournait `Set-Cookie` avec son propre `Path` (ex: `/api/1.0/auth/`). Le navigateur scopait le cookie à ce chemin. Les appels vers d'autres collections ne l'envoyaient pas → Xano ne recevait pas le token → posait un **nouveau** `Set-Cookie` → deux cookies `token` à des paths différents.

Fix : le proxy strip `Path` et `Domain` de chaque `Set-Cookie` et force `Path=/`.

## AuthContext — ce qui est exposé via useAuth()

```ts
user: User | null          // objet utilisateur complet
isAuthenticated: boolean
isLoading: boolean
login(credentials): Promise<void>
logout(): Promise<void>
```

Les types sont exportés depuis `src/api/auth.ts`.

## Règles absolues

- Ne jamais lire ni stocker le token en JS — cookie HttpOnly uniquement
- Toute requête Xano passe par `/api/proxy/*` — jamais appel direct
- Ne pas créer d'endpoint Xano pour le logout — le proxy le gère
- Si Xano ne reçoit pas le token, le fix est côté proxy ou CORS, jamais côté JS
- `LoginResponse` n'existe plus — `login()` retourne `void`, le role vient de `me()`