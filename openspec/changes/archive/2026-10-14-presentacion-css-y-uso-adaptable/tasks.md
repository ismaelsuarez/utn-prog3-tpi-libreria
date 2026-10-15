# Tasks

## 1. `css/base.css` — variables, reinicio y foco

- [x] 1.1 Escribir las variables de `:root` según design D1 y D3 (paleta verde/crema con los hex fijados, escala de espaciado 0,25–3 rem, radios, sombra, ancho máximo 70rem, dos pilas de tipografía del sistema) — Verificación: `grep -c "var(--" css/disposicion.css css/componentes.css` da > 0 y ningún color hex suelto aparece fuera de `base.css`. **Ejecutada**: 35 usos de `var(--` en disposicion.css y 103 en componentes.css; 0 colores sueltos fuera de base.css.
- [x] 1.2 Agregar el reinicio mínimo (box-sizing, márgenes de títulos, `img` fluido, `body` con fondo crema, tipografía sans e interlineado 1,5) y la escala tipográfica de h1/h2 — Verificación: abrir las cinco páginas por `file://` y confirmar fondo crema y texto legible sin estilos del navegador en conflicto. **Ejecutada en Edge headless 154** (CDP): `body` con `background-color: rgb(250, 247, 239)`, `font-family: system-ui…`, `line-height: 24px` (1,5) en las cinco páginas.
- [x] 1.3 Proteger `hidden` con `[hidden] { display: none !important; }` — Verificación: en `index.html` los mensajes `catalogo-vacio` y `catalogo-sin-resultados` (con atributo `hidden`) permanecen invisibles pese a cualquier `display` de componente. **Ejecutada**: `getComputedStyle(#catalogo-vacio).display === "none"` con `hidden` presente; al quitarlo el mensaje aparece (ver 3.5).
- [x] 1.4 Estilizar `:focus-visible` global (contorno dorado 0,1875rem con offset) y su variante dentro de `.encabezado` (dorado claro) — Verificación: recorrer `index.html` con Tab y ver el contorno visible en buscador, enlaces de navegación y pie; repetir en `ventas.html` sobre el encabezado verde. **Ejecutada** (CDP + `Input.dispatchKeyEvent` Tab): los 6 controles de index, 14 de libros, 8 de clientes, 14 de ventas y 6 de historial reciben `:focus-visible` con `outline: solid 3px`; dentro del encabezado el color es `rgb(244, 213, 141)` (dorado claro). Cero controles sin foco visible en las cinco páginas.
- [x] 1.5 Agregar `@media (prefers-reduced-motion: reduce)` desactivando transiciones — Verificación: con la simulación activada en DevTools, el hover de un botón no anima. **Ejecutada** (CDP `Emulation.setEmulatedMedia` con `prefers-reduced-motion: reduce`): `transition-duration` de `.boton` = `0s`.

## 2. `css/disposicion.css` — encabezado, navegación, grillas y cortes

- [x] 2.1 Estilizar `.encabezado` (flex, columna a 320 px, fila con `space-between` desde 48em, fondo verde primario) y `.encabezado__nombre` — Verificación: a 320 px el nombre y la navegación quedan apilados y legibles; a 1280 px quedan en una fila; sin `order` en elementos enfocables. **Ejecutada**: `flex-direction` = `column` a 320 px y `row` a 1280 px en las cinco páginas; grep de la propiedad `order` en las tres hojas: 0 coincidencias.
- [x] 2.2 Estilizar `.navegacion__lista` (flex-wrap con gap) y `.navegacion__enlace` (incluido `aria-current="page"` con indicador no solo cromático, p. ej. subrayado) con altura táctil ≥ 2,75 rem — Verificación: a 320 px los cinco enlaces caben repartidos en líneas sin desbordar; el enlace activo se distingue también sin color. **Ejecutada**: página sin desplazamiento horizontal a 320 px (scrollWidth = clientWidth = 320 en las cinco); enlace activo con `text-decoration: underline` + negrita; altura del enlace = 44 px.
- [x] 2.3 Estilizar `.contenido` (ancho máximo 70rem centrado, padding lateral ≥ 1rem) y `.seccion` (separación vertical con escala de espaciado) — Verificación: a 1280 px el contenido queda centrado con márgenes; a 320 px sin desplazamiento horizontal. **Ejecutada**: a 1280 px `.contenido` mide 1120 px con `margin-inline: 72,5–80 px` en las cinco páginas; a 320 px sin desplazamiento. *Incidencia corregida durante la apply*: `margin-inline: auto` anula el `stretch` del flex column del `body`, por lo que `.contenido`, `.encabezado` y `.pie` necesitan `width: 100%` (junto a `max-width`) para no encogerse a fit-content; sin ese ajuste cuatro páginas desbordaban a 320 px y el Catálogo mostraba una sola columna a 1280 px.
- [x] 2.4 Estilizar `.lista-tarjetas` como grilla fluida (`auto-fill` + `minmax(min(100%, 16rem), 1fr)`) — Verificación: `index.html` a 320 px muestra una columna de tarjetas; a 1280 px muestra varias columnas (design D4 y escenario «Listado de tarjetas a 1280 px»). **Ejecutada**: 1 columna a 320 px, 4 columnas a 1280 px; 0 tarjetas con recorte de contenido en ambos anchos.
- [x] 2.5 Estilizar `.pie` (borde superior, texto suave, contenido centrado o alineado coherente) — Verificación: las cinco páginas muestran el pie idéntico a ambos anchos. **Ejecutada**: `border-top: 1px solid`, `color: rgb(85, 85, 76)` (texto suave), `text-align: center`, `font-size` pequeño en las cinco páginas a ambos anchos.
- [x] 2.6 Confirmar con DevTools que a 320 px `document.documentElement.scrollWidth <= clientWidth` en las cinco páginas — Verificación: número observado por página, sin recurrir a `overflow-x: hidden` en `body` (design D10). **Ejecutada** (Edge headless 154, viewport 320): index 320/320, libros 320/320, clientes 320/320, ventas 320/320, historial 320/320. Grep de `overflow-x: hidden` en las hojas: 0 coincidencias.

## 3. `css/componentes.css` — tarjetas, formularios, botones, tablas y mensajes

- [x] 3.1 Estilizar `.tarjeta`, `.tarjeta__titulo`, `.tarjeta__datos` y `.tarjeta__dato` (borde + sombra, título verde, datos en lista etiqueta/valor) — Verificación: tarjetas de `index.html` a 320 px y 1280 px con datos completos visibles y sin recortes. **Ejecutada**: las 6 tarjetas visibles sin recorte (`scrollHeight <= clientHeight`) a 320 y 1280 px; título `rgb(47, 93, 58)` (verde primario sobre blanco, 7,6:1).
- [x] 3.2 Estilizar `.formulario`, `.campo`, `.campo__etiqueta`, `.campo__control` y `.campo__error` (apilado, control con `min-height: 2,75rem`, ancho máximo 30rem, foco heredado de `base.css`) y `.grupo-opciones` / `.grupo-opciones__opcion` (casillas envueltas con `gap`) — Verificación: en `libros.html` y `clientes.html` a 320 px los campos se apilan legibles; a 1280 px no quedan diminutos; recorrer el formulario con Tab confirma foco visible en cada control y en las casillas. **Ejecutada**: 0 controles con altura < 44 px en libros y ventas a ambos anchos; recorrido por teclado con foco visible en los 5 controles del formulario de libros y en las 3 casillas de autores; a 1280 px los formularios pasan a dos columnas y los controles quedan acotados a 30rem.
- [x] 3.3 Estilizar `.boton`, `.boton--primario` (verde con texto blanco) y `.boton--secundario` (borde verde, fondo claro) con hover/active y `min-height: 2,75rem` — Verificación: en `ventas.html` el «Confirmar venta» y el «Agregar renglón» miden ≥ 44 px de alto y sus textos superan 4,5:1 de contraste (blanco sobre `#2f5d3a`; verde sobre crema). **Ejecutada**: 0 botones < 44 px (los dos de ventas miden 44 px); contraste calculado con la fórmula WCAG: blanco/verde = 7,64:1, verde/crema = 7,14:1, blanco/verde-oscuro (hover) = 10,15:1.
- [x] 3.4 Estilizar `.tabla-contenedor` (`overflow-x: auto`) y `.tabla` (cabecera tintada, filas alternas, celdas con padding, `border-collapse`) — Verificación: a 320 px en `libros.html` la tabla se desplaza dentro de su contenedor mientras la página no se desplaza lateralmente; a 1280 px la tabla se ve completa. **Ejecutada**: a 320 px la tabla de libros mide 545 px dentro de un contenedor de 286 px con scroll interno (`scrollWidth > clientWidth`) y la página no se desplaza (320/320); en clientes, ventas e historial el comportamiento es el mismo; a 1280 px ningún contenedor necesita scroll (tabla completa).
- [x] 3.5 Estilizar `.mensaje`, `.mensaje--correcto`, `.mensaje--error`, `.mensaje--vacio` con borde lateral, fondo tintado y símbolo `::before` (design D8), asegurando que el texto es el diferenciador principal — Verificación: quitar temporalmente el atributo `hidden` en DevTools sobre los mensajes de `index.html` y `ventas.html`; el «error» se identifica con texto y trazo, no solo color. **Ejecutada** (CDP, quitar `hidden` y poblar el texto): `mensaje--vacio` → `::before: "● "`, `border-left: 4px solid`; `mensaje--error` → `::before: "⚠ "`, trazo y texto `rgb(147, 32, 26)` sobre `rgb(247, 232, 230)` (7,2:1); `mensaje--correcto` → `::before: "✓ "`. Los mensajes vacíos no ocupan lugar (`:empty { display: none }`), de modo que el símbolo nunca aparece suelto.
- [x] 3.6 Estilizar `.etiqueta-maqueta` (pastilla dorada punteada) y `.resumen` (panel destacado con borde/acento, `output` en monoespaciada) — Verificación: la marca «Maqueta» es visible en `libros.html`, `clientes.html`, `ventas.html` e `historial.html`; el total de `ventas.html` se lee en monoespaciada. **Ejecutada**: pastilla con `border-top: dashed` + trazo lateral `solid` dorado y `::before: "▣ "`; `.resumen` con borde superior `rgb(143, 98, 16)` (dorado); `#venta-total` con `font-family` monoespaciada. Las cuatro marcas de maqueta están presentes en el marcado de esas páginas y se estilizan por clase (ninguna oculta).
- [x] 3.7 Aplicar `--fuente-mono` a los `data-campo` de ISBN e importes (`isbn`, `precio`, `precio-unitario`, `subtotal`, `total`) — Verificación: ISBN y precios de `index.html` y `ventas.html` se renderizan en monoespaciada. **Ejecutada**: `font-family` computada = `ui-monospace, "Cascadia Mono", Consolas, "Courier New", monospace` sobre `[data-campo="isbn"]` y `[data-campo="precio-unitario"]`.

## 4. Verificación integral (anticipo de CM-8)

- [x] 4.1 Recorrer las cinco páginas a 320 px en DevTools: sin desplazamiento horizontal del documento, textos y controles legibles, tablas que solo desplazan su contenedor — Verificación: resultado observado por página registrado en el change (luego lo repite C-06 en el README). **Ejecutada** (Edge headless 154 + CDP, viewport 320): `scrollWidth <= clientWidth` en las cinco (320/320 cada una); controles ≥ 44 px; tablas desplazan solo su contenedor. Resultado por página más abajo («Resultados de verificación»).
- [x] 4.2 Recorrer las cinco páginas a 1280 px: contenido centrado con ancho máximo, grilla de tarjetas en varias columnas, sin desplazamiento horizontal — Verificación: resultado observado por página. **Ejecutada**: `.contenido` = 1120 px centrado en las cinco; Catálogo con 4 columnas de tarjetas; `scrollWidth <= clientWidth` en las cinco. Resultado por página más abajo.
- [x] 4.3 Recorrido completo por teclado (Tab/Shift+Tab) de las cinco páginas: foco visible en cada control, orden de tabulación igual al orden visual, ningún control inalcanzable — Verificación: lista de controles recorridos por página; probar también el scroll por teclado del contenedor de tabla (design D10) y, si falla, escalar la contingencia `tabindex="0"`. **Ejecutada** (CDP + `Input.dispatchKeyEvent`): 6/14/8/14/6 controles alcanzados en index/libros/clientes/ventas/historial, todos con `:focus-visible` (contorno sólido) y en el orden del marcado = orden visual (sin `order`); Shift+Tab regresa al estado previo. **D10 sin contingencia**: a 320 px, donde la tabla desborda, el `.tabla-contenedor` ES alcanzable con Tab (Edge/Chrome 154 lo enfoca por tener scroll) y la flecha/Espacio lo desplazan (Espacio verificado: `scrollLeft` > 0); no se agregó `tabindex="0"`. *Recomendación*: repetir este punto en Firefox y Safari, donde el contenedor puede no ser enfocable (la contingencia D10 sigue vigente para ese caso).
- [x] 4.4 Verificar los pares de contraste de design D3 con la calculadora de DevTools (texto sobre crema, texto del primario, mensajes, foco sobre verde y sobre claro) — Verificación: cada par ≥ 4,5:1 (foco ≥ 3:1) anotado en el change. **Ejecutada**: calculados con la fórmula WCAG 2.1 en un script propio (mismo cálculo que la calculadora de DevTools); todos los pares ≥ 4,5:1 (foco ≥ 3:1). Tabla más abajo.

## 5. Documentación de la decisión

- [x] 5.1 Registrar DD-15 (identidad visual: paleta «verde biblioteca + crema», tipografía del sistema, variables en `base.css`; origen: change `presentacion-css-y-uso-adaptable`) en `knowledge-base/09_decisiones_y_supuestos.md` — Verificación: el archivo contiene DD-15 después de DD-14 y la tabla de PA-03 en `10_preguntas_abiertas.md` figura «Resuelta» apuntando a este change. **Ejecutada**: DD-15 insertada después de DD-14 en el mismo formato de la tabla de decisiones; PA-03 figura «Resuelta» apuntando a este change en `10_preguntas_abiertas.md`.
- [x] 5.2 Verificar que ningún archivo de la entrega referencia recursos externos (grep de `http://`, `https://`, `//fonts` en HTML y CSS) — Verificación: cero coincidencias en `*.html` y `css/*.css`. **Ejecutada**: 0 coincidencias de `https?://`, `//fonts`, CDNs ni `@import url(...)` en los cinco HTML y las tres hojas.

## Resultados de verificación (apply)

### Contraste (fórmula WCAG 2.1, pares de D3 y uso real)

| Par | Razón | Mínimo |
|---|---|---|
| `--color-texto` sobre `--color-fondo` | 13,48:1 | 4,5 |
| `--color-texto-suave` sobre crema | 7,03:1 | 4,5 |
| `--color-primario` sobre crema (títulos) | 7,14:1 | 4,5 |
| Blanco sobre `--color-primario` (botón/encabezado) | 7,64:1 | 4,5 |
| Blanco sobre `--color-primario-oscuro` (hover) | 10,15:1 | 4,5 |
| `--color-primario` sobre blanco (botón secundario) | 7,64:1 | 4,5 |
| `--color-acento` sobre crema (enlaces, foco) | 5,00:1 | 4,5 |
| `--color-acento` sobre blanco | 5,35:1 | 4,5 |
| `--color-acento-claro` sobre `--color-primario` (foco en encabezado) | 5,37:1 | 3 |
| `--color-primario-oscuro` sobre `--color-primario-claro` (cabecera de tabla, «correcto») | 8,71:1 | 4,5 |
| `--color-error` sobre `--color-error-fondo` | 7,16:1 | 4,5 |
| `--color-error` sobre crema | 7,97:1 | 4,5 |
| Texto sobre `--color-fondo-alterno` (filas pares) | 12,24:1 | 4,5 |
| Texto sobre `--color-superficie` (tarjetas, formularios) | 14,43:1 | 4,5 |

### Desplazamiento horizontal por página (Edge headless 154, `documentElement.scrollWidth` / `clientWidth`)

| Página | 320 px | 1280 px | Tablas con scroll interno a 320 px |
|---|---|---|---|
| index.html | 320 / 320 ✓ | 1265 / 1265 ✓ | — |
| libros.html | 320 / 320 ✓ | 1265 / 1265 ✓ | 1 de 1 (545 px en contenedor de 286 px) |
| clientes.html | 320 / 320 ✓ | 1280 / 1280 ✓ | 1 de 1 |
| ventas.html | 320 / 320 ✓ | 1265 / 1265 ✓ | 1 de 1 |
| historial.html | 320 / 320 ✓ | 1280 / 1280 ✓ | 2 de 2 |

### Recorrido por teclado (Tab, `:focus-visible`)

| Página | Controles alcanzados | Sin foco visible | Orden |
|---|---|---|---|
| index.html | 6 (5 enlaces + buscador) | 0 | marcado = visual |
| libros.html | 14 (5 enlaces, 5 campos, 3 casillas, botón) | 0 | marcado = visual |
| clientes.html | 8 (5 enlaces, 2 campos, botón) | 0 | marcado = visual |
| ventas.html | 14 (5 enlaces, select de cliente, libro, cantidad, agregar, 2 renglones × 2 controles, confirmar) | 0 | marcado = visual |
| historial.html | 6 (5 enlaces + «Ver detalle») | 0 | marcado = visual |

## Workflow follow-up

- Revisión conjunta de Etapa 1 (C-01 + C-02) a 320 px y 1280 px con el equipo, marcando qué es maqueta (RN-GL-08), y archive del change con `/opsx:archive presentacion-css-y-uso-adaptable`.
- La verificación automática de este change se hizo con Edge headless 154 (motor Blink, el mismo de DevTools) vía CDP y un script propio de contraste con la fórmula WCAG; las herramientas quedaron en el sistema de archivos temporal, fuera del repositorio y de la entrega. Conviene que un integrante repita la pasada visual (estética, legibilidad subjetiva) en su navegador habitual antes del archive.
