import { Usuario } from "./usuario.js";

export class Invitacion {
  #invitado;
  #estado;
  #descripcion;
  #evento;
  #restriccion = "";
  #mensajeInvitado = "";

  constructor(unInvitado, descripcion = "", e, mensajeInvitado = "") {
    if (!(unInvitado instanceof Usuario)) {
      throw new Error(
        "El invitado debe ser una instancia de la clase usuario.",
      );
    }
    this.#invitado = unInvitado;
    this.#estado = "pendiente";
    this.#descripcion = descripcion;
    this.#evento = e;

    if (typeof mensajeInvitado !== "string") {
      throw new Error("El mensaje debe ser un texto.");
    }
    this.#mensajeInvitado = mensajeInvitado.trim();
  }

  getEvento() {
    return this.#evento;
  }

  setEvento(e) {
    if (typeof e !== "string" || e.trim() === "") {
      throw new Error("El evento debe ser un nombre válido.");
    }
    this.#evento = e;
  }

  getInvitado() {
    return this.#invitado;
  }

  setInvitado(usu) {
    if (!(usu instanceof Usuario)) {
      throw new Error(
        "El invitado debe ser una instancia de la clase Usuario.",
      );
    }
    this.#invitado = usu;
  }

  getEstado() {
    return this.#estado;
  }

  setEstado(e) {
    const estadosValidos = ["pendiente", "aceptada", "rechazada"];
    if (!estadosValidos.includes(e)) {
      throw new Error(
        "Estado inválido. Debe ser pendiente, aceptada o rechazada.",
      );
    }
    this.#estado = e;
  }

  getDescripcion() {
    return this.#descripcion;
  }

  setDescripcion(d = "") {
    if (typeof d !== "string") {
      throw new Error("La descripción debe ser un texto.");
    }
    this.#descripcion = d;
  }

  setRestriccion(valor) {
    this.#restriccion = valor;
  }

  getRestriccion() {
    return this.#restriccion;
  }

  aceptar() {
    this.#estado = "aceptada";
  }

  rechazar(motivo = "") {
    if (typeof motivo !== "string") {
      throw new Error("El motivo debe ser un texto.");
    }
    this.#estado = "rechazada";
    this.#descripcion = motivo;
  }

  setMensajeInvitado(msg) {
    if (typeof msg !== "string") {
      throw new Error("El mensaje debe ser un texto.");
    }
    this.#mensajeInvitado = msg.trim();
  }

  getMensajeInvitado() {
    return this.#mensajeInvitado;
  }
}
