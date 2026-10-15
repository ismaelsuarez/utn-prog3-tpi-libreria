(function (raiz) {
  "use strict";

  // Contrato de escritura (firma fija; implementación pendiente por change):
  //   agregarLibro(libro)    - registra un libro validado. Se implementa en C-04 (alta-de-libros-y-clientes).
  //   agregarCliente(cliente)- registra un cliente validado. Se implementa en C-04 (alta-de-libros-y-clientes).
  //   agregarVenta(venta)    - registra una venta confirmada. Se implementa en C-05 (venta-simulada-e-historial).
  // En este change (C-03) solo está implementada la lectura; la escritura
  // persistente llega según DD-09. Ninguna vista llama a agregar* todavía.

  const datos = (typeof module !== "undefined" && module.exports)
    ? require("./datos/datos-iniciales.js")
    : raiz.Libreria.datos;

  function copiarLibro(libro) {
    return Object.assign({}, libro, { autorIds: libro.autorIds.slice() });
  }

  function copiarRegistro(registro) {
    return Object.assign({}, registro);
  }

  const api = {
    obtenerLibros: function () {
      return datos.libros.map(copiarLibro);
    },
    obtenerClientes: function () {
      return datos.clientes.map(copiarRegistro);
    },
    obtenerVentas: function () {
      return [];
    },
    obtenerEditoriales: function () {
      return datos.editoriales.map(copiarRegistro);
    },
    obtenerGeneros: function () {
      return datos.generos.map(copiarRegistro);
    },
    obtenerAutores: function () {
      return datos.autores.map(copiarRegistro);
    },
    agregarLibro: function () {
      throw new Error("agregarLibro: pendiente de implementación (C-04 alta-de-libros-y-clientes)");
    },
    agregarCliente: function () {
      throw new Error("agregarCliente: pendiente de implementación (C-04 alta-de-libros-y-clientes)");
    },
    agregarVenta: function () {
      throw new Error("agregarVenta: pendiente de implementación (C-05 venta-simulada-e-historial)");
    }
  };

  raiz.Libreria = raiz.Libreria || {};
  raiz.Libreria.almacen = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
