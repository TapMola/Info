# Tap Mola

Web editorial en español para tarjetas físicas NFC y perfiles digitales. React 19, TypeScript, Vite, Tailwind CSS 4, Motion y Lucide. Todo funciona en el navegador, sin backend, cookies de seguimiento ni servicios de pago.

## Desarrollo

Necesitas Node.js **22.18 o posterior** y npm. Si utilizas nvm, ejecuta `nvm use` (incluimos `.nvmrc`). 

```sh
npm install
npm run dev
```

Vite muestra la dirección local, normalmente `http://127.0.0.1:5173`.

```sh
npm test       # Pruebas del pedido, precios, URLs y vCard
npm run build # Comprobación TypeScript y build de producción en dist/
npm run preview
```

Las tipografías Instrument Serif y Manrope se sirven localmente mediante Fontsource. No hay peticiones a Google Fonts ni imágenes externas necesarias para mostrar la página.

## Qué incluye

- Navegación fija, anclas y menú móvil con cierre por Escape.
- Escenas de producto creadas con CSS, iluminación, textura y movimiento de tarjeta limitado a tres grados en escritorio.
- Demo NFC simulada: arrastra la tarjeta hacia la parte superior del teléfono, o usa el botón. Notificación, perfil de ejemplo y reinicio; no utiliza Web NFC ni solicita permisos.
- Configurador con nombre y email obligatorios, empresa, campos opcionales, hasta cinco enlaces personalizados y comentarios.
- Logo local PNG/JPG/WebP/GIF: máximo 5 MB, validación de decodificación y límite de 40 megapíxeles. Se puede sustituir o quitar. No se sube a ningún servidor.
- Tres temas digitales y vista previa inmediata. Los enlaces válidos se pueden abrir y «Guardar contacto» descarga una vCard local.
- Selección de una tarjeta a 25 € o dos a 30 €, reflejada en el resumen y el email.
- Respeto a movimiento reducido, estados de foco, etiquetas, enlace para saltar al contenido y validación nativa del formulario.

## Pedidos: funcionamiento y límites

El destinatario real, obtenido de `script.js` del proyecto anterior, es **tapmolanfc@gmail.com**. «Solicitar mi tarjeta» abre el cliente de correo mediante `mailto:`. La alternativa «O preparar el email en Gmail» abre el formulario de redacción de Gmail. Ambas validan el mismo formulario y contienen los mismos datos y precio.

El usuario debe enviar el mensaje en su aplicación. La web no registra pedidos, no envía emails automáticamente y no confirma recepción. El logo **no se adjunta automáticamente**: se incluye el nombre del archivo y un recordatorio para adjuntarlo manualmente. El diseño final, la entrega y el pago se confirman con Tap Mola por email.

Gmail requiere la cuenta del cliente y recibe los datos solo cuando este elige esa opción. La solicitud no se guarda en localStorage ni se envía a analítica. Si el sistema no tiene un cliente de correo configurado, el cliente puede usar Gmail o copiar el texto de la solicitud y enviarlo manualmente. Los enlaces `mailto:` pueden tener límites de longitud dependientes del navegador o cliente; Gmail o copiar el texto son las alternativas para solicitudes extensas.

## Estructura

```text
src/
  components/
    layout/      # Navegación y pie
    sections/    # Hero, producto, demo, proceso, personalización, precios, pedido, cierre
    card/        # Tarjeta física ilustrada y perfil digital reutilizable
    ui/          # Revelado de contenido en viewport
  data/config.ts # Email real, precios, temas y campos opcionales
  lib/order.ts   # Email, validación segura de URLs y exportación vCard
  types/card.ts  # Modelo y valores iniciales
  App.tsx        # Estado compartido y composición de la página
  index.css      # Sistema visual, escenas CSS y diseños responsive
public/          # Favicon e imagen social
.github/workflows/deploy.yml
```

## Personalización y sistema visual

La paleta usa crema `#F7F5F0`, arena `#E8E0D4`, nogal `#705742` y carbón `#252421`, con verdes oliva apagados en las tarjetas y el cierre. Instrument Serif en titulares y Manrope en interfaz. El espaciado de las secciones se adapta al ancho, con ajustes específicos a 1150, 800 y 560 px. Las transiciones usan 250–800 ms y respetan `prefers-reduced-motion`.

Para cambiar textos, edita el componente de la sección. Los precios, destinatario y opciones viven en `src/data/config.ts`; los tokens y las composiciones, en `src/index.css`. Las imágenes de logos solo viven en URLs Blob con limpieza de memoria al sustituirlas.

Las escenas de producto **son representaciones ilustrativas**, no fotografías ni una promesa de acabados o materiales. El repositorio anterior contiene ilustraciones de uso, no fotografía de producto confirmada. Se eligió una tarjeta neutral sobre piedra y nogal como atmósfera; no se afirma que la tarjeta esté hecha de madera. Se pueden reemplazar las escenas en Hero y ProductShowcase por fotografías reales locales cuando estén disponibles. El perfil de Laura Martínez / Studio Norte es ficticio; sus botones sociales explican su comportamiento sin abrir cuentas inventadas. No se ha identificado un Instagram oficial, por lo que no se incluye en el pie.

## Referencia funcional revisada

- Web anterior: https://tapmola.github.io/Website/
- Repositorio: https://github.com/TapMola/Website
- Revisión: `main`, commit `47c4027bd51facc8dd8324523bc6eae281563052`.
- Se inspeccionaron `index.html`, `script.js`, el árbol de recursos, `img/imageNFC1.png` y `card_example/index.html`.
- Se conservaron el modelo tarjeta NFC + perfil digital, campos y enlaces, precios, guardado de contacto y pedido por email. La referencia abría Gmail en escritorio y mailto en móvil; ahora el usuario elige explícitamente sin detección de dispositivo.
- El acceso de lectura web a la referencia falló; se revisaron sus archivos fuente públicos directamente. No se inventan especificaciones físicas, política de envío, fiscalidad, suscripciones ni datos legales. 

## GitHub Pages

El repositorio de trabajo ya está configurado como `TapMola/Info`. El workflow publica `dist/` automáticamente tras un push a **main** y también permite ejecución manual.

1. Sube los archivos y el lockfile al repositorio nuevo.
2. En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions**.
3. Haz push a `main` o ejecuta el workflow **Deploy to GitHub Pages**.
4. La dirección prevista es `https://tapmola.github.io/Info/`; el workflow devuelve la URL efectiva.

`base: './'` en Vite genera rutas relativas, compatibles con `/Info/`, otros nombres de repositorio y dominios propios. La navegación usa anclas de la misma página, sin rutas SPA que necesiten redirecciones 404. Si renombras el repositorio o usas otro dominio, actualiza la URL absoluta de `og:image` en `index.html`. El archivo de imagen social está en `public/social-preview.png`.

No es necesario desplegar con Sites, configurar secretos, contratar un backend ni conectar un checkout. El workflow necesita que GitHub Pages esté habilitado y que la cuenta tenga permiso para desplegar; esas opciones se configuran en GitHub.

## Pruebas de navegador

Con el servidor local activo:

```sh
npx playwright install chromium
npm run test:browser
```

La regresión específica del configurador se ejecuta con `node tests/configurator.mjs`. Comprueba columnas estables al añadir, escribir y quitar campos a 1920, 1440, 1280, 1024, 768, 390 y 375 px, con URLs y emails largos, y al redimensionar. Los casos de zoom al 125 % y 150 % emulan el ancho de viewport CSS y la relación de píxeles resultantes; no controlan el zoom nativo del navegador ni sustituyen una prueba en dispositivos físicos. `npm test` también audita que los componentes no contengan pictogramas Unicode.

También puedes usar Chrome ya instalado con `CHROME_PATH=/ruta/al/ejecutable npm run test:browser`. El script cubre demo por botón y arrastre, reinicio, actualización del perfil, temas, logo y validación, precios, email preparado, menú móvil y movimiento reducido. Comprueba ausencia de desbordamiento horizontal a 320, 375, 390, 768, 1024 y 1440 px y errores de ejecución. Intercepta `window.open` para verificar Gmail **sin enviar datos ni pedidos**. Guarda capturas de escritorio y móvil en la carpeta temporal del sistema.

Para regenerar la imagen social después de cambiar el hero: `GENERATE_SOCIAL=1 npm run test:browser`.

Nota del entorno de desarrollo: el Node global de Homebrew presentaba una librería `simdjson` ausente. La compilación y las pruebas se ejecutaron con Node 22 instalado en `/opt/homebrew/opt/node@22/bin`. En ese equipo, usa `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run dev` si el Node por defecto sigue sin arrancar.
