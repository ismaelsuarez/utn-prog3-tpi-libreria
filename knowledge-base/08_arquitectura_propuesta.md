# Arquitectura Propuesta

> Esta arquitectura es una **propuesta** derivada de la consigna y de las
> decisiones del equipo. Los nombres de archivos y carpetas pueden ajustarse
> en cada change de OpenSpec, siempre que se respeten las restricciones.

## Patrones aplicados

| Patrón | Dónde se usa | Por qué |
|---|---|---|
| Separación estructura / estilos / comportamiento | HTML, `css/`, `js/` | Lo valora expresamente la consigna |
| Lógica pura separada del DOM | `js/logica/` | Permite probar validaciones, filtro y cálculos con `node --test` y reutilizarlos entre páginas |
| Almacén de datos (repositorio) | `js/almacen.js` | Un único punto de lectura y escritura; aísla `localStorage` del resto del código |
| Script por página | `js/paginas/` | Cada vista conecta su DOM y sus eventos sin mezclar responsabilidades |
| Generación de interfaz desde datos | Scripts de página | Catálogo, listados y selectores salen de los arrays, no del HTML escrito a mano |
| Instantánea histórica (snapshot) | Construcción de la venta | Los renglones copian precio y datos descriptivos en lugar de referenciar el catálogo |
| Exportación dual | Archivos de `js/logica/` y `js/datos/` | Scripts clásicos utilizables en el navegador y cargables desde Node |

## Estructura de directorios

```
proyecto/
├── index.html              # Entrada: vista Catálogo
├── libros.html
├── clientes.html
├── ventas.html
├── historial.html
├── css/
│   ├── base.css            # Variables, tipografía, reinicio mínimo, foco
│   ├── disposicion.css     # Encabezado, navegación, grillas
│   └── componentes.css     # Tarjetas, formularios, botones, tablas, mensajes
├── js/
│   ├── datos/
│   │   └── datos-iniciales.js   # Editoriales, géneros, autores, libros y clientes de ejemplo
│   ├── logica/                  # Funciones puras, sin DOM
│   │   ├── texto.js             # Normalización de texto, ISBN y email
│   │   ├── catalogo.js          # Filtro por título, resolución de relaciones
│   │   ├── libros.js            # Validación de alta de libro
│   │   ├── clientes.js          # Validación de alta de cliente
│   │   └── ventas.js            # Renglones, subtotales, total, construcción de la venta
│   ├── almacen.js               # Carga inicial, lectura y escritura
│   ├── interfaz.js              # Utilidades comunes de DOM (mensajes, formato de importes)
│   └── paginas/
│       ├── catalogo.js
│       ├── libros.js
│       ├── clientes.js
│       ├── ventas.js
│       └── historial.js
├── recursos/
│   ├── fuentes/                 # Tipografías locales, si se usan
│   └── imagenes/
├── README.md
│
│   # Fuera de la entrega (solo desarrollo)
├── tests/                       # Pruebas con node --test
├── docs/                        # Consigna
├── discovery/
├── knowledge-base/
└── openspec/
```

## Carga de scripts

- Los scripts se incluyen con `<script src="...">` clásico, en orden de
  dependencia: datos, lógica, almacén, interfaz y script de página.
- No se usa `type="module"`: los navegadores bloquean la carga de módulos
  desde `file://`, y la consigna exige abrir `index.html` sin servidor.
- Para que las funciones puras sean accesibles desde Node, cada archivo de
  lógica expone sus funciones en un espacio de nombres global y, si existe
  `module`, también las exporta. Ejemplo ilustrativo:

```js
(function (raiz) {
  function normalizarIsbn(isbn) {
    return String(isbn).replace(/[\s-]/g, "");
  }

  const api = { normalizarIsbn: normalizarIsbn };

  raiz.Libreria = raiz.Libreria || {};
  raiz.Libreria.texto = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
```

## Estrategia de verificación

| Nivel | Qué cubre | Herramienta |
|---|---|---|
| Pruebas automatizadas | Funciones puras: normalización, filtro, validaciones, cálculos, construcción de la venta | `node --test` |
| Casos manuales | Comportamiento observable en el navegador, incluidos DOM, `localStorage`, teclado y anchos | Navegador, registrados en el README (CM-1 a CM-8) |

- Las pruebas automatizadas no reemplazan los casos manuales.
- El DOM y `localStorage` no se prueban con Node; se cubren con los casos manuales.
- La carpeta `tests/` no forma parte de la entrega.

## Seguridad

- **Autenticación**: no hay. Excluida por la consigna.
- **Autorización**: no hay. Un único perfil de uso.
- **Validación de entrada**: en el cliente, mediante funciones puras, antes de
  agregar cualquier registro. Sirve para la práctica; no representa
  integridad garantizada por un servidor.
- **Inserción en el DOM**: los datos escritos por usuarios se insertan como
  texto (`textContent`, creación de nodos). No se construye HTML con datos de
  usuario.
- **Secretos**: no existen.
- **Datos**: todos ficticios.

## Variables de entorno

No aplica. El proyecto no tiene configuración ni proceso de compilación.

## Adaptación y accesibilidad

- Diseño fluido con Flexbox o Grid, comprobado a 320 px y a 1280 px.
- Las tablas se envuelven en un contenedor con desplazamiento horizontal propio.
- Foco visible en todos los controles; orden de tabulación coherente con el
  orden visual.
- Mensajes de estado con texto, ubicados cerca del formulario que los origina.
