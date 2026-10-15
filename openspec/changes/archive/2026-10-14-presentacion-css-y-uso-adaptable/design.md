# Design

## Context

Ver `proposal.md` para la motivación. C-01 archivó las cinco páginas con el marcado completo y las clases de D9 ya presentes en el HTML (`encabezado`, `navegacion`, `navegacion__lista`, `navegacion__enlace`, `contenido`, `seccion`, `pie`, `lista-tarjetas`, `tarjeta`, `tarjeta__titulo`, `tarjeta__datos`, `tarjeta__dato`, `formulario`, `campo`, `campo__etiqueta`, `campo__control`, `campo__error`, `grupo-opciones`, `grupo-opciones__opcion`, `boton`, `boton--primario`, `boton--secundario`, `tabla-contenedor`, `tabla`, `mensaje`, `mensaje--correcto`, `mensaje--error`, `mensaje--vacio`, `etiqueta-maqueta`, `resumen`). Las tres hojas de `css/` están enlazadas en ese orden y vacías. Condicionan el diseño:

- Reglas duras: CSS propio y local sin frameworks ni CDNs (1), sin módulos (2), verificar a 320 px y 1280 px con teclado y foco visible (11), solo CSS puro (12), español neutro (13).
- DD-13 (C-01 D9): las clases son solo para estilos; `id`, `data-campo` y `data-accion` pertenecen a JavaScript; `hidden` es el único mecanismo de mostrar/ocultar y el CSS no debe anularlo.
- El HTML **no se toca** (salvo ajuste mínimo de clases si fuera imprescindible, acordado con el Integrante A).
- Explore cerrado: PA-03a tipografía = pila del sistema sin `@font-face`; PA-03b paleta = «verde biblioteca + crema», solo modo claro.
- El CSS debe seguir siendo válido cuando C-03 a C-05 generen tarjetas y filas desde las plantillas (los clones heredan las mismas clases).

## Goals / Non-Goals

**Goals:**

- Identidad visual única declarada una sola vez (`:root` de `base.css`) y consumida por las tres hojas.
- Las cinco páginas legibles y utilizables a 320 px y a 1280 px, sin desplazamiento horizontal del documento; tablas con desplazamiento propio.
- Foco visible en todo control, orden visual = orden de tabulación, mensajes distinguibles sin depender del color, botones con objetivo táctil de 44 px.
- Estilo de todas las clases de C-01, incluida la marca de maqueta, sin duplicar reglas entre vistas.

**Non-Goals:**

- Modo oscuro (fuera de alcance por regla dura 9 y decisión del explore).
- `@font-face` o archivos de fuente binarios (PA-03a lo descarta).
- Cambios de marcado, JavaScript nuevo o estilos que el JavaScript dependa de usar.
- Iconografías, ilustraciones o imágenes ajenas (no hay imágenes en el proyecto; PA-13 queda para C-06 si aparecen).
- Impresión (`@media print`) y efectos animados beyond transiciones mínimas de estado.

## Decisions

### D1 — Variables en `:root` de `base.css`

Toda la identidad visual se declara como variables CSS (custom properties) en `base.css` y las otras hojas solo las consumen. La palabra «variables» se refiere a variables CSS, no a `var` de JavaScript (regla dura 14 aplica solo a JS).

- *Por qué*: US-003 pide definir colores, tipografía y espaciado; con variables, un ajuste de paleta es un solo cambio y las tres hojas quedan coherentes por construcción.
- *Alternativa*: valores sueltos por componente. Descartada: invierte el criterio de coherencia de la rúbrica.

### D2 — Tipografía del sistema (cierra PA-03a)

```css
--fuente-sans: system-ui, "Segoe UI", Roboto, Arial, sans-serif;
--fuente-mono: ui-monospace, "Cascadia Mono", Consolas, "Courier New", monospace;
```

Escala tipográfica (rem, base 1rem = 16 px): `0,875rem` texto pequeño, `1rem` cuerpo, `1,125rem` texto destacado, `1,375rem` h2, `1,75rem` h1. Interlineado 1,5 en cuerpo y 1,2 en títulos. La monoespaciada del sistema se aplica a ISBN e importes (ver D3).

- *Por qué*: la consigna exige tipografías locales; la pila del sistema es «local» por definición, sin binarios en la entrega y con buen render en cualquier SO.
- *Alternativa*: `@font-face` con WOFF2 descargado. Descartada por PA-03a: agrega archivos binarios y una descarga de fuente ajenas a la entrega.

### D3 — Paleta «verde biblioteca + crema» (cierra PA-03b) y dónde se aplica la monoespaciada

Solo modo claro. Valores exactos y usos:

| Variable | Valor | Uso | Contraste verificado |
|---|---|---|---|
| `--color-fondo` | `#faf7ef` | fondo de página (crema) | — |
| `--color-superficie` | `#ffffff` | tarjetas, formularios, paneles | — |
| `--color-texto` | `#2a2a24` | texto de cuerpo | ≈ 13,5:1 sobre crema |
| `--color-texto-suave` | `#55554c` | texto secundario, pies de tabla | ≈ 6,3:1 sobre crema |
| `--color-primario` | `#2f5d3a` | verde bosque: encabezado, botón primario, títulos de tarjeta | ≈ 7,1:1 sobre crema; 7,6:1 con texto blanco encima |
| `--color-primario-oscuro` | `#24492f` | hover/active del primario | ≥ 7:1 con texto blanco |
| `--color-primario-claro` | `#e7f0e8` | fondo tintado de «correcto» y de cabeceras de tabla | — |
| `--color-acento` | `#8f6210` | dorado: enlaces, foco, bordes de resumen y maqueta | ≈ 5,0:1 sobre crema; 5,3:1 sobre blanco |
| `--color-acento-claro` | `#f4d58d` | foco y detalles sobre fondos verdes | 5,4:1 sobre verde primario |
| `--color-error` | `#93201a` | texto y borde de error | ≥ 7:1 sobre crema y sobre fondo de error |
| `--color-error-fondo` | `#f7e8e6` | fondo tintado del mensaje de error | — |
| `--color-borde` | `#d9d2c1` | bordes de tarjetas, campos y tablas | — |

Espaciado (base 4 px): `--espacio-1: 0,25rem`, `--espacio-2: 0,5rem`, `--espacio-3: 1rem`, `--espacio-4: 1,5rem`, `--espacio-5: 2rem`, `--espacio-6: 3rem`. Radios: `--radio: 0,5rem`, `--radio-sm: 0,25rem`. Sombra: `--sombra: 0 1px 3px rgba(42, 42, 36, 0,12)` (solo acompañada de borde, nunca como única separación).

La monoespaciada (`--fuente-mono`) se aplica a ISBN e importes mediante selectores de atributo sobre el vocabulario estable de C-01: `[data-campo="isbn"]`, `[data-campo="precio"]`, `[data-campo="precio-unitario"]`, `[data-campo="subtotal"]`, `[data-campo="total"]`, más `output` del resumen. El CSS puede leer esos atributos porque forman parte del contrato de C-01 D9; JavaScript sigue sin depender de clases.

- *Por qué de cada tinte*: verde profundo y crema evocan «biblioteca»; el dorado aporta acento sin competir con el primario. Todos los pares de texto/fondo de la tabla alcanzan ≥ 4,5:1.
- *Alternativa*: acento dorado más claro (`#c9971f`). Descartada: baja a ≈ 3:1 sobre crema y no sirve para texto.

### D4 — Un solo corte y contenido fluido con ancho máximo

Mobile-first. La base (sin media query) es el diseño a 320 px: todo en una columna. Un único corte en `@media (min-width: 48em)` (768 px) activa lo que necesita más ancho (campos en dos columnas dentro de una sección, disposición del resumen al costado). El ancho máximo del contenido es `--ancho-maximo: 70rem` (1120 px), centrado con `margin-inline: auto` en `.contenido`, `.encabezado` y `.pie`; a 1280 px quedan márgenes laterales y nada se estira sin control.

- *Por qué*: la consigna solo exige comprobar 320 px y 1280 px; dos puntos de referencia no justifican una escala de cortes. El ancho máximo resuelve 1280 px sin un media query específico.
- *Alternativa*: cortes en 320, 768 y 1280. Descartada: complejidad sin beneficio evaluable.

### D5 — Encabezado y navegación con `flex-wrap` y sin `order`

`.encabezado` es un flexbox en columna a 320 px (nombre arriba, navegación debajo) que pasa a fila con `justify-content: space-between` desde 48em. `.navegacion__lista` es un flexbox con `flex-wrap: wrap` y `gap`: los cinco enlaces se reparten en una o dos líneas sin romperse. **No se usa la propiedad `order` en ningún elemento enfocable**: el orden visual debe coincidir con el orden de tabulación (RN-UI-12, regla dura 11).

- *Alternativa*: `order` para reacomodar el encabezado en pantalla angosta. Descartada: desfasaría el foco del orden visual.

### D6 — `hidden` se protege con una regla explícita

`base.css` incluye `[hidden] { display: none !important; }`. Cualquier `display: grid/flex` de componente (por ejemplo `.lista-tarjetas`) ganaría al estilo por defecto del navegador sobre el atributo `hidden` y haría visibles mensajes que C-03 a C-05 ocultan y muestran dinámicamente.

- *Por qué*: D9 de C-01 establece que el CSS no debe anular `hidden`; `!important` es la garantía de que ninguna hoja posterior lo rompa sin querer.

### D7 — Foco visible con `:focus-visible`, con variante sobre fondo verde

Regla global en `base.css`:

```css
:focus-visible {
  outline: 0.1875rem solid var(--color-acento);
  outline-offset: 0.125rem;
}
.encabezado :focus-visible {
  outline-color: var(--color-acento-claro);
}
```

Nunca se elimina un `outline` sin ofrecer reemplazo equivalente; los navegadores sin soporte de `:focus-visible` conservan su foco por defecto porque la regla se ignora. Se agrega `@media (prefers-reduced-motion: reduce)` desactivando las transiciones de hover, que son el único movimiento del CSS.

- *Por qué*: el dorado sobre crema/blanco da ≈ 5:1 contra los fondos claros, pero solo 1,4:1 sobre el verde del encabezado; la variante `--color-acento-claro` corrige el foco dentro del encabezado (5,4:1).

### D8 — Mensajes y estados: color + trazo + símbolo, nunca color solo

`.mensaje`, `.campo__error` y `.etiqueta-maqueta` llevan `border-left` grueso (0,25rem) y un símbolo decorativo con `::before` («⚠ » en error, «✓ » en correcto, «● » en vacío, «▣ » en maqueta). El texto explicativo ya vive en el HTML; el `::before` es puramente decorativo y accesible (los lectores lo omiten o lo leen como adorno, el mensaje real es el texto).

- *Por qué*: RN-UI-11 y US-005 exigen que el error no dependa del color; el trazo y el símbolo identifican el tipo de mensaje también en escala de grises.

### D9 — Objetivos táctiles de 2,75 rem

`.boton` y `.campo__control` tienen `min-height: 2,75rem` (44 px); `.navegacion__enlace` lleva `padding-block` suficiente para alcanzar la misma altura táctil. Los controles de formulario usan `width: 100%` con `max-width: min(100%, 30rem)` para que los campos de texto no queden diminutos a 1280 px ni desborden a 320 px.

### D10 — Tablas: `.tabla-contenedor` es el único desplazador

`.tabla-contenedor { overflow-x: auto; }` (RN-UI-15). La tabla conserva su ancho natural; si supera al contenedor, el scroll es del contenedor, no de la página. **No se usa `overflow-x: hidden` en `body`** para simular cumplimiento: la verificación real es `document.documentElement.scrollWidth <= clientWidth` a 320 px en las cinco páginas. Los hijos flex/grid relevantes declaran `min-width: 0` para que ningún contenido empuje al documento.

- *Costo aceptado*: un contenedor con scroll puede no ser alcanzable con teclado en algunos navegadores. Si la verificación lo confirma, se agrega `tabindex="0"` a `.tabla-contenedor` como ajuste mínimo de marcado acordado con el IntegranteA (único cambio de HTML previsto).

### D11 — Componentes con degradación segura

`.tarjeta`, `.formulario`, `.resumen` se dibujan con borde (siempre) + sombra (decorativa, D3); si la sombra no se renderiza, la tarjeta sigue delimitada. Las tablas usan `border-collapse: collapse`, cabecera con `--color-primario-claro` y filas alternas con tinte crema muy leve. `.etiqueta-maqueta` es una pastilla con borde punteado dorado y texto pequeño, visible sin restar legibilidad.

### D12 — Sin reglas acopladas al contenido de la Etapa 1

El CSS selecciona clases y `data-campo`, nunca selectores estructurales profundos (`ul > li:nth-child(3)`) ni texto. Cuando C-03 reemplace los ejemplos estáticos por clones de plantilla, el estilo no cambia.

## Risks / Trade-offs

- [Selectores de atributo (`[data-campo=...]`) acoplan el CSS al vocabulario de C-01] → ese vocabulario es contrato estable (D9 de C-01); si C-03 a C-05 lo amplían, los selectores siguen siendo válidos. Riesgo bajo.
- [El contenedor de tabla no es enfocable con teclado a 320 px] → verificar en la revisión de accesibilidad; contingencia acordada en D10 (`tabindex="0"`), único ajuste de marcado permitido.
- [Corte único en 48em deja poco espacio intermedio (480–767 px)] → la grilla de tarjetas es fluida (`auto-fill` + `minmax`) y no depende del corte; el tramo intermedio hereda la columna única, que es usable.
- [Alguien usa colores de la paleta para usos nuevos sin verificar contraste] → la tabla de D3 documenta los pares verificados; toda combinación nueva de texto/fondo debe calcularse antes de usarla.
- [Sombras o `gap` sin soporte en navegador muy viejo] → borde y `padding` sostienen la composición; el layout degrada sin perder contenido.

## Open Questions

Ninguna que bloquee la implementación. El formato definitivo de importes (C-03) y de fecha (C-05) no afecta el CSS: acá solo se estilizan como monoespaciada los selectores ya existentes.
