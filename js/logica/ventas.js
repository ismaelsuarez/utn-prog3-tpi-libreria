(function (raiz) {
  "use strict";

  // API pública pura: renglones de entrada {libroId, cantidad}; cantidades
  // numéricas o texto numérico no vacío, siempre enteras positivas seguras.
  // calcularVenta/agregarRenglon/cambiarCantidad/quitarRenglon reciben también
  // el catálogo vigente. Éxito: {errores: [], renglones, total}; rechazo:
  // {errores: [{campo, mensaje}]}, sin sustituir el último borrador válido.
  // Cada renglón devuelto copia título, ISBN, cantidad, unitario y subtotal.
  // Ninguna operación modifica las entradas ni comparte objetos de renglón.
  //
  // Firmas: calcularVenta(renglones, libros),
  // agregarRenglon(renglones, libroId, cantidad, libros),
  // cambiarCantidad(renglones, libroId, cantidad, libros),
  // quitarRenglon(renglones, libroId, libros).
  // validarVenta(clienteId, renglones, clientes, libros) devuelve solo errores;
  // exige cliente vigente y al menos una fila, además del cálculo válido.
  // construirVenta(cliente, renglonesEnriquecidos, fechaISO) devuelve
  // {errores: [], venta} sin ID, o {errores}; debe llamarse tras validarVenta.
  // No consulta catálogo ni reloj: copia datos y conserva importes confirmados.
  //
  // Límites: cantidad, subtotal y suma en centavos deben ser enteros seguros.
  // El precio crudo debe ser numérico, finito y positivo; se redondea primero
  // al centavo, con mitades hacia arriba. Un positivo subcentavo puede dar 0.
  // Se opera sobre el decimal disponible, no sobre precisión ya perdida.
  function aCentavos(precio) {
    if (typeof precio !== "number" || !Number.isFinite(precio) || precio < 0) return null;
    const partes = String(precio).toLowerCase().split("e");
    const decimal = partes[0].split(".");
    const digitos = decimal.join("");
    // Ubicación del corte en centavos sobre los dígitos, incluido el exponente.
    // No multiplicar el precio binario por 100: 1.005 debe producir 101.
    const corte = decimal[0].length + Number(partes[1] || 0) + 2;
    const enteros = corte <= 0 ? "0" : digitos.slice(0, corte).padEnd(corte, "0");
    const siguiente = corte < 0 ? "0" : (digitos[corte] || "0");
    const centavos = Number(enteros) + (siguiente >= "5" ? 1 : 0);
    return Number.isSafeInteger(centavos) ? centavos : null;
  }

  function cantidadValida(cantidad) {
    return (typeof cantidad === "number" || (typeof cantidad === "string" && cantidad.trim() !== ""))
      && Number.isSafeInteger(Number(cantidad)) && Number(cantidad) > 0;
  }

  function calcular(renglones, resolverLibro, permiteCero) {
    const errores = [];
    const ids = renglones.map(function (renglon) { return renglon.libroId; });
    if (new Set(ids).size !== ids.length) {
      return { errores: [{ campo: "renglones", mensaje: "Cada libro debe aparecer en un único renglón." }] };
    }
    let totalCentavos = 0;
    const calculados = renglones.map(function (renglon) {
      if (!cantidadValida(renglon.cantidad)) {
        errores.push({ campo: "cantidad", mensaje: "La cantidad debe ser un entero positivo seguro." });
        return null;
      }
      const libro = resolverLibro(renglon);
      if (!libro) {
        errores.push({ campo: "libro", mensaje: "Seleccione un libro existente." });
        return null;
      }
      const centavos = aCentavos(libro.precio);
      if (centavos === null || (!permiteCero && libro.precio === 0)) {
        errores.push({ campo: "libro", mensaje: "El precio del libro no es utilizable en una venta." });
        return null;
      }
      const subtotalCentavos = centavos * renglon.cantidad;
      if (!Number.isSafeInteger(subtotalCentavos)) {
        errores.push({ campo: "cantidad", mensaje: "El subtotal excede el rango seguro de centavos." });
        return null;
      }
      totalCentavos += subtotalCentavos;
      return {
        libroId: libro.id, titulo: libro.titulo, isbn: libro.isbn,
        cantidad: Number(renglon.cantidad), precioUnitario: centavos / 100, subtotal: subtotalCentavos / 100
      };
    });
    if (!Number.isSafeInteger(totalCentavos)) {
      errores.push({ campo: "renglones", mensaje: "El total excede el rango seguro de centavos." });
    }
    return errores.length ? { errores } : { errores: [], renglones: calculados, total: totalCentavos / 100 };
  }

  function calcularVenta(renglones, libros) {
    return calcular(renglones, function (renglon) {
      return libros.find(function (registro) { return registro.id === renglon.libroId; });
    }, false);
  }

  function agregarRenglon(renglones, libroId, cantidad, libros) {
    if (!cantidadValida(cantidad)) {
      return { errores: [{ campo: "cantidad", mensaje: "La cantidad debe ser un entero positivo seguro." }] };
    }
    const existente = renglones.find(function (renglon) { return renglon.libroId === libroId; });
    const nuevos = existente ? renglones.map(function (renglon) {
      return renglon.libroId === libroId ? { libroId, cantidad: Number(renglon.cantidad) + Number(cantidad) } : renglon;
    }) : renglones.concat([{ libroId, cantidad: Number(cantidad) }]);
    return calcularVenta(nuevos, libros);
  }

  function cambiarCantidad(renglones, libroId, cantidad, libros) {
    if (!cantidadValida(cantidad)) {
      return { errores: [{ campo: "cantidad", mensaje: "La cantidad debe ser un entero positivo seguro." }] };
    }
    if (!renglones.some(function (renglon) { return renglon.libroId === libroId; })) {
      return { errores: [{ campo: "libro", mensaje: "El libro no pertenece al borrador." }] };
    }
    return calcularVenta(renglones.map(function (renglon) {
      return renglon.libroId === libroId ? { libroId, cantidad: Number(cantidad) } : renglon;
    }), libros);
  }

  function quitarRenglon(renglones, libroId, libros) {
    return calcularVenta(renglones.filter(function (renglon) { return renglon.libroId !== libroId; }), libros);
  }

  function validarVenta(clienteId, renglones, clientes, libros) {
    const errores = [];
    if (!clientes.some(function (cliente) { return cliente.id === clienteId; })) {
      errores.push({ campo: "cliente", mensaje: "Seleccione un cliente existente." });
    }
    if (renglones.length === 0) {
      errores.push({ campo: "renglones", mensaje: "Agregue al menos un libro a la venta." });
    }
    return errores.concat(calcularVenta(renglones, libros).errores);
  }

  function construirVenta(cliente, renglones, fecha) {
    const errores = [];
    if (!cliente || !cliente.id) {
      errores.push({ campo: "cliente", mensaje: "Seleccione un cliente existente." });
    }
    if (renglones.length === 0) {
      errores.push({ campo: "renglones", mensaje: "Agregue al menos un libro a la venta." });
    }
    if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(fecha) || !Number.isFinite(Date.parse(fecha))) {
      errores.push({ campo: "fecha", mensaje: "La fecha de confirmación no es válida." });
    }
    const resultado = calcular(renglones, function (renglon) {
      return { id: renglon.libroId, titulo: renglon.titulo, isbn: renglon.isbn, precio: renglon.precioUnitario };
    }, true);
    errores.push(...resultado.errores);
    if (!resultado.errores.length && renglones.some(function (renglon, indice) {
      const calculado = resultado.renglones[indice];
      return renglon.precioUnitario !== calculado.precioUnitario || renglon.subtotal !== calculado.subtotal;
    })) {
      errores.push({ campo: "renglones", mensaje: "Los importes del borrador no coinciden con sus cantidades y unitarios." });
    }
    if (errores.length) return { errores };
    return {
      errores: [],
      venta: {
        fecha,
        cliente: { id: cliente.id, nombreCompleto: cliente.nombreCompleto, email: cliente.email },
        renglones: resultado.renglones,
        total: resultado.total
      }
    };
  }

  const api = { calcularVenta, agregarRenglon, cambiarCantidad, quitarRenglon, validarVenta, construirVenta };
  raiz.Libreria = raiz.Libreria || {};
  raiz.Libreria.ventas = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
