import { Usuario } from "./usuario.js"; // <--- AÑADIR ESTA LÍNEA
import { EventoList } from "./eventolist.js";

export class UsuarioList {
  #usuarios;

  constructor() {
    this.#usuarios = [];
  }

  add(usuario) {
    let usuarioInList = this.#usuarios.some(
      (m) => m.getMail() == usuario.getMail(), //guardo en usuarioInList si el nombre de usuario esta en el array, verificando por mail. El some() retorna true si ALGUN elemento del array da true
    );
    if (!usuarioInList && usuario.isValid()) {
      this.#usuarios.push(usuario);
    } else {
      throw new Error(
        `No se pudo agregar. ${usuario.getMail()} ya se agendó un usuario con ese mail.`,
      );
    }
  }

  getUsuarios() {
    return this.#usuarios;
  }

  quitarUsuario(usuarioAEliminar, sistemaDeEventos) {
    if (!(usuarioAEliminar instanceof Usuario)) {
      throw new Error(
        "El parámetro debe ser una instancia de la clase Usuario.",
      );
    }
    if (!(sistemaDeEventos instanceof EventoList)) {
      throw new Error(
        "Se requiere una instancia de EventoList para limpiar las invitaciones.",
      );
    }

    const indice = this.#usuarios.findIndex((u) => u === usuarioAEliminar);

    if (indice === -1) {
      throw new Error(
        `El usuario "${usuarioAEliminar.getNombre()}" no se encontró en el sistema.`,
      );
    }

    sistemaDeEventos.eliminarInvitacionesDeUsuario(usuarioAEliminar);
    this.#usuarios.splice(indice, 1);
  }
}
