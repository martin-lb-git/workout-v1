---
description: Comportement de DatePickerInput et règles pour les sélecteurs de plage de dates
alwaysApply: true
---

## Comportement de DatePickerInput à l'ouverture

Le composant ouvre sur : `selectedDate ?? defaultMonth ?? new Date()`

- Si `value` est renseigné → s'ouvre sur le mois de la valeur
- Sinon → s'ouvre sur `defaultMonth` si fourni
- Sinon → s'ouvre sur le mois courant (aujourd'hui)

Le `defaultMonth` n'est évalué qu'à l'ouverture (via `useEffect` sur `open`) — le passer depuis le parent est suffisant.

## Règle — plage de dates (start_date + end_date)

Toujours appliquer ce pattern dans tout form avec deux DatePickerInput start/end :

```tsx
const today = startOfDay(new Date())
const startDate = watch('start_date') ?? null
const endDate = watch('end_date') ?? null

// start_date picker
<DatePickerInput
  value={field.value || null}
  onChange={(d) => {
    field.onChange(d ?? '')
    if (d && endDate && d >= endDate) setValue('end_date', '')
  }}
  defaultMonth={startDate ? parseISO(startDate) : today}
  ...
/>

// end_date picker
<DatePickerInput
  value={field.value || null}
  onChange={(d) => field.onChange(d ?? '')}
  defaultMonth={endDate ? parseISO(endDate) : startDate ? parseISO(startDate) : today}
  ...
/>
```

## Règles

- `defaultMonth` sur `start_date` : today si vide, sinon la valeur (redondant mais explicite)
- `defaultMonth` sur `end_date` : end_date si set → start_date si set → today
- Quand `start_date` change : toujours resetter `end_date` si `start_date >= end_date`
- Sans le reset, on peut sélectionner une période inversée (ex: octobre → juillet)

## Forms concernés (vérifiés et corrigés)

| Form | Statut |
|---|---|
| `AddBookingForm` | ✓ |
| `EditBookingForm` | ✓ |
| `AddPricingForm` | ✓ |
| `UnavailabilityForm` | ✓ (ajout + édition) |
