---
description: Modifier les fichiers d'instructions après le setup initial (rules, skills, CLAUDE.md)
alwaysApply: false
---

# Skill — Maintenance des instructions Claude Code

## Ce que fait cette skill

Couvre les modifications post-setup : ajout de règle, création de skill, mise à jour d'instruction existante.

---

## Arbre de décision

```
L'utilisateur veut ajouter / modifier une instruction
│
├── C'est une règle qui s'applique au code ?
│   (nommage, architecture, CSS, sécurité, API…)
│   └── → Section "Ajouter une rule" ci-dessous
│
├── C'est une procédure réutilisable ?
│   (comment faire X, workflow à suivre, étapes à respecter)
│   └── → Section "Créer une skill" ci-dessous
│
└── C'est une info globale sur le projet ?
    (stack, structure, principes)
    └── → Mettre à jour CLAUDE.md racine directement
```

---

## Ajouter une rule

### Trouver le bon fichier

Avant de créer une nouvelle rule, vérifier si la règle appartient à une rule existante :

| Domaine | Fichier cible |
|---|---|
| Structure, composants, nommage | `architecture.md` |
| Appels API, Axios, hooks | `api.md` |
| CSS, responsive, variables | `css.md` |
| Branches, commits, déploiement | `git.md` |
| JWT, secrets, validation | `security.md` |
| Variables d'environnement, staging | `env.md` |

Si la règle appartient à un domaine existant → l'ajouter dans ce fichier.
Si le domaine n'existe pas → créer un nouveau fichier dans `.claude/rules/`.

### Créer une nouvelle rule

1. Créer `.claude/rules/<domaine>.md` avec le frontmatter approprié
2. Ajouter `Voir @.claude/rules/<domaine>.md` dans CLAUDE.md racine, section "Règles détaillées"
3. Vérifier que CLAUDE.md racine reste sous 150 lignes

### Mettre à jour une rule existante

1. Ouvrir le fichier rule concerné
2. Ajouter la règle dans la section thématique correspondante
3. Vérifier que le fichier reste sous 200 lignes — si dépassement, découper et mettre à jour les `@imports` dans CLAUDE.md

### Vérifications après ajout d'une rule

- [ ] La règle n'est pas déjà présente dans un autre fichier
- [ ] Le `@import` correspondant existe dans CLAUDE.md racine
- [ ] Le ton est prescriptif (pas de "recommandé", "peut", "envisager")
- [ ] Le fichier modifié reste sous 200 lignes

---

## Créer une skill

Une skill est une procédure réutilisable que Claude suit pour accomplir une tâche complexe.
Ce n'est pas une règle de code — c'est un mode opératoire.

Exemples : générer un composant, créer une page de A à Z, écrire un test, déployer.

### Processus

1. Capturer l'intention : quel problème cette skill résout, dans quel contexte elle se déclenche
2. Rédiger la skill dans `.claude/skillz/<nom>.md` avec le frontmatter standard
3. Tester la skill sur un cas réel — ajuster si Claude dévie du mode opératoire attendu
4. Si la skill est référencée fréquemment, ajouter un @import dans CLAUDE.md

### Rangement

```
.claude/
├── rules/      → règles qui s'appliquent au code
├── skillz/     → procédures réutilisables
│   └── <nom>.md
└── knowledge/  → contexte technique et métier
```

### Frontmatter d'une skill

```markdown
---
description: Ce que fait cette skill et quand la déclencher
alwaysApply: false
---
```

`alwaysApply: false` est la valeur par défaut pour les skills — elles sont invoquées explicitement,
pas chargées systématiquement.

---

## Vérifications générales après toute modification

- [ ] CLAUDE.md racine reste sous 150 lignes
- [ ] Le fichier modifié reste sous 200 lignes
- [ ] Aucune duplication avec un fichier existant
- [ ] Les @imports dans CLAUDE.md pointent vers des fichiers qui existent
