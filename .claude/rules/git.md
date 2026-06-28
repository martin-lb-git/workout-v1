---
description: Branches, workflow staging/prod, règles de commit
alwaysApply: true
---

## Branches

| Branche | Rôle |
|---|---|
| `main` | Production — deploy automatique Vercel Production → Backend data-source prod |
| `staging` | Staging — deploy automatique Vercel Preview → Backend data-source staging |

## Workflow quotidien

1. Développer sur la branche `staging`
2. Push → Vercel génère une Preview URL avec les données staging
3. Valider sur la Preview URL
4. Merger `staging` → `main` → déploiement prod automatique
5. Resynchroniser staging après chaque merge :

```bash
git checkout staging
git merge main
git push origin staging
```

`staging` a toujours le même code que `prod`, mais utilise les données staging.

## Règles de commit

- Messages en français, impératif présent : `Ajoute le filtre par date sur les réservations`
- Un commit = une unité logique de travail
- Ne jamais commiter `.env` ou `.env.staging`
- Ne jamais commiter de token ou clé secrète