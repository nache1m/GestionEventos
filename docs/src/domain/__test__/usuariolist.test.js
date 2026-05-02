import { expect, test, describe, beforeEach } from "@jest/globals";
import { UsuarioList } from "../usuariolist.js";
import { Usuario } from "../usuario.js";
import { EventoList } from "../eventolist.js";
import { Evento } from "../evento.js";

describe("pruebas sobre la clase usuariolist", () => {
  test("debería crear una lista de usuarios vacía", () => {
    const listaUsuarios = new UsuarioList();
    expect(listaUsuarios.getUsuarios()).toHaveLength(0);
  });

  describe("metodo add", () => {
    test("deberia agregar un usuario valido a la lista", () => {
      const listaUsuarios = new UsuarioList();
      const usuario = new Usuario("Ana", "ana@test.com");
      listaUsuarios.add(usuario);
      expect(listaUsuarios.getUsuarios()).toHaveLength(1);
      expect(listaUsuarios.getUsuarios()[0]).toBe(usuario);
    });

    test("deberia tirar un error al intentar agregar un usuario con un email repetido", () => {
      const listaUsuarios = new UsuarioList();
      const usuario1 = new Usuario("Ana", "ana@test.com");
      const usuario2 = new Usuario("Ana Repetida", "ana@test.com");
      listaUsuarios.add(usuario1);
      const errorMsg = `No se pudo agregar. ${usuario2.getMail()} ya se agendó un usuario con ese mail.`;
      expect(() => listaUsuarios.add(usuario2)).toThrow(errorMsg);
    });

    test("deberia lanzar un error al intentar agregar un usuario sin nombre", () => {
      const listaUsuarios = new UsuarioList();
      const usuarioInvalido = new Usuario("", "invalido@test.com");
      const errorMsg = "El nombre del usuario no puede ser vacio";
      expect(() => listaUsuarios.add(usuarioInvalido)).toThrow(errorMsg);
    });
  });

  describe("metodo quitarUsuario", () => {
    let sistemaUsuarios;
    let sistemaEventos;
    let usuarioAna, usuarioJuan;
    let boda;

    beforeEach(() => {
      sistemaUsuarios = new UsuarioList();
      sistemaEventos = new EventoList();
      usuarioAna = new Usuario("Ana", "ana@test.com");
      usuarioJuan = new Usuario("Juan", "juan@test.com");
      sistemaUsuarios.add(usuarioAna);
      sistemaUsuarios.add(usuarioJuan);
      boda = new Evento(
        "Boda A&J",
        "Casamiento",
        "2025-11-22",
        "Salón Principal",
        "",
      );
      sistemaEventos.add(boda);
    });

    test("debería eliminar un usuario de la lista y sus invitaciones asociadas", () => {
      sistemaEventos.invitarUsuarioAEvento(usuarioAna, boda);
      sistemaEventos.invitarUsuarioAEvento(usuarioJuan, boda);
      expect(boda.getInvitaciones()).toHaveLength(2);

      sistemaUsuarios.quitarUsuario(usuarioAna, sistemaEventos);

      expect(sistemaUsuarios.getUsuarios()).toHaveLength(1);
      expect(sistemaUsuarios.getUsuarios()[0]).toBe(usuarioJuan);
      expect(boda.getInvitaciones()).toHaveLength(1);
      expect(boda.getInvitaciones()[0].getInvitado()).toBe(usuarioJuan);
    });

    test("debería lanzar un error al intentar quitar un usuario que no está en la lista", () => {
      const usuarioFantasma = new Usuario("Fantasma", "fantasma@test.com");
      const errorMsg = `El usuario "${usuarioFantasma.getNombre()}" no se encontró en el sistema.`;
      expect(() =>
        sistemaUsuarios.quitarUsuario(usuarioFantasma, sistemaEventos),
      ).toThrow(errorMsg);
    });

    test("debería lanzar un error si no se provee un sistema de eventos válido", () => {
      const errorMsg =
        "Se requiere una instancia de EventoList para limpiar las invitaciones.";
      expect(() => sistemaUsuarios.quitarUsuario(usuarioAna, null)).toThrow(
        errorMsg,
      );
      expect(() =>
        sistemaUsuarios.quitarUsuario(usuarioAna, "un_string"),
      ).toThrow(errorMsg);
    });

    test("debería lanzar un error si se intenta quitar algo que no es una instancia de Usuario", () => {
      const errorMsg =
        "El parámetro debe ser una instancia de la clase Usuario.";
      expect(() => sistemaUsuarios.quitarUsuario(null, sistemaEventos)).toThrow(
        errorMsg,
      );
      expect(() =>
        sistemaUsuarios.quitarUsuario("un_string_cualquiera", sistemaEventos),
      ).toThrow(errorMsg);
      expect(() =>
        sistemaUsuarios.quitarUsuario(12345, sistemaEventos),
      ).toThrow(errorMsg);
    });
  });
});
