export class Usuario {
  #nombre;
  #mail;
  #telefono;
  #rol;
  #restriccion;

  constructor(aNombre, mail, telefono) {
    this.#nombre = aNombre;
    this.#mail = mail;
    this.#telefono = telefono;
  }

  getNombre() {
    return this.#nombre;
  }

  setNombre(n) {
    this.#nombre = n;
  }

  getMail() {
    return this.#mail;
  }

  setMail(m) {
    this.#mail = m;
  }

  getTelefono() {
    return this.#telefono;
  }
  setTelefono(t) {
    this.#telefono = t;
  }

  getRol() {
    return this.#rol;
  }

  setTipo(r) {
    this.#rol = r;
  }

  getRestriccion() {
    return this.#restriccion;
  }

  setRestriccion(r = "") {
    this.#restriccion = r;
  }

  /*
    toString() {
      return `Nombre: ${this.#nombre} - mail: ${this.#mail}`;
    }*/

  isValid() {
    if (
      this.#nombre === undefined ||
      this.#nombre === null ||
      this.#nombre === ""
    ) {
      throw new Error("El nombre del usuario no puede ser vacio");
    }
    if (this.#mail === undefined || this.#mail === null || this.#mail === "") {
      throw new Error("El mail del usuario no debe estar vacio");
    }
    return true;
  }

  getEventosInvitado(eventoList) {
    const todosLosEventos = eventoList.getEventos();
    const eventosFiltrados = todosLosEventos.filter((evento) => {
      return evento
        .getInvitaciones()
        .some((invitacion) => invitacion.getInvitado() === this);
    });

    return eventosFiltrados;
  }
}
