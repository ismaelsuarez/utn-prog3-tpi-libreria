"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const datos = require("../js/datos/datos-iniciales.js");
const clientes = require("../js/logica/clientes.js");

// Registro completo y válido: su email no coincide con ningún ejemplo.
function datosValidos() {
  return {
    nombreCompleto: "Ana Sosa",
    email: "ana.sosa@correo.test"
  };
}

function validar(registro, conjuntoDeClientes) {
  return clientes.validarCliente(registro, conjuntoDeClientes || datos.clientes);
}

// Exige UN SOLO error, en el campo esperado y con la forma {campo, mensaje}:
// así cada rechazo queda aislado (un error por campo) y sin colaterales.
function assertUnicoError(registro, campo, conjuntoDeClientes) {
  const errores = validar(registro, conjuntoDeClientes);
  assert.equal(
    errores.length,
    1,
    `se esperaba un solo error, hubo ${errores.length}: ${JSON.stringify(errores)}`
  );
  assert.equal(errores[0].campo, campo, `el error debería señalar «${campo}»`);
  assert.deepEqual(Object.keys(errores[0]).sort(), ["campo", "mensaje"]);
  assert.equal(typeof errores[0].mensaje, "string");
  assert.ok(errores[0].mensaje.trim() !== "", "el mensaje no puede quedar vacío");
  return errores[0];
}

test("rechaza el nombre completo vacío", () => {
  const registro = datosValidos();
  registro.nombreCompleto = "";
  assertUnicoError(registro, "nombre");
});

test("rechaza el email vacío", () => {
  const registro = datosValidos();
  registro.email = "";
  assertUnicoError(registro, "email");
});

test("rechaza un email sin arroba", () => {
  const registro = datosValidos();
  registro.email = "ana.sosacorreo.test";
  assertUnicoError(registro, "email");
});

test("rechaza un email sin punto en el dominio", () => {
  const registro = datosValidos();
  registro.email = "ana@correo";
  assertUnicoError(registro, "email");
});

test("rechaza un email con doble arroba", () => {
  const registro = datosValidos();
  registro.email = "ana@@correo.test";
  assertUnicoError(registro, "email");
});

test("rechaza un email con espacios intermedios", () => {
  const registro = datosValidos();
  registro.email = "ana sosa@correo.test";
  assertUnicoError(registro, "email");
});

test("rechaza un email repetido aunque cambien mayúsculas y espacios exteriores", () => {
  const registro = datosValidos();
  registro.email = " Laura.Mendoza@Correo.Test ";
  assertUnicoError(registro, "email");
});

test("un cliente válido no produce ningún error", () => {
  assert.deepEqual(validar(datosValidos()), []);
});

// --- Ampliación: segunda vuelta de casos por cada comportamiento ---

test("rechaza el nombre formado solo por espacios", () => {
  const registro = datosValidos();
  registro.nombreCompleto = "     ";
  assertUnicoError(registro, "nombre");
});

test("rechaza el email formado solo por espacios", () => {
  const registro = datosValidos();
  registro.email = "   ";
  assertUnicoError(registro, "email");
});

test("rechaza un email repetido solo por mayúsculas", () => {
  const registro = datosValidos();
  registro.email = "RICARDO.SORIA@CORREO.TEST";
  assertUnicoError(registro, "email");
});

test("rechaza un email repetido solo por espacios de los extremos", () => {
  const registro = datosValidos();
  registro.email = "  nina.podesta@correo.test  ";
  assertUnicoError(registro, "email");
});

test("rechaza un email repetido dentro del conjunto recibido en este envío", () => {
  const registro = datosValidos();
  registro.email = "OTRO.MENSAJE@CORREO.TEST";
  const guardados = [{ id: "cli-88", email: " Otro.Mensaje@Correo.Test " }];
  assertUnicoError(registro, "email", guardados);
});

test("acepta un email nuevo escrito con mayúsculas y espacios exteriores", () => {
  const registro = datosValidos();
  registro.email = "  Ana.Sosa@Correo.Test  ";
  assert.deepEqual(validar(registro), []);
});

test("acumula un error por cada campo rechazado sin registrar nada", () => {
  const registro = datosValidos();
  registro.nombreCompleto = "";
  registro.email = "ana.sosacorreo.test";

  const errores = validar(registro);
  assert.equal(errores.length, 2, JSON.stringify(errores));
  assert.deepEqual(
    errores.map((error) => error.campo).sort(),
    ["email", "nombre"],
    "debería señalar exactamente nombre y email"
  );
});
