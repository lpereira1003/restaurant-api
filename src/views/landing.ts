/**
 * Renderiza la Landing Page publica con accesos a Health Check y Swagger.
 */
export const renderLandingPage = () => {
  const year = new Date().getFullYear();

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>API REST - Sistema de Gesti&oacute;n Tur&iacute;stica</title>
    <meta
      name="description"
      content="Landing page academica para la API REST del Sistema de Gestion Turistica."
    />
    <link rel="stylesheet" href="/assets/css/landing.css" />
  </head>
  <body>
    <main class="page">
      <section class="hero" aria-labelledby="page-title">
        <article class="hero-card">
          <div class="status" aria-label="Estado del servidor">&#128994; API Online</div>
          <h1 id="page-title" class="title">API REST - Sistema de Gesti&oacute;n Tur&iacute;stica</h1>
          <p class="subtitle">Bootcamp Transformaci&oacute;n Digital para la Docencia T&eacute;cnica</p>

          <section class="quick-access" aria-labelledby="quick-access-title">
            <h2 id="quick-access-title" class="section-title">Accesos r&aacute;pidos</h2>
            <div class="actions">
              <a class="action-button" href="/api/health">
                <span class="action-title">Health Check</span>
                <span class="action-path">/api/health</span>
              </a>
              <a class="action-button" href="/api-docs">
                <span class="action-title">Swagger API</span>
                <span class="action-path">/api-docs</span>
              </a>
            </div>
            <p class="description">
              Swagger contiene toda la documentaci&oacute;n interactiva de la API, incluyendo endpoints,
              esquemas, autenticaci&oacute;n y ejemplos de uso para probar el servicio desde el navegador.
            </p>
          </section>
        </article>
      </section>

      <footer class="footer">
        <strong>&copy; ${year} Luis Pereira</strong><br />
        Todos los derechos reservados.<br /><br />
        Proyecto desarrollado como parte del<br />
        Bootcamp Transformaci&oacute;n Digital para la Docencia T&eacute;cnica<br />
        Kodigo - MINEDUCYT El Salvador
      </footer>
    </main>
  </body>
</html>`;
};
