(function (raiz) {
  "use strict";

  // Lógica pura del alta y edición de clientes (RN-CL-01 a RN-CL-04).
  // No toca el DOM ni el almacenamiento del navegador (reglas 6 y 7):
  // se prueba con node --test.
  // El formato se valida con un regex simple tras normalizar (SU-07 / PA-11).

  const texto = (typeof module !== "undefined" && module.exports)
    ? require("./texto.js")
    : raiz.Libreria.texto;

  const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const FORMATO_TELEFONO = /^\+?[\d\s().-]+$/;

  function aCadena(valor) {
    return valor === null || valor === undefined ? "" : String(valor);
  }

  function validarCliente(datos, clientes, idEnEdicion) {
    const errores = [];
    const registro = datos || {};
    const conjuntoClientes = Array.isArray(clientes) ? clientes : [];

    // RN-CL-01
    if (aCadena(registro.nombreCompleto).trim() === "") {
      errores.push({ campo: "nombre", mensaje: "El nombre completo es obligatorio." });
    }

    // RN-CL-02, RN-CL-03 y RN-CL-04: al editar, se excluye el propio ID.
    // Se comparan los email recortados y en
    // minúsculas, sin distinguir mayúsculas ni espacios de los extremos.
    const email = texto.normalizarEmail(aCadena(registro.email));
    if (email === "") {
      errores.push({ campo: "email", mensaje: "El email es obligatorio." });
    } else if (!FORMATO_EMAIL.test(email)) {
      errores.push({ campo: "email", mensaje: "El email no tiene un formato válido." });
    } else if (
      conjuntoClientes.some(function (cliente) {
        return cliente.id !== idEnEdicion && texto.normalizarEmail(aCadena(cliente.email)) === email;
      })
    ) {
      errores.push({ campo: "email", mensaje: "Ese email ya está registrado." });
    }

    // Los datos existentes pueden no tener telefono. Solo se exige al dar
    // de alta un cliente nuevo, sin alterar registros anteriores.
    const telefono = aCadena(registro.telefono).trim();
    const cantidadDigitos = telefono.replace(/\D/g, "").length;
    if (!telefono) {
      errores.push({ campo: "telefono", mensaje: "El teléfono es obligatorio." });
    } else if (!FORMATO_TELEFONO.test(telefono) || cantidadDigitos < 7 || cantidadDigitos > 15) {
      errores.push({ campo: "telefono", mensaje: "Ingresá un teléfono válido (entre 7 y 15 dígitos)." });
    }

    return errores;
  }

  const api = { validarCliente };

  raiz.Libreria = raiz.Libreria || {};
  raiz.Libreria.clientes = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
