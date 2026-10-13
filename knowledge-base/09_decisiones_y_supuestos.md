# Decisiones y Supuestos

## Decisiones documentadas

### DD-01 — Varias páginas HTML, una por vista
**Decisión**: cada vista (Catálogo, Libros, Clientes, Ventas, Historial) es un archivo HTML propio.
**Contexto**: la consigna permite varias páginas o secciones de una misma página.
**Alternativas consideradas**: una sola página con secciones que se muestran y ocultan.
**Justificación**: decisión del equipo; archivos HTML más cortos y una vista por archivo.
**Trade-offs aceptados**: el encabezado y la navegación se repiten en cada HTML; no hay memoria compartida entre páginas, por lo que el estado entre vistas depende por completo de `localStorage`.

### DD-02 — Alcance: TPI completo
**Decisión**: se planifican los ejercicios 1 a 6; la Etapa 1 es el primer hito.
**Contexto**: la consigna organiza el trabajo en dos etapas.
**Alternativas consideradas**: planificar solo la Etapa 1.
**Justificación**: decisión del equipo; los puntajes corresponden al TPI completo.
**Trade-offs aceptados**: mayor planificación inicial.

### DD-03 — Scripts clásicos en lugar de módulos ES
**Decisión**: los scripts se cargan con `<script src>` clásico y comparten un espacio de nombres global.
**Contexto**: la consigna exige abrir `index.html` sin npm ni servidor, es decir desde `file://`, donde los navegadores bloquean `<script type="module">`.
**Alternativas consideradas**: módulos ES servidos por un servidor local.
**Justificación**: un servidor local contradice el requisito de apertura directa.
**Trade-offs aceptados**: el orden de carga de los scripts se mantiene a mano; se requiere un patrón de exportación dual para las pruebas con Node.

### DD-04 — Pruebas automatizadas con `node --test`
**Decisión**: la lógica pura se prueba con el runner integrado de Node, sin dependencias.
**Contexto**: el equipo trabaja con desarrollo guiado por pruebas, pero la consigna prohíbe dependencias y herramientas de compilación en la entrega.
**Alternativas consideradas**: verificar solo con los casos manuales.
**Justificación**: decisión del equipo; obliga a separar la lógica del DOM, que la consigna valora, y da una red de seguridad sin instalar nada.
**Trade-offs aceptados**: Node es un requisito de desarrollo (no de uso); la carpeta `tests/` se excluye de la entrega; el DOM y `localStorage` quedan cubiertos solo por los casos manuales.

### DD-05 — Identidad visual con CSS propio y local
**Decisión**: estilos escritos por el equipo, sin librerías externas; tipografías e imágenes incluidas en el proyecto.
**Contexto**: restricción de la consigna y decisión explícita del equipo.
**Alternativas consideradas**: ninguna; los frameworks y CDNs incumplen el alcance técnico.
**Justificación**: requisito de la consigna.
**Trade-offs aceptados**: todo el sistema visual se construye a mano.

### DD-06 — Un change de OpenSpec por consigna
**Decisión**: en lo posible, seis changes, uno por ejercicio del TPI, cada uno recorrido con `/opsx:explore`, `/opsx:propose`, `/opsx:apply` y `/opsx:archive`.
**Contexto**: el equipo quiere que la organización SDD refleje la estructura de la consigna.
**Alternativas consideradas**: dividir por capacidad técnica (datos, vistas, persistencia).
**Justificación**: decisión del equipo; trazabilidad directa entre cada change y los puntos de la rúbrica.
**Trade-offs aceptados**: las consignas no son totalmente independientes (ver SU-01 y PA-01).

### DD-07 — Repositorio git diferido
**Decisión**: el repositorio se crea cuando exista al menos la estructura del proyecto y el `README.md`.
**Contexto**: decisión del equipo.
**Alternativas consideradas**: inicializarlo antes de la fundación.
**Justificación**: decisión del equipo.
**Trade-offs aceptados**: los artefactos de fundación no tienen historial hasta ese momento.

### DD-08 — La venta guarda una instantánea
**Decisión**: la venta copia los datos del cliente y, en cada renglón, título, ISBN y precio unitario.
**Contexto**: la consigna exige que el precio unitario sea un valor histórico y que se conserven los datos descriptivos necesarios para leer la venta.
**Alternativas consideradas**: guardar solo identificadores y resolver contra el catálogo.
**Justificación**: resolver contra el catálogo rompe el caso manual CM-6.
**Trade-offs aceptados**: datos duplicados dentro de cada venta.

### DD-09 — Escritura en `localStorage` adelantada al ejercicio 4
**Decisión**: el change del ejercicio 3 crea el Almacén de datos con una interfaz estable; el change del ejercicio 4 ya escribe libros y clientes en `localStorage`, y el del ejercicio 5 escribe las ventas. El change del ejercicio 6 se ocupa de la carga inicial sin duplicados, la documentación y los casos manuales.
**Contexto**: con varias páginas (DD-01) no hay memoria compartida, y la consigna ubica `localStorage` en la etapa final (IN-01 en `10_preguntas_abiertas.md`).
**Alternativas consideradas**: dejar toda la persistencia para el ejercicio 6.
**Justificación**: sin escritura, un libro o cliente nuevo no aparece en las demás páginas y los ejercicios 4 y 5 no se pueden comprobar de extremo a extremo.
**Trade-offs aceptados**: el orden se aparta levemente del de la consigna; el change 6 queda más chico y los changes 4 y 5 algo más grandes.

### DD-10 — `index.html` es el Catálogo
**Decisión**: la página de entrada muestra directamente la vista Catálogo, sin portada.
**Contexto**: la consigna fija `index.html` como entrada sin indicar qué vista contiene (PA-09, SU-04).
**Alternativas consideradas**: una portada con enlaces a las vistas.
**Justificación**: una portada sería una sexta pantalla que la consigna no pide.
**Trade-offs aceptados**: ninguno relevante.
**Origen**: change `estructura-y-pantallas-html`, decisión D2.

### DD-11 — Detalle de la venta en la misma página de Historial
**Decisión**: `historial.html` incluye una región de detalle que JavaScript completa al pedir el detalle de una venta.
**Contexto**: PA-12.
**Alternativas consideradas**: `<details>` por venta; página aparte con parámetro en la dirección.
**Justificación**: `<details>` no convive bien dentro de una tabla y una página aparte agrega un sexto HTML con navegación duplicada.
**Trade-offs aceptados**: el detalle no tiene dirección propia.
**Origen**: change `estructura-y-pantallas-html`, decisión D5.

### DD-12 — Catálogo en tarjetas, tablas para los listados de gestión
**Decisión**: el Catálogo muestra una tarjeta por libro; Libros, Clientes, renglones de Ventas e Historial usan tablas.
**Contexto**: Catálogo y Libros muestran los mismos datos de los libros.
**Alternativas consideradas**: tabla en ambas vistas.
**Justificación**: distingue la vista de consulta de la de gestión y evita una tabla de seis columnas a 320 px.
**Trade-offs aceptados**: dos presentaciones distintas de los mismos datos.
**Origen**: change `estructura-y-pantallas-html`, decisión D3.

### DD-13 — Plantillas `<template>` y vocabulario de enganches
**Decisión**: cada tarjeta o fila generada por JavaScript tiene una `<template>` en el HTML; JavaScript la clona y completa con `textContent`. Los enganches de JavaScript son `id`, `data-campo` y `data-accion`; las clases son solo para CSS; el atributo `hidden` es el único mecanismo para mostrar u ocultar estados.
**Contexto**: tres personas trabajan en paralelo sobre el mismo marcado.
**Alternativas consideradas**: crear los nodos con `document.createElement` en cada script; usar clases como enganche de JavaScript.
**Justificación**: la forma del marcado queda en el HTML, se evita `innerHTML` y el CSS puede cambiar clases sin romper el JavaScript.
**Trade-offs aceptados**: renombrar un `id` o un `data-*` obliga a coordinar entre changes.
**Origen**: change `estructura-y-pantallas-html`, decisiones D4 y D9.

### DD-14 — Autores con casillas y formularios con `novalidate`
**Decisión**: los autores se eligen con una casilla por autor dentro de un `fieldset`; los formularios llevan `novalidate` y JavaScript controla la validación y los mensajes.
**Contexto**: la consigna admite selector múltiple o controles equivalentes y exige errores cerca del formulario.
**Alternativas consideradas**: `select multiple`; validación nativa del navegador.
**Justificación**: las casillas son más usables con teclado y en teléfono; los avisos nativos varían entre navegadores y no quedan junto al campo.
**Trade-offs aceptados**: toda la validación debe escribirse en JavaScript.
**Origen**: change `estructura-y-pantallas-html`, decisiones D6 y D7.

## Supuestos inferidos

### SU-01 — Cada consigna equivale a un change autocontenido
**Supuesto**: los seis ejercicios pueden implementarse como seis changes en orden.
**Origen**: decisión DD-06.
**Riesgo si es falso**: el ejercicio 1 debe contemplar campos y estados que usan los ejercicios 3 a 5; el ejercicio 6 atraviesa a los anteriores. Puede haber retrabajo.
**Cómo validar**: revisar dependencias al generar `CHANGES.md` y en el explore de cada change.

### SU-02 — Nombres de propiedades del modelo
**Supuesto**: las propiedades propuestas en `04_modelo_de_datos.md` (`titulo`, `editorialId`, `autorIds`, `precioUnitario`, etc.) son aceptables.
**Origen**: la consigna define entidades y relaciones, no nombres de propiedades.
**Riesgo si es falso**: bajo; se renombran antes de escribir datos persistidos.
**Cómo validar**: confirmar en el change del ejercicio 3.

### SU-03 — Formato de los identificadores
**Supuesto**: identificadores de texto generados localmente, estables una vez asignados.
**Origen**: la consigna pide «identificadores estables» sin fijar formato.
**Riesgo si es falso**: bajo. Riesgo técnico: `crypto.randomUUID` requiere contexto seguro y puede no estar disponible bajo `file://`; conviene un esquema que no dependa de él.
**Cómo validar**: decidir el esquema en el change del ejercicio 3.

### SU-04 — `index.html` muestra el Catálogo (confirmado, ver DD-10)
**Supuesto**: la página de entrada es la vista Catálogo.
**Origen**: la consigna fija `index.html` como entrada sin indicar qué vista contiene; el Catálogo es la primera vista listada.
**Riesgo si es falso**: bajo; alternativa: una portada con enlaces.
**Cómo validar**: confirmar en el change del ejercicio 1.

### SU-05 — Editoriales, géneros y autores no se persisten
**Supuesto**: permanecen como datos iniciales en el código y no se guardan en `localStorage`.
**Origen**: la consigna indica conservar «libros, clientes y ventas» y excluye el ABM de las otras entidades.
**Riesgo si es falso**: bajo.
**Cómo validar**: confirmar en el change del ejercicio 6.

### SU-06 — Claves de `localStorage`
**Supuesto**: tres claves separadas (`libreria.libros`, `libreria.clientes`, `libreria.ventas`).
**Origen**: propuesta del equipo; la consigna solo exige documentar ubicación y estructura del catálogo guardado.
**Riesgo si es falso**: bajo, mientras se documente en el README.
**Cómo validar**: confirmar en el change del ejercicio 6.

### SU-07 — Formato de email
**Supuesto**: «formato válido» se verifica con una comprobación simple de estructura (texto, arroba, dominio con punto).
**Origen**: la consigna no define el criterio.
**Riesgo si es falso**: bajo; el caso manual CM-3 solo exige rechazar un email inválido.
**Cómo validar**: confirmar en el change del ejercicio 4.

### SU-08 — Node disponible en las máquinas del equipo
**Supuesto**: los tres integrantes pueden ejecutar `node --test`.
**Origen**: decisión DD-04.
**Riesgo si es falso**: quien no tenga Node no puede correr las pruebas automatizadas, aunque sí usar el proyecto.
**Cómo validar**: comprobar la versión de Node de cada integrante.
