# Despliegue

## Automático (GitHub Actions → Firebase Hosting)

Cada push/merge a `main` ejecuta `.github/workflows/deploy.yml`: instala
dependencias, corre los tests, hace el build y publica en Firebase Hosting.

### Secrets requeridos

En GitHub: **Settings → Secrets and variables → Actions → New repository secret**.

| Secret | De dónde sale |
|--------|---------------|
| `FIREBASE_SERVICE_ACCOUNT` | Cuenta de servicio (JSON completo). Firebase Console → ⚙ Configuración del proyecto → **Cuentas de servicio** → *Generar nueva clave privada*. Pega el contenido del `.json`. |
| `VITE_FIREBASE_API_KEY` | Console → ⚙ → Configuración del proyecto → Tus apps (Web) |
| `VITE_FIREBASE_AUTH_DOMAIN` | idem |
| `VITE_FIREBASE_PROJECT_ID` | idem (`controldgastos`) |
| `VITE_FIREBASE_STORAGE_BUCKET` | idem |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | idem |
| `VITE_FIREBASE_APP_ID` | idem |
| `VITE_FIREBASE_MEASUREMENT_ID` | idem (opcional, Analytics) |
| `VITE_API_URL` | URL pública de la API (Render). Opcional: si no se define, se usa la de `.env.production`. |
| `VITE_ENABLE_PLAID` | `true` para mostrar la pestaña Bancos (opcional) |

> La cuenta de servicio necesita el rol **Firebase Hosting Admin** (o Editor).

### Ejecutarlo a mano
Pestaña **Actions → Deploy to Firebase Hosting → Run workflow**.

## Manual (desde tu máquina)

Despliega Hosting **y** Data Connect (esquema/SQL):

```bash
git checkout main && git pull origin main
npm install
firebase login          # solo la primera vez
npm run deploy:firebase # build + deploy de hosting y dataconnect
```

> El workflow automático solo publica **Hosting** (la app). Si cambias el
> esquema de **Data Connect**, despliégalo con el comando manual de arriba.
