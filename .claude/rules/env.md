---
description: Variables d'environnement, fichiers .env, scripts npm, configuration Vercel
alwaysApply: true
---

## Variables d'environnement

| Variable | Usage | Présent en |
|---|---|---|
| `VITE_XANO_BASE_URL` | URL de base de l'API Xano | dev, staging, prod |
| `VITE_XANO_DATA_SOURCE` | Valeur `staging` — injecte le header `X-Data-Source` | staging uniquement |
| `VITE_INSCRIPTION_BASE_URL` | URL de base du lien d'inscription actionnaire | dev, staging, prod |

## Fichiers locaux

Copiés depuis `.env.example`, jamais committés :
- `.env` → chargé par `npm run dev` et `npm run build`
- `.env.staging` → chargé par `npm run dev:staging` et `npm run build:staging`

## Scripts npm

| Commande | Environnement | Données |
|---|---|---|
| `npm run dev` | Dev local | Prod |
| `npm run dev:staging` | Dev local | Staging |
| `npm run build` | Build prod | Prod |
| `npm run build:staging` | Build staging | Staging |

## Configuration Vercel

| Variable | Environnement Vercel |
|---|---|
| `VITE_XANO_BASE_URL` | Preview + Production |
| `VITE_XANO_DATA_SOURCE=staging` | Preview uniquement |

Vercel lit `package.json`, fait `npm install` puis `npm run build`.
Les variables sont saisies dans Vercel Settings → Environment Variables (pas de fichier `.env` en prod).

## Accès dans le code

```ts
import.meta.env.VITE_XANO_BASE_URL
import.meta.env.VITE_XANO_DATA_SOURCE
```

`VITE_*` est visible dans le bundle JS final — ne jamais y mettre de clé secrète.
