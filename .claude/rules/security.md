---
description: Variables sensibles, validation des inputs
alwaysApply: true
---

## Variables d'environnement

- Toutes les variables sensibles dans `.env` — jamais commitées, dans `.gitignore`
- Préfixe obligatoire `VITE_` pour que Vite les expose au navigateur
- `.env.example` commité sans valeurs réelles — sert de template
- En prod : saisir les variables directement dans Vercel Settings → Environment Variables

Tout ce qui est préfixé `VITE_` est visible dans le bundle JS final.
Les secrets vraiment sensibles restent côté serveur, jamais dans un `.env` React.

## Validation des inputs

Valider les inputs côté front ET côté API — jamais l'un sans l'autre.
