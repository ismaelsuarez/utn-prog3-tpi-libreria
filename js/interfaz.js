(function (raiz) {
  "use strict";

  function mostrarMensaje(nodo, texto) {
    nodo.textContent = texto;
    nodo.hidden = false;
  }

  function ocultarMensaje(nodo) {
    nodo.hidden = true;
  }

  function vaciarNodo(nodo) {
    while (nodo.firstChild) {
      nodo.removeChild(nodo.firstChild);
    }
  }

  function formatearImporte(numero) {
    return "$ " + numero.toFixed(2).replace(".", ",");
  }

  const api = { mostrarMensaje, ocultarMensaje, vaciarNodo, formatearImporte };

  raiz.Libreria = raiz.Libreria || {};
  raiz.Libreria.interfaz = api;
})(typeof window !== "undefined" ? window : globalThis);
