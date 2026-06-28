---
description: Structure des fichiers, conventions de nommage, séparation des responsabilités
alwaysApply: true
---

## Arborescence src/

```
src/
├── assets/                        → images, SVG, fonts
├── api/                           → client.ts + un fichier par domaine
├── hooks/                         → hooks custom wrappant React Query
├── constants/                     → valeurs statiques par type
├── context/                       → contextes React globaux
├── utils/                         → fonctions pures utilitaires
├── components/
│   ├── layout/                    → AppLayout, Sidebar or Navbar
│   ├── section/                   → composants métier liés à une page
│   └── ui/                        → composants atomiques réutilisables
│       └── form/                  → formulaires (flat ou sous-dossier selon complexité)
├── pages/                         → une page = un fichier plat
├── App.css                        → variables CSS globales (couleurs, breakpoints, transitions)
├── App.module.css
├── App.tsx
├── index.css
└── main.tsx
```

## Structure des composants

Chaque composant vit dans son propre dossier avec un fichier `.tsx` et un `.module.css` :

```
components/ui/Button/
├── Button.tsx
└── Button.module.css
```

Les pages sont des fichiers plats dans `src/pages/`.

Un form dans un **fichier plat** si : champs simples, une seule responsabilité.
Un form dans un **sous-dossier** si : logique complexe avec fichiers annexes (utils propres, sous-composants internes, config séparée).
Les fichiers partagés entre plusieurs forms restent plats dans `src/components/ui/form/`.

## Séparation des responsabilités

**`src/api/`**
- Un fichier par domaine métier
- `client.ts` = instance Axios unique — jamais d'autre instance
- Exports : types TypeScript + fonctions pures (`getX`, `addX`, `editX`, `deleteX`)
- Aucune logique métier — uniquement des appels HTTP

**`src/hooks/`**
- Seul endroit qui appelle les fonctions `src/api/`
- Wrappent React Query (`useQuery`, `useMutation`)
- `queryKey` cohérent : `['domaine']` ou `['domaine', param ?? null]`

**`src/components/ui/`**
- Composants atomiques sans connaissance du domaine métier
- Reçoivent données et callbacks via props uniquement
- N'appellent jamais l'API ni les hooks de données

**`src/components/section/`**
- Composants métier liés à une page spécifique
- Reçoivent les données depuis la page via props
- N'appellent jamais l'API directement

**`src/pages/`**
- Appellent les hooks, distribuent aux composants section/ui
- Gèrent les états d'ouverture des SidePanels
- Gèrent les handlers de mutation (appel API + invalidateQueries + setSuccess)
- Fichiers plats — pas de sous-dossier

**`src/constants/`**
- Valeurs statiques non dérivables depuis une API
- Jamais de logique — uniquement des `const` exportées

**`src/context/`**
- Contextes React globaux (notifications, thème…)
- Exposés via un hook `useX()` — jamais le contexte brut

**`src/App.css`**
- Variables CSS globales (couleurs, breakpoints, transitions) uniquement

## Nommage

| Type | Convention | Exemple |
|---|---|---|
| Composant | PascalCase + dossier éponyme |
| Hook | camelCase + préfixe `use` |
| Page | PascalCase + suffix `Page` |
| Fichier API | camelCase, domaine au pluriel |
| Fichier CSS module | Même nom que le composant |
| Constante | camelCase descriptif |

## Ordre de construction

Construire page par page de A à Z : appels API → hooks → composants → page.
Sur les pages suivantes, réutiliser les composants déjà créés.

## Règles absolues

- Zéro duplication JSX — si quelque chose apparaît deux fois, extraire un composant
- Un composant = un fichier `.tsx` + un fichier `.module.css`
- Tout composant réutilisable va dans `src/components/`
- Toutes les requêtes Axios passent par `src/api/client.ts`