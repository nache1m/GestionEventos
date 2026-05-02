import { Invitacion } from "./invitacion.js";
import { Mesa } from "./mesa.js";

export class Evento {
  #nombre;
  #tipo;
  #fecha;
  #ubicacion;
  #capacidad;
  #descripcion;
  #dresscode;
  #invitaciones; // aca la idea es guardar una lista con las invitaciones del evento
  #mesas; //idem a evento

  constructor(
    anombre,
    tipo,
    fecha,
    ubicacion,
    descripcion,
    dresscode,
    capacidad,
  ) {
    this.#nombre = anombre;
    this.#tipo = tipo;
    this.#fecha = fecha;
    this.#ubicacion = ubicacion;
    this.#dresscode = dresscode;
    this.#capacidad = capacidad;
    this.#descripcion = descripcion;
    this.#invitaciones = [];
    this.#mesas = [];
  }

  invitarUsuario(unUsuario) {
    //primero checkeo si no alcance la capacidad amxima
    if (this.#invitaciones.length >= this.#capacidad) {
      throw new Error(
        `El evento "${this.#nombre}" ha alcanzado su capacidad máxima de ${this.#capacidad} invitados y no se pueden enviar más invitaciones.`,
      );
    }
    // primero checkeamos que el invitado no haya sido invitado aun
    const yaInvitado = this.#invitaciones.some(
      (inv) => inv.getInvitado().getMail() === unUsuario.getMail(),
    );

    if (yaInvitado) {
      throw new Error(
        `El usuario ${unUsuario.getNombre()} (mail: ${unUsuario.getMail()}) ya ha sido invitado.`,
      );
    }

    const nuevaInvitacion = new Invitacion(unUsuario, "", this);
    this.#invitaciones.push(nuevaInvitacion);
    // throw (`Se ha enviado una invitación a ${unUsuario.getNombre()} para el evento "${this.#tipo}".`);
    return nuevaInvitacion;
  }

  //devolver los usuarios invitados
  getInvitadosConfirmados() {
    return this.#invitaciones
      .filter((inv) => inv.getEstado() === "aceptada")
      .map((inv) => inv.getInvitado());
  }

  getInvitaciones() {
    return this.#invitaciones;
  }

  getNombre() {
    return this.#nombre;
  }

  setNombre(n) {
    this.#nombre = n;
  }

  getTipo() {
    return this.#tipo;
  }

  setTipo(t) {
    this.#tipo = t;
  }

  getFecha() {
    return this.#fecha;
  }

  setFecha(f) {
    this.#fecha = f;
  }

  getUbicacion() {
    return this.#ubicacion;
  }

  setUbicacion(u) {
    this.#ubicacion = u;
  }

  getCapacidad() {
    return this.#capacidad;
  }

  setCapacidad(c) {
    this.#capacidad = c;
  }

  getDescripcion() {
    return this.#descripcion;
  }

  setDescripcion(d) {
    this.#descripcion = d;
  }

  setDresscode(d) {
    this.#dresscode = d;
  }

  getDresscode() {
    return this.#dresscode;
  }

  agregarMesa(mesa) {
    if (!(mesa instanceof Mesa)) {
      throw new Error("Debe pasarse una instancia válida de Mesa.");
    }

    // Evitar duplicados por número
    const yaExiste = this.#mesas.some(
      (m) => m.getNumero() === mesa.getNumero(),
    );
    if (yaExiste) {
      throw new Error(`Ya existe una mesa con el número ${mesa.getNumero()}.`);
    }
    this.#mesas.push(mesa);
  }

  quitarMesa(numeroMesa) {
    const indice = this.#mesas.findIndex(
      (mesa) => mesa.getNumero() === numeroMesa,
    );
    if (indice === -1) {
      throw new Error(
        `La mesa número ${numeroMesa} no se encontró y no puede ser eliminada.`,
      );
    }
    this.#mesas.splice(indice, 1);
  }

  getMesas() {
    return this.#mesas;
  }

  getCantMesas() {
    return this.#mesas.length;
  }

  getIdsMesas() {
    return this.#mesas.map((mesa) => mesa.getNumero());
  }

  isValid() {
    if (
      this.#nombre === undefined ||
      this.#nombre === null ||
      this.#nombre === ""
    ) {
      throw new Error("El nombre del evento no puede ser vacío");
    }
    return true;
  }

  eliminarTodasLasInvitaciones() {
    this.#invitaciones = [];
  }

  quitarInvitacionesDeUsuario(usuario) {
    this.#invitaciones = this.#invitaciones.filter(
      (inv) => inv.getInvitado() !== usuario,
    );
  }
}
