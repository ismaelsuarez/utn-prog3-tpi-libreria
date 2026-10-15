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

## Estado del avance (Etapa 1 + Ejercicio 3)

Este avance corresponde a la estructura y las pantallas HTML (Ejercicio 1), la
presentación con CSS (Ejercicio 2) y los datos locales con el catálogo
generado por JavaScript (Ejercicio 3). Las tarjetas del Catálogo se generan
desde `js/datos/datos-iniciales.js`; los demás listados siguen siendo
ejemplos estáticos escritos en el HTML.

### Interacciones que ya funcionan

- Navegación entre las cinco vistas.
- **Catálogo generado desde los datos**: al abrir `index.html` las tarjetas se
  arma desde el almacén de datos (editorial, género y autores se resuelven por
  identificador y un libro sin género muestra «Sin clasificar»).
- **Filtro por título del Catálogo**: no distingue mayúsculas de minúsculas,
  admite coincidencias parciales e ignora los espacios de los extremos. Una
  búsqueda vacía muestra todos los libros y una búsqueda sin coincidencias
  muestra un mensaje.

### Pantallas que son maqueta

En cada una hay un texto visible «Maqueta» junto al control que todavía no
funciona.

| Vista | Qué es maqueta |
|---|---|
| Libros | El formulario no registra libros; la tabla es un ejemplo fijo |
| Clientes | El formulario no registra clientes; la tabla es un ejemplo fijo |
| Ventas | Los controles no componen ni confirman ventas; los renglones y el total son un ejemplo fijo |
| Historial | La venta y su detalle son un ejemplo fijo; el botón «Ver detalle» no actúa |

### Pendiente

- Presentación con CSS y uso adaptable (Ejercicio 2): hecho (C-02 archivado).
- Datos locales y catálogo generado con JavaScript (Ejercicio 3): hecho (C-03).
- Alta de libros y clientes con validaciones (Ejercicio 4).
- Alta de libros y clientes con validaciones (Ejercicio 4).
- Venta simulada e historial (Ejercicio 5).
- Persistencia en `localStorage`, casos manuales y documentación final (Ejercicio 6).

## Para quienes desarrollan

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
