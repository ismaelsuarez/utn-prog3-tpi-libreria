# Design

## Context

C-01 dejó el Catálogo maquetado con seis tarjetas fijas en `index.html` y un filtro de maqueta en `js/paginas/catalogo.js` que opera sobre esas filas; `js/` solo tiene ese script. Este change introduce la capa de datos (modelo, lógica pura, almacén e interfaz) y reemplaza el script de maqueta. Ver `proposal.md` para el motivo; los requisitos están en `specs/datos-locales/spec.md` y `specs/catalogo/spec.md`.

Restricciones que condicionan el diseño: scripts clásicos sin `type="module"` porque el proyecto abre desde `file://` (DD-03), exportación dual para `node --test` (DD-04), inserción en el DOM solo como texto (regla 5), `localStorage` solo desde `js/almacen.js` (regla 7, sin uso en este change: DD-09) y ausencia total de dependencias (reglas 1 a 4).

## Goals / Non-Goals

**Goals:**

- Fijar el modelo de datos y su esquema de identificadores (governance ALTO: lo consumen C-04, C-05 y C-06).
- Fijar la interfaz del Almacén con firma estable; en este change solo se implementa la lectura.
- Reemplazar el script de maqueta por la versión generada desde datos, conservando el comportamiento del filtro ya verificado en la Etapa 1.
- Dejar la lógica pura probada con `node --test` antes de tocar el DOM (TDD).

**Non-Goals:**

- Altas de libros y clientes (C-04), ventas e historial (C-05), escritura y carga inicial en `localStorage` (C-04/C-05/C-06).
- Modificar las demás vistas: `libros.html`, `clientes.html`, `ventas.html` e `historial.html` siguen con sus datos de maqueta.
- Cambiar el marcado de las tarjetas o el vocabulario de clases acordado en C-01/C-02.

## Decisions

### D1 — Identificadores: prefijo + contador (cierra PA-08 / SU-03)

Formato `NN-SS` con prefijo por entidad (`edi`, `gen`, `aut`, `lib`, `cli`, `ven`) y contador de dos dígitos con relleno de cero (`edi-01`, `lib-06`). Los de los datos iniciales van escritos a mano en `datos-iniciales.js`; los nuevos (C-04 en adelante) se generan con `prefijo + "-" + String(n).padStart(2, "0")` usando el siguiente número libre.

- *Alternativas*: `crypto.randomUUID()` (descartado: requiere contexto seguro, puede no existir bajo `file://`); numéricos simples `"1"` (más propensos a colisión entre entidades al leer JSON a mano en CM-6).
- El contador con dos dígitos admite 99 registros por entidad; si se supera, `padStart` sigue funcionando (`lib-100`).

### D2 — Exportación dual en IIFE

Cada archivo de `js/datos/` y `js/logica/` usa el patrón de `08_arquitectura_propuesta.md`: envolvente IIFE, espacio de nombres `Libreria.<modulo>` y `module.exports` si existe `module`. Sin `type="module"` ni `import`/`export` (regla 2). La IIFE además aísla `const`/`let` de nivel superior entre scripts de la misma página (regla 14).

- *Alternativa*: variables globales sueltas (descartada: colisiona entre scripts y ensucia `window`).

### D3 — Contrato del Almacén en este change

`js/almacen.js` implementa `obtenerLibros`, `obtenerClientes`, `obtenerVentas`, `obtenerEditoriales`, `obtenerGeneros` y `obtenerAutores`, que devuelven copias de los datos iniciales (se implementa la lectura, según el scope de C-03).

`agregarLibro(libro)`, `agregarCliente(cliente)` y `agregarVenta(venta)` se DECLARAN con su firma y contrato en el comentario de cabecera, pero el cuerpo lanza `Error("... pendiente (C-04/C-05)")`. Nadie las llama en este change; así la firma queda fijada sin mentir sobre el comportamiento actual.

- *Alternativas*: no declararlas hasta C-04 (descartada: el scope de C-03 pide documentar firma y contrato); implementarlas ya con `localStorage` (descartada: contradice DD-09 y ensuciaría el alcance del change).
- Copias en la lectura: devolver arreglos nuevos (concat/map de los objetos) para que ninguna vista pueda mutar los datos iniciales por accidente.

### D4 — Render con `<template>` + `textContent`

`js/paginas/catalogo.js` vacía `lista-catalogo` (`vaciarNodo`) y por cada libro clona `plantilla-tarjeta-libro`, completa los `data-campo` con `textContent` y resuelve editorial/género/autores mediante `js/logica/catalogo.js`. El filtro pasa a ser sobre los datos, reutilizando `filtrarPorTitulo` + `normalizarTexto`.

- Mantiere DD-13 (forma del marcado en el HTML, enganches `id`/`data-campo`, `hidden` como único mecanismo de mostrar/ocultar) y RN-UI-05.
- *Alternativa*: mantener el filtro sobre las tarjetas ya renderizadas leyendo su `data-campo="titulo"` (descartada: doble fuente de verdad; se pierde la distinción «lista vacía vs. sin resultados»).

### D5 — Tarjetas estáticas como respaldo (decisión del usuario)

Las seis `<li>` de ejemplo se conservan en `index.html`. Al cargar, el script vacía la lista y la rellena desde datos → no hay duplicado. Con JS deshabilitado queda la maqueta visible.

- *Pendiente de revisión*: si al terminar el TPI resultan redundantes, se retiran en un change posterior (no afecta este alcance).

### D6 — Formato de importes

`formatearImporte(n)` = `"$ " + n.toFixed(2).replace(".", ",")`, calzado con la maqueta actual (`$ 1500,00`). Sin separador de miles para no introducir una convención que la maqueta no usa.

- *Alternativa*: `Intl.NumberFormat("es-AR")` (descartada: introduce separador de miles con punto y comportamiento por locale que hoy no se necesita; se puede migrar después sin tocar specs).

### D7 — Estados con `hidden` y mensajes existentes

- Sin libros en el almacén → `catalogo-vacio` visible, lista oculta.
- Con libros y filtro sin coincidencias → `catalogo-sin-resultados` visible (ya tiene `role="status"`), lista oculta.
- Filtro vacío → todo visible.
- Los mensajes ya existen en el HTML con `hidden`; solo se alterna el atributo.

### D8 — Carga de scripts en `index.html`

Orden con `defer` (respeta dependencias porque `defer` ejecuta en orden):

```html
<script src="js/datos/datos-iniciales.js" defer></script>
<script src="js/logica/texto.js" defer></script>
<script src="js/logica/catalogo.js" defer></script>
<script src="js/almacen.js" defer></script>
<script src="js/interfaz.js" defer></script>
<script src="js/paginas/catalogo.js" defer></script>
```

Las demás páginas NO cargan estos scripts todavía (se hace en C-04).

### D9 — Pruebas con `node --test`

`tests/texto.test.js`, `tests/catalogo.test.js` y `tests/datos-iniciales.test.js`, usando `require("../js/logica/...")` (funciona por la exportación dual). Sin `package.json` (regla 3). La consistencia del seed se prueba con código (mínimos y relaciones), no a mano.

## Risks / Trade-offs

- [La firma del Almacén o los IDs cambian después → hay que retocar C-04/C-05] → se fijan ahora en D1/D3 y se validan con SU-02 antes de escribir; el almacén es el único punto de lectura.
- [Dos fuentes de verdad en `index.html` (tarjetas estáticas + render)] → el script vacía la lista al iniciar; se verifica en el caso manual de apertura sin errores y sin duplicados.
- [`agregar*` lanza `Error` → un error de uso futuro rompe en frío] → el mensaje de la excepción nombra el change responsable (C-04/C-05); ninguna vista lo llama en este change.
- [Copias en la lectura → costo extra] → arreglos chicos (≤ decenas de registros); a cambio ninguna vista muta los datos iniciales.

## Migration Plan

No hay datos persistidos previos ni usuarios finales: el change agrega archivos y reemplaza un script. Reversión = borrar los archivos nuevos y restaurar `js/paginas/catalogo.js` e `index.html` del commit anterior.

## Open Questions

- ¿Se retiran las tarjetas estáticas de `index.html` al final del TPI? (decisión del usuario «dejarlas y después lo vemos»; no bloquea este change ni a C-04).
