# Tareas pendientes antes de salir en producción

## ✅ Hecho
- Web completa (home, catálogo, producto, carrito, checkout)
- Panel de administración `/admin` (usuario: admin@llevateunchollo.es / admin123)
- Chatbot Oscar con IA
- Dominios configurados (llevateunchollo.es y .com)
- Despliegue en Vercel preparado

---

## ⏳ PASO 1 — WhatsApp Business

1. Instalar **WhatsApp Business** en el móvil con la SIM del negocio
2. Registrarlo con el número nuevo
3. Abrir el `.env` y cambiar:
   ```
   NEXT_PUBLIC_WHATSAPP_NUMBER="34XXXXXXXXX"
   ```
   (34 + número sin el 0 inicial, ej: si el número es 612345678 → `34612345678`)
4. En Vercel → Settings → Environment Variables → actualizar `NEXT_PUBLIC_WHATSAPP_NUMBER`
5. En Vercel → hacer "Redeploy"

---

## ⏳ PASO 2 — Stripe (cobros con tarjeta)

1. Crear cuenta en **stripe.com**
   - Rellenar datos del negocio
   - Añadir IBAN para recibir pagos
2. Ir a **Desarrolladores → Claves de API** y copiar:
   - Clave publicable: `pk_live_...`
   - Clave secreta: `sk_live_...`
3. En Vercel → Settings → Environment Variables → añadir:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```
4. Configurar el Webhook de Stripe:
   - En Stripe → Desarrolladores → Webhooks → "Añadir endpoint"
   - URL: `https://www.llevateunchollo.es/api/checkout/webhook`
   - Eventos: `checkout.session.completed`
   - Copiar el "Signing secret" (`whsec_...`)
   - En Vercel → añadir `STRIPE_WEBHOOK_SECRET=whsec_...`
5. En Vercel → hacer "Redeploy"

---

## ⏳ PASO 3 — Despliegue en Vercel (hacer cuando tengas Anthropic)

### 3a. Base de datos (Neon Postgres — gratis)
1. En Vercel → Storage → Create Database → Neon Postgres
2. Vercel rellena `DATABASE_URL` automáticamente

### 3b. Anthropic (para Oscar el chatbot)
1. Crear cuenta en **console.anthropic.com**
2. API Keys → Create Key → copiar `sk-ant-...`
3. En Vercel → Environment Variables → añadir `ANTHROPIC_API_KEY=sk-ant-...`

### 3c. Variables de entorno en Vercel
Añadir todas estas en Vercel → Settings → Environment Variables:

| Variable | Valor |
|---|---|
| `NEXTAUTH_URL` | `https://www.llevateunchollo.es` |
| `NEXTAUTH_SECRET` | Generar con: `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.llevateunchollo.es` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `34XXXXXXXXX` |
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |
| `ANTHROPIC_API_KEY` | `sk-ant-...` |

### 3d. Deploy
1. Vercel → New Project → importar `infortisa-proveedores` de GitHub
2. Set Root Directory to `llevateunchollo`
3. Clic en Deploy
4. Settings → Domains → añadir `www.llevateunchollo.es`
5. En IONOS → DNS → añadir los registros que indica Vercel

### 3e. Primera ejecución en producción
Después del primer deploy, ejecutar en la terminal de Vercel (o localmente con la DB de producción):
```bash
npx prisma db push
npx tsx prisma/seed.ts
```
Esto crea las tablas y carga el producto inicial.

---

## 📞 Cambiar contraseña de admin
Una vez en producción, cambiar la contraseña por defecto `admin123`:
- Ir a `/admin` → login → y pedir a Juan que actualice la contraseña desde el panel
- O ejecutar en consola:
  ```bash
  npx tsx -e "
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync('NUEVA_CONTRASEÑA', 10);
  console.log(hash);
  "
  ```
  Y actualizar el hash en la base de datos.
