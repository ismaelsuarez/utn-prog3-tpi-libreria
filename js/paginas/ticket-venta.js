(function (raiz) {
  "use strict";

  // Presentación aislada: no registra ventas ni modifica localStorage.
  // mostrar(ventaGuardada) recibe EXACTAMENTE el objeto devuelto por almacen.agregarVenta().
  const dialogo = document.getElementById("modal-comprobante");
  if (!dialogo) return;
  const buscar = function (id) { return document.getElementById(id); };
  const escena = buscar("ticket-venta-escena");
  const papel = buscar("ticket-venta-papel-contenedor");
  const indicador = buscar("ticket-venta-indicador");
  const estado = buscar("ticket-venta-estado");
  const detalle = buscar("ticket-venta-detalle");
  const anuncio = buscar("ticket-venta-anuncio");
  const repetir = buscar("ticket-venta-repetir");
  const imprimir = buscar("ticket-venta-imprimir");
  const cerrar = buscar("ticket-venta-cerrar");
  const formatoImporte = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 });
  const formatoFecha = new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" });
  const movimientoReducido = raiz.matchMedia && raiz.matchMedia("(prefers-reduced-motion: reduce)");
  let pendientes = [];
  let ventaActual = null;

  function limpiarTemporizadores() {
    pendientes.forEach(function (temporizador) { raiz.clearTimeout(temporizador); });
    pendientes = [];
  }
  function despues(funcion, milisegundos) {
    pendientes.push(raiz.setTimeout(funcion, milisegundos));
  }
  function etapa(nombre, titulo, subtitulo, etiqueta) {
    escena.dataset.estado = nombre;
    estado.textContent = titulo;
    detalle.textContent = subtitulo;
    indicador.textContent = etiqueta;
  }
  function crearRenglon(renglon) {
    const articulo = document.createElement("div");
    articulo.className = "ticket-venta__item";
    const nombre = document.createElement("strong");
    nombre.textContent = renglon.titulo;
    const linea = document.createElement("div");
    linea.className = "ticket-venta__item-detalle";
    const unidades = document.createElement("span");
    unidades.textContent = renglon.cantidad + " × " + formatoImporte.format(renglon.precioUnitario);
    const subtotal = document.createElement("span");
    subtotal.textContent = formatoImporte.format(renglon.subtotal);
    linea.append(unidades, subtotal);
    articulo.append(nombre, linea);
    return articulo;
  }
  function rellenar(venta) {
    buscar("ticket-venta-id").textContent = venta.id;
    buscar("ticket-venta-codigo").textContent = venta.id.toUpperCase();
    buscar("ticket-venta-cliente").textContent = venta.cliente.nombreCompleto;
    buscar("ticket-venta-fecha").textContent = formatoFecha.format(new Date(venta.fecha));
    const lista = buscar("ticket-venta-renglones");
    lista.replaceChildren();
    venta.renglones.forEach(function (renglon) { lista.appendChild(crearRenglon(renglon)); });
    buscar("ticket-venta-total").textContent = formatoImporte.format(venta.total);
    // Una copia separada permite imprimir solo el comprobante, incluso si el modal está abierto.
    const copia = buscar("ticket-venta-papel").cloneNode(true);
    copia.removeAttribute("id");
    copia.querySelectorAll("[id]").forEach(function (nodo) { nodo.removeAttribute("id"); });
    buscar("ticket-venta-impresion").replaceChildren(copia);
  }
  function completar() {
    etapa("listo", "¡Comprobante listo!", "Podés imprimirlo o repetir la animación", "FINALIZADO");
    anuncio.textContent = "Venta " + ventaActual.id + " registrada correctamente. Tu comprobante está listo.";
    repetir.disabled = false;
    imprimir.disabled = false;
  }
  function animar() {
    if (!ventaActual || !dialogo.open) return;
    limpiarTemporizadores();
    repetir.disabled = true;
    imprimir.disabled = true;
    papel.style.transition = "none";
    etapa("reposo", "Preparando tu ticket…", "Colocando el papel", "PREPARANDO");
    anuncio.textContent = "Preparando el comprobante de la venta " + ventaActual.id + "…";
    // Restablecer el punto de partida para que Repetir funcione.
    void papel.offsetHeight;
    papel.style.removeProperty("transition");
    if (movimientoReducido && movimientoReducido.matches) {
      completar();
      return;
    }
    despues(function () {
      etapa("procesando", "Procesando comprobante…", "Verificando los datos de la compra", "PROCESANDO");
      despues(function () {
        etapa("imprimiendo", "Imprimiendo tu ticket…", "El papel está saliendo de la impresora", "IMPRIMIENDO");
        anuncio.textContent = "Imprimiendo el comprobante de la venta " + ventaActual.id + "…";
        despues(completar, 3000);
      }, 650);
    }, 80);
  }
  function mostrar(ventaGuardada) {
    if (!ventaGuardada || !ventaGuardada.id || !ventaGuardada.cliente || !Array.isArray(ventaGuardada.renglones)) {
      throw new TypeError("La venta guardada no contiene los datos necesarios para el comprobante.");
    }
    rellenar(ventaGuardada);
    ventaActual = ventaGuardada;
    if (!dialogo.open) dialogo.showModal();
    animar();
  }
  function cerrarModal() {
    if (dialogo.open) dialogo.close();
  }
  dialogo.addEventListener("close", function () { limpiarTemporizadores(); });
  cerrar.addEventListener("click", cerrarModal);
  repetir.addEventListener("click", function () { if (!repetir.disabled) animar(); });
  imprimir.addEventListener("click", function () { if (!imprimir.disabled) raiz.print(); });
  // Cerrar haciendo clic FUERA de la ventana, sin interceptar clics en el ticket.
  dialogo.addEventListener("click", function (evento) {
    if (evento.target === dialogo) cerrarModal();
  });

  raiz.Libreria = raiz.Libreria || {};
  raiz.Libreria.comprobante = { mostrar: mostrar };
})(window);
