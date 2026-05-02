import { expect, test, describe, beforeEach } from "@jest/globals";
import { Evento } from "../evento.js";
import { EventoList } from "../eventolist.js";
import { Usuario } from "../usuario.js";

describe("pruebas sobre la clase Usuario", () => {
  test("test sobre getters", () => {
    const usuario = new Usuario(
      "Juan Perez",
      "juan.perez@test.com",
      "099123456",
    );
    expect(usuario.getNombre()).toBe("Juan Perez");
    expect(usuario.getMail()).toBe("juan.perez@test.com");
    expect(usuario.getTelefono()).toBe("099123456");
    expect(usuario.getRol()).toBeUndefined();
    expect(usuario.getRestriccion()).toBeUndefined();
  });

  test("controles sobre los setters)", () => {
    const usuario = new Usuario("Ana", "ana@test.com");

    usuario.setNombre("Ana García");
    expect(usuario.getNombre()).toBe("Ana García");

    usuario.setMail("ana.garcia@test.com");
    expect(usuario.getMail()).toBe("ana.garcia@test.com");

    usuario.setTelefono("098765432");
    expect(usuario.getTelefono()).toBe("098765432");

    usuario.setTipo("Admin");
    expect(usuario.getRol()).toBe("Admin");

    usuario.setRestriccion("Vegetariano");
    expect(usuario.getRestriccion()).toBe("Vegetariano");

    usuario.setRestriccion();
    expect(usuario.getRestriccion()).toBe("");
  });

  describe("pruebas sobre el metodo isValid", () => {
    test("devuelve true para un usuario con nombre y mail válidos", () => {
      const usuarioValido = new Usuario("Carlos", "carlos@test.com");
      expect(usuarioValido.isValid()).toBe(true);
    });

    test("devuelve un error si el nombre es inválido", () => {
      const usuarioSinNombre = new Usuario("", "sin.nombre@test.com");
      const errorMsg = "El nombre del usuario no puede ser vacio";
      expect(() => usuarioSinNombre.isValid()).toThrow(errorMsg);
    });
    test("devuelve error si el nombre es null", () => {
      const usuarioConNombreNull = new Usuario(null, "test@mail.com");
      const errorMsg = "El nombre del usuario no puede ser vacio";
      expect(() => usuarioConNombreNull.isValid()).toThrow(errorMsg);
    });

    test("devuelve error si el nombre es undefined", () => {
      const usuarioConNombreUndefined = new Usuario(undefined, "test@mail.com");
      const errorMsg = "El nombre del usuario no puede ser vacio";
      expect(() => usuarioConNombreUndefined.isValid()).toThrow(errorMsg);
    });

    test("devuelve error si el mail es inválido", () => {
      const usuarioSinMail = new Usuario("Usuario Sin Mail", "");
      const errorMsg = "El mail del usuario no debe estar vacio";
      expect(() => usuarioSinMail.isValid()).toThrow(errorMsg);
    });

    test("debería lanzar un error si el mail es null", () => {
      const usuarioSinMail = new Usuario("Usuario Con Nombre", null);
      const errorMsg = "El mail del usuario no debe estar vacio";
      expect(() => usuarioSinMail.isValid()).toThrow(errorMsg);
    });

    test("debería lanzar un error si el mail es undefined", () => {
      const usuarioSinMail = new Usuario("Usuario Con Nombre", undefined);
      const errorMsg = "El mail del usuario no debe estar vacio";
      expect(() => usuarioSinMail.isValid()).toThrow(errorMsg);
    });
  });

  describe("pruebas sobre elmetodo getEventosInvitado", () => {
    let sistemaDeEventos;
    let boda, conferencia;

    beforeEach(() => {
      sistemaDeEventos = new EventoList();
      boda = new Evento(
        "Boda",
        "Casamiento",
        "2025-11-22",
        "Salón Principal",
        "",
      );
      conferencia = new Evento(
        "Conferencia Tech",
        "Corporativo",
        "2025-09-01",
        "LATU",
        "",
      );
      sistemaDeEventos.add(boda);
      sistemaDeEventos.add(conferencia);
    });

    test("debería devolver un array vacío si el usuario no tiene invitaciones", () => {
      const usuarioNoInvitado = new Usuario("Pedro", "pedro@test.com");

      const eventos = usuarioNoInvitado.getEventosInvitado(sistemaDeEventos);
      expect(eventos).toStrictEqual([]);
    });

    test("debería devolver un array con los eventos a los que el usuario fue invitado", () => {
      const usuarioInvitado = new Usuario("Laura", "laura@test.com");

      sistemaDeEventos.invitarUsuarioAEvento(usuarioInvitado, boda);

      const eventos = usuarioInvitado.getEventosInvitado(sistemaDeEventos);

      expect(eventos).toHaveLength(1);
      expect(eventos[0]).toBe(boda);
      expect(eventos[0].getNombre()).toBe("Boda");
    });
  });
});
