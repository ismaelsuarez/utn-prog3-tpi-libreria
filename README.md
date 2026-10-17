# TPI: frontend de una librería

Trabajo Práctico Integrador de Programación III — Tecnicatura Universitaria en
Programación a Distancia (UTN). Unidad HTML, CSS y JavaScript.

Frontend de una librería ficticia que presenta su catálogo y registra libros,
clientes y ventas. Los datos y las operaciones se simulan en el navegador:
no hay servidor, base de datos ni API.

## Integrantes

- Avalos Pablo
- Blangetti Sofia
- Suarez Ismael

## Cómo abrir el proyecto

1. Descomprimir o copiar la carpeta del proyecto.
2. Abrir el archivo `index.html` con un navegador (doble clic sobre el archivo).

No requiere npm, instalación de dependencias, servidor ni conexión a Internet.
Solo usa HTML, CSS y JavaScript nativos, sin librerías, frameworks ni CDNs.

## Navegación entre vistas

Todas las páginas tienen la misma barra de navegación, que enlaza a las cinco
vistas e indica cuál es la vista actual.

| Vista | Archivo | Contenido |
|---|---|---|
| Catálogo | `index.html` | Buscador por título y libros en tarjetas |
| Libros | `libros.html` | Formulario de alta y tabla de libros |
| Clientes | `clientes.html` | Formulario de alta y tabla de clientes |
| Ventas | `ventas.html` | Selección de cliente, renglones y resumen |
| Historial | `historial.html` | Tabla de ventas y detalle de una venta |

## Estado del avance (Ejercicios 1 a 5)

Las cinco vistas funcionan con datos del almacén. Los ejemplos iniciales están
en `js/datos/datos-iniciales.js`; las altas de libros y clientes y las ventas
se conservan en el navegador. C-06 mantiene pendiente la consolidación del
almacenamiento, la verificación general y la preparación de la entrega.

### Interacciones que ya funcionan

- Navegación entre las cinco vistas.
- **Catálogo generado desde los datos**: al abrir `index.html` las tarjetas se
  arman desde el almacén de datos (editorial, género y autores se resuelven por
  identificador y un libro sin género muestra «Sin clasificar»).
- **Filtro por título del Catálogo**: no distingue mayúsculas de minúsculas,
  admite coincidencias parciales e ignora los espacios de los extremos. Una
  búsqueda vacía muestra todos los libros y una búsqueda sin coincidencias
  muestra un mensaje.

- **Altas de libros y clientes**: validación y actualización del listado en la
  misma página. Las otras vistas leen los datos vigentes al abrirse; navegar
  entre páginas no es una actualización automática de pestañas ya abiertas.
- **Ventas**: seleccionar cliente, libro y cantidad entera positiva. Agregar
  otra vez el mismo libro suma cantidades sin duplicar filas. Antes de
  confirmar se pueden cambiar cantidades o quitar renglones.
- **Historial**: listado de ventas y detalle en la misma página, sin edición
  ni eliminación. La fecha se muestra como `dd/mm/aaaa HH:mm`, hora local del
  navegador; se almacena en formato ISO.

### Importes y confirmación de ventas

El precio unitario se redondea al centavo antes de multiplicar; las mitades
se redondean hacia arriba. Por ejemplo, `1500,125` pasa a `1500,13` y dos
unidades cuestan `3000,26`. Los cálculos usan centavos enteros y rechazan
valores no finitos o fuera del rango seguro. No se modifica el catálogo.

La venta conserva una copia de los datos del cliente y de cada libro, con su
precio unitario, cantidad y subtotal. El historial lee esa copia, no los
precios actuales del catálogo. El formulario se limpia solamente después de
guardar correctamente; un fallo conserva el borrador y muestra un error.
No se gestionan stock, cobros ni facturación fiscal.

### Almacenamiento y límites

Solo `js/almacen.js` accede a `localStorage`. Las claves son:

| Clave | Contenido |
|---|---|
| `libreria.libros` | Arreglo de libros; cada registro incluye `id`, `titulo`, `precio` y las referencias a editorial, género y autores |
| `libreria.clientes` | Arreglo de clientes con identificador, nombre y email |
| `libreria.ventas` | Arreglo de instantáneas `{id, fecha, cliente, renglones, total}`; cada renglón conserva `libroId`, `titulo`, `isbn`, `cantidad`, `precioUnitario` y `subtotal` |

El almacén asigna identificadores de venta `ven-01`, `ven-02`, etc. Una clave
de ventas ausente se lee como lista vacía sin escribir. Si esa clave es
ilegible o el navegador bloquea su acceso, se informa el fallo sin reemplazar
los datos; no se presenta una reserva temporal como guardado persistente.
Las pruebas de Node sin almacenamiento sí usan una reserva en memoria.

Los datos dependen del navegador, perfil y ubicación desde la que se abre el
proyecto; no se comparten entre personas ni se respaldan en un servidor.
No borrar datos del navegador si se desea conservarlos. La política general
para claves parciales o dañadas de libros/clientes queda para C-06.

### Verificación observada de C-05

El 2026-10-16 se ejecutaron recorridos automatizados en Chrome 155 real,
mediante CDP, sobre copias del proyecto y perfiles aislados abiertos con
`file://`. Se inspeccionaron capturas a 320 px y 1280 px y se utilizaron
eventos de teclado. Esto no equivale a una auditoría completa con lector de
pantalla ni reemplaza la verificación final de C-06.

| Caso | Resultado observado en esta etapa |
|---|---|
| CM-1 | No reevaluado en C-05; queda para la verificación general |
| CM-2 | Parcial: alta válida desde formulario y disponibilidad para vender. No se volvió a comprobar el ISBN duplicado ni la aparición en Catálogo |
| CM-3 | Parcial: alta válida desde formulario y disponibilidad para vender. No se repitieron email inválido/duplicado ni se verificó todo el listado |
| CM-4 | Aprobado: rechazo de venta sin cliente y cantidades vacías, cero, negativas o decimales; repetidos acumulados en una fila. Editar una cantidad inválida bloquea la confirmación hasta corregirla o quitarla |
| CM-5 | Aprobado: subtotales 3000 y 2000, total 5000, guardado y detalle histórico correctos |
| CM-6 | Aprobado en copia: modificar exclusivamente el precio del catálogo y recargar no cambió los importes de la venta confirmada |
| CM-7 | Parcial: las altas llegaron a Ventas y dos ventas conservaron sus identificadores al recargar, sin duplicarse. No se comprobó toda la carga inicial ni la recuperación de claves parciales |
| CM-8 | Parcial general: Ventas e Historial comprobados a 320/1280 px, con teclado y foco visible, sin desbordamiento de página. Las tablas se desplazan dentro de sus contenedores. Sigue pendiente la comprobación de Libros/Clientes trasladada desde C-04 |

También se comprobó el redondeo de `1500,125` a `1500,13`, la conservación del
borrador ante escritura rechazada, el reintento sin duplicados, el cambio
correcto de día UTC/local y el reemplazo de detalles de dos ventas sin mezclar
filas. El texto con etiquetas HTML se mostró literalmente.

Para repetir CM-6, usar una copia y un perfil de prueba, registrar una venta
y conservar sus importes. En las herramientas de desarrollo, editar solo
`precio` del libro correspondiente dentro del JSON de `libreria.libros`;
mantener los demás campos y no editar `libreria.ventas`. Recargar Historial y
comparar precio unitario, subtotales y total con los valores confirmados.

### Pendiente

- Consolidación de carga inicial y recuperación de almacenamiento (C-06).
- Verificación general de CM-1 a CM-8 y pendientes indicados en la tabla.
- Documentación final y armado de la entrega (Ejercicio 6).

## Para quienes desarrollan

Pruebas de lógica y almacén, sin instalar dependencias:

```bash
node --test tests/*.test.js
```

Resultado al integrar C-05: **146 pruebas aprobadas, 0 fallidas**; baseline
previo: 70 aprobadas. Estas pruebas no sustituyen los recorridos de navegador.
La carpeta `tests/` se excluye de la entrega.

Después de clonar el repositorio, ejecutar una sola vez:

```bash
git config core.hooksPath .githooks
engram sync --import
```

El primer comando activa los hooks que mantienen sincronizada la memoria
compartida del proyecto (carpeta `.engram/`); el segundo la carga en la base
local de Engram. Requiere tener Engram instalado; sin Engram, el proyecto se
usa y se edita igual. Detalle en `AGENTS.md`.

## Estructura de carpetas

```
index.html, libros.html, clientes.html, ventas.html, historial.html
css/        hojas de estilo (base, disposición y componentes)
js/         scripts; js/paginas/ tiene un script por vista
recursos/   tipografías e imágenes locales
```
