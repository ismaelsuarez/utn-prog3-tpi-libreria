(function () {
  "use strict";

  Libreria.almacen.inicializar();
  const almacen = Libreria.almacen;
  const logica = Libreria.ventas;
  const interfaz = Libreria.interfaz;
  const formulario = document.getElementById("form-venta");
  const cliente = document.getElementById("venta-cliente");
  const libro = document.getElementById("venta-libro");
  const cantidad = document.getElementById("venta-cantidad");
  const agregar = document.getElementById("boton-agregar-renglon");
  const confirmar = document.getElementById("boton-confirmar-venta");
  const filas = document.getElementById("filas-renglones");
  const plantilla = document.getElementById("plantilla-fila-renglon");
  const vacio = document.getElementById("renglones-vacio");
  const total = document.getElementById("venta-total");
  const estado = document.getElementById("mensaje-estado");
  const errorGeneral = document.getElementById("mensaje-error");
  const controles = { cliente, libro, cantidad };
  let renglones = [];
  let numeroFila = 0;
  let confirmando = false;
  let ultimaVentaConfirmada = null;

  function limpiarMensajes() {
    interfaz.ocultarMensaje(estado);
    interfaz.ocultarMensaje(errorGeneral);
    Object.keys(controles).forEach(function (campo) {
      controles[campo].removeAttribute("aria-invalid");
      interfaz.ocultarMensaje(document.getElementById("error-venta-" + campo));
    });
  }

  function mostrarErrores(errores) {
    errores.forEach(function (error) {
      if (controles[error.campo]) {
        controles[error.campo].setAttribute("aria-invalid", "true");
        interfaz.mostrarMensaje(document.getElementById("error-venta-" + error.campo), error.mensaje);
      }
    });
    interfaz.mostrarMensaje(errorGeneral, errores.map(function (error) { return error.mensaje; }).join(" "));
    (controles[errores[0].campo] || agregar).focus();
  }

  function informarFallo() {
    interfaz.ocultarMensaje(estado);
    interfaz.mostrarMensaje(errorGeneral, "No se pudo acceder al almacenamiento. La venta no se confirmó; el borrador se conserva. Intente nuevamente.");
  }

  function filaDe(libroId) {
    return Array.from(filas.children).find(function (fila) { return fila.dataset.libroId === libroId; });
  }

  function renderizar(resultado) {
    renglones = resultado.renglones;
    Array.from(filas.children).forEach(function (fila) {
      if (!renglones.some(function (renglon) { return renglon.libroId === fila.dataset.libroId; })) fila.remove();
    });
    renglones.forEach(function (renglon) {
      let fila = filaDe(renglon.libroId);
      if (!fila) {
        fila = plantilla.content.firstElementChild.cloneNode(true);
        fila.dataset.libroId = renglon.libroId;
        numeroFila += 1;
        const error = fila.querySelector('[data-campo="error-cantidad"]');
        error.id = "error-renglon-" + numeroFila;
        fila.querySelector('[data-campo="cantidad"]').setAttribute("aria-describedby", error.id);
        filas.appendChild(fila);
      }
      fila.querySelectorAll('[data-campo="libro"]').forEach(function (nodo) { nodo.textContent = renglon.titulo; });
      const control = fila.querySelector('[data-campo="cantidad"]');
      // No reemplazar controles ni borrar una edición inválida al actualizar otra fila.
      if (!control.hasAttribute("aria-invalid") && document.activeElement !== control) control.value = renglon.cantidad;
      fila.querySelector('[data-campo="precio-unitario"]').textContent = interfaz.formatearImporte(renglon.precioUnitario);
      fila.querySelector('[data-campo="subtotal"]').textContent = interfaz.formatearImporte(renglon.subtotal);
    });
    total.textContent = interfaz.formatearImporte(resultado.total);
    vacio.hidden = renglones.length !== 0;
  }

  function hayEdicionInvalida() {
    const invalido = filas.querySelector('[aria-invalid="true"]');
    if (!invalido) return false;
    interfaz.mostrarMensaje(errorGeneral, "Corrija la cantidad marcada o quite ese renglón antes de continuar.");
    invalido.focus();
    return true;
  }

  function llenarSelector(selector, registros, propiedad) {
    registros.forEach(function (registro) {
      const opcion = document.createElement("option");
      opcion.value = registro.id;
      opcion.textContent = registro[propiedad];
      selector.appendChild(opcion);
    });
  }

  // Cuando se crea o edita un cliente en otra pestaña, actualizamos la lista
  // sin perder la selección actual. Las ventas siempre validan por ID.
  function actualizarSelectorClientes() {
    const seleccionado = cliente.value;
    const actuales = almacen.obtenerClientes();
    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = "Elegir un cliente";
    cliente.replaceChildren(opcionInicial);
    llenarSelector(cliente, actuales, "nombreCompleto");
    if (actuales.some(function (registro) { return registro.id === seleccionado; })) {
      cliente.value = seleccionado;
    }
  }

  cliente.addEventListener("focus", function () {
    try { actualizarSelectorClientes(); } catch (error) { informarFallo(); }
  });
  window.addEventListener("pageshow", function () {
    try { actualizarSelectorClientes(); } catch (error) { informarFallo(); }
  });
  window.addEventListener("storage", function (evento) {
    if (evento.key === "libreria.clientes") {
      try { actualizarSelectorClientes(); } catch (error) { informarFallo(); }
    }
  });

  agregar.addEventListener("click", function () {
    limpiarMensajes();
    if (hayEdicionInvalida()) return;
    try {
      const resultado = logica.agregarRenglon(renglones, libro.value, cantidad.value, almacen.obtenerLibros());
      if (resultado.errores.length) return mostrarErrores(resultado.errores);
      renderizar(resultado);
      ultimaVentaConfirmada = null; // Inició o modificó una nueva operación.
      cantidad.value = "1";
      interfaz.mostrarMensaje(estado, "Renglón actualizado correctamente.");
    } catch (error) {
      informarFallo();
    }
  });

  filas.addEventListener("input", function (evento) {
    const control = evento.target;
    if (control.dataset.campo !== "cantidad") return;
    limpiarMensajes();
    const fila = control.closest("tr");
    const aviso = fila.querySelector('[data-campo="error-cantidad"]');
    try {
      const resultado = logica.cambiarCantidad(renglones, fila.dataset.libroId, control.value, almacen.obtenerLibros());
      if (resultado.errores.length) {
        control.setAttribute("aria-invalid", "true");
        interfaz.mostrarMensaje(aviso, resultado.errores.map(function (error) { return error.mensaje; }).join(" "));
        interfaz.mostrarMensaje(errorGeneral, "Hay una cantidad inválida. Corríjala o quite el renglón; los importes conservan el último cálculo válido.");
        return;
      }
      control.removeAttribute("aria-invalid");
      interfaz.ocultarMensaje(aviso);
      renderizar(resultado);
    } catch (error) {
      control.setAttribute("aria-invalid", "true");
      interfaz.mostrarMensaje(aviso, "No se pudo comprobar esta cantidad. Intente nuevamente.");
      informarFallo();
    }
  });

  filas.addEventListener("click", function (evento) {
    const boton = evento.target.closest('[data-accion="quitar-renglon"]');
    if (!boton) return;
    limpiarMensajes();
    const fila = boton.closest("tr");
    const siguiente = fila.nextElementSibling || fila.previousElementSibling;
    try {
      const resultado = logica.quitarRenglon(renglones, fila.dataset.libroId, almacen.obtenerLibros());
      if (resultado.errores.length) return mostrarErrores(resultado.errores);
      renderizar(resultado);
      (siguiente ? siguiente.querySelector('[data-campo="cantidad"]') : libro).focus();
      interfaz.mostrarMensaje(estado, "Renglón quitado de la venta.");
    } catch (error) {
      informarFallo();
    }
  });

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (confirmando) return;

    // Al finalizar una venta se limpia el borrador. Un segundo submit (doble
    // clic/Enter) NO puede convertir el éxito anterior en «cliente inexistente».
    if (ultimaVentaConfirmada && renglones.length === 0 && cliente.value === "") {
      interfaz.ocultarMensaje(errorGeneral);
      interfaz.mostrarMensaje(estado,
        "Venta " + ultimaVentaConfirmada.id + " ya registrada correctamente. " +
        "Podés consultarla en Historial. Para otra venta, elegí un cliente y agregá libros.");
      return;
    }

    limpiarMensajes();
    if (hayEdicionInvalida()) return;

    let guardada;
    confirmando = true;
    confirmar.disabled = true;
    try {
      const libros = almacen.obtenerLibros();
      const clientes = almacen.obtenerClientes();
      const entradas = renglones.map(function (renglon) {
        const fila = filaDe(renglon.libroId);
        return {
          libroId: renglon.libroId,
          cantidad: fila.querySelector('[data-campo="cantidad"]').value
        };
      });
      const errores = logica.validarVenta(cliente.value, entradas, clientes, libros);
      if (errores.length) return mostrarErrores(errores);
      const calculada = logica.calcularVenta(entradas, libros);
      renderizar(calculada);
      const elegida = clientes.find(function (registro) { return registro.id === cliente.value; });
      const resultado = logica.construirVenta(elegida, renglones, new Date().toISOString());
      if (resultado.errores.length) return mostrarErrores(resultado.errores);
      guardada = almacen.agregarVenta(resultado.venta);
    } catch (error) {
      informarFallo();
      return;
    } finally {
      confirmando = false;
      confirmar.disabled = false;
    }

    // Desde este punto la venta YA está guardada. Nada visual puede anularla.
    ultimaVentaConfirmada = guardada;
    try {
      formulario.reset();
      renderizar({ renglones: [], total: 0 });
    } catch (errorVisual) {
      interfaz.mostrarMensaje(estado,
        "Venta " + guardada.id + " registrada correctamente en Historial.");
      return;
    }
    interfaz.mostrarMensaje(estado,
      "Venta " + guardada.id + " registrada correctamente. El comprobante está disponible.");
    try {
      Libreria.comprobante.mostrar(guardada);
    } catch (errorTicket) {
      interfaz.mostrarMensaje(estado,
        "Venta " + guardada.id + " registrada correctamente. No se pudo mostrar " +
        "el ticket, pero la venta sigue disponible en Historial.");
    }
  });

  try {
    actualizarSelectorClientes();
    llenarSelector(libro, almacen.obtenerLibros(), "titulo");
  } catch (error) {
    informarFallo();
  }
})();
