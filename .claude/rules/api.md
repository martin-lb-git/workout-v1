---
description: Instance Axios centralisée, hooks React Query, patterns GET/mutation
globs: src/api/**/*.ts, src/hooks/**/*.ts
alwaysApply: false
---

# API & Data fetching

## Client Axios centralisé

Tous les appels Axios passent par `src/api/client.ts`. Ne jamais créer d'instance Axios ailleurs.

```ts
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})
```

## Organisation des fichiers API

Un fichier par domaine dans `src/api/` :

```
src/api/
├── client.ts          → instance Axios unique
└── <domaine>.ts       → un fichier par domaine métier
```

Chaque fichier exporte des fonctions pures qui appellent l'API et retournent les données.
Aucune logique métier dans ces fichiers.

## Hooks React Query

Les hooks dans `src/hooks/` wrappent React Query. C'est le seul endroit où on appelle les fonctions `src/api/`.

```ts
// Bon
const { data, isLoading } = useItems()

// Interdit — appel direct dans un composant
const res = await axios.get('/items')
```

### Convention queryKey

```ts
queryKey: ['items']                        // liste simple
queryKey: ['items', id ?? null]            // avec paramètre optionnel — null si absent
```

Utiliser le même queryKey pour invalider après une mutation.

## GET — pattern standard

```ts
// src/api/houses.ts
export interface House { id: number; label: string }

export async function getHouses(): Promise<House[]> {
  const { data } = await client.get<House[]>('/houses')
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
  await client.patch('/houses', payload)
}

// dans la page
const queryClient = useQueryClient()
const mutation = useMutation({
  mutationFn: editHouse,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['houses'] }),
})
```
