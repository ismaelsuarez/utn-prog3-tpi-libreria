# Tasks

## 1. Armazón del proyecto

- [x] 1.1 Crear las carpetas `css/`, `js/paginas/` y `recursos/`, y los archivos vacíos `css/base.css`, `css/disposicion.css` y `css/componentes.css`; verificar con `fd . css js recursos` que existen las tres hojas y las carpetas
- [x] 1.2 Crear `index.html` con el armazón común (D1, D12): `lang="es"`, UTF-8, `viewport`, `title` con vista y librería, enlaces a las tres hojas de estilo, `header` con el nombre de la librería, `nav` con los cinco enlaces en el orden fijo, `main` con un único `h1` y `footer` con integrantes y materia; verificar abriéndolo desde `file://` que se muestra sin errores en consola
- [x] 1.3 Crear `libros.html`, `clientes.html`, `ventas.html` e `historial.html` copiando el armazón, con su `title`, su `h1` y `aria-current="page"` en el enlace propio; verificar con `rg -c 'aria-current="page"' *.html` que cada archivo tiene exactamente una coincidencia y con `rg -c '<h1' *.html` que cada uno tiene un único `h1`
- [x] 1.4 Comprobar que el bloque `nav` es idéntico en las cinco páginas salvo `aria-current`; verificar comparando los cinco bloques sin ese atributo y confirmando que no hay diferencias
- [x] 1.5 Recorrer la navegación completa desde cada página; verificar que los cinco enlaces abren la vista correcta en las cinco páginas (25 enlaces) y que la vista actual queda indicada

## 2. Vista Catálogo y filtro por título

- [x] 2.1 En `index.html`, agregar el formulario de búsqueda (`form-busqueda`, `busqueda-titulo` con su etiqueta) y la lista `lista-catalogo` con al menos seis tarjetas de ejemplo (D3, D11), una sin género con «Sin clasificar» y una con dos autores; verificar que cada tarjeta muestra título, ISBN, editorial, género, autores y precio con dos decimales, cada dato con su nombre
- [x] 2.2 Agregar los mensajes `catalogo-vacio` y `catalogo-sin-resultados` con el atributo `hidden` y la plantilla `plantilla-tarjeta-libro` con los atributos `data-campo` de D9; verificar que la estructura de la plantilla coincide con la de las tarjetas de ejemplo y que ningún mensaje se ve al abrir la página
- [x] 2.3 Crear `js/paginas/catalogo.js` como script clásico cargado con `defer` (D8) que filtra las tarjetas por título al escribir; verificar a mano los cuatro casos de la especificación: parte del título en mayúsculas, texto con espacios en los extremos, búsqueda vacía y texto inexistente con su mensaje
- [x] 2.4 Verificar con `rg -n 'type="module"|import |export |innerHTML|fetch\(' js index.html` que no hay coincidencias y que la consola no registra errores al usar el buscador

## 3. Vista Libros

- [x] 3.1 En `libros.html`, crear el formulario `form-libro` con `novalidate` (D7) y los campos título, ISBN, precio, editorial y género con sus etiquetas, la opción «Sin clasificar» en género y el botón «Registrar libro»; verificar que al hacer clic en cada etiqueta el foco pasa a su campo
- [x] 3.2 Agregar el `fieldset` de autores con `legend` y una casilla por autor de ejemplo (D6), y la plantilla `plantilla-opcion-autor`; verificar con el teclado que se pueden marcar y desmarcar varias casillas
- [x] 3.3 Agregar el lugar de error de cada campo (`error-` más el `id` del campo) asociado con `aria-describedby`, y las regiones `mensaje-estado` y `mensaje-error` junto al formulario; verificar con `rg -o 'aria-describedby="[^"]+"' libros.html` que cada valor corresponde a un `id` existente y que ninguna región muestra texto al abrir la página
- [x] 3.4 Agregar la tabla `tabla-libros` dentro de un contenedor `tabla-contenedor`, con `caption`, encabezados con `scope="col"`, cuerpo `filas-libros` con filas de ejemplo, el mensaje `libros-vacio` oculto y la plantilla `plantilla-fila-libro`; verificar que las columnas son título, ISBN, editorial, género, autores y precio
- [x] 3.5 Marcar el formulario como maqueta con un texto visible (D10); verificar que la marca se lee junto al formulario

## 4. Vista Clientes

- [x] 4.1 En `clientes.html`, crear el formulario `form-cliente` con `novalidate`, los campos nombre completo y email (`type="email"`) con sus etiquetas, sus lugares de error, las regiones de mensajes y el botón «Registrar cliente»; verificar que no existe un campo de apellido y que cada etiqueta lleva el foco a su campo
- [x] 4.2 Agregar la tabla `tabla-clientes` con `caption`, encabezados, cuerpo `filas-clientes` con tres clientes de ejemplo, el mensaje `clientes-vacio` oculto y la plantilla `plantilla-fila-cliente`; verificar que las columnas son nombre completo y email
- [x] 4.3 Marcar el formulario como maqueta; verificar que la marca es visible

## 5. Vista Ventas

- [x] 5.1 En `ventas.html`, crear `form-venta` con la lista `venta-cliente`, la lista `venta-libro`, el campo `venta-cantidad` (`type="number"`, `min="1"`, `step="1"`) y el botón `boton-agregar-renglon`, todos con etiqueta o texto descriptivo, más las regiones de mensajes; verificar que cada control es alcanzable con el teclado y tiene nombre
- [x] 5.2 Agregar la tabla `tabla-renglones` con `caption`, encabezados libro, cantidad, precio unitario y subtotal, cuerpo `filas-renglones` con los dos renglones de ejemplo de D11, un control de cantidad y un botón «Quitar» por renglón identificados con su libro, el mensaje `renglones-vacio` oculto y la plantilla `plantilla-fila-renglon` con `data-accion="quitar-renglon"`; verificar que los subtotales de ejemplo son 3000,00 y 2000,00
- [x] 5.3 Agregar el resumen con `venta-total` y el botón `boton-confirmar-venta`; verificar que el total de ejemplo es 5000,00 con dos decimales
- [x] 5.4 Marcar como maqueta los controles de la venta; verificar que la marca es visible

## 6. Vista Historial

- [x] 6.1 En `historial.html`, agregar la tabla `tabla-ventas` con `caption`, encabezados identificador, fecha, cliente y total, cuerpo `filas-ventas` con una venta de ejemplo y su botón «Ver detalle» (`data-accion="ver-detalle"`) identificado con la venta, el mensaje `ventas-vacio` oculto y la plantilla `plantilla-fila-venta`; verificar que no hay controles para editar ni eliminar
- [x] 6.2 Agregar la sección `detalle-venta` con `detalle-venta-titulo`, la tabla de renglones con cuerpo `filas-detalle`, `detalle-total` y la plantilla `plantilla-fila-detalle` (D5); verificar que el detalle de ejemplo identifica la venta y muestra libro, cantidad, precio unitario, subtotal y total
- [x] 6.3 Marcar el detalle como maqueta; verificar que la marca es visible

## 7. README inicial y documentación del proyecto

- [x] 7.1 Crear `README.md` con integrantes, pasos para abrir `index.html` sin npm, navegación entre vistas, lista de pantallas que son maqueta y lista de interacciones que ya funcionan (filtro por título); verificar siguiendo los pasos del README en una carpeta copiada que el proyecto se abre como se describe
- [x] 7.2 Actualizar `knowledge-base/10_preguntas_abiertas.md` (PA-09 y PA-12 resueltas) y `knowledge-base/09_decisiones_y_supuestos.md` (decisiones D2 a D7 y D9 de este change; SU-04 confirmado); verificar que ambos archivos remiten a este change
- [x] 7.3 Actualizar `CHANGES.md`: el Catálogo pasa de tabla a tarjetas en el alcance de C-01, y se marca C-01 según corresponda; verificar con `rg -n 'tabla con título, ISBN' CHANGES.md` que ya no describe el Catálogo como tabla

## 8. Verificación de integración

- [x] 8.1 Verificar con `rg -n 'https?://|//cdn|@import' *.html css js` que ninguna página ni hoja de estilo referencia recursos externos
- [x] 8.2 Verificar que todos los `id` de D9 existen en su página y que no hay `id` duplicados dentro de un mismo archivo, listándolos con `rg -o 'id="[^"]+"' <archivo>` y comparando contra la tabla del diseño
- [x] 8.3 Verificar que todo `for` de una etiqueta corresponde a un `id` existente en la misma página y que todo campo tiene etiqueta
- [x] 8.4 Abrir las cinco páginas desde `file://` en una copia del proyecto sin conexión a Internet; verificar que se muestran completas, que la consola no registra errores y que se pueden recorrer por teclado en un orden coherente
