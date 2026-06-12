# Inactivity URL Loader - Extensión de Chrome

Esta extensión carga una URL específica después de un tiempo determinado de inactividad en el navegador.

## Características

- **Configuración de URL**: Ingresa la URL que deseas cargar después del período de inactividad
- **Tiempo personalizable**: Define el tiempo de inactividad en minutos (mínimo 1 minuto)
- **Inicio automático**: Opción para iniciar la extensión automáticamente al abrir el navegador
- **Control simple**: Botón Start/Stop para activar o desactivar el monitoreo

## Instalación

1. Abre Google Chrome y navega a `chrome://extensions/`
2. Activa el "Modo de desarrollador" en la esquina superior derecha
3. Haz clic en "Cargar descomprimida"
4. Selecciona la carpeta `chrome-inactivity-extension`
5. La extensión aparecerá en tu barra de extensiones

## Uso

1. Haz clic en el ícono de la extensión en la barra de herramientas
2. Ingresa la URL que deseas cargar (ej: `https://ejemplo.com`)
3. Establece el tiempo de inactividad en minutos
4. (Opcional) Marca la casilla "Iniciar automáticamente al abrir el navegador"
5. Haz clic en el botón **Start** para activar el monitoreo

Cuando la extensión está activa, monitorea tu actividad en el navegador. Si no detecta actividad durante el tiempo especificado, cargará automáticamente la URL configurada en la pestaña activa.

## Archivos

- `manifest.json` - Configuración de la extensión
- `background.js` - Lógica de monitoreo de inactividad
- `popup.html` / `popup.js` - Interfaz y lógica del popup
- `options.html` / `options.js` - Página de opciones

## Permisos

La extensión requiere los siguientes permisos:
- `storage`: Para guardar la configuración
- `tabs`: Para cargar la URL en una pestaña
- `alarms`: Para verificar periódicamente la inactividad

## Notas

- El tiempo de inactividad se resetea cuando realizas cualquier acción en el navegador (cambiar de pestaña, actualizar, etc.)
- La extensión funciona en segundo plano y consume mínimos recursos
- Puedes desactivarla en cualquier momento haciendo clic en el botón **Stop**
