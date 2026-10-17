# Design

## Context

Ver [proposal.md](proposal.md) para motivación y alcance. Se requiere diseño porque el cambio atraviesa lógica pura, almacén, dos páginas e instantáneas persistidas.

Evidencia de la exploración:
- `js/almacen.js` ya concentra almacenamiento y dispone de `leerLista`, `escribirLista` y `siguienteId`; `obtenerVentas` devuelve `[]` y `agregarVenta` es un stub. Sus altas existentes asignan el ID y devuelven una copia.
- `js/interfaz.js` proporciona mensajes, vaciado de nodos y `formatearImporte`. Las páginas contienen plantillas y enganches `id`/`data-*` reutilizables; las filas de Ventas repiten `data-campo="libro"` en varios nodos.
- `js/logica/libros.js` no limita la escala decimal del precio y no rechaza explícitamente infinitos. C-05 no cambia esa validación: comprueba que los valores usados en una venta sean utilizables.
- Los specs vigentes describen la maqueta y los contratos del almacén para libros/clientes. Los deltas agregan los comportamientos operativos sin quitar requisitos previos.

## Goals / Non-Goals

**Goals:** separar cálculo determinista de efectos; conservar las firmas públicas del almacén; garantizar que importe mostrado, confirmado y consultado sea el mismo; permitir pruebas sin navegador y verificación real de la interacción.

**Non-Goals:** migrar libros/clientes, cambiar sus reglas, agregar edición de ventas, resolver sincronización entre pestañas, persistir borradores o implementar la política global de recuperación/siembra de C-06.

## Decisions

### D1 — Lógica pura y fronteras de prueba

`js/logica/ventas.js` expone mediante `Libreria.ventas` y exportación dual operaciones de validación, agregado/acumulación, cambio y quitado de renglones, cálculo y `construirVenta`. Recibe los datos necesarios; no consulta almacén, DOM ni reloj. Las operaciones devuelven nuevos valores y errores descriptivos, reutilizando el patrón `{ campo, mensaje }` cuando corresponda. La página mantiene el borrador.

Alternativa descartada: cálculos dentro de eventos DOM, porque mezcla efectos y dificulta probar las reglas. Las fronteras de prueba son la API pública de lógica y la API pública del almacén, no sus helpers privados. Antes de escribir pruebas en apply se confirma esta delimitación con el usuario, conforme a la skill TDD.

### D2 — Un renglón por libro

Decisión confirmada: agregar de nuevo un libro suma cantidades. La clave del renglón es `libroId`; cambiar cantidad reemplaza la cantidad de esa fila y quitarla elimina únicamente esa fila del borrador. Todas las operaciones recalculan los importes a través de las mismas funciones. La suma debe seguir siendo un entero positivo seguro.

Alternativa descartada: rechazar duplicados, admitida por la consigna pero no elegida. Mientras el usuario escribe una cantidad inválida se conserva el último estado calculable, se marca el control y se bloquea la confirmación; no se confirma silenciosamente el valor anterior. Corregir o quitar esa fila resuelve el error.

### D3 — Redondeo decimal explícito antes de multiplicar

Decisión confirmada: mitades hacia arriba al centavo del precio unitario, sin modificar catálogo. El precio `1500,125` produce unitario `1500,13`; dos unidades producen `3000,26`. El mismo valor alimenta pantalla, cálculo e instantánea.

Convertir la representación decimal canónica del número del catálogo a centavos mediante manipulación decimal: separar signo, dígitos, fracción y exponente si existe; desplazar el punto; conservar dos decimales y aumentar un centavo si el siguiente dígito es 5 o mayor. Convertir el entero decimal resultante solo tras comprobar su rango seguro. Así `1.005` produce 101 centavos; no depender de `Math.round(precio * 100)` ni de un ajuste universal con `Number.EPSILON`.

Multiplicar cantidades y sumar subtotales en centavos enteros, comprobando que cantidades y resultados sean seguros. Rechazar precios no numéricos, no finitos o no positivos antes de convertir. El redondeo acordado también determina el resultado de precios positivos menores a un centavo; no imponer un mínimo nuevo al catálogo. Convertir a números en unidades monetarias al construir el objeto persistido, manteniendo el modelo existente. Reutilizar `formatearImporte` únicamente para presentación, no para cálculos.

Alternativas descartadas: redondear solo el total (puede no coincidir con lo mostrado por renglón), multiplicación binaria directa o cambiar todos los precios almacenados (fuera de alcance). El algoritmo opera sobre la representación decimal disponible: no puede recuperar precisión ya perdida antes de recibir el número.

### D4 — Instantánea y autoridad única del identificador

La página proporciona a `construirVenta` el cliente, los renglones válidos y una fecha ISO capturada al confirmar. Esta función pura produce los datos de venta con copias del cliente y cada renglón, sin ID persistido. `agregarVenta(venta)` asigna el ID mediante `siguienteId(lista, "ven")`, persiste y devuelve la venta completa. De esta forma el requisito de venta final con identificador se cumple sin dos generadores ni firmas nuevas del almacén.

Formato final: `{id, fecha, cliente: {id, nombreCompleto, email}, renglones: [{libroId, titulo, isbn, cantidad, precioUnitario, subtotal}], total}`. El ID recibido desde fuera no reemplaza el asignado por el almacén. Se usan copias explícitas, no referencias al catálogo ni al borrador. No hace falta congelar objetos globales: el aislamiento de copias y la ausencia de API de edición conservan el contrato.

Alternativa descartada: asignar IDs en la página o resolver títulos/precios al abrir Historial, porque rompe autoridad única o CM-6.

### D5 — Persistencia específica de ventas y compatibilidad

Agregar `CLAVE_VENTAS` y `copiarVenta`. Reutilizar los helpers existentes donde mantienen sus contratos, sin cambiar la semántica de libros/clientes. La lectura de ventas no siembra; una clave ausente equivale a `[]`. El alta agrega al final y escribe una vez la lista completa. Las copias incluyen cliente y todos los renglones en entrada, salida y lecturas.

Mantener reserva en memoria cuando Node carece de almacenamiento. En navegador, una indisponibilidad o excepción de almacenamiento para ventas debe propagarse como fallo, no como éxito de reserva volátil. Aislar esa comprobación en la ruta de ventas: no modificar el fallback existente de libros/clientes. No envolver `getItem`/`setItem` en un catch que convierta el fallo en una lista vacía y luego sobrescriba ventas. El lector de ventas no debe confundir contenido ilegible con ausencia de clave: comunica el error sin repararlo ni sobrescribirlo. La estrategia global de recuperación sigue en C-06.

La página captura el error y conserva el borrador. Revalidar antes de guardar, construir una sola venta y limpiar únicamente tras el retorno satisfactorio. Un segundo envío con el formulario limpio falla la validación; no se requiere un sistema de transacciones o idempotencia remota.

Alternativa descartada: garantizar persistencia mediante memoria en el navegador, porque esa memoria no viaja entre páginas. No agregar dependencias ni otro backend.

### D6 — Vistas, fecha y accesibilidad

Cargar scripts clásicos con `defer` en orden de dependencia. Reemplazar datos de maqueta por selectores y filas reales; reutilizar las plantillas y completar todas las coincidencias de `data-campo="libro"`. Usar `textContent`, `hidden`, controles nativos, errores asociados y foco visible. No recrear la fila que se está editando de manera que se pierda el foco en cada pulsación; mantener o restaurar foco tras quitar filas.

Historial consume únicamente `obtenerVentas`. Como supuesto menor, conserva el orden de registro del almacén, sin agregar filtros u ordenación solicitables. El detalle comienza oculto, reemplaza sus filas al elegir venta y enfoca su encabezado con foco programático. El botón incluye el identificador en su nombre accesible; la tabla mantiene su contenedor desplazable.

Decisión confirmada: mostrar `dd/mm/aaaa HH:mm`, reloj de 24 horas, hora local; usar componentes locales de la fecha con relleno de ceros para que no dependa del formato regional predeterminado. No modificar el ISO guardado ni reinterpretar UTC como fecha local literal. La función de formato puede permanecer en la página de Historial, sin ampliar utilidades compartidas innecesariamente.

Alternativas descartadas: fecha visible en UTC, otra página de detalle o leer nuevamente el catálogo para mostrar ventas pasadas.

### D7 — Comprobación incremental

Antes de cambiar producción, registrar baseline con `node --test tests/*.test.js`. Aplicar ciclos verticales RED, GREEN, triangulación y refactor con al menos caso válido y caso límite por comportamiento, sin escribir todos los tests de una vez. Sustituir el test que exige el error del stub de ventas por pruebas del nuevo contrato, manteniendo las regresiones de libros/clientes.

Cubrir CM-4, CM-5, el redondeo acordado y `1.005`, rangos inseguros, copias independientes y almacenamiento simulado mediante su interfaz pública. Comprobar por separado acceso bloqueado en contexto de navegador y ausencia de almacenamiento en Node, sin crear dependencias. El DOM se valida en navegador: selectores CM-2/3, CM-4/5, CM-6 sobre copia, navegación y persistencia, errores, 320/1280 px y teclado/foco. Registrar resultados reales, incluyendo pendientes o fallos; no confundir pruebas automatizadas con casos manuales.

## Risks / Trade-offs

- [Precio histórico incorrecto por redondeo] → pruebas con resultados literales y cálculo entero antes de construir la instantánea.
- [Cambiar helpers compartidos rompe C-04] → preferir extensión específica de ventas; regresiones de lectura y alta de libros/clientes y comparación diferencial si se toca una ruta compartida.
- [Almacenamiento bloqueado o ilegible] → error explícito sin borrar borrador ni sobrescribir datos; no implementar recuperación global en este cambio.
- [Dos pestañas escriben simultáneamente] → no se promete sincronización multipestaña; el alcance sigue siendo un operador y una venta a la vez.
- [Pérdida de foco al renderizar] → actualización acotada de filas y pruebas manuales de teclado con controles reales.
- [Confusión entre planificación y entrega] → todas las tareas comienzan pendientes; esta fase no ejecuta producción ni declara CM aprobados.

## Migration Plan

No hay migración de datos existentes: se incorpora la clave de ventas solo al primer registro. Mantener los datos de libros/clientes sin modificación. Durante apply integrar lógica, almacén y páginas con sus comprobaciones; luego documentar los resultados. Si se revierte la funcionalidad, conservar `libreria.ventas` sin borrarla: la versión previa no la usa. No realizar rollback ni borrar datos como parte de esta propuesta.
