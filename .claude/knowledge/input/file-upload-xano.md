---
description: Format confirmé pour uploader un fichier vers Xano — solution fonctionnelle
alwaysApply: true
---

## Résultat final — ça fonctionne

Upload d'image vers Xano en un seul appel PATCH, sans endpoint dédié.

## Format du payload Axios

`votre_photo` se met **au même niveau que `body`**, pas à l'intérieur :

```ts
await client.patch('/exemple', {
  body: {
    island_id: payload.island_id,
    label: payload.label,
    address: payload.address,
  },
  island_photo: {
    base64: dataUrl,   // data URI complet — data:image/jpeg;base64,...
    name: file.name,
    mime: file.type,
    size: file.size,
    type: 'image',
    access: 'public',
    meta: { width, height },
  },
})
```

## Règles critiques

- `base64` doit être le **data URI complet** avec préfixe `data:mime;base64,...` — pas du base64 brut
- Utiliser `FileReader.readAsDataURL(file)` — pas `btoa()` ni `arrayBuffer()`
- Ne pas inclure `path` ni `url` — Xano les génère lui-même
- `island_photo` est au même niveau que `body` dans le payload Axios (niveau racine de l'objet envoyé)
- Si pas de nouveau fichier sélectionné, ne pas inclure `island_photo` dans le payload

## Format Xano attendu (réponse en lecture)

```json
{
  "access": "public",
  "path": "/vault/Gbc9odzY/.../IMG_0159.jpeg",
  "name": "IMG_0159.jpeg",
  "type": "image",
  "size": 1059864,
  "mime": "image/jpeg",
  "meta": { "width": 3020, "height": 1932 },
  "url": "https://x20z-1h39-uxl7.p7.xano.io/vault/...",
  "base64": "data:image/jpeg;base64,..."
}
```

`path` et `url` sont générés par Xano côté serveur — ne pas les envoyer lors d'un upload.

## Helpers à réutiliser

```ts
function getDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target!.result as string)
    reader.readAsDataURL(file)
  })
}

function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.src = src
  })
}
```

