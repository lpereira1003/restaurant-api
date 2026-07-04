# Publicacion en GitHub

Pasos para publicar este proyecto como repositorio publico.

## Antes de publicar

Ejecutar validaciones:

```bash
pnpm prisma validate
pnpm typecheck
pnpm lint
pnpm build
```

Confirmar que no se publiquen secretos:

```bash
git status --short
git diff -- .env.example .env.production.example
```

El archivo `.env` debe permanecer ignorado por Git.

## Crear repositorio publico

Crear un repositorio publico en GitHub con un nombre descriptivo, por ejemplo:

```text
api-restaurant-reservations
```

Luego conectar el remoto local:

```bash
git remote add origin https://github.com/<usuario>/api-restaurant-reservations.git
git branch -M main
git push -u origin main
```

## Verificacion

Despues del push:

- Confirmar que el repositorio sea publico.
- Confirmar que `README.md`, `database/schema.sql`, `docs/deployment.md` y la coleccion Postman esten disponibles.
- Confirmar que `.env` no aparezca en GitHub.
- Agregar la URL del despliegue cuando la API este publicada.
