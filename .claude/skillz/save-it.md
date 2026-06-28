---
description: Sauvegarder une connaissance pour les prochaines sessions Claude (rules, skillz, knowledge)
alwaysApply: false
---

# Skill — save-it

## Ce que fait cette skill

Sauvegarde une connaissance dans le bon endroit du projet pour que les prochaines sessions
Claude puissent la retrouver et la réutiliser.

Déclencher quand l'utilisateur dit "save-it", "sauvegarde ça", "mémorise ça pour les
prochaines fois", ou toute formulation équivalente.

---

## Arbre de décision — où sauvegarder

```
C'est quoi ?
│
├── Une règle qui s'applique au code ?
│   (nommage, architecture, CSS, sécurité, API, git…)
│   └── → .claude/rules/<domaine>.md
│       Vérifier d'abord si un fichier existant peut absorber la règle.
│
├── Une procédure réutilisable, un workflow ?
│   (comment faire X, étapes à suivre, mode opératoire)
│   └── → .claude/skillz/<nom>.md
│
└── Un contexte technique ou métier ?
    (pourquoi ça marche comme ça, décision d'archi, comportement d'un tiers,
     historique d'un bug, contrat d'une API externe)
    └── → .claude/knowledge/<sujet>.md
```

---

## Format fichier knowledge

```markdown
---
description: Une ligne — ce que couvre ce fichier
alwaysApply: true
---

## [Titre]

[Contenu]
```

## Format fichier rules

```markdown
---
description: Courte description du domaine couvert
alwaysApply: true
---

## [Section]

[Règles prescriptives, ton direct]
```

---

## Processus

1. Identifier précisément ce que l'utilisateur veut sauvegarder
2. Appliquer l'arbre de décision ci-dessus
3. Vérifier si un fichier existant peut absorber l'info — préférer l'ajout à la création
4. Écrire le contenu avec le bon format
5. Si nouveau fichier **knowledge** : ajouter `Voir @.claude/knowledge/<fichier>.md` dans CLAUDE.md section "Contexte technique"
6. Si nouveau fichier **rules** : ajouter `Voir @.claude/rules/<fichier>.md` dans CLAUDE.md section "Règles détaillées"
7. Confirmer à l'utilisateur : ce qui a été sauvegardé, dans quel fichier, pourquoi cet endroit

---

## Ce qu'on ne sauvegarde pas ici

- Les patterns de code ou conventions déjà dans les rules → les rules font autorité
- Les tâches en cours ou l'état d'une session → éphémère, pas de persistance
- Ce qui est déjà dans CLAUDE.md ou les rules → pas de duplication
