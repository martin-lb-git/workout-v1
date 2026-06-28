---
description: Catalogue de tous les types d'inputs du projet — librairies, patterns, états d'erreur, CSS
alwaysApply: true
---

## Librairies

| Lib | Rôle |
|---|---|
| `react-hook-form` | État du form, register, watch, Controller |
| `zod` + `@hookform/resolvers/zod` | Schéma de validation + resolver |
| `react-day-picker` | Calendrier interne de `DatePickerInput` |
| `@tiptap/react` + `@tiptap/starter-kit` | Éditeur rich text (`RichTextEditor`) |
| `lucide-react` | Icônes dans les inputs |

---

## Pattern d'erreur — commun à tous les inputs

Trois éléments réagissent simultanément quand un champ est invalide :

```tsx
<label className={`${styles.label}${errors.field ? ` ${styles.labelError}` : ''}`}>
  {errors.field && <TriangleAlert size={10} />}
  Label
</label>
<input className={`${styles.input}${errors.field ? ` ${styles.inputError}` : ''}`} {...register('field')} />
{errors.field && <p className={styles.error}>{errors.field.message}</p>}
```

Focus automatique sur le premier champ invalide via un second callback à `handleSubmit` :

```ts
function onError(errs: Record<string, unknown>) {
  const firstKey = Object.keys(errs)[0]
  if (firstKey) setFocus(firstKey as never)
}
```

---

## Inputs texte / email / textarea

```ts
// Schéma
field: z.string().min(1, 'Requis')
email: z.string().email('Email invalide')

// Register
<input type="text" {...register('field')} />
<textarea {...register('description')} />
```

---

## Inputs numériques

**Requis** — toujours `valueAsNumber: true`, jamais `z.coerce.number()` :

```ts
price: z.number({ error: 'Requis' }).min(0)
<input type="number" {...register('price', { valueAsNumber: true })} />
```

**Optionnel** — `valueAsNumber` convertit un input vide en `NaN`. Utiliser `setValueAs` :

```ts
const toOptionalNum = (v: unknown) =>
  v === '' || v == null || Number.isNaN(Number(v)) ? undefined : Number(v)

field: z.number().int().min(0).optional()
<input type="number" {...register('field', { setValueAs: toOptionalNum })} />
```

Le scroll sur `<input type="number">` est désactivé globalement dans `src/main.tsx`.

---

## Selects

**String** — `register` suffit.

**Entier** — utiliser `Controller` (le `register` + `valueAsNumber` renvoie `NaN` sur option vide) :

```tsx
<Controller name="group_id" control={control} render={({ field }) => (
  <select
    value={field.value ?? ''}
    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
  >
    <option value="">Sélectionner…</option>
    {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
  </select>
)} />
```

Wrapper `position: relative` + chevron `position: absolute; right: 12px; pointer-events: none`.

---

## Composants custom

**`DatePickerInput`** — valeur en `YYYY-MM-DD`, affichage en `DD/MM/YYYY`. Toujours via `Controller`.
Resetter `end_date` si `start_date >= end_date`.

**`StepperField`** — boutons +/− pour les entiers. Ne s'intègre pas avec `register` — piloter via `watch` + `setValue(..., { shouldDirty: true })`.

**`RichTextEditor`** — éditeur Tiptap (bold, italic, liste). Stocke du HTML. Via `Controller`. Convertit `<p></p>` en `''` avant d'appeler `onChange`.

---

## Upload image

`<input type="file">` caché derrière une dropzone cliquable. Limite : 5 Mo. Preview via `URL.createObjectURL`.
La conversion base64 + dimensions se fait dans `onValid`, pas dans `handleFileChange`.
Helpers `getDataUrl` et `getImageDimensions` dans `src/utils/imageUtils.ts`.

---

## Variables CSS des inputs

```css
var(--input-height)       /* hauteur standard */
var(--input-border)       /* bordure au repos */
var(--input-placeholder)  /* couleur placeholder */
var(--color-bordeaux)     /* rouge d'erreur */
```