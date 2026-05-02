/*import { Usuario } from "./usuario.js";
import { Evento } from "./evento.js"; */

export class Mesa {
  #numero;
  #evento;
  #invitados;

  constructor(numero, evento) {
    this.#numero = numero;
    this.#evento = evento;
    this.#invitados = [];
  }

  getNumero() {
    return this.#numero;
  }

  setNumero(nuevoNumero) {
    this.#numero = nuevoNumero;
  }

  getEvento() {
    return this.#evento;
  }

  setEvento(nuevoEvento) {
    this.#evento = nuevoEvento;
  }

  getInvitados() {
    return this.#invitados;
  }

  agregarInvitado(inv) {
    const yaInvitado = this.#invitados.some(
      (otroInv) =>
        otroInv.getInvitado().getMail() === inv.getInvitado().getMail(),
    );

    if (yaInvitado) {
      throw new Error(
        `El usuario ${inv.getInvitado().getNombre()} (mail: ${inv.getInvitado().getMail()}) ya ha sido agregado a la mesa.`,
      );
    }

    this.#invitados.push(inv);
  }

  quitarInvitado(inv) {
    const yaInvitado = this.#invitados.some(
      (otroInv) =>
        otroInv.getInvitado().getMail() === inv.getInvitado().getMail(),
    );

    if (!yaInvitado) {
      throw new Error(
        `El usuario ${inv.getInvitado().getNombre()} (mail: ${inv.getInvitado().getMail()}) no ha sido agregado a esta mesa.`,
      );
    }

    this.#invitados = this.#invitados.filter(
      (otroInv) =>
        otroInv.getInvitado().getMail() !== inv.getInvitado().getMail(),
    );
  }
}
