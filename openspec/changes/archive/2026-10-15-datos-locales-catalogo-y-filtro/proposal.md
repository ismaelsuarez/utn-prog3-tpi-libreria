# Proposal

## Why

Hasta ahora el Catálogo muestra tarjetas de ejemplo escritas a mano en el HTML y un filtro que opera sobre esas filas fijas: los datos no tienen modelo, no hay una fuente única de lectura y ningún script puede reutilizarlos en las demás vistas. El ejercicio 3 (15 puntos) introduce los datos locales y el Almacén, que son la base que consumen los changes 4, 5 y 6.

## What Changes

- Se crea `js/datos/datos-iniciales.js` con los datos ficticios de arranque: al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes, incluyendo un libro sin género, un libro con más de un autor y libros con precios 1500 y 2000 (necesarios para CM-5).
- Se crean las funciones puras de `js/logica/texto.js` (normalización de texto, ISBN y email) y `js/logica/catalogo.js` (filtro por título y resolución de editorial, género y autores por identificador), reutilizables por C-04.
- Se crea `js/almacen.js` como único punto de lectura de los datos, con la interfaz estable del proyecto (`obtenerLibros`, `obtenerClientes`, `obtenerVentas`, `obtenerEditoriales`, `obtenerGeneros`, `obtenerAutores`, `agregarLibro`, `agregarCliente`, `agregarVenta`). En este change se implementa la lectura; las escrituras se declaran con su contrato y se implementan en C-04 y C-05 (DD-09).
- Se crea `js/interfaz.js` con las utilidades comunes de DOM (mensajes, vaciado de nodos, formato de importes con dos decimales), siempre inserción como texto.
- `js/paginas/catalogo.js` reemplaza al script de maqueta: genera las tarjetas desde el Almacén con la `<template>` existente, filtra al escribir y gestiona los mensajes de lista vacía y de búsqueda sin resultados.
- `index.html` carga los scripts nuevos en orden de dependencia; las tarjetas de ejemplo escritas a mano se conservan como respaldo y se reemplazan al ejecutar el script.
- Se agrega `tests/` con pruebas `node --test` de normalización, filtro y consistencia de los datos iniciales (carpeta excluida de la entrega).
- **BREAKING** (interno): el comportamiento del Catálogo deja de depender del HTML fijo; a partir de ahora la fuente de verdad de la vista es el Almacén.

## Capabilities

### New Capabilities

- `datos-locales`: modelo de datos con identificadores estables, datos iniciales mínimos, normalización compartida y el Almacén como único punto de lectura.

### Modified Capabilities

- `catalogo`: el listado pasa a generarse con JavaScript desde los datos del Almacén (resolución de relaciones por identificador, «Sin clasificar») y se agrega el estado de catálogo vacío.

## Impact

- Archivos nuevos: `js/datos/datos-iniciales.js`, `js/logica/texto.js`, `js/logica/catalogo.js`, `js/almacen.js`, `js/interfaz.js`, `tests/*.test.js`.
- Archivos modificados: `js/paginas/catalogo.js` (reemplazo total), `index.html` (carga de scripts), `README.md` (solo el estado de interacciones, si hace falta).
- Interfaces que quedan fijas para cambios posteriores: firma del Almacén (C-04 y C-05 la consumen sin cambiarla) y funciones de `texto.js` (C-04 las reutiliza).
- Sin dependencias, sin `package.json`, sin `type="module"`, sin `fetch`: sigue abriéndose desde `file://`.
