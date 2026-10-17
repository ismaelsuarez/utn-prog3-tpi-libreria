# Tasks

Plan de C-05; esta lista no acredita implementación. Referencias: [diseño](design.md), [ventas](specs/ventas/spec.md), [historial](specs/historial/spec.md) y [datos locales](specs/datos-locales/spec.md).

Disciplina para cada comportamiento de lógica/almacén: prueba pública mínima con RED observado, implementación mínima hasta GREEN, triangulación con entradas distintas y refactor con pruebas verdes. No escribir todas las pruebas antes de implementar. Registrar comando, resultado y casos; como mínimo un caso válido y un límite por comportamiento. La tabla de evidencia de apply incluirá tarea, archivo, capa, baseline, RED, GREEN, triangulación y refactor. DOM y accesibilidad se comprueban en navegador, sin inventar RED automatizado ni instalar dependencias.

## 1. Fronteras y lógica de venta

- [x] 1.1 Confirmar antes de escribir tests las fronteras públicas propuestas (API de `Libreria.ventas` y API del almacén), registrar baseline con `node --test tests/*.test.js` y detenerse si existen fallos previos, sin corregirlos dentro de C-05.
- [x] 1.2 Crear `js/logica/ventas.js` y `tests/ventas.test.js` mediante TDD para precios redondeados al centavo según D3; verificar `1500.125 -> 1500.13`, `1.005 -> 1.01`, `10.124 -> 10.12`, precios positivos inferiores a un centavo, exponentes decimales y rechazo de no finitos, sin alterar catálogo, con `node --test tests/ventas.test.js`.
- [x] 1.3 Implementar mediante TDD agregado y acumulación por libro existente; verificar cantidades vacías, cero, negativas y decimales, identificador inexistente, `2 + 1 = 3` en una sola fila y preservación de entradas ante rechazo con `node --test tests/ventas.test.js`.
- [x] 1.4 Implementar mediante TDD cambio y quitado de renglones y cálculos comunes; verificar 2 por 1500 más 1 por 2000 igual a 5000, 3 por 0.10 más 0.20 igual a 0.50, vaciado final y rechazo de cantidades/acumulaciones/subtotales/totales inseguros con `node --test tests/ventas.test.js`.
- [x] 1.5 Implementar mediante TDD validación final y `construirVenta` pura con fecha suministrada; verificar cliente inexistente o ausente, venta vacía, cantidades/libros inválidos, formato completo sin ID asignado por lógica e independencia tras mutar cliente, catálogo y borrador con `node --test tests/ventas.test.js`.
- [x] 1.6 Documentar brevemente en el módulo las entradas, salidas y límites monetarios de su API; verificar por lectura que coincide con los tests y ejecutar `node --test tests/ventas.test.js` tras refactor, conservando scripts clásicos, envolvente y exportación dual.

## 2. Almacén de ventas

- [x] 2.1 Sustituir mediante TDD la prueba del stub de `agregarVenta` en `tests/almacen.test.js`; implementar lectura y alta bajo `libreria.ventas`, verificando clave ausente sin siembra, primera/segunda venta, conservación de registros y ausencia de escrituras sobre otras claves con `node --test tests/almacen.test.js`.
- [x] 2.2 Implementar mediante TDD identificadores `ven-XX` mediante la autoridad del almacén y copias profundas acotadas; verificar `ven-01`, `ven-02`, salto sobre máximo `ven-07`, devolución del ID e independencia de cliente/renglones en entradas, respuestas y lecturas con `node --test tests/almacen.test.js`.
- [x] 2.3 Cubrir mediante TDD almacenamiento de ventas inaccesible, errores de lectura/escritura y datos ilegibles sin sobrescritura; verificar fallo explícito en contexto navegador y éxito en memoria para Node sin almacenamiento, sin cambiar las rutas de libros/clientes, con `node --test tests/almacen.test.js`.
- [x] 2.4 Actualizar el contrato documentado en `js/almacen.js` y la descripción pertinente del README sobre la clave de ventas y sus límites; verificar las regresiones de libros/clientes con `node --test tests/almacen.test.js`. Si cambió una ruta compartida, comparar sus resultados previos y actuales sobre copias aisladas fuera del repositorio y registrar toda diferencia.

## 3. Página de composición y confirmación

- [x] 3.1 Crear `js/paginas/ventas.js` y conectar scripts clásicos en `ventas.html`, retirar filas/opciones y aviso de maqueta y generar opciones desde el almacén; verificar en navegador borrador vacío, total cero y selección de nuevas altas de libro/cliente (mitades de CM-2/CM-3 pendientes de C-04).
- [x] 3.2 Conectar agregado, acumulación, cambio y quitado con la lógica pura y las plantillas; verificar en navegador CM-4 y CM-5, todos los textos del libro en cada fila, corrección de cantidades inválidas y bloqueo de confirmación mientras exista un control inválido, sin perder el foco al editar.
- [x] 3.3 Conectar confirmación, fecha ISO e instantánea con `agregarVenta`; verificar en navegador limpieza y mensaje tras éxito, segundo envío vacío sin duplicado y conservación de cliente/renglones con error explícito ante fallo de almacenamiento.
- [x] 3.4 Completar etiquetas/errores asociados, `aria-invalid`, foco al primer error y mensajes de estado; verificar Ventas a 320 px y 1280 px con teclado y foco visible, sin desplazamiento horizontal de página, ajustando solo el CSS necesario para los controles reales.
- [x] 3.5 Actualizar la sección de Ventas y sus resultados en README; verificar que explica repetidos acumulados y redondeo previo del unitario, distingue pruebas de lógica de casos manuales y registra únicamente resultados efectivamente observados, con fallos o pendientes explícitos.

## 4. Historial y conservación de instantáneas

- [x] 4.1 Crear `js/paginas/historial.js`, conectar scripts clásicos y sustituir la maqueta en `historial.html`; verificar en navegador lista vacía, error de lectura, listado real en orden de registro y ausencia de controles para editar o borrar.
- [x] 4.2 Implementar presentación local `dd/mm/aaaa HH:mm`; verificar en navegador ceros iniciales, reloj de 24 horas y un caso de cambio de día UTC/local con zona observada, comprobando que no cambia el ISO almacenado.
- [x] 4.3 Implementar selección y reemplazo de detalle exclusivamente desde la venta guardada; verificar dos ventas distintas sin filas mezcladas, identificación accesible, foco en el detalle y CM-6 en una copia de prueba con modificación exclusiva del precio del catálogo.
- [x] 4.4 Verificar Historial a 320 px y 1280 px, teclado, foco visible y desplazamiento propio de tablas; actualizar README con recorrido de consulta, ubicación de `libreria.libros`/`libreria.ventas` para CM-6 y resultados reales, sin declarar aprobada la revisión general de C-06.

## 5. Integración y cierre de la implementación

- [x] 5.1 Ejecutar `node --test tests/*.test.js` y contrastar el resultado con el baseline; verificar que pasan las pruebas del nuevo contrato sin perder regresiones existentes y registrar todos los fallos, omisiones o pendientes.
- [x] 5.2 Ejecutar recorrido integrado alta de libro/cliente, venta, historial y recarga; verificar CM-2/3/4/5, conservación y no duplicación de las ventas creadas, coincidencia de unitario mostrado/guardado e independencia histórica ya comprobada en CM-6, sin convertirlo en la validación global de CM-7.
- [x] 5.3 Revisar los deltas y las reglas duras contra los archivos cambiados; verificar ausencia de `var`, módulos ES, dependencias, acceso a almacenamiento fuera del almacén y datos de usuario por `innerHTML`, más `openspec validate venta-simulada-e-historial --strict`; registrar evidencia de cierre por requisito, sin marcar checks manuales no ejecutados.

## Workflow follow-up

- Presentar la implementación y sus verificaciones para revisión; el archive requiere su flujo explícito y no es una tarea de implementación.
- C-06 conserva PA-04/PA-05, consolidación de siembra/recuperación, los casos generales CM-1 a CM-8 y preparación de entrega. Mantener sus pendientes, incluidos los controles responsivos anteriores de Libros/Clientes; las verificaciones de C-05 no los dan por terminados.

## Evidencia de implementación

Fronteras confirmadas por el usuario: API pública de `Libreria.ventas` y API pública del almacén; no helpers privados. Baseline previo: `node --test tests/*.test.js`, 70 aprobadas, 0 fallidas. Suite integrada: 146 aprobadas, 0 fallidas. Pruebas focalizadas repetidas por el orquestador: 88 aprobadas (65 de ventas y 23 del almacén).

### TDD Cycle Evidence

| Tarea | Archivo / capa | Safety Net | RED observado | GREEN / triangulación | Refactor |
|---|---|---|---|---|---|
| 1.2 | `tests/ventas.test.js`, API pura | 70/70 global | Módulo ausente y precios inválidos aceptados | 17 casos: mitades, exponentes, subcentavos y no finitos | Conversión decimal privada |
| 1.3 | Mismo, API pura | Baseline conservado | Operación ausente, repetido creaba otra fila y cantidades inválidas aceptadas | 31 acumulados, con entradas intactas | Validación común |
| 1.4 | Mismo, API pura | Baseline conservado | Cambio/quita ausentes y resultados inseguros aceptados | 45 acumulados, referencias 5000 y 0,50 | Cálculo entero compartido |
| 1.5 | Mismo, API pura | Baseline conservado | Validación/construcción ausentes y datos inválidos aceptados | 65 acumulados, instantáneas independientes | Copias explícitas |
| 1.6 | Comentarios del módulo | 65/65 | No corresponde: documentación | 65/65 tras documentación y lectura de contrato | Sin cambio de comportamiento |
| 2.1 | `tests/almacen.test.js`, API almacén | 12/12 focalizadas | Nueva alta falla contra stub anterior | 12/12, luego 14/14 con segunda venta e identificadores | Sin refactor necesario |
| 2.2 | Mismo, API en contexto aislado | 14/14 | Mutación del cliente altera la venta almacenada | 15/15, luego 16/16 con mutación de lecturas | Copia específica |
| 2.3 | Mismo, almacenamiento simulado | 16/16 | JSON/estructura ilegibles y navegador sin almacenamiento | 23/23, lectura/escritura fallidas y reintento | Suite verde |

Los cuerpos de los seis helpers previos y las siete operaciones de libros/clientes/referencias del almacén se compararon con el baseline y permanecen idénticos. No fue necesario cambiar sus rutas compartidas. Los scripts nuevos y el almacén pasan `node --check`; `git diff --check` no informa errores.

### Navegador e integración

Comprobación del 2026-10-16 con Chrome 155 real mediante CDP, sobre copias y perfiles aislados abiertos por `file://`, sin servidor ni dependencias instaladas. Excepción TDD de DOM: recorridos de navegador observados, no RED automatizado inventado.

- Tareas 3.1–3.4: altas desde formularios disponibles para vender; cantidades inválidas, repetidos, cambio/quita, foco conservado, CM-4 y CM-5, redondeo, guardado fallido con borrador intacto, reintento y segundo envío vacío sin duplicar. Texto potencialmente HTML insertado como texto.
- Tareas 4.1–4.4: vacío/error de lectura, orden, dos detalles sin mezcla, fecha local con ceros y cambio de día UTC/local (zona observada America/Mendoza), ISO intacto, CM-6 y foco programático. Historial no consulta el catálogo.
- Ambas vistas a 320/1280 px: capturas examinadas, eventos reales Tab/Enter, foco visible y tablas con desplazamiento interno sin desbordamiento de página. No se realizó auditoría con lector de pantalla.
- Tarea 5.2: alta de libro a 1500,125 y cliente, navegación a Ventas, acumulación 2+1, cambio a 2, confirmación por 3000,26, consulta y recarga. Cambio exclusivo del precio del catálogo a 9999 no alteró la venta. Segunda venta de referencia por 5000; exactamente dos identificadores después de recargar.
- Tareas 2.4, 3.5 y 4.4: README actualizado con contratos, navegación, importes, límites y resultados. CM-2/CM-3 documentados como parciales; no se infieren validaciones de altas no recorridas. CM-7/CM-8 generales y pendientes de Libros/Clientes siguen en C-06.
- Tarea 5.3: revisión acotada de reglas duras en archivos cambiados; sin `var`, módulos ES, dependencias externas, `fetch` ni `innerHTML`; almacenamiento solo en `js/almacen.js`. `openspec validate --all --strict`: 10 elementos aprobados, 0 fallidos.

Risk: none — lógica y vistas nuevas, operaciones de ventas previstas y helpers/contratos existentes de libros y clientes conservados. No se migran ni eliminan datos. Este registro no equivale a revisión nativa ni autoriza archive, commit o publicación.
