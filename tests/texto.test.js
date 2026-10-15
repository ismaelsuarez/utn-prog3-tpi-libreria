"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const texto = require("../js/logica/texto.js");

test("normalizarTexto recorta los extremos y pasa a minúsculas", () => {
  assert.equal(texto.normalizarTexto("  El FARO "), "el faro");
  assert.equal(texto.normalizarTexto("CARTAS"), "cartas");
  assert.equal(texto.normalizarTexto("sin-espacios"), "sin-espacios");
});

test("normalizarTexto con texto vacío o solo espacios devuelve vacío", () => {
  assert.equal(texto.normalizarTexto(""), "");
  assert.equal(texto.normalizarTexto("   "), "");
});

test("normalizarIsbn quita espacios y guiones", () => {
  assert.equal(texto.normalizarIsbn(" 978-987-000-001-1 "), "9789870000011");
  assert.equal(texto.normalizarIsbn("978 987 000 002 8"), "9789870000028");
  assert.equal(texto.normalizarIsbn("9789870000035"), "9789870000035");
});

test("normalizarEmail recorta y pasa a minúsculas", () => {
  assert.equal(texto.normalizarEmail("  Laura.Mendoza@Correo.Test "), "laura.mendoza@correo.test");
  assert.equal(texto.normalizarEmail("nina.podesta@correo.test"), "nina.podesta@correo.test");
});

test("dos ISBN equivalentes con distinto formato normalizan igual", () => {
  assert.equal(
    texto.normalizarIsbn("978-987-000-001-1"),
    texto.normalizarIsbn("978 987 000 001 1")
  );
});
