---
description: Appels Xano, instance Axios centralisée, hooks React Query
globs: src/api/**/*.ts, src/hooks/**/*.ts
alwaysApply: false
---

# API & Data fetching

## Client Axios centralisé

Tous les appels Axios passent par `src/api/client.ts`. Ne jamais créer d'instance Axios ailleurs.

```ts
const client = axios.create({
  baseURL: '/api/proxy',  // toujours relatif — jamais l'URL Xano directement
  withCredentials: true,
})
```

`baseURL: '/api/proxy'` — en dev, Vite proxifie vers Xano. En prod/preview, Vercel route vers `api/proxy.ts`. Le client ne connaît jamais l'URL Xano directement.

`VITE_XANO_BASE_URL` n'est **pas** dans `client.ts`. Il sert uniquement à construire les URLs d'images vault dans les fichiers API qui en ont besoin.

## Organisation des fichiers API

Un fichier par domaine dans `src/api/` :

```
src/api/
├── client.ts          → instance Axios + intercepteur X-Data-Source
├── auth.ts            → login, me, logout
├── bookings.ts
├── islands.ts
├── services.ts
├── shareholders.ts
├── documents.ts
├── groups.ts
├── villas.ts
└── export.ts
```

Chaque fichier exporte des fonctions pures qui appellent Xano et retournent les données.
Aucune logique métier dans ces fichiers.

## Hooks React Query exemple

Les hooks dans `src/hooks/` wrappent React Query. C'est le seul endroit où on appelle les fonctions `src/api/`.

```ts
// Bon
const { data, isLoading } = useIslands()

// Interdit — appel direct dans un composant
const res = await axios.get('/island/all_island')
```

### Convention queryKey exemple

```ts
queryKey: ['islands']                        // liste simple
queryKey: ['bookings', villaId ?? null]      // avec paramètre optionnel — null si absent
```

Utiliser le même queryKey pour invalider après une mutation.

## GET — pattern standard

```ts
// src/api/houses.ts
export interface House { id: number; label: string }

export async function getHouses(): Promise<House[]> {
  const { data } = await client.get<House[]>('/house/all')
  return data
}

// src/hooks/useHouses.ts
export function useHouses() {
  return useQuery({ queryKey: ['houses'], queryFn: getHouses })
}
```

## Mutation — pattern standard

```ts
// src/api/houses.ts
export async function editHouse(payload: EditHousePayload): Promise<void> {
  await client.patch('/house', { body: payload })
}

// dans le composant
const queryClient = useQueryClient()
const mutation = useMutation({
  mutationFn: editHouse,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['houses'] }),
})
```

Les mutations Xano reçoivent le payload wrappé dans `{ body: payload }` — vérifier sur les endpoints existants si ce n'est pas le cas.

## Champs JSON-stringifiés (piège Xano)

Xano retourne parfois des tableaux ou objets sous forme de string JSON. Les typer avec `string | T[] | null` et parser :

```ts
interface RawIsland extends Omit<Island, 'villas'> {
  villas: string | Villa[] | null
}

function parseJsonField<T>(value: string | T[] | null): T[] | null {
  if (!value) return null
  if (Array.isArray(value)) return value
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : null
  } catch { return null }
}
```

## Images vault Xano

Les fichiers Xano Vault ont un `path` (ex: `/vault/abc.jpg`). URL complète :

```ts
imageUrl: attachment?.path
  ? `${(import.meta.env.VITE_XANO_BASE_URL ?? '').split('/api:')[0]}${attachment.path}`
  : null
```

`.split('/api:')[0]` extrait l'origine depuis l'URL d'API (ex: `https://xyz.xano.io`).

## Xano — référence endpoints BO

- Auth : `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- Logout géré par le proxy, pas par Xano — voir @.claude/knowledge/auth-proxy.md
- Staging : header `X-Data-Source: staging` injecté automatiquement
