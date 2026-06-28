---
description: Variables d'environnement, fichiers .env, scripts npm
alwaysApply: true
---

## Variables d'environnement

| Variable | Usage | Présent en |
|---|---|---|
| `VITE_API_BASE_URL` | URL de base de l'API | dev, staging, prod |

> Compléter selon le projet instancié.

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

## Accès dans le code

```ts
import.meta.env.VITE_API_BASE_URL
```

`VITE_*` est visible dans le bundle JS final — ne jamais y mettre de clé secrète.
