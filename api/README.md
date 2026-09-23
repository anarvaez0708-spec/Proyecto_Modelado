# Arte Tours API

API Node.js + TypeScript con Clean Architecture, Express, Supabase Auth y acceso a las tablas existentes del esquema `artetours`.

## Desarrollo local

```bash
cd api
copy .env.example .env
npm install
npm run dev
```

Configura en `.env` `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` y un `JWT_SECRET` de al menos 32 caracteres. La API escucha en `PORT` y responde en `GET /health`.

## Endpoints

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `GET|POST|PUT|DELETE /users`
- `GET|POST|PUT|DELETE /tours`
- `GET|POST|PUT|DELETE /bookings`
- `GET|POST|PUT|DELETE /clients`
- `GET /reports/kpis`
- `GET /reports/sales?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /reports/top-tours`

Todos los endpoints excepto login, registro y recuperación exigen `Authorization: Bearer <supabase-access-token>`. Las mutaciones exigen roles según el recurso; eliminar exige `ADMINISTRADOR`.

## Despliegue en Render

1. En Render selecciona **New > Blueprint** y conecta `anarvaez0708-spec/Proyecto_Modelado`.
2. Render detectará el `render.yaml` de la raíz y usará `api/` como `rootDir`.
3. En el dashboard completa `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` y `CORS_ORIGIN` con la URL publicada del frontend. `JWT_SECRET` se genera automáticamente.
4. Confirma el build `npm install && npm run build`, espera el despliegue y verifica `https://<servicio>.onrender.com/health`.

## Conectar el frontend

En los servicios del frontend sustituye los mocks por un cliente HTTP con una variable como:

```env
VITE_API_URL=https://<servicio>.onrender.com
```

Incluye el token de Supabase en cada llamada protegida:

```ts
fetch(`${import.meta.env.VITE_API_URL}/tours`, {
  headers: { Authorization: `Bearer ${session.access_token}` }
});
```

Los módulos actuales en `src/features/admin/*/*Services.js` son los puntos naturales para reemplazar las implementaciones mock.

## Nota del modelo

La tabla `usuarios` exige `id_usuario BIGINT`, mientras que Supabase Auth identifica usuarios con UUID y no existe una FK entre ambos en las migraciones actuales. Esta versión relaciona el token de Supabase con el perfil por `correo` y conserva la tabla existente. Para una relación referencial estricta se recomienda una migración posterior que agregue `auth_user_id UUID UNIQUE` a `usuarios`.