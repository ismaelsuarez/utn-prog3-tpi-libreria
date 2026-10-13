# Modelo de Datos

Los datos se representan con arrays y objetos de JavaScript con
identificadores estables. No hay base de datos.

> **Nota**: la consigna fija las entidades, sus relaciones y los datos que
> debe conservar una venta. Los **nombres de propiedades** y el **formato de
> los identificadores** que aparecen aquí son una propuesta del equipo
> (ver SU-02 y SU-03 en `09_decisiones_y_supuestos.md`).

## Dominios

| Dominio | Entidades | Descripción |
|---|---|---|
| Catálogo | Libro, Editorial, Género, Autor | Libros disponibles y sus datos de referencia |
| Clientes | Cliente | Personas a las que se les registran ventas |
| Ventas | Venta, Renglón | Operaciones confirmadas con sus importes históricos |

## ERD

```
Editorial 1 ───────< N Libro N >─────── 1..N Autor
                         │
Género 0..1 ────────< N ─┘

Cliente 1 ──────< N Venta 1 ──────< 1..N Renglón
                                          │
                                          └── copia de datos del Libro
                                              (no es una referencia viva)
```

## Entidades

### Editorial

- `id` (texto): identificador estable.
- `nombre` (texto).
- Solo lectura: proviene de los datos iniciales.

### Género

- `id` (texto): identificador estable.
- `nombre` (texto).
- Solo lectura: proviene de los datos iniciales.

### Autor

- `id` (texto): identificador estable.
- `nombre` (texto).
- Solo lectura: proviene de los datos iniciales.

### Libro

- `id` (texto): identificador estable.
- `titulo` (texto): obligatorio.
- `isbn` (texto): obligatorio y único; se compara sin espacios ni guiones.
- `precio` (número): mayor que cero.
- `editorialId` (texto): obligatorio; referencia a una editorial existente.
- `generoId` (texto o `null`): opcional; si tiene valor, referencia a un género
  existente. `null` se muestra como «Sin clasificar».
- `autorIds` (array de texto): uno o más; todos referencian autores existentes.

### Cliente

- `id` (texto): identificador estable.
- `nombreCompleto` (texto): obligatorio. No hay campo de apellido separado.
- `email` (texto): obligatorio, con formato válido y único; se compara sin
  espacios exteriores y sin distinguir mayúsculas de minúsculas.

### Venta

- `id` (texto): identificador de la venta.
- `fecha` (texto en formato ISO 8601): momento de la confirmación.
- `cliente` (objeto): copia de los datos descriptivos del cliente
  (`id`, `nombreCompleto`, `email`).
- `renglones` (array de Renglón): al menos uno.
- `total` (número): suma de los subtotales.
- Inmutable una vez confirmada.

### Renglón

- `libroId` (texto): identificador del libro vendido.
- `titulo` (texto): copia del título al momento de la venta.
- `isbn` (texto): copia del ISBN al momento de la venta.
- `cantidad` (entero): mayor que cero.
- `precioUnitario` (número): **copia** del precio del libro al momento de la
  venta. Es el valor histórico.
- `subtotal` (número): `cantidad × precioUnitario`.
- Un libro aparece como máximo una vez por venta.

**Regla central**: el historial lee el precio unitario, los subtotales, el
total y los datos descriptivos desde la propia venta. Nunca vuelve a buscarlos
en el catálogo.

## Persistencia en `localStorage`

Se conservan libros, clientes y ventas. Editoriales, géneros y autores no se
modifican y permanecen como datos iniciales en el código.

| Clave propuesta | Contenido |
|---|---|
| `libreria.libros` | Array de Libro (el catálogo guardado) |
| `libreria.clientes` | Array de Cliente |
| `libreria.ventas` | Array de Venta |

- En el primer inicio se cargan los ejemplos.
- En los inicios siguientes se recuperan los registros guardados sin duplicar
  los datos iniciales.
- La ubicación y la estructura del catálogo guardado se documentan en el
  README, porque el docente modifica el precio de un libro allí para
  comprobar el precio histórico.

## Seed data inicial

Mínimos exigidos por la consigna:

| Entidad | Mínimo |
|---|---|
| Libros | 6 |
| Editoriales | 2 |
| Géneros | 2 |
| Autores | 3 |
| Clientes | 3 |

Condiciones del conjunto inicial:

- Todos los datos son ficticios.
- Cada libro se relaciona con una editorial existente y con uno o más autores
  existentes.
- El género es opcional; si se asigna, corresponde a un género existente.
- Conviene incluir al menos un libro sin género (para mostrar «Sin
  clasificar»), al menos un libro con más de un autor, y libros con precios
  1500 y 2000 para reproducir el caso manual de la venta válida.
