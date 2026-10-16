# Proposal

## Why

Hasta ahora los formularios de Libros y Clientes son maquetas inoperantes: no validan nada, no guardan nada y los listados son filas fijas escritas a mano en el HTML. El ejercicio 4 (15 puntos) implementa el alta real de libros y clientes —validación de negocio, primera escritura de datos del usuario en `localStorage` y actualización del listado sin recargar—, que es lo que permite comprobar de extremo a extremo el Catálogo (C-03) y prepara la selección de ventas (C-05). Es el primer change que escribe datos del usuario, según DD-09.

## What Changes

- Se crea `js/logica/libros.js` con `validarLibro(datos, libros, catalogos)`, función pura que devuelve `[{campo, mensaje}]`: título vacío, ISBN vacío, ISBN ya existente (comparado con `normalizarIsbn`, sin validar dígito de control), precio no numérico, precio no mayor que cero, editorial vacía o desconocida, ningún autor, autor desconocido y género desconocido. El género es opcional: vacío o `null` no produce error y se guarda como `null` (RN-LI-01 a RN-LI-11).
- Se crea `js/logica/clientes.js` con `validarCliente(datos, clientes)`, función pura que devuelve `[{campo, mensaje}]`: nombre completo vacío, email vacío, formato inválido (regex simple tras `normalizarEmail`, SU-07/PA-11) y email ya registrado (comparado con `normalizarEmail`) (RN-CL-01 a RN-CL-04).
- Se modifica `js/almacen.js`: `obtenerLibros` y `obtenerClientes` leen primero `localStorage` (claves `libreria.libros` y `libreria.clientes`, SU-06) y solo si la clave falta o el JSON es inválido usan los ejemplos, sin sembrar al leer (carga provisoria; C-06 la endurece, PA-04/PA-05). `agregarLibro` y `agregarCliente` dejan de lanzar: asignan identificador nuevo (`lib-07`, `cli-04`…, esquema D1), copian los datos recibidos, escriben la lista completa actual y devuelven el registro almacenado; no validan ni normalizan (lo hace la página). `agregarVenta` sigue pendiente (C-05).
- Se crea `js/paginas/libros.js`: genera el selector de editorial, el de género (con primera opción «Sin clasificar», `value=""`) y las casillas de autores desde el almacén (RN-LI-11); re-renderiza `#filas-libros` desde `plantilla-fila-libro` y muestra `#libros-vacio` si no hay libros; intercepta el envío con `preventDefault`, limpia errores previos, valida, muestra un mensaje por campo en su slot (`#error-libro-<campo>`) y en `#mensaje-error` sin dar de alta, y en caso de éxito persiste, re-renderiza, limpia el formulario y muestra `#mensaje-estado` (RN-UI-01 a RN-UI-04). La página relee el almacén en cada envío para detectar duplicados de la misma sesión.
- Se crea `js/paginas/clientes.js` con el flujo equivalente para el alta y el listado de clientes.
- Se modifican `libros.html` y `clientes.html`: se agregan los `<script defer>` en orden de dependencia y se quitan las etiquetas «Maqueta» de los dos formularios (RN-GL-08). Las filas estáticas quedan como respaldo sin JavaScript y se reemplazan al ejecutar el script.
- Se agrega `tests/libros.test.js` y `tests/clientes.test.js` con un caso por cada rechazo y un alta válida (base de CM-2 y CM-3), y se actualiza `tests/almacen.test.js`: `agregarLibro`/`agregarCliente` ya no lanzan; quedan el identificador siguiente, la presencia en las lecturas y la mutabilidad del módulo al final del archivo.
- **BREAKING** (interno): `tests/almacen.test.js` deja de afirmar que `agregarLibro`/`agregarCliente` lanzan Error pendiente; el contrato de lectura del almacén prioriza ahora lo guardado en `localStorage` cuando existe.

## Capabilities

### New Capabilities

- (ninguna — las capacidades afectadas ya existen)

### Modified Capabilities

- `libros`: se agregan los requisitos de validación del alta (un error por campo, ISBN duplicado normalizado, género opcional), de selectores y casillas generados desde los datos locales, de listado generado desde el Almacén (antes era HTML fijo) y del efecto del alta (persistencia, actualización sin recargar, formulario limpio y mensaje de resultado).
- `clientes`: se agregan los requisitos de validación del alta (nombre vacío, email vacío, formato inválido, email repetido sin distinguir mayúsculas ni espacios exteriores) y del efecto del alta (persistencia, actualización sin recargar, formulario limpio y mensaje de resultado).
- `datos-locales`: se agrega la persistencia de libros y clientes en `localStorage` (claves `libreria.libros` y `libreria.clientes`), la lectura que prioriza lo guardado con carga provisoria desde los ejemplos, y la asignación de identificadores nuevos por el Almacén al registrar.

## Impact

- Archivos nuevos: `js/logica/libros.js`, `js/logica/clientes.js`, `js/paginas/libros.js`, `js/paginas/clientes.js`, `tests/libros.test.js`, `tests/clientes.test.js`.
- Archivos modificados: `js/almacen.js` (lectura priorizando `localStorage` + `agregarLibro`/`agregarCliente`), `libros.html` y `clientes.html` (carga de scripts, fin de la etiqueta «Maqueta»), `tests/almacen.test.js`.
- Sin tocar: `ventas.html`, `historial.html`, `README.md` (la explicación de «sin recargar» queda para C-06, IN-02) y `js/paginas/catalogo.js`.
- Interfaces que quedan fijas: la firma del Almacén no cambia (C-05 implementa `agregarVenta` sobre las mismas claves y el mismo patrón); `validarLibro` y `validarCliente` consumen `texto.js` de C-03 sin modificarlo.
- Cumple las reglas duras: sin librerías ni CDNs, sin `type="module"` (exportación dual), sin `package.json`, sin `fetch`, sin `innerHTML` con datos de usuario, sin `localStorage` fuera de `js/almacen.js`, sin DOM en `js/logica/`, sin `var` y sin edición ni borrado de registros. Se abre desde `file://`.
