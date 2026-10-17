(function () {
  "use strict";

  window.Libreria.almacen.inicializar();
  const almacen = window.Libreria.almacen;
  const interfaz = window.Libreria.interfaz;
  const filasVentas = document.getElementById("filas-ventas");
  const filasDetalle = document.getElementById("filas-detalle");
  const tablaVentas = document.getElementById("tabla-ventas");
  const contenedorVentas = tablaVentas.parentElement;
  const mensajeVacio = document.getElementById("ventas-vacio");
  const mensajeError = document.getElementById("mensaje-error");
  const detalle = document.getElementById("detalle-venta");
  const tituloDetalle = document.getElementById("detalle-venta-titulo");
  const totalDetalle = document.getElementById("detalle-total");
  const plantillaVenta = document.getElementById("plantilla-fila-venta");
  const plantillaDetalle = document.getElementById("plantilla-fila-detalle");

  // La fecha guardada representa un instante; sus componentes locales se usan
  // solo para presentación, sin escribir ni reinterpretar el ISO almacenado.
  function formatearFecha(iso) {
    const fecha = new Date(iso);
    if (!Number.isFinite(fecha.getTime())) return "Fecha no válida";
    function dosDigitos(numero) { return String(numero).padStart(2, "0"); }
    return dosDigitos(fecha.getDate()) + "/" + dosDigitos(fecha.getMonth() + 1)
      + "/" + String(fecha.getFullYear()).padStart(4, "0") + " "
      + dosDigitos(fecha.getHours()) + ":" + dosDigitos(fecha.getMinutes());
  }

  function mostrarDetalle(venta) {
    interfaz.vaciarNodo(filasDetalle);
    venta.renglones.forEach(function (renglon) {
      const fila = plantillaDetalle.content.firstElementChild.cloneNode(true);
      fila.querySelector('[data-campo="libro"]').textContent = renglon.titulo + " · ISBN " + renglon.isbn;
      fila.querySelector('[data-campo="cantidad"]').textContent = renglon.cantidad;
      fila.querySelector('[data-campo="precio-unitario"]').textContent = interfaz.formatearImporte(renglon.precioUnitario);
      fila.querySelector('[data-campo="subtotal"]').textContent = interfaz.formatearImporte(renglon.subtotal);
      filasDetalle.appendChild(fila);
    });
    tituloDetalle.textContent = "Detalle de la venta " + venta.id;
    totalDetalle.textContent = interfaz.formatearImporte(venta.total);
    detalle.hidden = false;
    tituloDetalle.focus();
  }

  function pintarVenta(venta) {
    const fila = plantillaVenta.content.firstElementChild.cloneNode(true);
    fila.querySelector('[data-campo="identificador"]').textContent = venta.id;
    fila.querySelector('[data-campo="fecha"]').textContent = formatearFecha(venta.fecha);
    fila.querySelector('[data-campo="cliente"]').textContent = venta.cliente.nombreCompleto;
    fila.querySelector('[data-campo="total"]').textContent = interfaz.formatearImporte(venta.total);
    const boton = fila.querySelector('[data-accion="ver-detalle"]');
    boton.textContent = "Ver detalle de " + venta.id;
    boton.setAttribute("aria-controls", "detalle-venta");
    boton.addEventListener("click", function () { mostrarDetalle(venta); });
    filasVentas.appendChild(fila);
  }

  function cargarHistorial() {
    interfaz.vaciarNodo(filasVentas);
    interfaz.vaciarNodo(filasDetalle);
    interfaz.ocultarMensaje(mensajeError);
    interfaz.ocultarMensaje(mensajeVacio);
    detalle.hidden = true;
    tablaVentas.hidden = true;
    contenedorVentas.hidden = true;
    try {
      // Única fuente: instantáneas guardadas. No consultar catálogo ni clientes.
      const ventas = almacen.obtenerVentas();
      ventas.forEach(pintarVenta);
      if (ventas.length === 0) {
        interfaz.mostrarMensaje(mensajeVacio, "No hay ventas confirmadas.");
      } else {
        tablaVentas.hidden = false;
        contenedorVentas.hidden = false;
      }
    } catch (error) {
      interfaz.vaciarNodo(filasVentas);
      interfaz.mostrarMensaje(mensajeError, "No se pudo consultar el historial. Los datos guardados no se modificaron. Revisa el acceso al almacenamiento e inténtalo nuevamente al recargar.");
    }
  }

  cargarHistorial();
})();
