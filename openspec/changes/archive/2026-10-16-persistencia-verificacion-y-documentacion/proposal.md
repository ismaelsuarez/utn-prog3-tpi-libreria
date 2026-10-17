# Proposal

## Why

Hoy `js/almacen.js` no siembra los datos de ejemplo en el primer inicio (RN-PE-02 incumplido; la propia spec de `datos-locales` dejó la consolidación pendiente para este change), y faltan el README completo, el registro real de los ocho casos manuales y la carpeta de entrega. C-06 es el ejercicio 6 (10 puntos): consolida la persistencia, verifica el trabajo completo en navegador y cierra la documentación y la entrega.

## What Changes

- `almacen.inicializar()`: nueva operación llamada al inicio de los cinco scripts de página. Por clave: si está ausente, siembra (libros y clientes ← ejemplos de `datos-iniciales.js`, ventas ← `[]`); si está presente con un arreglo JSON válido, se respeta; si está presente pero ilegible, no se toca. «Primer inicio» equivale a clave ausente; no hay cuarta clave marcadora. Un fallo de escritura durante la siembra degrada a reserva en memoria y no interrumpe la carga de la página.
- Tests con `node --test` del almacén usando almacenamiento simulado inyectado (patrón de `tests/almacen.test.js`, con contexto aislado cuando el estado de módulo `memoria` influye): primer inicio, segundo inicio sin duplicados, claves parciales, JSON inválido conservado y escritura de siembra rechazada.
- `README.md` completo: procedencia de `img/estanteria.webp` (PA-13, imagen descargada que se conserva), política de claves dañadas (JSON ilegible no se repara; el alta posterior sí pisa la lista — documentar), tabla CM-1 a CM-8 con resultado observado, entrega, `img/` en la estructura, ejemplo de JSON de libro para reproducir CM-6, aclaración estable de IN-02 («sin recargar»), claves de `localStorage` y no persistencia de editoriales/géneros/autores (SU-05/SU-06), baseline de tests.
- Ejecución en navegador real y registro del resultado observado de CM-1 a CM-8 (RN-GL-07), incluida la tarea 6.3 trasladada desde C-04: verificar Libros y Clientes a 320 px y 1280 px con teclado y foco visible (regla dura 11), sin editar el change archivado.
- Entrega empaquetada con lista de inclusión (`index.html`, demás `*.html`, `css/`, `js/`, `img/`, `recursos/`, `README.md`) y comprobaciones posteriores al zip: ausencia de `type="module"`, referencias `http(s)`, `fetch`, `localStorage` fuera de `almacen.js`, imágenes referenciadas inexistentes y carpetas excluidas (`tests/`, `openspec/`, `knowledge-base/`, `discovery/`, `docs/`, `.atl/`, `.claude/`, `.engram/`, `.githooks/`, `.git/`, `.gitignore`, `CHANGES.md`, `AGENTS.md`, `CLAUDE.md`, `.active-orchestrator-state.json`).
- Las 7 referencias a `img/portadas/*.jpg` inexistentes en `index.html` se conservan con su fallback textual («Portada no disponible») y se documenta el comportamiento; no se toca HTML ni CSS por esta causa.

## Capabilities

### New Capabilities

Ninguna: se consolida y documenta una capacidad existente.

### Modified Capabilities

- `datos-locales`: el requirement «Lectura que prioriza lo guardado con carga provisoria de ejemplos» pasa a describir la carga inicial consolidada: siembra en el primer inicio (las tres claves), respeto de claves presentes, conservación de contenido ilegible, ausencia de duplicados al reabrir y degradación ante fallo de escritura de la siembra. Las lecturas siguen sin siembra.

## Impact

- `js/almacen.js`: se agrega `inicializar()` (aditivo; las firmas existentes no cambian). `js/paginas/*.js` (los cinco scripts) reciben una llamada al inicio, dentro de la función envolvente. `tests/almacen.test.js` crece con los escenarios nuevos.
- `README.md`: se completa con las secciones faltantes. Ningún cambio de HTML, CSS ni lógica de negocio.
- Sin dependencias, sin migración de datos: las claves ya guardadas se conservan tal cual.
- Los 146 tests existentes deben seguir verdes: `inicializar()` no altera los contratos de lectura ni de alta.
- Fuera de alcance: cambios de lógica de negocio, de CSS o de HTML (salvo lo mínimo si un hallazgo lo exigiría — en este cambio, ninguno), edición/borrado de registros y sincronización entre pestañas.
- Trazabilidad: `CHANGES.md` C-06; US-015 a US-017; RN-PE-01 a RN-PE-03 y RN-GL-06 a RN-GL-08. Dependencias: C-05 y C-02 archivados. La propuesta no ejecuta implementación ni declara casos manuales aprobados.
