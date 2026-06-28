---
description: Flow reset password via magic link — endpoints, routing App.tsx, invariants
alwaysApply: true
---

## Endpoints

// demander le nommage exact des endpoints et retracer les routes partout

| Action | Méthode | Path | Payload |
|---|---|---|---|
| Envoi du lien | GET | `/auth/magic-link` | params : `{ email }` |
| Échange token | POST | `/auth/magic-login` | body direct : `{ magic_token }` |
| Changement mdp | POST | `/update_pw` | body direct : `{ password }` |

Ces trois endpoints **ne wrappent pas dans `{ body: ... }`** — contrairement aux mutations standard Xano.

## Flux complet

1. `LoginPage` — bloc "Mot de passe oublié" :
   - `apiLogout()` (purge le cookie existant pour éviter que le proxy injecte `Authorization` sur l'appel magic-link)
   - `GET /auth/magic-link?email=...` → Xano envoie l'email
   - Bloc succès affiché dans la card (pas de navigation)

2. `ResetPasswordPage` (`/mot-de-passe-oublie?token=...`) :
   - Au montage : extrait `?token=` → `POST /auth/magic-login` → pose le cookie HttpOnly
   - **L'user est forcément authentifié après cette étape** — c'est le comportement normal
   - Seul cas d'erreur : token invalide/expiré → toast + `navigate(ROUTES.LOGIN)`
   - Form : `password` + `confirm_password` → `POST /update_pw` (call authentifié via cookie magicLogin)
   - Succès → toast + `navigate(ROUTES.LOGIN)`

## Invariants critiques

- `magicLogin` **échange** le magic token contre un auth token (cookie HttpOnly) — après ça l'user est authentifié
- `updatePassword` est un **call authentifié** — il a besoin du cookie posé par `magicLogin`. Ne jamais appeler `logout()` entre les deux.
- Le catch de `magicLogin` ne doit rediriger au login **que si le token est vraiment invalide** — pas dans les autres cas.

## Routing App.tsx — piège

`ResetPasswordPage` doit être accessible **quelle que soit l'état d'auth** (avant et après `magicLogin`).

Le bloc authentifié utilise des `<Routes>` imbriquées pour isoler `RESET_PASSWORD` hors de `AppLayout` :

```tsx
// Bloc isAuthenticated = true
return (
  <Routes>
    <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
    <Route
      path="*"
      element={
        <AppLayout>
          <Routes>
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.RESERVATIONS} replace />} />
            <Route path={ROUTES.LOGIN} element={<Navigate to={ROUTES.RESERVATIONS} replace />} />
            {/* ... autres routes ... */}
          </Routes>
        </AppLayout>
      }
    />
  </Routes>
)
```

`RESET_PASSWORD` est aussi dans le bloc `!isAuthenticated` (pour le cas où `me()` a retourné 401 avant que `magicLogin` pose le cookie).

`ROUTES.LOGIN` dans le bloc authentifié redirige vers `ROUTES.RESERVATIONS` — un user connecté qui atterrit sur `/login` (ex: après `updatePassword`) est renvoyé vers l'app.

## Ne pas faire

- Ne pas utiliser `useLocation` dans `AppContent` pour court-circuiter les checks d'auth → cause des remounts/double-appels selon les cycles de rendu React
- Ne pas appeler `logout()` avant `magicLogin` dans `ResetPasswordPage` — cela purgerait le cookie nécessaire à `updatePassword`
- Ne pas wrapper `/auth/magic-login` ni `/update_pw` dans `{ body: ... }`
