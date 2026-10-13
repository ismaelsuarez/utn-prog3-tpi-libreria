# Actores y Roles

## Actores del sistema

| Actor | Descripción | Cómo interactúa |
|---|---|---|
| Operador de la librería | Única persona que usa la aplicación | Navega las cinco vistas, completa formularios, arma ventas y consulta el historial desde el navegador |
| Docente evaluador | Revisa la entrega | Abre `index.html`, reproduce los casos manuales y los contrasta con el README. En la comprobación del precio histórico modifica `localStorage` con las herramientas del navegador |
| Equipo de desarrollo | Avalos Pablo, Blangetti Sofia, Suarez Ismael | Construye el proyecto y registra en el README el resultado observado de cada caso |

El docente evaluador y el equipo no son roles dentro de la aplicación: la
usan con las mismas capacidades que el operador.

## RBAC — Matriz de permisos

No hay autenticación, sesiones ni roles. La consigna excluye expresamente un
inicio de sesión real. Existe un único perfil de uso con estas capacidades:

| Recurso | Crear | Leer | Actualizar | Eliminar |
|---|---|---|---|---|
| Libro | Sí | Sí | No | No |
| Cliente | Sí | Sí | No | No |
| Venta en composición (antes de confirmar) | Sí | Sí | Sí (cantidades) | Sí (quitar renglones) |
| Venta confirmada | Sí (al confirmar) | Sí | No | No |
| Editorial, género, autor | No | Sí | No | No |

Las editoriales, los géneros y los autores provienen únicamente de los datos
iniciales.

## Rutas públicas

Todas las páginas son accesibles sin autenticación:

- `index.html` (entrada)
- Página de Libros
- Página de Clientes
- Página de Ventas
- Página de Historial

Los nombres de archivo de las páginas distintas de `index.html` y la vista que
ocupa `index.html` están propuestos en `08_arquitectura_propuesta.md`.

## Consideraciones de accesibilidad para el operador

- Todos los controles se recorren con el teclado y conservan un foco visible.
- Cada campo tiene una etiqueta asociada.
- Los botones tienen textos que describen su acción.
- Los mensajes de error se expresan con texto y no dependen solo del color.
- Las imágenes informativas tienen texto alternativo; las decorativas no
  repiten información.
