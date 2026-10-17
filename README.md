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
El proyecto se abre directamente desde `file://`.

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

## Funcionalidades implementadas

- Navegación entre las cinco vistas.
- **Carga inicial consolidada**: al abrir cualquier vista, el almacén siembra
  los datos de ejemplo en las claves que falten (libros, clientes y ventas),
  sin duplicar ni sobrescribir lo ya guardado.
- **Catálogo generado desde los datos**: las tarjetas se arman desde el
  almacén (editorial, género y autores se resuelven por identificador y un
  libro sin género muestra «Sin clasificar»).
- **Filtro por título del Catálogo**: no distingue mayúsculas de minúsculas,
  admite coincidencias parciales e ignora los espacios de los extremos. Una
  búsqueda vacía muestra todos los libros y una búsqueda sin coincidencias
  muestra un mensaje.
- **Altas de libros y clientes**: validación y actualización del listado en la
  misma página.
- **Ventas**: seleccionar cliente, libro y cantidad entera positiva. Agregar
  otra vez el mismo libro suma cantidades sin duplicar filas. Antes de
  confirmar se pueden cambiar cantidades o quitar renglones.
- **Historial**: listado de ventas y detalle en la misma página, sin edición
  ni eliminación. La fecha se muestra como `dd/mm/aaaa HH:mm`, hora local del
  navegador; se almacena en formato ISO.

Nota sobre «sin recargar»: cuando el proyecto dice que un listado se
actualiza «sin recargar», significa dentro de la misma página donde ocurre la
alta u operación. Navegar hacia otra vista sí vuelve a leer el almacén.

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

Los datos de ejemplo viven en `js/datos/datos-iniciales.js` (seis libros,
tres clientes, editoriales, géneros y autores). Editoriales, géneros y
autores **no se persisten**: se leen siempre de ese archivo; en
`localStorage` solo se guardan libros, clientes y ventas.

Solo `js/almacen.js` accede a `localStorage`. Al abrir cualquier página,
`Libreria.almacen.inicializar()` siembra únicamente las claves ausentes; las
claves presentes se respetan sin duplicarlas. Las claves son:

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

`localStorage` depende del navegador, del perfil y de la ubicación desde la
que se abre el proyecto: los datos no se comparten entre personas ni entre
perfiles, no se respaldan en un servidor y desaparecen si el navegador borra
los datos del sitio. No se gestionan sincronización entre pestañas abiertas
ni migración de datos guardados con versiones anteriores.

### Política de claves dañadas

Si el contenido de una clave no es un arreglo JSON válido (por ejemplo, fue
alterado a mano), la aplicación **no lo repara ni lo sobrescribe**: el valor
alterado se conserva intacto y las lecturas sirven los ejemplos provisorios
en memoria (en el caso de ventas ilegibles, la consulta informa el fallo).
La única vía de recuperación es un alta posterior: al registrar un libro, un
cliente o una venta, la lista completa de esa clave se reemplaza por
ejemplos + registro nuevo.

### Ubicación y estructura del catálogo guardado

En el navegador: Herramientas de desarrollo → Application (o Almacenamiento)
→ Local Storage → el origen `file://` → claves `libreria.libros`,
`libreria.clientes` y `libreria.ventas`. Cada clave contiene un arreglo JSON.
Un libro guardado tiene esta forma:

```json
{
  "id": "lib-01",
  "titulo": "El faro de los vientos",
  "isbn": "978-987-000-001-1",
  "precio": 1500,
  "editorialId": "edi-01",
  "generoId": "gen-01",
  "autorIds": ["aut-01"]
}
```

Para reproducir CM-6 en una copia de prueba: registrar una venta, editar en
DevTools **solo** el campo `precio` del libro correspondiente dentro de
`libreria.libros` (mantener los demás campos y no editar `libreria.ventas`),
recargar Historial y comparar precio unitario, subtotales y total con los
valores confirmados: deben conservarse intactos.

### Imágenes

- `img/estanteria.webp` es una imagen descargada de la red que se conserva
  como recurso local del proyecto.
- `index.html` referencia siete `img/portadas/*.jpg` que no existen en la
  entrega (seis portadas de ejemplo y una predeterminada para la plantilla).
  Cada tarjeta oculta la imagen rota con `onerror` y muestra un bloque
  decorativo con el texto «Portada no disponible»: la página no se rompe ni
  aparecen íconos de imagen defectuosa.

## Casos manuales: resultado observado

Verificación del 2026-10-16 con Edge 155 real en modo headless, mediante CDP
(Chrome DevTools Protocol), sobre una copia del proyecto y perfiles aislados
abiertos con `file://`, sin servidor ni dependencias instaladas. Esto no
equivale a una auditoría completa con lector de pantalla ni reemplaza una
pasada visual en el navegador habitual de cada integrante.

| Caso | Resultado observado |
|---|---|
| CM-1 | Aprobado: `FARO` → 1 tarjeta; `   faro   ` → 1 tarjeta; búsqueda vacía → catálogo completo (6); `zzzz` → 0 tarjetas con mensaje «sin resultados» |
| CM-2 | Aprobado: ISBN duplicado rechazado con «Ese ISBN ya está registrado.» sin dar de alta; libro nuevo registrado sin recargar (7 filas) y visible en Catálogo y en la selección de venta |
| CM-3 | Aprobado: email inválido y existente en mayúsculas rechazados; cliente nuevo registrado sin recargar (4 filas) y visible en la selección de venta |
| CM-4 | Aprobado: venta sin cliente no se confirma y conserva el borrador; cantidades 0, −2 y 1,5 rechazadas («entero positivo seguro»); libro repetido acumula en la misma fila (2 + 1 → cantidad 3) |
| CM-5 | Aprobado: 2 × $ 1500,00 → $ 3000,00 y 1 × $ 2000,00 → $ 2000,00; total $ 5000,00; venta `ven-01` guardada y detalle correcto en el Historial |
| CM-6 | Aprobado: alterado el precio de `lib-01` en el catálogo guardado (1500 → 9999), la venta confirmada conserva unitarios $ 1500,00 / $ 2000,00, subtotales $ 3000,00 / $ 2000,00 y total $ 5000,00 tras recargar |
| CM-7 | Aprobado: tras altas de libro (`lib-07`) y cliente (`cli-04`) y una venta, recorrer las cinco vistas recupera libros 7 / clientes 4 / ventas 1 sin duplicar ejemplos ni ventas, con 0 errores de consola |
| CM-8 | Aprobado: las cinco vistas a 320 px y 1280 px sin desplazamiento horizontal de página (`scrollWidth == clientWidth`); Tab recorre todos los controles (Catálogo 6, Libros 15/14, Clientes 8, Ventas 11, Historial 5) con foco visible en el 100 %; las tablas desplazan su propio contenedor con la flecha cuando exceden el ancho |

La tarea 6.3 trasladada desde C-04 (Libros y Clientes a 320 px y 1280 px, con
teclado y foco visible) quedó cubierta dentro del recorrido de CM-8 y también
aprobada.

También se observó el redondeo de `1500,125` a `1500,13`, la conservación del
borrador ante escritura rechazada, el reintento sin duplicados y el texto
con etiquetas HTML mostrado literalmente (verificación de C-05, abajo).

## Verificación observada de C-05 (histórica)

El 2026-10-16 se ejecutaron recorridos automatizados en Chrome 155 real,
mediante CDP, sobre copias del proyecto y perfiles aislados abiertos con
`file://`. Los resultados detallados de esa etapa quedan registrados en el
change archivado `venta-simulada-e-historial`; la tabla de CM-1 a CM-8 de la
sección anterior es la verificación vigente y completa.

## Para quienes desarrollan

Pruebas de lógica y almacén, sin instalar dependencias:

```bash
node --test tests/*.test.js
```

Resultado al integrar C-06: **153 pruebas aprobadas, 0 fallidas**; baseline
previo a C-06: 146 aprobadas. En Windows el runner correcto es
`node --test tests/*.test.js` (no `node --test tests/`). Estas pruebas no
sustituyen los recorridos de navegador. La carpeta `tests/` se excluye de la
entrega.

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
img/        imágenes locales (estanteria.webp y el subdirectorio portadas/)
recursos/   tipografías e imágenes locales
README.md
```

## Entrega

La entrega incluye únicamente: `index.html`, los demás `*.html`, `css/`,
`js/`, `img/`, `recursos/` y `README.md`. No forman parte de la entrega
`tests/`, `docs/`, `discovery/`, `knowledge-base/`, `openspec/`, `.atl/`,
`.claude/`, `.engram/`, `.githooks/`, `.git/`, `.gitignore`, `CHANGES.md`,
`AGENTS.md`, `CLAUDE.md` ni `.active-orchestrator-state.json`.
