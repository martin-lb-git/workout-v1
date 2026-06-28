---
description: CSS Modules, mobile first, responsive, variables globales
globs: src/**/*.module.css
alwaysApply: false
---

## CSS Modules

Un composant = un fichier `.module.css`. Jamais de styles inline. Jamais de classes globales dans un fichier de composant.

## index.css — variables globales

`src/index.css` contient toutes les variables CSS globales :
- Couleurs (`--color-primary`, etc.)
- Breakpoints (`--breakpoint-tablet`, `--breakpoint-desktop`)
- Transitions (`--transition-default`)
- Typographie

Les `.module.css` référencent ces variables via `var(--nom-variable)`.

## Mobile first

Écrire le CSS mobile en premier, puis surcharger avec des `@media (min-width: ...)` :

```css
/* Mobile — base */
.container {
  padding: 1rem;
  flex-direction: column;
}

/* Tablet */
@media (min-width: var(--breakpoint-tablet)) {
  .container {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: var(--breakpoint-desktop)) {
  .container {
    flex-direction: row;
  }
}
```

Le navigateur lit le CSS de haut en bas : les styles desktop écrasent les styles mobile sur grands écrans.
Pas de fichier responsive global — chaque composant gère son propre responsive.

## Hauteur pleine page — dvh obligatoire

Toujours utiliser `100dvh` (dynamic viewport height) à la place de `100vh` pour les éléments pleine hauteur (sidebar, layout, overlays). Sur iOS Safari, `100vh` inclut la barre d'adresse et coupe le bas du contenu.

```css
/* ✓ correct */
.sidebar { height: 100dvh; }
.layout  { min-height: 100dvh; }

/* ✗ éviter */
.sidebar { height: 100vh; }
```

## Scroll lock — overlay mobile

Quand un drawer ou une sidebar overlay s'ouvre sur mobile, bloquer le scroll de la page via `useEffect` dans le composant parent :

```ts
useEffect(() => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
  return () => { document.body.style.overflow = '' }
}, [isOpen])
```

Le cleanup dans le return garantit que le scroll est rétabli si le composant est démonté.

## Overflow horizontal — interdit globalement

`overflow-x: hidden` est posé sur `body` dans `src/index.css`. Ne jamais créer d'élément dont la largeur dépasse 100% du viewport.

## Transitions

Les valeurs de transition sont des variables dans `index.css`.
Chaque composant les applique dans son `.module.css` via `var(--transition-default)`.