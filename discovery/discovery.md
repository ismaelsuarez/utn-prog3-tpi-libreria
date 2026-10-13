# Discovery — TPI: frontend de una librería

**Fecha**: 2026-10-13
**Materia**: Programación III — Tecnicatura Universitaria en Programación a Distancia (UTN)
**Fuentes investigadas**: 1 documento (`docs/Repaso Primer Parcial.pdf`, consigna del TPI). Sin competidores ni scraping.
**Integrantes**: Avalos Pablo, Blangetti Sofia, Suarez Ismael

## 1. Problema que resuelve

Una librería necesita presentar su catálogo y registrar libros, clientes y
ventas. El trabajo desarrolla exclusivamente el frontend: los datos y las
operaciones se simulan en el navegador, sin API, base de datos ni servidor.
Toma como contexto el TP backend de Programación III del otro docente.

## 2. Usuarios / roles

- **Operador de la librería**: consulta el catálogo, registra libros y
  clientes, arma ventas y consulta el historial. No hay inicio de sesión ni
  distinción de roles.
- **Docente evaluador**: revisa el funcionamiento observado y la
  correspondencia entre interfaz, datos y documentación (README).

## 3. Casos de uso

1. Como operador, quiero buscar libros por título para encontrar un ejemplar
   del catálogo sin recorrer toda la lista.
2. Como operador, quiero registrar un libro con su editorial, género y autores
   para que aparezca en el catálogo y en la selección de ventas.
3. Como operador, quiero registrar un cliente con nombre completo y email para
   poder asignarle ventas.
4. Como operador, quiero componer una venta con renglones, cantidades y total
   para confirmarla con importes correctos.
5. Como operador, quiero consultar el historial y el detalle de una venta para
   ver los valores con los que se confirmó.

## 4. Competidores / soluciones existentes

No aplica: es un trabajo práctico académico con alcance fijado por la
consigna. La única referencia de dominio es el TP backend de la misma materia.

## 5. Funcionalidades necesarias

Alcance decidido: **TPI completo (ejercicios 1 a 6, 100 puntos)**. La Etapa 1
(maqueta) es el primer hito.

| Ejercicio | Contenido | Puntos |
|---|---|---|
| 1. Estructura y pantallas HTML | Vistas Catálogo, Libros, Clientes, Ventas e Historial; navegación clara; etiquetas semánticas; etiquetas asociadas a campos; tablas con encabezados; mensajes de lista vacía, búsqueda sin resultados y operación correcta o rechazada | 20 |
| 2. Presentación con CSS y uso adaptable | Identidad visual propia; CSS en archivos externos con clases reutilizadas; Flexbox o Grid; comprobación a 320 px y 1280 px sin desplazamiento horizontal de la página; foco visible; errores expresados con texto | 20 |
| 3. Datos locales, catálogo y filtro | Arrays y objetos con identificadores estables (al menos 6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes); catálogo generado por JavaScript; filtro por título | 15 |
| 4. Alta de libros y clientes | Formularios con validación, selectores generados desde los datos, actualización de listados y opciones sin recargar | 15 |
| 5. Venta simulada e historial | Composición de renglones, cálculos, confirmación, historial con detalle e inmutabilidad | 20 |
| 6. Persistencia, verificación y documentación | `localStorage` para libros, clientes y ventas; casos manuales registrados; README | 10 |

## 6. Funcionalidades opcionales

Ninguna solicitada. Quedan explícitamente fuera de alcance:

- Editar o eliminar libros, clientes o ventas.
- Altas, bajas y modificaciones de editoriales, géneros o autores.
- Gestión de stock, cobros y facturación fiscal.
- Obtención de datos con `fetch`, inicio de sesión real.
- Pantalla para editar precios.

## 7. Reglas de negocio

**Libros**

- Título e ISBN obligatorios.
- ISBN único en el conjunto local, comparado sin espacios ni guiones. No se
  valida el dígito de control.
- Precio numérico y mayor que cero.
- Editorial obligatoria y existente en los datos locales.
- Al menos un autor; todos los seleccionados deben existir.
- Género opcional; si se asigna, debe existir. La ausencia se muestra como
  «Sin clasificar».

**Clientes**

- Nombre completo y email obligatorios (sin campo de apellido separado).
- Email con formato válido.
- Email único, comparado sin espacios exteriores y sin distinguir mayúsculas
  de minúsculas.

**Catálogo**

- El filtro por título ignora mayúsculas y minúsculas, busca coincidencias
  parciales y recorta espacios de los extremos.
- Búsqueda vacía muestra todo el catálogo; búsqueda sin coincidencias muestra
  un mensaje claro.

**Ventas**

- Requiere un cliente existente y al menos un renglón.
- Cantidad entera y mayor que cero.
- Sin libros repetidos en una misma venta: se modifica la cantidad del renglón
  existente o se informa el duplicado.
- Antes de confirmar se pueden cambiar cantidades y quitar renglones.
- Subtotal = cantidad × precio; total = suma de subtotales; importes con dos
  decimales.
- Al confirmar se registran identificador, fecha, cliente, renglones y total.
- El precio unitario se copia al renglón como valor histórico, junto con los
  datos descriptivos necesarios para leer la venta. No se vuelve a leer del
  catálogo.
- Las ventas confirmadas no se editan ni eliminan.
- La confirmación limpia el formulario y muestra un mensaje de resultado.

**Generales**

- El envío de formularios se controla con `preventDefault`; los errores se
  muestran cerca del formulario; el registro se agrega solo si todas las
  comprobaciones pasan.
- Los datos escritos por usuarios se insertan en el DOM como texto.
- En el primer inicio se cargan los ejemplos; en los siguientes se recuperan
  los registros guardados sin duplicar los datos iniciales.

## 8. Integraciones

Ninguna. El único almacenamiento es `localStorage` del navegador.

## 9. Restricciones

- Únicamente HTML, CSS y JavaScript nativos.
- Sin librerías, frameworks ni CDNs de CSS o JavaScript. Estilos, scripts,
  tipografías e imágenes se incluyen localmente en el proyecto.
- `index.html` es la entrada y se abre en el navegador sin npm ni servidor.
- La entrega no incluye dependencias instaladas ni herramientas de
  compilación.
- Entrega: carpeta o archivo comprimido con `index.html`, los demás HTML,
  carpetas de CSS, JavaScript y recursos locales, y `README.md`.
- El README identifica a los integrantes y contiene: pasos para abrir el
  proyecto, navegación entre vistas, funcionalidades implementadas y
  pendientes, ubicación de los datos iniciales, funcionamiento y límites de
  `localStorage`, resultados de los casos manuales y procedencia de imágenes
  ajenas.
- Se valora código legible, nombres comprensibles, funciones acotadas y
  separación entre estructura, estilos y comportamiento.

**Decisiones del equipo**

- **Vistas**: varias páginas HTML, una por vista.
- **Verificación**: tests automatizados con `node --test` (runner integrado de
  Node, sin dependencias) para la lógica pura; la carpeta de tests se excluye
  de la entrega. Los ocho casos manuales de la consigna se ejecutan y
  registran igualmente en el README.
- **Identidad visual**: definida localmente con CSS propio, sin librerías
  externas.
- **Repositorio git**: se crea una vez armada al menos la estructura del
  proyecto y el `README.md`.
- **Organización SDD**: en lo posible, seis changes de OpenSpec, uno por cada
  consigna del TPI, cada uno recorrido con explore y propose:
  1. Estructura y pantallas HTML
  2. Presentación con CSS y uso adaptable
  3. Datos locales, catálogo y filtro
  4. Alta de libros y clientes
  5. Venta simulada e historial
  6. Persistencia, verificación y documentación

## 10. Riesgos

- **Módulos ES bajo `file://`**: los navegadores bloquean
  `<script type="module">` cuando el HTML se abre directamente desde el disco.
  Como la consigna exige abrir `index.html` sin servidor, se usan scripts
  clásicos, y la lógica debe poder cargarse tanto en el navegador como en los
  tests de Node.
- **Estado entre páginas**: con varias páginas HTML no hay memoria compartida;
  todo el estado entre vistas depende de `localStorage`. Los ejercicios 3 a 5
  se desarrollan antes que la persistencia del ejercicio 6, por lo que la
  capa de datos debe pensarse para ese orden.
- **Duplicación de encabezado y navegación** en cada HTML, sin plantillas.
- **Precio histórico**: es la comprobación más fácil de romper. El renglón
  debe guardar una copia del precio y de los datos descriptivos, nunca una
  referencia al catálogo.
- **Carga inicial**: distinguir «primer inicio» de «almacenamiento vacío» para
  no duplicar los ejemplos ni las ventas al recargar.
- **Casos manuales**: el README registra el resultado realmente observado;
  los tests automatizados no los reemplazan. No se indica una prueba como
  aprobada sin ejecutarla.
- **Supuesto sin probar**: que una consigna equivale a un change autocontenido.
  El ejercicio 1 ya debe contemplar campos y estados que usan los ejercicios
  3 a 5, y el 6 atraviesa a todos los anteriores.

## 11. Preguntas abiertas

- **Fechas y canal de entrega**: los comunica el docente por separado. Sin
  definir todavía.
- **Identidad visual concreta**: paleta de colores y tipografía local aún no
  elegidas (se resuelve en el change del ejercicio 2).
- **Modalidad de trabajo del grupo**: reparto de tareas entre los tres
  integrantes sin definir.
