
# PeerShare  decentralized forum

PeerShare es una aplicación web de foro descentralizada y centrada en la privacidad, diseñada para crear, compartir y poseer tu contenido sin depender de un servidor central. Todo tu contenido se almacena localmente en tu navegador, dándote control total sobre tus datos.

## ✨ Conceptos Clave

- **Archivos (Archives):** Un archivo es una colección autocontenida de publicaciones, similar a un blog o un cuaderno personal. Puedes tener múltiples archivos para diferentes temas.
- **Publicaciones (Posts):** Cada publicación es un documento individual dentro de un archivo. Están escritas en Markdown, permitiendo un formato de texto enriquecido de manera sencilla.
- **Local-First:** Todos tus datos (archivos y publicaciones) se guardan directamente en el `localStorage` de tu navegador. No se envía nada a un servidor externo, garantizando tu privacidad.
- **Portabilidad Total:** Puedes exportar cualquier archivo como un único archivo `.json`. Este archivo contiene todas tus publicaciones y se puede importar en cualquier otro dispositivo que ejecute PeerShare, permitiéndote mover o hacer una copia de seguridad de tu contenido fácilmente.

## 🚀 Características

- **Editor de Markdown:** Crea y edita publicaciones con un editor de Markdown simple y potente.
- **Vista Previa en Tiempo Real:** El contenido de Markdown se renderiza a un formato de texto enriquecido y estilizado para una lectura agradable.
- **Búsqueda Integrada:** Busca rápidamente a través de tus publicaciones por título, contenido o etiquetas.
- **Gestión de Archivos:** Crea nuevos archivos, importa archivos existentes desde un archivo `.json` o exporta los tuyos para compartirlos o hacer una copia de seguridad.
- **Sin Cuentas, Sin Servidores:** No es necesario registrarse. Simplemente abre la aplicación y empieza a escribir.

## ✅ Cómo Sacar Tu Contenido (Exportar)

Tu contenido es tuyo y puedes llevártelo cuando quieras. El proceso es simple:

1.  Asegúrate de que el archivo que quieres exportar esté activo.
2.  Busca y haz clic en el botón **"Export Archive"** (normalmente tiene un icono de una nube con una flecha hacia arriba).
3.  La aplicación generará un archivo `.json` que se descargará en tu computadora. Este archivo contiene **todas las publicaciones y configuraciones** de ese archivo.
4.  Guarda este archivo en un lugar seguro. ¡Esa es tu copia de seguridad!

## 🛠️ Stack Tecnológico

Este proyecto está construido con un stack moderno y eficiente. Para ejecutarlo localmente o alojarlo tú mismo, necesitarás tener conocimientos de este ecosistema:

- **Framework:** [Next.js](https://nextjs.org/) (con App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [React](https://react.dev/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes:** [shadcn/ui](https://ui.shadcn.com/)
- **Renderizado de Markdown:** [Marked](https://marked.js.org/) y [DOMPurify](https://github.com/cure53/DOMPurify) para un renderizado seguro.
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Entorno de ejecución:** [Node.js](https://nodejs.org/)

## 🏁 Cómo Empezar (Localmente)

Para ejecutar este proyecto en tu propia computadora y alojarlo en tu servicio de preferencia, sigue estos pasos:

1.  **Copia los archivos del proyecto:** Deberás recrear la estructura de carpetas y archivos con todo el código que se muestra en este entorno de desarrollo. El archivo más importante para empezar es `package.json`, que lista todas las dependencias.

2.  **Instala las dependencias:** Abre una terminal en la carpeta raíz de tu proyecto y ejecuta el siguiente comando. Esto descargará todas las librerías necesarias.
    ```bash
    npm install
    ```

3.  **Ejecuta el servidor de desarrollo:** Una vez instaladas las dependencias, puedes iniciar la aplicación en modo de desarrollo.
    ```bash
    npm run dev
    ```
    Esto iniciará la aplicación en `http://localhost:3000` (o un puerto similar).

4.  **Construye para producción:** Cuando estés listo para desplegar tu aplicación, debes crear una versión optimizada.
    ```bash
    npm run build
    ```
    Este comando crea una carpeta `.next` con el código de producción.

5.  **Aloja tu aplicación:** Puedes alojar la carpeta resultante en cualquier plataforma compatible con Next.js, como Vercel, Netlify, AWS, o tu propio servidor Node.js.

¡Disfruta de la libertad de poseer y alojar tu propio código y contenido!
