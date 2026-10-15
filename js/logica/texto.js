(function (raiz) {
  "use strict";

  function normalizarTexto(texto) {
    return String(texto).trim().toLowerCase();
  }

  function normalizarIsbn(isbn) {
    return String(isbn).replace(/[\s-]/g, "");
  }

  function normalizarEmail(email) {
    return String(email).trim().toLowerCase();
  }

  const api = { normalizarTexto, normalizarIsbn, normalizarEmail };

  raiz.Libreria = raiz.Libreria || {};
  raiz.Libreria.texto = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
