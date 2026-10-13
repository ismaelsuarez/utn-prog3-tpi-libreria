# Proposal

## Why

El Ejercicio 1 del TPI (20 puntos: vistas y navegación 10; semántica, formularios y estados 10) exige cinco vistas navegables con HTML semántico. Hoy el proyecto no tiene ningún archivo de la aplicación, y este marcado es el contrato sobre el que trabajan en paralelo el CSS del Ejercicio 2 y el JavaScript de los Ejercicios 3 a 5, por lo que debe existir y estar acordado antes que todo lo demás.

## What Changes

- Se crean cinco páginas HTML, una por vista: `index.html` (Catálogo), `libros.html`, `clientes.html`, `ventas.html` e `historial.html`.
- Cada página incluye encabezado, navegación hacia las otras vistas, contenido principal y pie, con etiquetas semánticas y un único título principal.
- **Catálogo**: título de la librería, buscador por título y listado de libros en tarjetas (título, ISBN, editorial, género, autores y precio; «Sin clasificar» cuando no hay género).
- **Libros**: formulario de alta (título, ISBN, precio, editorial, género y autores con casillas) y tabla de libros registrados.
- **Clientes**: formulario de alta (nombre completo y email) y tabla de clientes registrados.
- **Ventas**: selección de cliente, composición de renglones (libro y cantidad), tabla de renglones y resumen con total.
- **Historial**: tabla de ventas y región de detalle de la venta en la misma página.
- Se incorporan los lugares previstos para mensajes de lista vacía, búsqueda sin resultados, operación correcta u operación rechazada, y para el error de cada campo.
- Se incluyen datos estáticos de ejemplo y una plantilla (`<template>`) por cada tarjeta o fila que JavaScript generará en los changes siguientes.
- Interacción básica de la Etapa 1: el filtro por título del Catálogo funciona sobre las tarjetas de ejemplo.
- Todo control cuya operación todavía no funciona se identifica visiblemente como maqueta.
- Se crea la estructura de carpetas (`css/`, `js/`, `recursos/`) con las hojas de estilo enlazadas y un `README.md` inicial.
- Se acuerda el vocabulario de identificadores, atributos de datos y clases que usarán el CSS y el JavaScript posteriores.

Fuera de este change: estilos (C-02), datos locales y generación del catálogo desde datos (C-03), validación y alta efectiva (C-04), ventas e historial funcionales (C-05), persistencia y README completo (C-06).

## Capabilities

### New Capabilities

- `estructura-y-navegacion`: página de entrada, existencia de las cinco vistas, navegación entre ellas, regiones semánticas, apertura sin servidor e identificación de lo que todavía es maqueta.
- `formularios-y-mensajes`: reglas comunes a todas las vistas para etiquetas de campos, textos de botones, encabezados de tablas y lugares de mensajes de estado y de error.
- `catalogo`: contenido de la vista Catálogo, datos que muestra cada libro y filtro por título.
- `libros`: contenido de la vista Libros (formulario de alta y listado).
- `clientes`: contenido de la vista Clientes (formulario de alta y listado).
- `ventas`: contenido de la vista Ventas (selección de cliente, renglones y resumen).
- `historial`: contenido de la vista Historial (listado de ventas y detalle).

### Modified Capabilities

Ninguna. El proyecto todavía no tiene especificaciones.

## Impact

- **Archivos nuevos**: `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `css/base.css`, `css/disposicion.css`, `css/componentes.css` (vacíos y enlazados), `js/paginas/catalogo.js`, `recursos/` y `README.md`.
- **Documentación a actualizar**: `knowledge-base/09_decisiones_y_supuestos.md`, `knowledge-base/10_preguntas_abiertas.md` (PA-09 y PA-12 quedan resueltas) y `CHANGES.md` (el Catálogo pasa de tabla a tarjetas).
- **Changes dependientes**: C-02 se apoya en las clases; C-03, C-04 y C-05 se apoyan en los identificadores, los atributos de datos y las plantillas. Cambiar ese vocabulario después de archivar este change obliga a retocar los demás.
- **Dependencias**: ninguna. No se agregan librerías, frameworks, CDNs ni herramientas de compilación.
- **Pruebas**: este change no contiene lógica pura, por lo que no agrega pruebas con `node --test`; se verifica con comprobaciones de estructura y con revisión manual en el navegador.
