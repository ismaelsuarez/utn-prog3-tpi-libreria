# TPI: frontend de una librería — Base de Conocimiento

Base de conocimiento generada a partir de la consigna
(`docs/Repaso Primer Parcial.pdf`) y del Discovery (`discovery/discovery.md`).

Programación III — Tecnicatura Universitaria en Programación a Distancia (UTN).
Integrantes: Avalos Pablo, Blangetti Sofia, Suarez Ismael.

## Índice de Archivos

| Archivo | Contenido |
|---|---|
| [01_vision_y_objetivos.md](01_vision_y_objetivos.md) | Propósito, objetivos, alcance por ejercicio, etapas y fuera de alcance |
| [02_descripcion_general.md](02_descripcion_general.md) | Stack, arquitectura general, vistas y límites declarados |
| [03_actores_y_roles.md](03_actores_y_roles.md) | Actores, capacidades por recurso y accesibilidad |
| [04_modelo_de_datos.md](04_modelo_de_datos.md) | Entidades, relaciones, persistencia y datos iniciales |
| [05_reglas_de_negocio.md](05_reglas_de_negocio.md) | Reglas codificadas por dominio (RN-XX-NN) |
| [06_funcionalidades.md](06_funcionalidades.md) | Seis épicas, historias de usuario y los ocho casos manuales |
| [07_flujos_principales.md](07_flujos_principales.md) | Flujos extremo a extremo, incluida la comprobación del precio histórico |
| [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md) | Patrones, estructura de directorios, carga de scripts y verificación |
| [09_decisiones_y_supuestos.md](09_decisiones_y_supuestos.md) | Decisiones del equipo y supuestos a validar |
| [10_preguntas_abiertas.md](10_preguntas_abiertas.md) | Inconsistencias y preguntas abiertas priorizadas |

## Quick Start para Desarrolladores

1. Entender el dominio → [01](01_vision_y_objetivos.md), [03](03_actores_y_roles.md)
2. Entender los datos → [04](04_modelo_de_datos.md)
3. Entender las reglas → [05](05_reglas_de_negocio.md)
4. Entender la arquitectura → [02](02_descripcion_general.md), [08](08_arquitectura_propuesta.md)
5. Implementar → [07](07_flujos_principales.md), [06](06_funcionalidades.md)
6. Antes de codificar → [10](10_preguntas_abiertas.md)

## Resumen Ejecutivo

Frontend estático de una librería, construido solo con HTML, CSS y JavaScript
nativos, que se abre desde `index.html` sin npm ni servidor. Cinco vistas en
páginas separadas (Catálogo, Libros, Clientes, Ventas, Historial) comparten
datos a través de `localStorage`. El trabajo se organiza en seis ejercicios
que suman 100 puntos y se verifica con pruebas automatizadas de la lógica pura
y con ocho casos manuales registrados en el README.

Lo más delicado: el precio histórico de las ventas (la venta guarda una copia,
nunca una referencia al catálogo) y la dependencia de `localStorage` para
compartir estado entre páginas (ver IN-01 en el archivo 10).
