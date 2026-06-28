---
description: Créer ou modifier les fichiers d'instructions d'un projet Claude Code (CLAUDE.md, rules, skillz)
alwaysApply: false
---

# Skill — Créer les fichiers d'instructions Claude Code

## Ce que fait cette skill

Elle produit les fichiers d'instructions d'un projet Claude Code, bien découpés et directement
utilisables : CLAUDE.md racine, règles dans .claude/rules/, et CLAUDE.md imbriqués.

Déclencher dès que l'utilisateur mentionne CLAUDE.md, des règles Claude Code, la structure
d'instructions d'un projet, ou demande à organiser des règles pour Claude Code.

---

## 1. Comprendre le projet avant d'écrire

Collecter ces informations avant de produire quoi que ce soit :

- Stack technique (langages, frameworks, librairies)
- Structure du projet (arborescence src/, conventions de nommage)
- Principes de développement importants (DRY, mobile first, etc.)
- Règles spécifiques : API, CSS, sécurité, git, tests, env
- Ce qui doit être global vs scopé à un dossier ou type de fichier

Si ces informations sont déjà dans la conversation, les extraire sans reposer les questions.

---

## 2. Mécanismes Claude Code

| Fichier | Quand il charge |
|---|---|
| CLAUDE.md racine | Toujours |
| @chemin dans CLAUDE.md | Toujours (au démarrage) |
| .claude/rules/ sans `globs` | Toujours — règles globales modulaires |
| .claude/rules/ avec `globs` | Quand un fichier du projet matche le pattern |
| CLAUDE.md dans un sous-dossier | Quand Claude touche ce dossier |

### Frontmatter d'une rule

```markdown
---
description: Courte description de ce que couvre cette rule
globs: src/api/**/*.ts
alwaysApply: false
---
```

- `globs` absent ou vide → la rule charge toujours
- `globs` présent → charge uniquement quand le fichier matche
- `alwaysApply: true` → force le chargement même sans match

### Syntaxe des globs

- `*` → n'importe quel nom de fichier (un seul segment)
- `**` → n'importe quel chemin, quelle que soit la profondeur
- Exemples : `src/api/**/*.ts`, `**/*.test.ts`, `src/components/**`

### @imports dans CLAUDE.md

Le `@` référence un fichier ou dossier. Claude le charge au démarrage.
Sert à garder CLAUDE.md court en déléguant le détail aux rules.

---

## 3. Règles de rédaction

**Longueur** : aucun fichier ne dépasse 200 lignes.

**Ton** : formulations directes et prescriptives.
- ✓ "Centraliser les appels API dans src/api/"
- ✓ "Ne jamais appeler l'API directement dans un composant"
- ✗ "Il est recommandé de centraliser…"

**Pas de duplication** : une règle dans une rule n'est pas répétée dans CLAUDE.md.

**Découpage par domaine** : un fichier = un domaine.
Exemples : `architecture.md`, `api.md`, `css.md`, `git.md`, `security.md`, `env.md`

---

## 4. Structure recommandée

```
mon-projet/
├── CLAUDE.md
├── CLAUDE.local.md              # Préférences perso — dans .gitignore
└── .claude/
    ├── rules/
    │   ├── architecture.md
    │   ├── api.md
    │   ├── css.md
    │   ├── git.md
    │   ├── security.md
    │   └── env.md
    ├── skillz/
    │   ├── setup.md
    │   ├── save-it.md
    │   └── maintenance.md
    ├── knowledge/
    └── memory/
```

---

## 5. Contenu type du CLAUDE.md racine

Le CLAUDE.md racine doit rester sous 150 lignes. Il contient :

1. Une ligne de description du projet
2. La stack technique complète
3. La structure du projet (arborescence commentée)
4. Les @imports vers les rules, skillz et autres fichiers importants
5. Les principes non négociables du projet

Ce qu'il ne contient pas : le détail des règles (ça va dans les rules/).

---

## 6. Ordre de production

1. Proposer le découpage (quels fichiers, quels domaines) et valider avec l'utilisateur
2. Produire CLAUDE.md racine
3. Produire les rules dans l'ordre : architecture → api → css → git → security → env
4. Produire les CLAUDE.md imbriqués si nécessaire
5. Vérifier : aucun fichier > 200 lignes, aucune duplication entre fichiers

---

## 7. Vérifications avant de livrer

- [ ] CLAUDE.md racine < 150 lignes
- [ ] Aucun fichier rules/ > 200 lignes
- [ ] Aucune règle dupliquée entre deux fichiers
- [ ] Les globs matchent exactement les fichiers ciblés
- [ ] Le ton est prescriptif partout
- [ ] Les @imports dans CLAUDE.md pointent vers des fichiers qui existent

---

## 8. Modifier les instructions après le setup initial

Voir @.claude/skillz/maintenance.md pour :
- Arbre de décision : règle vs skill vs mise à jour CLAUDE.md
- Ajouter ou modifier une rule
- Créer une skill
