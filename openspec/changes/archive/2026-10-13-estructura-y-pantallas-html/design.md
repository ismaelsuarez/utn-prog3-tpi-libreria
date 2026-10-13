# Design

## Context

Ver `proposal.md` para la motivación. El proyecto no tiene todavía ningún archivo de la aplicación. Condicionan el diseño:

- Se abre desde `file://`, sin servidor ni npm: no hay plantillas del lado del servidor ni inclusión de fragmentos, y no se usa `<script type="module">`.
- Solo HTML, CSS y JavaScript nativos; ningún recurso externo.
- Tres personas trabajan en paralelo: el CSS (C-02) y el JavaScript (C-03 a C-05) se escriben contra este marcado.
- El marcado de la Etapa 1 lleva datos estáticos, pero debe servir sin rehacerse cuando JavaScript genere el contenido.

## Goals / Non-Goals

**Goals:**

- Un vocabulario estable de identificadores, atributos de datos y clases que C-02 a C-05 puedan usar sin volver a tocar la estructura.
- Que la forma de cada tarjeta y de cada fila la defina el HTML, no el JavaScript.
- Cinco páginas coherentes entre sí, con el mismo armazón.

**Non-Goals:**

- Estilos: las hojas de `css/` se crean vacías y enlazadas; su contenido es de C-02.
- Datos locales, almacén y generación desde datos: son de C-03.
- Validación, altas, ventas e historial funcionales: son de C-04 y C-05.
- Extraer el filtro a una función pura con pruebas: es de C-03 (ver D8).

## Decisions

### D1 — Cinco archivos HTML con el armazón copiado

Cada página repite literalmente `header`, `nav`, `main` y `footer`. Orden fijo de la navegación: Catálogo, Libros, Clientes, Ventas, Historial. La vista actual lleva `aria-current="page"`.

- *Alternativa*: inyectar encabezado y navegación con JavaScript. Descartada: la navegación dejaría de existir en el HTML, que es lo que evalúa el Ejercicio 1, y cada página dependería de un script para ser navegable.
- *Costo aceptado*: un cambio en la navegación se replica a mano en cinco archivos.

### D2 — `index.html` es el Catálogo

Sin portada. Resuelve PA-09. Una portada sería una sexta pantalla que la consigna no pide.

### D3 — Catálogo en tarjetas, tabla para los listados de gestión

El Catálogo es una lista (`ul`) de tarjetas (`li` > `article`); los datos de cada libro van en una lista de descripción (`dl`). Libros, Clientes, renglones de Ventas e Historial usan tablas.

- *Por qué*: Catálogo y Libros muestran los mismos datos; con dos tablas una vista parecería duplicada. La tarjeta sirve para consultar y la tabla para administrar. Además una tabla de seis columnas es el peor caso a 320 px.
- *Alternativa*: tabla en ambas vistas. Descartada por lo anterior.

### D4 — Una `<template>` por cada tarjeta o fila

Cada página incluye, al final de `main`, las plantillas de lo que JavaScript generará. Los changes siguientes clonan la plantilla y completan los datos con `textContent`.

| Página | Plantillas |
|---|---|
| `index.html` | `plantilla-tarjeta-libro` |
| `libros.html` | `plantilla-fila-libro`, `plantilla-opcion-autor` |
| `clientes.html` | `plantilla-fila-cliente` |
| `ventas.html` | `plantilla-fila-renglon` |
| `historial.html` | `plantilla-fila-venta`, `plantilla-fila-detalle` |

- *Por qué*: la estructura queda en HTML, y el JavaScript no arma marcado con cadenas, lo que hace natural la regla de no usar `innerHTML` con datos de usuario.
- *Alternativa*: crear los nodos con `document.createElement` en cada script. Descartada: la forma del marcado quedaría repartida entre HTML y JavaScript.
- Los ejemplos estáticos de la Etapa 1 tienen exactamente la misma estructura que su plantilla; C-03 a C-05 vacían el contenedor y lo completan desde los datos.

### D5 — Detalle de la venta en la misma página

`historial.html` incluye una sección de detalle, oculta con el atributo `hidden` hasta que se pide el detalle de una venta. Cada fila del listado tiene un botón «Ver detalle». Resuelve PA-12.

- *Alternativas*: `<details>` por venta (no convive bien dentro de una tabla) y una página aparte con parámetro en la dirección (sexto HTML y más navegación duplicada).
- En este change la sección muestra un ejemplo estático visible, marcado como maqueta.

### D6 — Autores con casillas

Un `fieldset` con `legend` «Autores» y una casilla por autor, en lugar de `select multiple`.

- *Por qué*: `select multiple` exige combinaciones de teclas y es difícil de usar en teléfono y con teclado.

### D7 — Formularios con `novalidate` y tipos de campo

Los formularios llevan `novalidate`: la validación y los mensajes los controla JavaScript (C-04), cerca de cada campo. Se conservan los tipos semánticos para el teclado en pantalla: `type="email"` para el email y `type="number"` para precio (`step="0.01"`, `min="0.01"`) y cantidad (`step="1"`, `min="1"`).

- *Por qué*: los avisos nativos del navegador varían entre navegadores y no son «errores mostrados cerca del formulario».
- *Alternativa*: validación nativa. Descartada como mecanismo principal por lo anterior.

### D8 — Interacción de la Etapa 1: filtro sobre las tarjetas estáticas

`js/paginas/catalogo.js` (script clásico, cargado con `defer` solo en `index.html`) escucha el evento `input` del buscador, compara el texto normalizado con el título de cada tarjeta y alterna el atributo `hidden` de las tarjetas y del mensaje de búsqueda sin resultados.

- *Por qué en este change*: la consigna pide una interacción básica en la Etapa 1.
- *Costo aceptado*: C-03 reemplaza este archivo por la versión que genera las tarjetas desde los datos y mueve la comparación a una función pura en `js/logica/` con pruebas de `node --test`. Aquí la lógica está acoplada al DOM y se verifica a mano; no se agregan pruebas automatizadas.
- *Alternativa*: crear ya la función pura con pruebas. Descartada para no pisar el trabajo de C-03, que es dueño de `js/logica/`.

### D9 — Vocabulario: `id` y `data-*` para JavaScript, clases para CSS

- **`id`**: elementos únicos que JavaScript necesita ubicar. En español, minúsculas y guiones.
- **`data-campo`**: dentro de una plantilla, marca dónde va cada dato (`data-campo="titulo"`). **`data-accion`**: marca los botones de una fila (`data-accion="quitar-renglon"`).
- **Clases**: solo para estilos; JavaScript no las usa como enganche. Convención bloque / `bloque__elemento` / `bloque--variante`.
- **`hidden`**: único mecanismo para mostrar u ocultar estados. El CSS no debe anular `[hidden]`.

Identificadores por página:

| Página | Identificadores |
|---|---|
| Las que tienen formulario de alta o de venta | `mensaje-estado` (`role="status"`), `mensaje-error` (`role="alert"`) |
| `index.html` | `form-busqueda`, `busqueda-titulo`, `lista-catalogo`, `catalogo-vacio`, `catalogo-sin-resultados` |
| `libros.html` | `form-libro`, `libro-titulo`, `libro-isbn`, `libro-precio`, `libro-editorial`, `libro-genero`, `libro-autores`, `tabla-libros`, `filas-libros`, `libros-vacio` |
| `clientes.html` | `form-cliente`, `cliente-nombre`, `cliente-email`, `tabla-clientes`, `filas-clientes`, `clientes-vacio` |
| `ventas.html` | `form-venta`, `venta-cliente`, `venta-libro`, `venta-cantidad`, `boton-agregar-renglon`, `tabla-renglones`, `filas-renglones`, `renglones-vacio`, `venta-total`, `boton-confirmar-venta` |
| `historial.html` | `tabla-ventas`, `filas-ventas`, `ventas-vacio`, `detalle-venta`, `detalle-venta-titulo`, `filas-detalle`, `detalle-total` |

- El error de cada campo usa `error-` más el `id` del campo (`error-libro-isbn`) y se asocia con `aria-describedby`.
- Valores de `data-campo`: `titulo`, `isbn`, `editorial`, `genero`, `autores`, `precio`, `nombre`, `email`, `libro`, `cantidad`, `precio-unitario`, `subtotal`, `identificador`, `fecha`, `cliente`, `total`.
- Valores de `data-accion`: `quitar-renglon`, `ver-detalle`.
- Un mismo `data-campo` puede repetirse dentro de una plantilla (por ejemplo `libro` en la celda, en la etiqueta de la cantidad y en el botón «Quitar»): quien complete la plantilla debe llenar **todas** las apariciones.
- Las páginas tienen además `id` auxiliares que solo sirven para asociaciones de accesibilidad (`titulo-…` para `aria-labelledby`, `error-…` para `aria-describedby`); JavaScript no depende de los `titulo-…`.

Notas de implementación:

- El nombre ficticio de la librería es «Librería El Faro».
- Los importes de ejemplo usan el formato `$ 1500,00`; el formato definitivo lo fija C-03.
- Las tablas de renglones y de ventas tienen una columna extra («Acciones» y «Detalle») para los botones de cada fila.
- `recursos/` contiene un `LEEME.txt` para que la carpeta exista en la entrega.

Clases base para C-02: `encabezado`, `navegacion`, `navegacion__enlace`, `contenido`, `seccion`, `pie`, `tarjeta`, `formulario`, `campo`, `campo__etiqueta`, `campo__control`, `campo__error`, `grupo-opciones`, `boton`, `boton--primario`, `boton--secundario`, `tabla-contenedor`, `tabla`, `mensaje`, `mensaje--correcto`, `mensaje--error`, `mensaje--vacio`, `etiqueta-maqueta`, `resumen`. C-02 puede agregar clases, pero no renombrar `id` ni atributos `data-*`.

### D10 — Marca de maqueta

Un texto visible «Maqueta» (clase `etiqueta-maqueta`) junto a cada formulario, botón o región cuya operación no funciona todavía. En este change llevan la marca todos los formularios, los controles de Ventas y el detalle del Historial; el buscador del Catálogo no la lleva porque funciona. Cada change posterior quita la marca de lo que implementa.

### D11 — Datos de ejemplo de la Etapa 1

Datos ficticios escritos en el HTML: al menos seis libros en el Catálogo y en la tabla de Libros, tres clientes, una venta en composición con dos renglones (dos unidades a 1500,00 y una a 2000,00; total 5000,00) y una venta en el Historial con su detalle. Incluyen un libro sin género y un libro con dos autores. Son ilustrativos: el conjunto inicial definitivo lo fija C-03 y puede no coincidir.

### D12 — Carpetas y carga de recursos

```
index.html  libros.html  clientes.html  ventas.html  historial.html
css/base.css  css/disposicion.css  css/componentes.css   (vacíos, enlazados en ese orden)
js/paginas/catalogo.js
recursos/
README.md
```

Las tres hojas de estilo se enlazan en las cinco páginas. Todas las rutas son relativas. Cada página declara `lang="es"`, codificación UTF-8 y la etiqueta `viewport`.

## Risks / Trade-offs

- [El vocabulario de D9 cambia después de archivar] → C-02 a C-05 dependen de él; cualquier cambio se acuerda con los tres integrantes y se refleja en el change que lo origina.
- [Navegación duplicada en cinco archivos se desincroniza] → una comprobación compara el bloque de navegación de las cinco páginas; solo puede diferir `aria-current`.
- [Las páginas se ven sin estilo hasta que exista C-02] → esperado; el hito de la Etapa 1 es C-01 más C-02.
- [Los ejemplos estáticos se confunden con funcionalidad real] → marca visible de maqueta (D10) y lista en el README.
- [El filtro de D8 queda sin pruebas automatizadas] → es descartable y lo reemplaza C-03 con función pura y pruebas; aquí se verifica a mano con los cuatro casos del filtro.
- [Los ejemplos de la Etapa 1 no coinciden con los datos de C-03] → son ilustrativos y C-03 los reemplaza al generar desde los datos.
- [`type="number"` devuelve un valor vacío ante texto no numérico] → C-04 trata el valor vacío como dato inválido y lo informa con texto.

## Open Questions

- Formato definitivo de los importes (separador decimal y símbolo de moneda): lo fija C-03 al crear la utilidad de formato. Aquí solo se exige que tengan dos decimales.
- Formato de presentación de la fecha de una venta (PA-10): lo fija C-05.
