"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const ventas = require("../js/logica/ventas.js");

function libro(precio, id = "lib-01") {
  return { id, titulo: "Libro de prueba", isbn: "978-1", precio };
}

function calcular(precio, cantidad = 1) {
  return ventas.calcularVenta([{ libroId: "lib-01", cantidad }], [libro(precio)]);
}

test("redondea el unitario antes de multiplicar sin cambiar el catálogo", () => {
  const catalogo = [libro(1500.125)];
  const resultado = ventas.calcularVenta([{ libroId: "lib-01", cantidad: 2 }], catalogo);
  assert.deepEqual(resultado, {
    errores: [],
    renglones: [{ libroId: "lib-01", titulo: "Libro de prueba", isbn: "978-1", cantidad: 2, precioUnitario: 1500.13, subtotal: 3000.26 }],
    total: 3000.26
  });
  assert.equal(catalogo[0].precio, 1500.125);
});

for (const [precio, cantidad, unitario, subtotal] of [
  [1.005, 1, 1.01, 1.01], [10.124, 2, 10.12, 20.24],
  [0.004, 2, 0, 0], [0.005, 2, 0.01, 0.02],
  [1e-7, 2, 0, 0], [5e-324, 1, 0, 0]
]) {
  test(`redondeo decimal de ${precio} con cantidad ${cantidad}`, () => {
    const resultado = calcular(precio, cantidad);
    assert.deepEqual(resultado.errores, []);
    assert.equal(resultado.renglones[0].precioUnitario, unitario);
    assert.equal(resultado.renglones[0].subtotal, subtotal);
    assert.equal(resultado.total, subtotal);
  });
}

for (const precio of ["12", "abc", null, undefined, NaN, Infinity, -Infinity, 0, -1, 1e21]) {
  test(`rechaza precio no utilizable: ${String(precio)}`, () => {
    const resultado = calcular(precio);
    assert.equal(resultado.errores.length, 1);
    assert.equal(resultado.errores[0].campo, "libro");
    assert.ok(resultado.errores[0].mensaje.length > 0);
    assert.equal(resultado.renglones, undefined);
  });
}

test("agrega un libro existente con cantidad tomada del formulario sin mutar entradas", () => {
  const borrador = [];
  const catalogo = [libro(1500)];
  const resultado = ventas.agregarRenglon(borrador, "lib-01", "2", catalogo);
  assert.deepEqual(resultado, {
    errores: [],
    renglones: [{ libroId: "lib-01", titulo: "Libro de prueba", isbn: "978-1", cantidad: 2, precioUnitario: 1500, subtotal: 3000 }],
    total: 3000
  });
  assert.deepEqual(borrador, []);
  assert.deepEqual(catalogo, [libro(1500)]);
});

test("acumula 2 más 1 en una sola fila sin modificar otro libro ni el borrador", () => {
  const catalogo = [libro(1500), libro(2000, "lib-02")];
  const anterior = ventas.calcularVenta([{ libroId: "lib-01", cantidad: 2 }, { libroId: "lib-02", cantidad: 1 }], catalogo);
  const copia = structuredClone(anterior);
  const resultado = ventas.agregarRenglon(anterior.renglones, "lib-01", 1, catalogo);
  assert.deepEqual(resultado.errores, []);
  assert.equal(resultado.renglones.length, 2);
  assert.equal(resultado.renglones[0].cantidad, 3);
  assert.equal(resultado.renglones[0].subtotal, 4500);
  assert.deepEqual(resultado.renglones[1], anterior.renglones[1]);
  assert.equal(resultado.total, 6500);
  assert.deepEqual(anterior, copia);
});

for (const cantidad of ["", " ", 0, -1, 1.5, "1.5", NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, null, true]) {
  test(`rechaza cantidad ${String(cantidad)} aun al acumular y preserva las entradas`, () => {
    const catalogo = [libro(1500)];
    const borrador = [{ libroId: "lib-01", cantidad: 2 }];
    const resultado = ventas.agregarRenglon(borrador, "lib-01", cantidad, catalogo);
    assert.equal(resultado.errores.length, 1);
    assert.equal(resultado.errores[0].campo, "cantidad");
    assert.equal(resultado.renglones, undefined);
    assert.deepEqual(borrador, [{ libroId: "lib-01", cantidad: 2 }]);
    assert.deepEqual(catalogo, [libro(1500)]);
  });
}

test("rechaza un libro inexistente sin modificar el borrador", () => {
  const borrador = [{ libroId: "lib-01", cantidad: 2 }];
  const resultado = ventas.agregarRenglon(borrador, "inexistente", 1, [libro(1500)]);
  assert.equal(resultado.errores[0].campo, "libro");
  assert.equal(resultado.renglones, undefined);
  assert.deepEqual(borrador, [{ libroId: "lib-01", cantidad: 2 }]);
});

test("cambia la cantidad a 3 y recalcula sin modificar el borrador", () => {
  const borrador = [{ libroId: "lib-01", cantidad: 2 }];
  const resultado = ventas.cambiarCantidad(borrador, "lib-01", "3", [libro(1500)]);
  assert.deepEqual(resultado.errores, []);
  assert.equal(resultado.renglones[0].cantidad, 3);
  assert.equal(resultado.renglones[0].subtotal, 4500);
  assert.equal(resultado.total, 4500);
  assert.deepEqual(borrador, [{ libroId: "lib-01", cantidad: 2 }]);
});

for (const cantidad of ["", 0, -2, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
  test(`cambiar cantidad rechaza ${String(cantidad)} y conserva el borrador`, () => {
    const borrador = [{ libroId: "lib-01", cantidad: 2 }];
    const resultado = ventas.cambiarCantidad(borrador, "lib-01", cantidad, [libro(1500)]);
    assert.equal(resultado.errores[0].campo, "cantidad");
    assert.equal(resultado.renglones, undefined);
    assert.deepEqual(borrador, [{ libroId: "lib-01", cantidad: 2 }]);
  });
}

test("cambiar una fila inexistente informa error", () => {
  assert.equal(ventas.cambiarCantidad([], "lib-01", 1, [libro(1500)]).errores[0].campo, "libro");
});

test("quitar el último renglón deja el total en cero sin modificar la entrada", () => {
  const borrador = [{ libroId: "lib-01", cantidad: 2 }];
  assert.deepEqual(ventas.quitarRenglon(borrador, "lib-01", [libro(1500)]), { errores: [], renglones: [], total: 0 });
  assert.deepEqual(borrador, [{ libroId: "lib-01", cantidad: 2 }]);
});

test("quitar un renglón conserva el otro y recalcula su total", () => {
  const catalogo = [libro(1500), libro(2000, "lib-02")];
  const borrador = [{ libroId: "lib-01", cantidad: 2 }, { libroId: "lib-02", cantidad: 1 }];
  const resultado = ventas.quitarRenglon(borrador, "lib-01", catalogo);
  assert.deepEqual(resultado.errores, []);
  assert.equal(resultado.renglones.length, 1);
  assert.equal(resultado.renglones[0].libroId, "lib-02");
  assert.equal(resultado.total, 2000);
  assert.equal(borrador.length, 2);
});

for (const [primero, segundo, cantidad, subtotal, total] of [[1500, 2000, 2, 3000, 5000], [0.10, 0.20, 3, 0.30, 0.50]]) {
  test(`calcula subtotales y total de referencia ${total}`, () => {
    const resultado = ventas.calcularVenta([{ libroId: "lib-01", cantidad }, { libroId: "lib-02", cantidad: 1 }], [libro(primero), libro(segundo, "lib-02")]);
    assert.deepEqual(resultado.errores, []);
    assert.equal(resultado.renglones[0].subtotal, subtotal);
    assert.equal(resultado.renglones[1].subtotal, segundo);
    assert.equal(resultado.total, total);
  });
}

test("rechaza acumulación de cantidades fuera del rango seguro", () => {
  const borrador = [{ libroId: "lib-01", cantidad: Number.MAX_SAFE_INTEGER }];
  const resultado = ventas.agregarRenglon(borrador, "lib-01", 1, [libro(0.001)]);
  assert.equal(resultado.errores[0].campo, "cantidad");
  assert.equal(resultado.renglones, undefined);
  assert.equal(borrador[0].cantidad, Number.MAX_SAFE_INTEGER);
});

test("rechaza subtotal inseguro aunque cantidad y precio sean seguros", () => {
  const resultado = calcular(0.02, Number.MAX_SAFE_INTEGER);
  assert.equal(resultado.errores[0].campo, "cantidad");
  assert.equal(resultado.total, undefined);
});

test("rechaza total inseguro aunque cada subtotal sea seguro", () => {
  const resultado = ventas.calcularVenta([{ libroId: "lib-01", cantidad: 1 }, { libroId: "lib-02", cantidad: 1 }], [libro(45035996273704.96), libro(45035996273704.96, "lib-02")]);
  assert.equal(resultado.errores[0].campo, "renglones");
  assert.equal(resultado.total, undefined);
});

const clientes = [{ id: "cli-01", nombreCompleto: "Cliente de prueba", email: "cliente@ejemplo.test" }];

test("validarVenta acepta cliente vigente y renglones válidos", () => {
  assert.deepEqual(ventas.validarVenta("cli-01", [{ libroId: "lib-01", cantidad: 2 }], clientes, [libro(1500)]), []);
});

for (const clienteId of ["", "inexistente", undefined]) {
  test(`validarVenta rechaza cliente ausente o inexistente: ${String(clienteId)}`, () => {
    const errores = ventas.validarVenta(clienteId, [{ libroId: "lib-01", cantidad: 1 }], clientes, [libro(1500)]);
    assert.equal(errores.length, 1);
    assert.equal(errores[0].campo, "cliente");
  });
}

test("validarVenta rechaza borrador vacío", () => {
  assert.equal(ventas.validarVenta("cli-01", [], clientes, [libro(1500)])[0].campo, "renglones");
});

for (const [renglones, campo] of [
  [[{ libroId: "inexistente", cantidad: 1 }], "libro"],
  [[{ libroId: "lib-01", cantidad: 0 }], "cantidad"],
  [[{ libroId: "lib-01", cantidad: 1 }, { libroId: "lib-01", cantidad: 2 }], "renglones"]
]) {
  test(`validarVenta rechaza ${campo} inválidos`, () => {
    const copia = structuredClone(renglones);
    assert.equal(ventas.validarVenta("cli-01", renglones, clientes, [libro(1500)])[0].campo, campo);
    assert.deepEqual(renglones, copia);
  });
}

test("construye la venta completa sin ID y con fecha suministrada", () => {
  const renglones = calcular(1500.125, 2).renglones;
  const resultado = ventas.construirVenta(clientes[0], renglones, "2026-10-16T23:45:00.000Z");
  assert.deepEqual(resultado, {
    errores: [],
    venta: {
      fecha: "2026-10-16T23:45:00.000Z",
      cliente: { id: "cli-01", nombreCompleto: "Cliente de prueba", email: "cliente@ejemplo.test" },
      renglones: [{ libroId: "lib-01", titulo: "Libro de prueba", isbn: "978-1", cantidad: 2, precioUnitario: 1500.13, subtotal: 3000.26 }],
      total: 3000.26
    }
  });
});

test("la instantánea no comparte referencias con cliente, catálogo ni borrador", () => {
  const cliente = { ...clientes[0] };
  const catalogo = [libro(1500.125)];
  const borrador = ventas.calcularVenta([{ libroId: "lib-01", cantidad: 2 }], catalogo).renglones;
  const resultado = ventas.construirVenta(cliente, borrador, "2026-01-06T01:07:00.000Z");
  cliente.nombreCompleto = "Modificado";
  catalogo[0].titulo = "Modificado";
  catalogo[0].isbn = "Otro";
  catalogo[0].precio = 999;
  borrador[0].titulo = "Modificado";
  borrador[0].cantidad = 99;
  borrador.push({ libroId: "otro", cantidad: 1 });
  assert.equal(resultado.venta.cliente.nombreCompleto, "Cliente de prueba");
  assert.deepEqual(resultado.venta.renglones, [{ libroId: "lib-01", titulo: "Libro de prueba", isbn: "978-1", cantidad: 2, precioUnitario: 1500.13, subtotal: 3000.26 }]);
  assert.equal(resultado.venta.total, 3000.26);
});

test("construirVenta conserva el unitario cero redondeado desde un precio positivo", () => {
  const resultado = ventas.construirVenta(clientes[0], calcular(0.004, 2).renglones, "2026-01-06T01:07:00.000Z");
  assert.deepEqual(resultado.errores, []);
  assert.equal(resultado.venta.renglones[0].precioUnitario, 0);
  assert.equal(resultado.venta.total, 0);
});

for (const [cliente, renglones, fecha, campo] of [
  [null, calcular(1).renglones, "2026-01-06T01:07:00.000Z", "cliente"],
  [clientes[0], [], "2026-01-06T01:07:00.000Z", "renglones"],
  [clientes[0], [{ ...calcular(1).renglones[0], cantidad: 0 }], "2026-01-06T01:07:00.000Z", "cantidad"],
  [clientes[0], [{ ...calcular(1).renglones[0], precioUnitario: Infinity }], "2026-01-06T01:07:00.000Z", "libro"],
  [clientes[0], calcular(1).renglones, "fecha inválida", "fecha"]
]) {
  test(`construirVenta rechaza ${campo} inválido sin producir venta`, () => {
    const copia = structuredClone(renglones);
    const resultado = ventas.construirVenta(cliente, renglones, fecha);
    assert.equal(resultado.errores[0].campo, campo);
    assert.equal(resultado.venta, undefined);
    assert.deepEqual(renglones, copia);
  });
}

test("construirVenta calcula el total en centavos y copia solo los campos del contrato", () => {
  const renglones = ventas.calcularVenta([{ libroId: "lib-01", cantidad: 3 }, { libroId: "lib-02", cantidad: 1 }], [libro(0.1), libro(0.2, "lib-02")]).renglones;
  renglones[0].extra = { mutable: true };
  const resultado = ventas.construirVenta({ ...clientes[0], extra: { mutable: true } }, renglones, "2026-01-06T01:07:00.000Z");
  assert.deepEqual(resultado.errores, []);
  assert.equal(resultado.venta.total, 0.5);
  assert.equal(resultado.venta.renglones[0].extra, undefined);
  assert.equal(resultado.venta.cliente.extra, undefined);
});

test("construirVenta rechaza renglones duplicados", () => {
  const renglon = calcular(1).renglones[0];
  const resultado = ventas.construirVenta(clientes[0], [renglon, { ...renglon }], "2026-01-06T01:07:00.000Z");
  assert.equal(resultado.errores[0].campo, "renglones");
  assert.equal(resultado.venta, undefined);
});

test("construirVenta rechaza fecha sin hora ISO", () => {
  const resultado = ventas.construirVenta(clientes[0], calcular(1).renglones, "2026-01-06");
  assert.equal(resultado.errores[0].campo, "fecha");
  assert.equal(resultado.venta, undefined);
});

test("construirVenta rechaza subtotal alterado en vez de confirmar una venta distinta", () => {
  const renglones = calcular(1500, 2).renglones;
  renglones[0].subtotal = 3001;
  const resultado = ventas.construirVenta(clientes[0], renglones, "2026-01-06T01:07:00.000Z");
  assert.equal(resultado.errores[0].campo, "renglones");
  assert.equal(resultado.venta, undefined);
  assert.equal(renglones[0].subtotal, 3001);
});
