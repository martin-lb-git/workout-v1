---
description: Pattern dataform — état générique page → formulaire react-hook-form + zod → mutation Xano
alwaysApply: false
---

## Vue d'ensemble

Toute création ou modification passe par ce flux :

```
Page : dataform (Record<string, unknown>)
  → Form component : react-hook-form + zod
    → onSubmit({ body: data })
      → Page handler : appel API + invalidateQueries
```

## Étape 1 — Page : état et ouverture

```ts
const [editingItem, setEditingItem] = useState<Item | null>(null)
const [dataform, setDataform] = useState<Record<string, unknown>>({})

// Ouvrir une modification — pré-remplir dataform avec l'item
function handleOpenEdit(item: Item) {
  setDataform({ ...item, group_id: resolvedGroupId })
  setEditingItem(item)
  setEditOpen(true)
}

// Ouvrir une création — dataform vide
function handleOpenAdd() {
  setDataform({})
  setAddOpen(true)
}
```

`dataform` est toujours `Record<string, unknown>` — il n'est jamais typé précisément à ce niveau.

## Étape 2 — Form component : validation et rendu

```ts
// Schéma Zod — source de vérité du payload
const editItemSchema = z.object({
  label: z.string().min(1, 'Requis'),
  group_id: z.number({ error: 'Requis' }),
})
export type EditItemFormData = z.infer<typeof editItemSchema>

interface Props {
  dataform: Record<string, unknown>
  onSubmit: (data: { body: EditItemFormData }) => Promise<void>
}

export default function EditItemForm({ dataform, onSubmit }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<EditItemFormData>({
      resolver: zodResolver(editItemSchema),
      defaultValues: dataform as Partial<EditItemFormData>,
    })

  // Reset quand dataform change (réutilisation du composant pour des items différents)
  useEffect(() => {
    reset(dataform as Partial<EditItemFormData>)
  }, [dataform, reset])

  async function onValid(data: EditItemFormData) {
    await onSubmit({ body: data })
  }

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <input {...register('label')} />
      {errors.label && <p>{errors.label.message}</p>}
      <button type="submit" disabled={isSubmitting}>Enregistrer</button>
    </form>
  )
}
```

Le form wrappe toujours les données dans `{ body: data }` avant d'appeler `onSubmit`.

## Étape 3 — Page : handler de soumission

```ts
async function handleEdit({ body }: { body: EditItemFormData }) {
  try {
    await editItem({
      item_id: editingItem!.id,
      label: body.label,
      group_id: body.group_id,
    })
    await queryClient.invalidateQueries({ queryKey: ['items'] })
    setEditSuccess(true)
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      ?? (err instanceof Error ? err.message : 'Erreur')
    toast.error(message)
  }
}
```

L'`id` de l'item édité vient de `editingItem!.id` — pas du body du form.

## Stack

- `react-hook-form` — gestion de l'état du form
- `zod` + `@hookform/resolvers/zod` — validation et typage
- `zodResolver` — connecteur entre les deux

## Zod v4 — syntaxe des messages d'erreur

Ce projet utilise **Zod v4**. L'option `invalid_type_error` n'existe plus — utiliser `error` :

```ts
// ✓ Zod v4
z.number({ error: 'Requis' })
z.string({ error: 'Requis' })

// ✗ Zod v3 — ne compile pas
z.number({ invalid_type_error: 'Requis' })
```

## Toast — feedback erreur

`react-hot-toast` est monté une seule fois dans `App.tsx` (`<Toaster position="top-right" />`). Ne jamais le remonter ailleurs.

Pattern d'extraction de l'erreur Xano dans chaque handler :

```ts
} catch (err: unknown) {
  const message =
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    ?? (err instanceof Error ? err.message : 'Erreur')
  toast.error(message)
}
```

Xano retourne son message d'erreur dans `response.data.message`. Le fallback `err.message` couvre les erreurs réseau. Ne jamais afficher un message générique sans avoir tenté d'extraire le message Xano.

## Champs conditionnels — `watch()` + `superRefine`

Pour afficher/masquer un champ selon la valeur d'un autre, utiliser `watch()` de react-hook-form et `z.superRefine` pour la validation conditionnelle.

## Règles

- `dataform` est toujours `Record<string, unknown>` dans la page — pas de type précis
- Le type précis vit dans le composant form via `z.infer<typeof schema>`
- `useEffect(() => reset(dataform), [dataform, reset])` est obligatoire pour les forms réutilisés
- `invalidateQueries` se fait dans le handler page, jamais dans le form component
- L'id de l'item n'est jamais dans le form — il vient de l'état `editingItem` de la page
- Toujours extraire `err.response.data.message` avant de fallback sur un message générique
