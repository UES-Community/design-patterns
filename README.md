# Catálogo Interactivo de Patrones de Diseño

Este es un catálogo interactivo y moderno que detalla los patrones de diseño clásicos de desarrollo de software (creacionales, estructurales y de comportamiento) descritos originalmente por el *Gang of Four* (GoF). El proyecto incluye explicaciones detalladas y ejemplos de implementación en lenguajes como TypeScript, Python, Go y Java.

## Tecnologías Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) (v15.5) & [React](https://reactjs.org/) (v18.3)
- **Diseño y Componentes UI:** [Cloudscape Design System](https://cloudscape.design/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) & PostCSS
- **Manejo de Contenido:** [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) & [gray-matter](https://github.com/jonschlinkert/gray-matter)
- **Resaltado de Código:** [Shiki](https://shiki.style/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)

## Características del Catálogo

- **Clasificación por Categorías:**
  - **Creacionales:** Builder, Factory Method, Singleton, etc.
  - **Estructurales:** Adapter, Composite, Decorator, Facade, Proxy, etc.
  - **Comportamiento:** Command, Iterator, Observer, Strategy, Template Method, etc.
- **Ejemplos Multilenguaje:** Cada patrón incluye códigos de ejemplo listos para analizar.
- **Diseño Premium:** Interfaz moderna y altamente responsiva utilizando el sistema de diseño Cloudscape.

## Desarrollo Local

1. Instalar las dependencias utilizando [pnpm](https://pnpm.io/):
   ```bash
   pnpm install
   ```

2. Ejecutar el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

3. Abrir [http://localhost:3000](http://localhost:3000) en el navegador para ver el resultado.

## Despliegue en GitHub Pages

Este proyecto está configurado para realizar exportación estática (`output: 'export'`) y desplegarse automáticamente en GitHub Pages a través de GitHub Actions.

Cada vez que se realiza un push a la rama `main`, el workflow `.github/workflows/deploy.yml` compila el proyecto y publica la salida estática en:
[https://ues-community.github.io/design-patterns/](https://ues-community.github.io/design-patterns/)
