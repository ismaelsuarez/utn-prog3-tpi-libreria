"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const datos = require("../js/datos/datos-iniciales.js");
const catalogo = require("../js/logica/catalogo.js");

test("filtra sin distinguir mayúsculas de minúsculas", () => {
  const resultado = catalogo.filtrarPorTitulo(datos.libros, "FARO DE");
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].titulo, "El faro de los vientos");
});

test("encuentra coincidencias parciales dentro del título", () => {
  const resultado = catalogo.filtrarPorTitulo(datos.libros, "cartas");
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].titulo, "Cartas desde el sur");

  const varios = catalogo.filtrarPorTitulo(datos.libros, "a");
  assert.ok(varios.length > 1, "una sola letra coincide con varios títulos");
});

test("elimina los espacios de los extremos de la búsqueda", () => {
  const directo = catalogo.filtrarPorTitulo(datos.libros, "faro");
  const conEspacios = catalogo.filtrarPorTitulo(datos.libros, "   faro   ");
  assert.deepEqual(conEspacios, directo);
  assert.equal(conEspacios.length, 1);
});

test("una búsqueda vacía o de solo espacios muestra todo el catálogo", () => {
  assert.equal(catalogo.filtrarPorTitulo(datos.libros, "").length, datos.libros.length);
  assert.equal(catalogo.filtrarPorTitulo(datos.libros, "   ").length, datos.libros.length);
});

test("una búsqueda sin coincidencias devuelve un arreglo vacío", () => {
  assert.deepEqual(catalogo.filtrarPorTitulo(datos.libros, "zzzzz"), []);
});

test("resolverEditorial resuelve el nombre por identificador", () => {
  assert.equal(catalogo.resolverEditorial(datos.editoriales, "edi-01"), "Ediciones del Puerto");
  assert.equal(catalogo.resolverEditorial(datos.editoriales, "edi-02"), "Editorial Brújula");
  assert.equal(catalogo.resolverEditorial(datos.editoriales, "edi-99"), "");
});

test("resolverGenero devuelve «Sin clasificar» cuando el libro no tiene género", () => {
  assert.equal(catalogo.resolverGenero(datos.generos, null), "Sin clasificar");
  assert.equal(catalogo.resolverGenero(datos.generos, "gen-01"), "Novela");
  assert.equal(catalogo.resolverGenero(datos.generos, "gen-99"), "Sin clasificar");
});

test("resolverAutores une los nombres con coma", () => {
  assert.equal(catalogo.resolverAutores(datos.autores, ["aut-01"]), "Marta Ibáñez");
  assert.equal(catalogo.resolverAutores(datos.autores, ["aut-03", "aut-02"]), "Elena Varela, Tomás Quiroga");
  assert.equal(catalogo.resolverAutores(datos.autores, ["aut-99"]), "");
});

test("estadoDelListado distingue vacío, sin resultados y con resultados", () => {
  assert.equal(catalogo.estadoDelListado(0, 0), "vacio");
  assert.equal(catalogo.estadoDelListado(6, 0), "sin-resultados");
  assert.equal(catalogo.estadoDelListado(6, 2), "con-resultados");
});

test("la lógica del catálogo funciona con la normalización de texto.js", () => {
  const normalizar = require("../js/logica/texto.js").normalizarTexto;
  assert.equal(normalizar("  Mapas  "), "mapas");
  assert.equal(catalogo.filtrarPorTitulo(datos.libros, "  MAPAS  ").length, 1);
});
