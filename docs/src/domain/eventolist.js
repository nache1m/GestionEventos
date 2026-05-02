import { Evento } from "./evento.js";
import { Usuario } from "./usuario.js";

export class EventoList {
  #eventos;

  constructor() {
    this.#eventos = [];
  }

  add(evento) {
    let eventoInList = this.#eventos.some(
      (e) => e.getNombre() == evento.getNombre(), //guardo en eventoInList si el nombre de evento esta en el array, verificando por nombre. El some() retorna true si ALGUN elemento del array da true
    );
    if (!eventoInList) {
      this.#eventos.push(evento);
    } else {
      throw new Error(
        `No se pudo agregar ${evento.getNombre()}. Ya se agendó un evento con ese nombre.`,
      );
    }
  }

  quitarEvento(eventoAEliminar) {
    if (!(eventoAEliminar instanceof Evento)) {
      throw new Error(
        "El evento suministrado debe ser una instancia de la clase Evento.",
      );
    }
    const indice = this.#eventos.findIndex((e) => e === eventoAEliminar);

    // si el índice es -1, el evento no está en nuestra lista.
    if (indice === -1) {
      throw new Error(
        `El evento ${eventoAEliminar.getNombre()} no se encontró en el sistema.`,
      );
    }

    const eventoEncontrado = this.#eventos[indice];
    eventoEncontrado.eliminarTodasLasInvitaciones();
    this.#eventos.splice(indice, 1);
  }

  getEventos() {
    return this.#eventos;
  }

  getInvitacionesDelUsuario(usuarioBuscado) {
    if (!(usuarioBuscado instanceof Usuario)) {
      throw new Error(
        "El parámetro debe ser una instancia de la clase Usuario para poder buscar sus invitaciones.",
      );
    }

    //recorre cada evento, obtiene su array de invitaciones, y junta todos esos arrays en uno solo, para que no nos quede un array de arrays
    const todasLasInvitacionesDelSistema = this.#eventos.flatMap((evento) =>
      evento.getInvitaciones(),
    );

    const invitacionesDelUsuario = todasLasInvitacionesDelSistema.filter(
      (invitacion) => invitacion.getInvitado() === usuarioBuscado,
    );

    return invitacionesDelUsuario;
  }

  aceptarInvitacion(usuarioQueAcepta, eventoDeLaInvitacion) {
    const invitacionesDelEvento = eventoDeLaInvitacion.getInvitaciones();

    // Usamos .find() para buscar la invitación cuyo invitado sea el usuario que buscamos
    const Invitacion = invitacionesDelEvento.find(
      (inv) => inv.getInvitado() === usuarioQueAcepta,
    );

    // Validamos si la invitación realmente existe
    if (!Invitacion) {
      throw new Error(
        `El usuario ${usuarioQueAcepta.getNombre()} no tiene una invitación para el evento ${eventoDeLaInvitacion.getNombre()}.`,
      );
    }
    Invitacion.aceptar();
  }

  invitarUsuarioAEvento(usuarioAInvitar, eventoDestino) {
    if (!(usuarioAInvitar instanceof Usuario)) {
      throw new Error(
        "El objeto a invitar debe ser una instancia de la clase Usuario.",
      );
    }
    if (!(eventoDestino instanceof Evento)) {
      throw new Error("El destino debe ser una instancia de la clase Evento.");
    }

    const eventoExisteEnElSistema = this.#eventos.includes(eventoDestino);
    if (!eventoExisteEnElSistema) {
      throw new Error(
        `El evento ${eventoDestino.getNombre()} no se encuentra en el sistema y no se puede enviar la invitación.`,
      );
    }

    // 3. Delegación: Llamamos al método que ya existe en la clase Evento.
    // La clase Evento es la responsable de manejar su propia lista de invitaciones.
    eventoDestino.invitarUsuario(usuarioAInvitar);
  }

  eliminarInvitacionesDeUsuario(usuarioAEliminar) {
    if (!(usuarioAEliminar instanceof Usuario)) {
      throw new Error(
        "El parámetro debe ser una instancia de la clase Usuario.",
      );
    }

    this.#eventos.forEach((evento) => {
      evento.quitarInvitacionesDeUsuario(usuarioAEliminar);
    });
  }
}
