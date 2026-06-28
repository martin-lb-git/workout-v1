---
description: Structure des fichiers, conventions de nommage, séparation des responsabilités
alwaysApply: true
---

## Structure des composants

Chaque composant vit dans son propre dossier avec un fichier `.tsx` et un `.module.css` :

```
components/ui/Button/
├── Button.tsx
└── Button.module.css
```

Les pages sont des fichiers plats dans `src/pages/` : `ReservationsPage.tsx`.

## Séparation des responsabilités

- Un composant UI n'appelle jamais l'API directement
- La logique métier va dans les hooks (`src/hooks/`) ou services (`src/services/`)
- Les appels API sont centralisés dans `src/api/` — un fichier par domaine
- Les constantes statiques vont dans `src/constants/` (routes.ts, status.ts…)
- Les couleurs, breakpoints et transitions vont dans `src/index.css` en variables CSS

## Nommage

| Type | Convention | Exemple |
|---|---|---|
| Composant | PascalCase | `BookingCard.tsx` |
| Hook | camelCase + préfixe `use` | `useBookings.ts` |
| Service / util | camelCase | `exportService.ts`, `formatDate.ts` |
| Fichier page | PascalCase + suffix Page | `ReservationsPage.tsx` |
| Fichier CSS | Même nom que le composant | `BookingCard.module.css` |

## Ordre de construction

Construire page par page de A à Z : composants → hooks → appels API.
Sur les pages suivantes, réutiliser les composants déjà créés.

## Règles absolues

- Zéro duplication JSX — si quelque chose apparaît deux fois, extraire un composant
- Un composant = un fichier `.tsx` + un fichier `.module.css`
- Tout composant réutilisable va dans `src/components/`
- Toutes les requêtes Axios passent par `src/api/client.ts`