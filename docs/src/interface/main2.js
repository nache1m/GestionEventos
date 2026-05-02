/* global bootstrap */
// ------------------------
// IMPORTACIÓN DE CLASES DEL DOMINIO
// ------------------------
import { Usuario } from "../domain/usuario.js";
import { Evento } from "../domain/evento.js";
import { EventoList } from "../domain/eventolist.js";
import { Mesa } from "../domain/mesa.js";
import { UsuarioList } from "../domain/usuariolist.js";

// ------------------------
// VARIABLES GLOBALES Y "ALMACENES"
// ------------------------
const listaUsuarios = new UsuarioList();
const listaEventos = new EventoList();
let usuarioActual = null; // Usuario logueado
let invitadoEditandoIndex = null;
let eventoEditandoIndex = null;
window.listaUsuarios = listaUsuarios;
window.listaEventos = listaEventos;
window.usuarioActual = usuarioActual;

// ------------------------
// FUNCIÓN LOGIN: INGRESAR
// ------------------------
export function ingresar() {
  const form = document.getElementById("login-form");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  // Obtener datos del formulario
  const nombre = document.getElementById("nombreInicio").value.trim();
  const email = document.getElementById("emailInicio").value.trim();
  const rol = document.getElementById("rol").value;

  // Crear usuario (instancia de Usuario)
  usuarioActual = new Usuario(nombre);
  window.usuarioActual = usuarioActual;
  usuarioActual.setMail(email);
  usuarioActual.setTipo(rol);

  try {
    listaUsuarios.add(usuarioActual);
  } catch (e) {
    console.warn(e.message);
    // Si el usuario ya existe, se continúa
  }

  // Actualizamos el menú según el rol ingresado.
  updateNavForRol(rol);
  // Ocultar login y mostrar la aplicación
  document.getElementById("login-form").classList.add("d-none");
  document.getElementById("inicioSesion").classList.add("d-none");
  document.getElementById("app").classList.remove("d-none");

  // Actualizar la sección de inicio según el rol:
  const seccionInicio = document.getElementById("seccion-inicio");
  let contenido = "";
  switch (rol) {
    case "organizador":
      contenido = `
        <h2 class="text-primary">¡Hola ${nombre}!</h2>
        <p class="lead">Como organizador, podés gestionar invitados, eventos, mesas y notificaciones.</p>
        <img src="img/inicio-organizador.png" alt="Organizador" class="img-fluid mt-3" style="max-height: 450px;">
      `;
      break;
    case "anfitrión":
      contenido = `
        <h2 class="text-success">¡Bienvenido ${nombre}!</h2>
        <p class="lead">Como anfitrión, revisá el estado del evento, confirmaciones y restricciones.</p>
        <img src="img/inicio-anfitrión.png" alt="Anfitrión" class="img-fluid mt-3" style="max-height: 450px;">
      `;
      break;
    case "invitado":
      contenido = `
        <h2 class="text-info">¡Hola ${nombre}!</h2>
        <p class="lead">Como invitado, podés confirmar tu asistencia y ver los detalles del evento.</p>
        <img src="img/inicio-invitado.png" alt="Invitado" class="img-fluid mt-3" style="max-height: 450px;">
      `;
      break;
  }
  seccionInicio.innerHTML = `<div class="text-center my-4">${contenido}</div>`;
  actualizarNotificaciones();
  actualizarListaInvitados();
  actualizarListaEventos();
  // Ocultar todas las secciones y mostrar sólo la sección de inicio
  document
    .querySelectorAll("section")
    .forEach((section) => section.classList.add("d-none"));
  seccionInicio.classList.remove("d-none");
}
window.ingresar = ingresar;

// ------------------------
// NAVEGACIÓN: MENÚ Y VISIBILIDAD DE SECCIONES
// ------------------------
window.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-link");
  const secciones = document.querySelectorAll("section[id^='seccion-']");
  const loginForm = document.getElementById("login-form");
  const app = document.getElementById("app");
  const titulo = document.getElementById("inicioSesion");

  navItems.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const navId = link.parentElement.id;
      if (navId === "nav-salir") {
        // Cerrar sesión: limpiar la variable global y resetear la interfaz
        localStorage.clear();
        usuarioActual = null; // limpia la sesión global
        invitadoEditandoIndex = null;
        eventoEditandoIndex = null;

        // Limpiar los campos del formulario de login
        document.getElementById("nombreInicio").value = "";
        document.getElementById("emailInicio").value = "";
        document.getElementById("rol").value = "organizador"; // valor predeterminado

        // Restablecer el estado del menú: quitar clases activas y mostrar todos los ítems que correspondan al estado inicial
        navItems.forEach((l) => l.classList.remove("active"));
        document.getElementById("nav-usuarios").classList.remove("d-none");
        document.getElementById("nav-invitaciones").classList.remove("d-none");
        document.getElementById("nav-mesas").classList.remove("d-none");
        document.getElementById("nav-evento").classList.remove("d-none");
        document
          .getElementById("nav-notificaciones")
          .classList.remove("d-none");
        document.getElementById("nav-confirmar").classList.remove("d-none");
        document.getElementById("nav-restricciones").classList.remove("d-none");
        document
          .getElementById("nav-eventoInvitado")
          .classList.remove("d-none");

        // Ocultar todas las secciones de la aplicación
        secciones.forEach((sec) => sec.classList.add("d-none"));
        // Mostrar el formulario de login y el título
        app.classList.add("d-none");
        titulo.classList.remove("d-none");
        loginForm.classList.remove("d-none");

        const toast = new bootstrap.Toast(
          document.getElementById("logout-toast"),
          { delay: 3000 },
        );
        toast.show();
        return;
      }
      navItems.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      secciones.forEach((sec) => sec.classList.add("d-none"));
      const idSeccion = navId.replace("nav-", "seccion-");
      const seccionMostrar = document.getElementById(idSeccion);
      if (seccionMostrar) {
        if (navId === "nav-notificaciones") {
          actualizarNotificaciones();
        }
        seccionMostrar.classList.remove("d-none");
        if (navId === "nav-confirmar") {
          mostrarSeccionConfirmar();
        }
        if (navId === "nav-invitaciones") {
          verificarDisponibilidadParaInvitaciones();
        }
        if (
          navId === "nav-eventoInvitado" &&
          usuarioActual.getRol() === "invitado"
        ) {
          mostrarEventosConfirmadosInvitado();
        }
        if (idSeccion === "seccion-mesas") {
          mostrarSeccionMesas();
        }
        if (idSeccion === "seccion-restricciones") {
          mostrarSeccionRestricciones();
        }
      }
    });
  });
});

function updateNavForRol(rol) {
  // Primero, mostramos todos los ítems
  document.getElementById("nav-usuarios").classList.remove("d-none");
  document.getElementById("nav-invitaciones").classList.remove("d-none");
  document.getElementById("nav-mesas").classList.remove("d-none");
  document.getElementById("nav-evento").classList.remove("d-none");
  document.getElementById("nav-notificaciones").classList.remove("d-none");
  document.getElementById("nav-confirmar").classList.remove("d-none");
  document.getElementById("nav-restricciones").classList.remove("d-none");
  document.getElementById("nav-eventoInvitado").classList.remove("d-none");

  // Luego, según el rol, ocultar los ítems que no correspondan
  if (rol === "invitado") {
    // Para el invitado se ocultan secciones de gestión que no le interesan.
    document.getElementById("nav-usuarios").classList.add("d-none");
    document.getElementById("nav-invitaciones").classList.add("d-none");
    document.getElementById("nav-mesas").classList.add("d-none");
    document.getElementById("nav-evento").classList.add("d-none");
    document.getElementById("nav-restricciones").classList.add("d-none");
  } else if (rol === "organizador" || rol == "anfitrion") {
    // Si el usuario es organizador, ocultamos Notificaciones y Confirmar asistencia
    document.getElementById("nav-notificaciones").classList.add("d-none");
    document.getElementById("nav-confirmar").classList.add("d-none");
    document.getElementById("nav-eventoInvitado").classList.add("d-none");
    document.getElementById("seccion-notificaciones").classList.add("d-none");
    document.getElementById("seccion-confirmar").classList.add("d-none");
  }
}

// ------------------------
// GESTIÓN DE INVITADOS
// ------------------------
// Función para crear un invitado (desde la sección "Gestión de Invitados")
export function crearUsuario() {
  const nombreInvitado = document.getElementById("nombreInvitado").value.trim();
  const emailInvitado = document.getElementById("emailInvitado").value.trim();
  const telefonoInvitado = document
    .getElementById("telefonoInvitado")
    .value.trim();

  if (!nombreInvitado || !emailInvitado || !telefonoInvitado) {
    alert("Por favor, completá todos los campos.");
    return;
  }

  // Si estamos en modo edición, actualizamos el invitado existente
  if (invitadoEditandoIndex !== null) {
    // Obtenemos la instancia a modificar
    const usuarioEditar = listaUsuarios.getUsuarios()[invitadoEditandoIndex];
    // Actualizamos sus datos usando los setters correspondientes
    usuarioEditar.setNombre(nombreInvitado);
    usuarioEditar.setMail(emailInvitado);
    usuarioEditar.setTelefono(telefonoInvitado);
    invitadoEditandoIndex = null;
    document.getElementById("btnUsuario").innerText = "Crear";
    document.getElementById("btnCancelarUsuario").classList.add("d-none");
  } else {
    // Caso: creación de un nuevo invitado
    const nuevoInvitado = new Usuario(nombreInvitado);
    nuevoInvitado.setMail(emailInvitado);
    nuevoInvitado.setTipo("invitado");
    nuevoInvitado.setTelefono(telefonoInvitado);
    try {
      listaUsuarios.add(nuevoInvitado);
    } catch (e) {
      alert(e.message);
      return;
    }
  }
  // Actualizamos la lista de invitados y refrescamos las invitaciones
  actualizarListaInvitados();
  refrescarInvitaciones();
  // Limpiar el formulario
  document.getElementById("agregarUsuario-form").reset();
}
window.crearUsuario = crearUsuario;

// Función para mostrar la lista de invitados en la sección "Gestión de Invitados"
function actualizarListaInvitados() {
  const lista = document.getElementById("lista-usuarios");
  lista.innerHTML = "";

  // Obtenemos la lista completa y filtramos sólo los "invitado"
  const usuarios = listaUsuarios.getUsuarios();
  const invitados = usuarios.filter((u) => u.getRol() === "invitado");
  console.log("Total invitados:", invitados.length);
  if (invitados.length === 0) {
    // Si no hay invitados, agregamos un mensaje
    const sinInvitados = document.createElement("li");
    sinInvitados.className = "list-group-item text-center text-muted";
    sinInvitados.textContent = "Aún no hay invitados creados.";
    lista.appendChild(sinInvitados);
  } else {
    // Para cada invitado, usamos el índice real en el array global
    invitados.forEach((u) => {
      const actualIndex = usuarios.indexOf(u);
      const item = document.createElement("li");
      item.className =
        "list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row";

      const datos = document.createElement("div");
      datos.innerHTML = `<strong>${u.getNombre()}</strong><br>
                           <small>${u.getMail()} ${u.getTelefono() ? "- " + u.getTelefono() : ""}</small>`;

      // Botón "Editar"
      const btnEditar = document.createElement("button");
      btnEditar.className = "btn btn-sm btn-outline-primary";
      btnEditar.textContent = "Editar";
      btnEditar.onclick = () => cargarInvitadoEnFormulario(actualIndex);

      // Botón "Eliminar"
      const btnEliminar = document.createElement("button");
      btnEliminar.className = "btn btn-sm btn-outline-danger";
      btnEliminar.textContent = "Eliminar";
      btnEliminar.onclick = () => eliminarUsuario(actualIndex);

      const contenedorBotones = document.createElement("div");
      contenedorBotones.className = "d-flex gap-2";
      contenedorBotones.appendChild(btnEditar);
      contenedorBotones.appendChild(btnEliminar);

      item.appendChild(datos);
      item.appendChild(contenedorBotones);
      lista.appendChild(item);
    });
  }
}

// Función para cargar los datos de un invitado en el formulario para editar
function cargarInvitadoEnFormulario(index) {
  const invitado = listaUsuarios.getUsuarios()[index];
  invitadoEditandoIndex = index;
  document.getElementById("nombreInvitado").value = invitado.getNombre();
  document.getElementById("emailInvitado").value = invitado.getMail();
  document.getElementById("telefonoInvitado").value =
    invitado.getTelefono() || "";
  document.getElementById("btnUsuario").innerText = "Guardar cambios";
  document.getElementById("btnCancelarUsuario").classList.remove("d-none");
}

// Función para cancelar la edición de un invitado y restablecer el formulario
export function cancelarEdicionUsuario() {
  invitadoEditandoIndex = null;
  document.getElementById("agregarUsuario-form").reset();
  document.getElementById("btnUsuario").innerText = "Crear";
  document.getElementById("btnCancelarUsuario").classList.add("d-none");
}
window.cancelarEdicionUsuario = cancelarEdicionUsuario;

export function eliminarUsuario(index) {
  const usuarioAEliminar = listaUsuarios.getUsuarios()[index];

  if (!usuarioAEliminar) {
    alert("El usuario no existe.");
    return;
  }

  if (
    confirm(
      `¿Estás seguro de que querés eliminar a ${usuarioAEliminar.getNombre()}?`,
    )
  ) {
    try {
      listaUsuarios.quitarUsuario(usuarioAEliminar, listaEventos);
      actualizarListaInvitados();
      refrescarInvitaciones(); // Si tenés esta función para redibujar tabla
    } catch (error) {
      alert(error.message);
    }
  }
}

window.eliminarUsuario = eliminarUsuario;

// ------------------------
// GESTIÓN DE EVENTOS
// ------------------------
export function crearEvento() {
  const nombre = document.getElementById("nombreEvento").value.trim();
  const tipo = document.getElementById("tipoEvento").value;
  const fecha = document.getElementById("fechaEvento").value;
  // Obtenemos el valor de capacidad (convertido a número si se requiere)
  const capacidad = document.getElementById("capacidadEvento").value.trim();
  const ubicacion = document.getElementById("ubicacionEvento").value.trim();
  const dresscode = document.getElementById("dressEvento").value.trim();
  const descripcion = document.getElementById("descripcionEvento").value.trim();

  // Validación: se comprueba que todos los campos tengan valor (incluyendo capacidad)
  if (
    !nombre ||
    !tipo ||
    !fecha ||
    !ubicacion ||
    !dresscode ||
    !descripcion ||
    !capacidad
  ) {
    alert("Por favor, completá todos los campos.");
    return;
  }
  const selectedDate = new Date(fecha);
  // Obtenemos la fecha actual y 'reiniciamos' la hora para comparar solo la fecha
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    alert("La fecha del evento no puede ser anterior a la fecha actual.");
    return;
  }
  // Si estamos en modo edición, modificamos el evento existente.
  if (eventoEditandoIndex !== null) {
    const eventoEditar = listaEventos.getEventos()[eventoEditandoIndex];
    eventoEditar.setNombre(nombre);
    eventoEditar.setTipo(tipo);
    eventoEditar.setFecha(fecha);
    eventoEditar.setUbicacion(ubicacion);
    eventoEditar.setDescripcion(descripcion);
    eventoEditar.setDresscode(dresscode);
    // Asumimos que capacidad es un número; si es necesario, puedes convertirlo:
    eventoEditar.setCapacidad(Number(capacidad));

    // Reseteamos la variable de edición
    eventoEditandoIndex = null;
    document.getElementById("btnEvento").innerText = "Crear";
    document.getElementById("btnCancelar").classList.add("d-none");
  } else {
    // Caso: creación de un nuevo evento
    const nuevoEvento = new Evento(
      nombre,
      tipo,
      fecha,
      ubicacion,
      descripcion,
      dresscode,
      Number(capacidad),
    );
    try {
      listaEventos.add(nuevoEvento);
    } catch (e) {
      alert(e.message);
      return;
    }
  }

  document.getElementById("agregarEvento-form").reset();
  actualizarListaEventos();
  refrescarInvitaciones();
}
window.crearEvento = crearEvento;

function actualizarListaEventos() {
  const lista = document.getElementById("lista-eventos");
  lista.innerHTML = "";

  // Obtenemos el array completo de eventos
  const eventos = listaEventos.getEventos();

  // Si no hay eventos, agregamos un mensaje informativo
  if (eventos.length === 0) {
    const mensaje = document.createElement("li");
    mensaje.className = "list-group-item text-center text-muted";
    mensaje.textContent = "Aún no hay eventos creados.";
    lista.appendChild(mensaje);
    return;
  }

  // Si hay eventos, los listamos normalmente
  eventos.forEach((evento, index) => {
    const item = document.createElement("li");
    item.className =
      "list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row";
    const datos = document.createElement("div");
    datos.innerHTML = `
      <strong>${evento.getNombre()}</strong> (${evento.getTipo()})<br>
      <small>
        <b>Fecha:</b> ${evento.getFecha()} | 
        <b>Ubicación:</b> ${evento.getUbicacion()}<br>
        <b>Dress code:</b> ${evento.getDresscode() || "-"}<br>
        <b>Capacidad:</b> ${evento.getCapacidad()}
      </small><br>
      <small><b>Descripción:</b> ${evento.getDescripcion()}</small>
    `;
    // Botones para editar y eliminar
    const botones = document.createElement("div");
    botones.className = "mt-2 mt-md-0 d-flex gap-2";
    const btnEditar = document.createElement("button");
    btnEditar.className = "btn btn-sm btn-outline-primary";
    btnEditar.textContent = "Editar";
    btnEditar.onclick = () => cargarEventoEnFormulario(index);
    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn btn-sm btn-outline-danger";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.onclick = () => eliminarEvento(index);
    botones.appendChild(btnEditar);
    botones.appendChild(btnEliminar);
    item.appendChild(datos);
    item.appendChild(botones);
    lista.appendChild(item);
  });
}

function cargarEventoEnFormulario(index) {
  const evento = listaEventos.getEventos()[index];
  document.getElementById("nombreEvento").value = evento.getNombre();
  document.getElementById("tipoEvento").value = evento.getTipo();
  document.getElementById("fechaEvento").value = evento.getFecha();
  document.getElementById("ubicacionEvento").value = evento.getUbicacion();
  document.getElementById("dressEvento").value = evento.getDresscode();
  document.getElementById("descripcionEvento").value = evento.getDescripcion();
  document.getElementById("capacidadEvento").value = evento.getCapacidad();

  eventoEditandoIndex = index;
  document.getElementById("btnEvento").innerText = "Guardar cambios";
  document.getElementById("btnCancelar").classList.remove("d-none");
}

export function cancelarEdicion() {
  eventoEditandoIndex = null;
  document.getElementById("agregarEvento-form").reset();
  document.getElementById("btnEvento").innerText = "Crear";
  document.getElementById("btnCancelar").classList.add("d-none");
}
window.cancelarEdicion = cancelarEdicion;

function eliminarEvento(index) {
  const eventoAEliminar = listaEventos.getEventos()[index];

  if (
    eventoAEliminar &&
    confirm(
      `¿Estás seguro de que querés eliminar el evento "${eventoAEliminar.getNombre()}"?`,
    )
  ) {
    try {
      listaEventos.quitarEvento(eventoAEliminar);

      cancelarEdicion();
      actualizarListaEventos();
    } catch (e) {
      alert(e.message);
    }
  }
}

function mostrarEventosConfirmadosInvitado() {
  const mensaje = document.getElementById("mensajeSinEventosConfirmados");
  const lista = document.getElementById("listaEventosConfirmados");
  lista.innerHTML = "";

  const eventosConfirmados = listaEventos.getEventos().filter((evento) => {
    return evento
      .getInvitadosConfirmados()
      .some((inv) => inv.getMail() === usuarioActual.getMail());
  });

  if (eventosConfirmados.length === 0) {
    mensaje.classList.remove("d-none");
    lista.classList.add("d-none");
  } else {
    mensaje.classList.add("d-none");
    lista.classList.remove("d-none");

    eventosConfirmados.forEach((evento) => {
      const item = document.createElement("li");
      item.className = "list-group-item";

      item.innerHTML = `
        <strong>${evento.getNombre()}</strong><br>
        <b>Tipo:</b> ${evento.getTipo()}<br>
        <b>Fecha:</b> ${evento.getFecha()}<br>
        <b>Ubicación:</b> ${evento.getUbicacion()}<br>
        <b>Dress code:</b> ${evento.getDresscode()}<br>
        <b>Descripción:</b> ${evento.getDescripcion()}
      `;

      lista.appendChild(item);
    });
  }
}

// ------------------------
// GESTIÓN DE INVITACIONES (TABLA)
// ------------------------
// Actualiza el select de eventos en la sección de invitaciones
function actualizarSelectEventosInvitacion() {
  const selectEvento = document.getElementById("select-evento-invitacion");
  if (!selectEvento) return;
  selectEvento.innerHTML = "";

  if (listaEventos.getEventos().length === 0) {
    selectEvento.innerHTML = `<option value="">No hay eventos disponibles para invitar</option>`;
    selectEvento.disabled = true;
    return;
  } else {
    selectEvento.disabled = false;
  }

  // Recorremos todos los eventos y creamos las opciones
  listaEventos.getEventos().forEach((evento) => {
    const option = document.createElement("option");
    option.value = evento.getNombre(); // Se toma el nombre como identificador
    option.textContent = evento.getNombre();
    selectEvento.appendChild(option);
  });
}

// Actualiza la tabla de invitaciones según el evento seleccionado
function actualizarTablaInvitaciones() {
  const tbody = document.getElementById("tabla-invitaciones");
  tbody.innerHTML = "";
  const selectEvento = document.getElementById("select-evento-invitacion");
  if (!selectEvento) return;

  // Si no hay eventos, mostramos mensaje y salimos
  if (listaEventos.getEventos().length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="5" class="text-center">No hay eventos disponibles para enviar invitaciones.</td>`;
    tbody.appendChild(row);
    return;
  }

  const selectedEventName = selectEvento.value;
  // Buscamos el evento seleccionado
  const evento = listaEventos
    .getEventos()
    .find((e) => e.getNombre() === selectedEventName);

  if (!evento) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="5" class="text-center">No se encontró el evento seleccionado.</td>`;
    tbody.appendChild(row);
    return;
  }

  let countRows = 0;
  // Recorremos todos los usuarios y filtramos por rol "invitado"
  listaUsuarios.getUsuarios().forEach((usuario) => {
    if (usuario.getRol() !== "invitado") return;
    countRows++;
    // Buscamos si ya se envió una invitación para este usuario en el evento
    const invitacion = evento
      .getInvitaciones()
      .find((inv) => inv.getInvitado().getMail() === usuario.getMail());
    const estado = invitacion ? invitacion.getEstado() : "No enviada";
    // Si ya existe la invitación, deshabilitamos el checkbox.
    const disabledAttr = invitacion ? "disabled" : "";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="form-check-input" data-mail="${usuario.getMail()}" ${disabledAttr}></td>
      <td>${usuario.getNombre()}</td>
      <td>${usuario.getMail()}</td>
      <td>-</td>
      <td>${estado}</td>
    `;
    tbody.appendChild(row);
  });

  if (countRows === 0) {
    // Si no hay usuarios invitados disponibles
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="5" class="text-center">No hay usuarios disponibles para enviar invitaciones.</td>`;
    tbody.appendChild(row);
  }
}

function refrescarInvitaciones() {
  actualizarSelectEventosInvitacion();
  actualizarTablaInvitaciones();

  const mensajeDiv = document.getElementById("mensajeInvitaciones");
  const lista = document.getElementById("invitaciones");

  if (
    listaEventos.getEventos().length === 0 ||
    listaUsuarios.getUsuarios().filter((u) => u.getRol() === "invitado")
      .length === 0
  ) {
    lista.classList.add("d-none");
    mensajeDiv.classList.remove("d-none");
  } else {
    mensajeDiv.classList.add("d-none");
    lista.classList.remove("d-none");
  }
}

window.refrescarInvitaciones = refrescarInvitaciones;

function verificarDisponibilidadParaInvitaciones() {
  const mensaje = document.getElementById("mensajeInvitaciones");
  const divTabla = document.getElementById("invitaciones");

  const hayEventos = listaEventos.getEventos().length > 0;
  const hayInvitados = listaUsuarios
    .getUsuarios()
    .some((u) => u.getRol() === "invitado");

  if (!hayEventos || !hayInvitados) {
    mensaje.classList.remove("d-none");
    divTabla.classList.add("d-none");
  } else {
    mensaje.classList.add("d-none");
    divTabla.classList.remove("d-none");
  }
}

// Función para enviar invitaciones a los usuarios seleccionados para el evento elegido
window.enviarInvitacionesSeleccionadas = function () {
  const checkboxes = document.querySelectorAll(
    "#tabla-invitaciones input[type='checkbox']:checked",
  );
  if (checkboxes.length === 0) {
    const alerta = document.getElementById("alertaCentro");
    if (alerta) {
      alerta.classList.remove("d-none");
      setTimeout(() => alerta.classList.add("d-none"), 3000);
    }
    return;
  }
  const selectEvento = document.getElementById("select-evento-invitacion");
  if (!selectEvento) return;
  const selectedEventName = selectEvento.value;
  // Buscamos el evento seleccionado
  const evento = listaEventos
    .getEventos()
    .find((e) => e.getNombre() === selectedEventName);
  if (!evento) {
    alert("No se encontró el evento seleccionado.");
    return;
  }

  // obtener el mensaje del input
  const mensajeInput = document.getElementById("mensajeInvitado");
  const mensajeTexto = mensajeInput ? mensajeInput.value.trim() : "";

  // Para cada checkbox seleccionado buscamos el usuario por mail y, si aún no fue invitado, lo invitamos
  checkboxes.forEach((cb) => {
    const mail = cb.getAttribute("data-mail");
    const yaInvitado = evento
      .getInvitaciones()
      .some((inv) => inv.getInvitado().getMail() === mail);
    if (!yaInvitado) {
      const usuario = listaUsuarios
        .getUsuarios()
        .find((u) => u.getMail() === mail);
      if (usuario) {
        try {
          evento.invitarUsuario(usuario);
          //Validamos invitacion con mensaje
          const invitacion = evento
            .getInvitaciones()
            .find((inv) => inv.getInvitado().getMail() === mail);
          if (invitacion) {
            try {
              invitacion.setMensajeInvitado(mensajeTexto);
              console.log(
                "Mensaje del invitado:",
                invitacion.getMensajeInvitado(),
              );
            } catch (err) {
              console.error("Error al guardar el mensaje:", err.message);
            }
          }
        } catch (err) {
          alert(err.message);
        }
      }
    }
  });
  actualizarTablaInvitaciones();
  actualizarNotificaciones();
  const toast = new bootstrap.Toast(
    document.getElementById("toastInvitacionesEnviadas"),
  );
  toast.show();
  if (mensajeInput) mensajeInput.value = "";
};

// ------------------------
// GESTIÓN DE MESAS
// ------------------------
const CAPACIDAD_MAXIMA = 10;
export function crearMesaDesdeFormulario() {
  const selectEvento = document.getElementById("eventoParaMesa");
  const indexSeleccionado = parseInt(selectEvento.value);
  const evento = listaEventos.getEventos()[indexSeleccionado];

  if (!evento) {
    alert("Evento no encontrado.");
    return;
  }

  const invitadosSeleccionados = Array.from(
    document.querySelectorAll("#invitadosMesa option:checked"),
  ).map((opt) => opt.value);

  if (invitadosSeleccionados.length === 0) {
    alert("Seleccioná al menos un invitado.");
    return;
  }

  if (invitadosSeleccionados.length > CAPACIDAD_MAXIMA) {
    alert(
      `Solo se pueden asignar hasta ${CAPACIDAD_MAXIMA} invitados por mesa.`,
    );
    return;
  }

  // Chequear si alguno ya está en una mesa
  const yaAsignados = evento
    .getMesas()
    .flatMap((mesa) =>
      mesa.getInvitados().map((inv) => inv.getInvitado().getMail()),
    );

  const duplicados = invitadosSeleccionados.filter((mail) =>
    yaAsignados.includes(mail),
  );

  if (duplicados.length > 0) {
    const nombres = duplicados.map((mail) => {
      const u = listaUsuarios.getUsuarios().find((u) => u.getMail() === mail);
      return u ? u.getNombre() : mail;
    });
    alert(
      `Los siguientes invitados ya están asignados a otra mesa: ${nombres.join(", ")}`,
    );
    return;
  }

  // Crear nueva mesa
  let nuevoNumero = 1;
  const mesasExistentes = evento.getMesas();
  if (mesasExistentes.length > 0) {
    const max = Math.max(...mesasExistentes.map((m) => m.getNumero()));
    nuevoNumero = max + 1;
  }

  const nuevaMesa = new Mesa(nuevoNumero, evento);

  invitadosSeleccionados.forEach((mail) => {
    const usuario = listaUsuarios
      .getUsuarios()
      .find((u) => u.getMail() === mail);
    const invitacion = evento
      .getInvitaciones()
      .find((i) => i.getInvitado().getMail() === mail);
    if (usuario && invitacion) {
      try {
        nuevaMesa.agregarInvitado(invitacion);
      } catch (e) {
        console.warn(e.message);
      }
    }
  });

  evento.agregarMesa(nuevaMesa);
  actualizarListaMesasGeneral(evento);
  document.getElementById("formMesa").reset();
}
window.crearMesaDesdeFormulario = crearMesaDesdeFormulario;

function actualizarListaMesasGeneral() {
  const lista = document.getElementById("listaMesas");
  lista.innerHTML = "";

  const eventos = listaEventos.getEventos();

  if (eventos.length === 0) {
    lista.innerHTML = "<p class='text-muted'>No hay eventos disponibles.</p>";
    return;
  }

  eventos.forEach((evento) => {
    const contenedorEvento = document.createElement("div");
    contenedorEvento.className = "card mb-4 shadow-sm";

    const header = document.createElement("div");
    header.className = "card-header bg-primary text-white";
    header.innerHTML = `<h5 class="mb-0">${evento.getNombre()} (${evento.getTipo()})</h5>`;

    const body = document.createElement("div");
    body.className = "card-body";

    const mesas = evento.getMesas();
    if (mesas.length === 0) {
      body.innerHTML =
        "<p class='text-muted'>No hay mesas creadas para este evento.</p>";
    } else {
      mesas.forEach((mesa) => {
        const cardMesa = document.createElement("div");
        cardMesa.className = "card mb-3";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const invitadosTexto =
          mesa.getInvitados().length > 0
            ? `<ul class='mb-2'>${mesa
                .getInvitados()
                .map(
                  (inv) =>
                    `<li>${inv.getInvitado().getNombre()} (${inv.getInvitado().getMail()})</li>`,
                )
                .join("")}</ul>`
            : "<em class='text-muted'>Sin invitados asignados</em>";

        cardBody.innerHTML = `
          <h6 class="card-title">Mesa ${mesa.getNumero()}</h6>
          ${invitadosTexto}
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarMesaPorEvento('${evento.getNombre()}', ${mesa.getNumero()})">Eliminar</button>
        `;

        cardMesa.appendChild(cardBody);
        body.appendChild(cardMesa);
      });
    }

    contenedorEvento.appendChild(header);
    contenedorEvento.appendChild(body);
    lista.appendChild(contenedorEvento);
  });
}

export function eliminarMesa(numeroMesa) {
  const selectEvento = document.getElementById("eventoMesa");
  const idEventoSeleccionado = selectEvento.value;
  const evento = listaEventos
    .getEventos()
    .find((ev) => ev.getNombre() === idEventoSeleccionado);

  if (!evento) {
    alert("Evento no encontrado.");
    return;
  }

  if (confirm("¿Querés eliminar esta mesa?")) {
    try {
      evento.quitarMesa(numeroMesa);
      actualizarListaMesasGeneral(evento);
    } catch (e) {
      alert(e.message);
    }
  }
}

window.eliminarMesa = eliminarMesa;

function cargarInvitadosEnSelectMesa() {
  const selectEvento = document.getElementById("eventoParaMesa");
  const invitadosSelect = document.getElementById("invitadosMesa");
  invitadosSelect.innerHTML = "";

  const evento = listaEventos.getEventos()[selectEvento.value];
  if (!evento) return;

  const invitadosConfirmados = evento.getInvitadosConfirmados();
  const mensaje = document.getElementById("mensajeMesas");

  if (invitadosConfirmados.length === 0) {
    mensaje.textContent = "Este evento aún no tiene invitados confirmados.";
    mensaje.classList.remove("d-none");
    invitadosSelect.classList.add("d-none");
    return;
  }

  mensaje.classList.add("d-none");
  invitadosSelect.classList.remove("d-none");

  invitadosConfirmados.forEach((usuario) => {
    const option = document.createElement("option");
    option.value = usuario.getMail(); // usar el mail como valor único
    option.textContent = usuario.getNombre();
    invitadosSelect.appendChild(option);
  });
}
window.cargarInvitadosEnSelectMesa = cargarInvitadosEnSelectMesa;

function cargarEventosEnSelectMesa() {
  const select = document.getElementById("eventoParaMesa");
  select.innerHTML = "";

  const eventos = listaEventos.getEventos();
  const mensaje = document.getElementById("mensajeMesas");

  if (eventos.length === 0) {
    mensaje.classList.remove("d-none");
    select.classList.add("d-none");
    document.getElementById("invitadosMesa").classList.add("d-none");
    return;
  }

  mensaje.classList.add("d-none");
  select.classList.remove("d-none");
  document.getElementById("invitadosMesa").classList.remove("d-none");

  eventos.forEach((evento, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = evento.getNombre();
    select.appendChild(option);
  });

  cargarInvitadosEnSelectMesa(); // carga los invitados confirmados del primer evento por defecto
}

function mostrarSeccionMesas() {
  const eventos = listaEventos.getEventos();
  const crearMesas = document.getElementById("crearMesas");
  const listaMesas = document.getElementById("listaMesas");
  const mensaje = document.getElementById("mensajeMesas");

  // Si no hay eventos, mostrar mensaje
  if (eventos.length === 0) {
    crearMesas.classList.add("d-none");
    listaMesas.classList.add("d-none");
    mensaje.classList.remove("d-none");
    return;
  }

  // Buscar si alguno de los eventos tiene invitados confirmados
  const hayInvitadosConfirmados = eventos.some(
    (evento) => evento.getInvitadosConfirmados().length > 0,
  );

  if (!hayInvitadosConfirmados) {
    crearMesas.classList.add("d-none");
    listaMesas.classList.add("d-none");
    mensaje.classList.remove("d-none");
    return;
  }

  // Mostrar formulario normalmente
  crearMesas.classList.remove("d-none");
  listaMesas.classList.remove("d-none");
  mensaje.classList.add("d-none");

  // Cargar eventos e invitados
  cargarEventosEnSelectMesa();
}

window.eliminarMesaPorEvento = function (nombreEvento, numeroMesa) {
  const evento = listaEventos
    .getEventos()
    .find((ev) => ev.getNombre() === nombreEvento);
  if (!evento) return;

  if (
    confirm(
      `¿Querés eliminar la mesa ${numeroMesa} del evento "${nombreEvento}"?`,
    )
  ) {
    try {
      evento.quitarMesa(numeroMesa);
      actualizarListaMesasGeneral();
    } catch (e) {
      alert(e.message);
    }
  }
};

// ------------------------
// GESTIÓN DE NOTIFICACIONES
// ------------------------
function actualizarNotificaciones() {
  // Nos aseguramos de que exista un usuario logueado.
  if (!usuarioActual) return;

  // Creamos un array para acumular todas las invitaciones pendientes.
  let notifications = [];

  // Recorremos todos los eventos y sus invitaciones.
  listaEventos.getEventos().forEach((evento) => {
    evento.getInvitaciones().forEach((inv) => {
      if (
        inv.getInvitado().getMail() === usuarioActual.getMail() &&
        inv.getEstado() === "pendiente"
      ) {
        // Guardamos los datos resumidos del evento
        notifications.push({
          nombre: evento.getNombre(),
          tipo: evento.getTipo(),
          fecha: evento.getFecha(),
          // Puedes agregar otros datos resumidos aquí si lo deseas.
        });
      }
    });
  });

  // Obtenemos los contenedores en el DOM
  const panelNotificacion = document.getElementById("panelNotificacion");
  const sinNotificaciones = document.getElementById("sinNotificaciones");

  // Vaciamos el contenido anterior del contenedor de notificaciones
  panelNotificacion.innerHTML = "";

  if (notifications.length > 0) {
    // Por cada notificación, creamos una tarjeta con la información resumida
    notifications.forEach((notif) => {
      let card = document.createElement("div");
      card.className = "card mb-3";
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">Invitación: ${notif.nombre}</h5>
          <p class="card-text">
            <strong>Tipo:</strong> ${notif.tipo} <br>
            <strong>Fecha:</strong> ${notif.fecha}
          </p>
        </div>
      `;
      panelNotificacion.appendChild(card);
    });
    // Se muestra el contenedor de notificaciones y se oculta el mensaje "Sin notificaciones"
    panelNotificacion.classList.remove("d-none");
    sinNotificaciones.classList.add("d-none");
  } else {
    // Si no hay notificaciones pendientes, se oculta el panel y se muestra el mensaje
    panelNotificacion.classList.add("d-none");
    sinNotificaciones.classList.remove("d-none");
  }

  // Actualizamos el badge en la barra de navegación
  actualizarBadgeNotificaciones(notifications.length);
}

function actualizarBadgeNotificaciones(unreadCount) {
  const badge = document.getElementById("badge-notificaciones");
  if (!badge) return;
  if (unreadCount > 0) {
    badge.textContent = unreadCount;
    badge.classList.remove("d-none");
  } else {
    badge.textContent = "";
    badge.classList.add("d-none");
  }
}

// ------------------------
// SECCIÓN CONFIRMAR ASISTENCIA
// ------------------------
export function mostrarSeccionConfirmar() {
  if (!usuarioActual) return;

  let invitacionesPendientes = [];

  listaEventos.getEventos().forEach((evento) => {
    evento.getInvitaciones().forEach((invitacion) => {
      if (
        invitacion.getInvitado().getMail() === usuarioActual.getMail() &&
        invitacion.getEstado() === "pendiente"
      ) {
        invitacionesPendientes.push({ invitacion, evento });
      }
    });
  });

  const listaContainer = document.getElementById("listaInvitacionesConfirmar");
  listaContainer.innerHTML = "";

  if (invitacionesPendientes.length > 0) {
    document.getElementById("mensajeSinInvitacion").classList.add("d-none");
    listaContainer.classList.remove("d-none");

    invitacionesPendientes.forEach(({ invitacion, evento }, index) => {
      const restriccionActual = invitacion.getRestriccion() || "";

      const card = document.createElement("div");
      card.className = "card mb-3";
      card.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">🎉 Evento: ${evento.getNombre()}</h5>
      <p class="mb-1"><strong>Tipo:</strong> ${evento.getTipo()}</p>
      <p class="mb-1"><strong>Fecha:</strong> ${evento.getFecha()}</p>
      <p class="mb-1"><strong>Ubicación:</strong> ${evento.getUbicacion()}</p>
      <p class="mb-1"><strong>Dress Code:</strong> ${evento.getDresscode() || "-"}</p>
      <p class="mb-2"><strong>Descripción:</strong> ${evento.getDescripcion()}</p>

      <div class="mb-2">
        <label for="restriccion-evento-${index}" class="form-label">Restricciones alimentarias</label>
        <input type="text" id="restriccion-evento-${index}" class="form-control"
          value="${restriccionActual}" placeholder="Ej: sin gluten, vegetariano...">
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-success btn-sm" onclick="confirmarAsistencia(${index})">Confirmar</button>
        <button class="btn btn-danger btn-sm" onclick="rechazarInvitacion(${index})">Rechazar</button>
      </div>
    </div>
  `;
      listaContainer.appendChild(card);
    });
  } else {
    listaContainer.classList.add("d-none");
    document.getElementById("mensajeSinInvitacion").classList.remove("d-none");
  }
}
window.mostrarSeccionConfirmar = mostrarSeccionConfirmar;

window.confirmarAsistencia = function (index) {
  if (!usuarioActual) return;

  const pendientes = [];
  listaEventos.getEventos().forEach((evento) => {
    evento.getInvitaciones().forEach((invitacion) => {
      if (
        invitacion.getInvitado().getMail() === usuarioActual.getMail() &&
        invitacion.getEstado() === "pendiente"
      ) {
        pendientes.push({ invitacion, evento });
      }
    });
  });

  const data = pendientes[index];
  if (!data) return;

  const restriccion = document
    .getElementById(`restriccion-evento-${index}`)
    .value.trim();
  data.invitacion.setRestriccion(restriccion);

  data.invitacion.aceptar();
  mostrarToast("🎉 Asistencia confirmada.");
  mostrarSeccionConfirmar();
  refrescarInvitaciones();
  actualizarBadgeNotificaciones();
  actualizarNotificaciones();
};

window.rechazarInvitacion = function (index) {
  if (!usuarioActual) return;

  const pendientes = [];
  listaEventos.getEventos().forEach((evento) => {
    evento.getInvitaciones().forEach((invitacion) => {
      if (
        invitacion.getInvitado().getMail() === usuarioActual.getMail() &&
        invitacion.getEstado() === "pendiente"
      ) {
        pendientes.push(invitacion);
      }
    });
  });

  if (!pendientes[index]) return;

  pendientes[index].rechazar("El invitado rechazó la invitación");
  mostrarToast("❌ Invitación rechazada.");
  mostrarSeccionConfirmar();
  refrescarInvitaciones();
  actualizarBadgeNotificaciones();
  actualizarNotificaciones();
};

// ------------------------
// SECCIÓN RESTRICCIONES
// ------------------------

function cargarEventosEnSelectRestricciones() {
  const select = document.getElementById("selectEventoRestricciones");
  if (!select) return;
  select.innerHTML = ""; // Limpia las opciones existentes

  if (listaEventos.getEventos().length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No hay eventos creados";
    opt.disabled = true;
    select.appendChild(opt);
    return;
  }

  // Por cada evento creado, se agrega una opción usando el nombre del evento
  listaEventos.getEventos().forEach((evento) => {
    const opt = document.createElement("option");
    opt.value = evento.getNombre();
    opt.textContent = evento.getNombre();
    select.appendChild(opt);
  });
}

function mostrarRestriccionesDeEvento() {
  const select = document.getElementById("selectEventoRestricciones");
  const tbody = document.getElementById("tbodyRestricciones");
  if (!select || !tbody) return;

  const nombreEvento = select.value;
  const evento = listaEventos
    .getEventos()
    .find((e) => e.getNombre() === nombreEvento);
  if (!evento) return;

  tbody.innerHTML = "";

  let confirmadas = 0;
  evento.getInvitaciones().forEach((invitacion) => {
    // Solo se muestran las invitaciones confirmadas
    if (invitacion.getEstado() === "aceptada") {
      confirmadas++;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${invitacion.getInvitado().getNombre()}</td>
        <td>${invitacion.getInvitado().getMail()}</td>
        <td>${invitacion.getRestriccion() || "Sin especificar"}</td>
      `;
      tbody.appendChild(tr);
    }
  });

  if (confirmadas === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center">No hay invitados confirmados para este evento.</td></tr>`;
  }
}

function mostrarSeccionRestricciones() {
  const contenedor = document.getElementById("contenedorRestricciones");
  const mensaje = document.getElementById("mensajeRestricciones");

  // Se considera que si no hay eventos o no hay usuarios con rol "invitado" se muestra el mensaje.
  const hayEventos = listaEventos.getEventos().length > 0;
  const hayInvitados =
    listaUsuarios.getUsuarios().filter((u) => u.getRol() === "invitado")
      .length > 0;

  if (!hayEventos || !hayInvitados) {
    contenedor.classList.add("d-none");
    mensaje.classList.remove("d-none");
  } else {
    contenedor.classList.remove("d-none");
    mensaje.classList.add("d-none");
    cargarEventosEnSelectRestricciones();
    mostrarRestriccionesDeEvento();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarSeccionRestricciones();
  cargarEventosEnSelectRestricciones();
  mostrarRestriccionesDeEvento(); // Actualiza inicialmente en caso de que ya haya un evento seleccionado

  const selectRestricciones = document.getElementById(
    "selectEventoRestricciones",
  );
  if (selectRestricciones) {
    selectRestricciones.addEventListener(
      "change",
      mostrarRestriccionesDeEvento,
    );
  }
});

// ------------------------
// TOAST
// ------------------------

function mostrarToast(mensaje) {
  const toastDiv = document.createElement("div");
  toastDiv.className =
    "toast align-items-center text-white bg-success border-0";
  toastDiv.style.position = "fixed";
  toastDiv.style.bottom = "20px";
  toastDiv.style.right = "20px";
  toastDiv.style.zIndex = "2000";
  toastDiv.setAttribute("role", "alert");
  toastDiv.setAttribute("aria-live", "assertive");
  toastDiv.setAttribute("aria-atomic", "true");
  toastDiv.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${mensaje}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
    </div>
  `;
  document.body.appendChild(toastDiv);
  const toast = new bootstrap.Toast(toastDiv, { delay: 3000 });
  toast.show();
  setTimeout(() => toastDiv.remove(), 3500);
}

// ------------------------
// DOMContentLoaded: Inicializa el login (o modo test)
// ------------------------
window.addEventListener("DOMContentLoaded", () => {
  // Mostrar login al cargar la página
  document.getElementById("login-form").classList.remove("d-none");
  document.getElementById("app").classList.add("d-none");
  const selectEvento = document.getElementById("select-evento-invitacion");
  if (selectEvento) {
    selectEvento.addEventListener("change", actualizarTablaInvitaciones);
  }
  document
    .getElementById("selectEventoRestricciones")
    .addEventListener("change", mostrarRestriccionesDeEvento);
});
