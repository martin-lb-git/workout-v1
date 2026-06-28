# Template Project Starter

Projet de démarrage servant de base pour les nouveaux projets Vibecode / NoCode Factory.

---

## Stack technique

> À compléter selon le projet instancié.

---

## Structure du projet

> À compléter selon le projet instancié.

---

## Principes non négociables

- **DRY** : zéro JSX dupliqué — si ça apparaît deux fois, c'est un composant ou une util
- **KISS** : la solution la plus simple qui fonctionne est la bonne
- **Single Responsibility** : un composant fait une seule chose, il n'appelle jamais l'API
- **Open/Closed** : le comportement s'injecte via props (`onDelete`, `onEdit`), jamais hardcodé

---

## Règles détaillées

> Ajouter les @imports au fur et à mesure de la création des rules.

Voir @.claude/rules/architecture.md — Structure des fichiers, conventions de nommage, séparation des responsabilités
Voir @.claude/rules/structure-src.md — Structure src/, arborescence détaillée
Voir @.claude/rules/api.md — Appels Xano, instance Axios centralisée, hooks React Query
Voir @.claude/rules/css.md — CSS Modules, mobile first, responsive, variables globales
Voir @.claude/rules/git.md — Branches, workflow staging/prod, règles de commit
Voir @.claude/rules/security.md — Auth proxy, variables sensibles, validation des inputs
Voir @.claude/rules/env.md — Variables d'environnement, fichiers .env, scripts npm, configuration Vercel

---

## Skills disponibles

> Ajouter les @imports vers .claude/skillz/ au fur et à mesure.

Voir @.claude/skillz/setup.md — Créer ou modifier les fichiers d'instructions Claude Code
Voir @.claude/skillz/save-it.md — Sauvegarder une connaissance pour les prochaines sessions
Voir @.claude/skillz/maintenance.md — Modifier les instructions après le setup initial

---

## Contexte technique

> Ajouter les @imports vers .claude/knowledge/ au fur et à mesure.

Voir @.claude/knowledge/auth-proxy.md — Architecture complète du flux d'authentification Xano via proxy Vercel
Voir @.claude/knowledge/reset-password.md — Flow reset password via magic link — endpoints, routing, invariants
Voir @.claude/knowledge/api-feature.md — Recette complète pour implémenter une feature avec appel API Xano
Voir @.claude/knowledge/form-dataform-pattern.md — Pattern dataform — état générique page → formulaire react-hook-form + zod → mutation Xano
Voir @.claude/knowledge/input/input.md — Catalogue de tous les types d'inputs — librairies, patterns, états d'erreur, CSS
Voir @.claude/knowledge/input/datepicker-pattern.md — Comportement de DatePickerInput et règles pour les sélecteurs de plage de dates
Voir @.claude/knowledge/input/file-upload-xano.md — Format confirmé pour uploader un fichier vers Xano

---
