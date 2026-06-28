---
description: Recette complète pour implémenter une feature avec appel API Xano de A à Z
alwaysApply: false
---

## Ce que l'utilisateur doit fournir

Pour réussir une feature de A à Z sans aller-retour, Claude a besoin de :

1. **L'endpoint exact** — path seul, sans base URL
   Exemples : `GET /island/all_island`, `PATCH /island`

2. **Le schéma de réponse Xano brut** — champs et types exacts
   Préciser si des champs sont retournés comme string JSON au lieu d'objets (voir piège ci-dessous)

3. **La maquette** — URL Figma (via MCP) ou description UI

4. **Les règles métiers** — détail de comportement attendu

5. **Pour les mutations** : shape du payload + queryKey à invalider

## Ce que Claude produit, dans l'ordre

### Étape 1 — `src/api/<domaine>.ts`

- Types TypeScript de la réponse brute Xano
- Type `Raw<X>` si des champs sont JSON-stringifiés
- Types des payloads de mutation
- Fonction `get<X>()` avec `client.get<T>()`
- Fonctions de mutation `edit<X>()`, `add<X>()` avec `{ body: payload }`
- Parsing des champs JSON-stringifiés si nécessaire
- Construction de `imageUrl` depuis vault path si attachment

### Étape 2 — `src/hooks/use<Domaine>.ts`

- `useQuery` qui wrappe la fonction API
- `queryKey` cohérent : `['domaine']` ou `['domaine', param ?? null]`

### Étape 3 — Composant(s) (`src/components/...`)

- Un composant = `.tsx` + `.module.css`
- Reçoit les données via props, n'appelle jamais l'API directement
- Applique les gardes de rôle via `useAuth().user.role`

### Étape 4 — Page (`src/pages/<Nom>Page.tsx`)

- Appelle le hook, distribue aux composants
- Gère `isLoading` et erreur
- Point d'entrée de la route

## Pièges connus

**Champs JSON-stringifiés** : Xano retourne parfois `"[{\"id\":1}]"` au lieu de `[{id:1}]`. Toujours vérifier le schéma brut. Typer en `string | T[] | null` et parser avec `parseJsonField`.

**Vault image URL** : `attachment.path` est un chemin relatif Xano, pas une URL complète.
Construire avec `VITE_XANO_BASE_URL.split('/api:')[0] + path`.

**queryKey avec paramètre optionnel** : utiliser `null` si absent — `['bookings', villaId ?? null]`.
Sans ça, `invalidateQueries({ queryKey: ['bookings'] })` ne matche pas les entrées avec paramètre.

**Payload wrappé** : les mutations Xano reçoivent `{ body: payload }` comme second argument Axios.
Vérifier sur les endpoints existants si différent.

**baseURL** : toujours `/api/proxy/...` — jamais l'URL Xano directement. Le routing vers staging ou prod est transparent.
