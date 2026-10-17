# Design

## Context

Ver [proposal.md](proposal.md) para motivación y alcance. Se requiere diseño porque la consolidación toca el almacén que consumen las cinco páginas, introduce una política de fallos y fija el método de entrega.

Evidencia de la exploración:
- `js/almacen.js` ya concentra el acceso a `localStorage` con `leerLista`, `escribirLista`, `memoria` (reserva en Node) y los puntos de inyección `obtenerStorage`/`obtenerStorageVentas`; hoy la lectura no siembra (RN-PE-02 incumplido) y la spec de `datos-locales` declara la consolidación pendiente para este change.
- `tests/almacen.test.js` ya inyecta un `localStorage` simulado mediante `globalThis.localStorage` y dispone de cargas en contexto aislado con `vm.runInNewContext` (`cargarAlmacenEnNode`, `cargarAlmacenEnNavegador`) para aislar el estado de módulo `memoria`; la suite vigente está en 146/146 (`node --test tests/*.test.js`; en Windows NO funciona `node --test tests/`).
- Los cinco scripts de página (`js/paginas/*.js`) se cargan como scripts clásicos con `defer` dentro de su propia función envolvente (regla dura 14); `Libreria.almacen` está disponible antes de que corra cualquiera de ellos.
- `index.html` referencia 7 `img/portadas/*.jpg` inexistentes con fallback textual «Portada no disponible», e `img/estanteria.webp` es una imagen descargada; PA-13 exige conservar ambas cosas y documentarlas.
- Cambios archivados C-01..C-05; la tarea 6.3 (Libros y Clientes a 320/1280 px con teclado y foco) quedó pendiente en C-04 y debe ejecutarse aquí sin editar ese archivo.

## Goals / Non-Goals

**Goals:** sembrar el primer inicio por clave ausente sin duplicar ni sobrescribir; mantener intacto el contenido ilegible; no romper la carga de la página ante un fallo de escritura de siembra; conservar los 146 tests existentes; entregar una carpeta zip verificable y un README con resultados observados.

**Non-Goals:** reparar o migrar datos dañados, persistir editoriales/géneros/autores, sincronizar entre pestañas, editar HTML/CSS por esta causa, cambiar firmas del almacén o reglas de negocio, editar el change archivado de C-04.

## Decisions

### D1 — Mecanismo y momento de la siembra

El almacén expone `inicializar()`, que recorre las tres claves (`libreria.libros`, `libreria.clientes`, `libreria.ventas`) y, por cada una: clave ausente → siembra (ejemplos de `datos-iniciales.js` para libros/clientes, `[]` para ventas); clave presente con arreglo JSON válido → no hace nada; clave presente ilegible → no hace nada. «Primer inicio» = clave ausente; no se agrega una cuarta clave marcadora. La llamada va al comienzo de los cinco scripts de página, dentro de su función envolvente, antes de usar el almacén: así todas las vistas arranzan con el mismo estado, sea cual sea la página de entrada.

Alternativa descartada: clave marcadora de inicialización, porque duplica el estado real (dos fuentes de verdad que pueden divergir) y no aporta nada sobre el criterio «clave ausente». También se descarta sembrar dentro de `obtenerLibros`/`obtenerClientes`: la lectura actual no siembra es un contrato testeado que se conserva.

### D2 — Política de JSON ilegible (PA-05)

La inicialización no repara ni sobrescribe contenido ilegible: el valor alterado a mano se conserva intacto (CM-6 del docente depende de poder alterar el storage y observar la reacción). Las lecturas siguen sirviendo los ejemplos provisorios en memoria, como hoy hace `leerLista`. El alta posterior (`agregarLibro`/`agregarCliente`/`agregarVenta`) sí pisa la lista completa: es el único mecanismo de recuperación y queda documentado en el README («si borra o altera una clave, un alta válida reemplaza esa lista por ejemplos + registro»).

Alternativa descartada: regenerar la clave dañada al iniciar, porque destruiría datos del usuario sin aviso y rompería CM-6.

### D3 — Fallo de escritura en `inicializar()`: degradar, no romper

Si `setItem` lanza durante la siembra (cuota, modo privado, acceso bloqueado), `inicializar()` captura el error y deja esa clave en la reserva en memoria de la sesión: la página termina de cargar y el almacén sigue respondiendo; no se informa persistencia duradera para esa sesión. Se elige degradar en vez de propagar porque la siembra ocurre al arrancar, sin formulario ni borrador que proteger: propagar rompería las cinco páginas por un fallo que afecta solo a datos de ejemplo (regenerables desde `datos-iniciales.js`). En cambio, las altas del usuario (`agregarLibro`, `agregarCliente`, `agregarVenta`) sí propagan el fallo, como ya hacen: allí sí hay una operación del usuario que debe comunicarse como fallida (contrato de C-05 conservado).

### D4 — Imágenes (PA-13)

`img/estanteria.webp` es una imagen descargada: se conserva y se documenta su procedencia en el README. Las 7 referencias a `img/portadas/*.jpg` inexistentes en `index.html` se conservan con su fallback textual («Portada no disponible») y ese comportamiento también se documenta. No se modifica HTML ni CSS por esta causa.

### D5 — Método de empaquetado (PA-14)

La entrega se arma con una lista de inclusión: `index.html`, los demás `*.html`, `css/`, `js/`, `img/`, `recursos/` y `README.md`. Tras comprimir, se verifica el zip: ausencia de `type="module"`, de referencias `http(s)`, de `fetch`, de `localStorage` fuera de `js/almacen.js`, de imágenes referenciadas inexistentes y de carpetas/archivos excluidos (`tests/`, `openspec/`, `knowledge-base/`, `discovery/`, `docs/`, `.atl/`, `.claude/`, `.engram/`, `.githooks/`, `.git/`, `.gitignore`, `CHANGES.md`, `AGENTS.md`, `CLAUDE.md`, `.active-orchestrator-state.json`). Lista de inclusión elegida sobre lista de exclusión: el olvido de una carpeta nueva no contamina la entrega.

### D6 — Tarea 6.3 trasladada

La verificación de Libros y Clientes a 320 px y 1280 px, con teclado y foco visible (regla dura 11), entra como task nueva de C-06 con su registro en el README. No se edita `openspec/changes/archive/2026-10-16-alta-de-libros-y-clientes/`.

### D7 — Compatibilidad con la suite y enfoque de pruebas

`inicializar()` es aditivo: no cambia firmas, claves ni el contrato «la lectura no siembra»; la suite de 146 tests debe seguir verde sin edición de sus aserciones (solo se agregan pruebas). Los tests nuevos usan el patrón existente: almacenamiento simulado inyectado para la mayoría de los escenarios; contexto aislado con `vm` (patrón `cargarAlmacenEnNavegador`) cuando el escenario depende del estado de módulo `memoria`, como el segundo inicio y la degradación por fallo de escritura. TDD primero: RED observado, implementación mínima hasta GREEN, triangulación y refactor, por comportamiento.

## Risks / Trade-offs

- [Siembrar ventas `[]` escribe en la primera página abierta] → es intencional y acordado: el alta de la primera venta ya no necesita crear la clave; el escenario «lectura sin siembra» sigue protegiendo las lecturas puras.
- [`inicializar()` en 5 scripts se ejecuta 1 vez por página, no una sola vez por sesión] → es idempotente por diseño (D1): reejecutar no duplica ni sobrescribe.
- [Memoria de sesión confundida con persistencia] → el README documenta que, ante un fallo de escritura, los datos viven solo hasta cerrar la pestaña.
- [Alterar a mano el storage en pruebas reales contamina el perfil del navegador] → CM-6 y CM-7 se ejecutan sobre una copia del proyecto y/o perfil aislado, como ya acuerda el alcance.
- [Zip con archivos de más] → lista de inclusión y verificación posterior al empaquetado (D5).

## Migration Plan

No hay migración de datos: las claves ya guardadas se respetan. `inicializar()` solo escribe claves ausentes. Si se revierte el cambio, las claves sembradas son inocuas para versiones anteriores (se leen igual). No se borran datos como parte del change.
