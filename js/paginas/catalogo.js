// Interacción de la Etapa 1: filtra por título las tarjetas de ejemplo del
// Catálogo. El change datos-locales-catalogo-y-filtro reemplaza este archivo
// por la versión que genera las tarjetas desde los datos locales.
(function () {
  "use strict";

  const formulario = document.getElementById("form-busqueda");
  const campoBusqueda = document.getElementById("busqueda-titulo");
  const lista = document.getElementById("lista-catalogo");
  const mensajeSinResultados = document.getElementById("catalogo-sin-resultados");

  function normalizar(texto) {
    return texto.trim().toLowerCase();
  }

  function tituloDe(tarjeta) {
    return tarjeta.querySelector('[data-campo="titulo"]').textContent;
  }

  function filtrarPorTitulo() {
    const buscado = normalizar(campoBusqueda.value);
    const tarjetas = lista.querySelectorAll("li");
    let visibles = 0;

    tarjetas.forEach(function (tarjeta) {
      const coincide = normalizar(tituloDe(tarjeta)).includes(buscado);
      tarjeta.hidden = !coincide;
      if (coincide) {
        visibles += 1;
      }
    });

    const hayTarjetas = tarjetas.length > 0;
    lista.hidden = hayTarjetas && visibles === 0;
    mensajeSinResultados.hidden = !hayTarjetas || visibles > 0;
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    filtrarPorTitulo();
  });

  campoBusqueda.addEventListener("input", filtrarPorTitulo);
})();
