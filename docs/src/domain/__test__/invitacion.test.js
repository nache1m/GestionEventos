import { Usuario } from "../usuario.js";
import { Invitacion } from "../invitacion.js";
import { expect, test, describe, beforeEach } from "@jest/globals";

describe("Clase Invitacion", () => {
  let usuario;

  beforeEach(() => {
    usuario = new Usuario("Leo Fernandez", "lf10@peñarol.com", "invitado");
  });

  test("crear una invitación válida", () => {
    const invitacion = new Invitacion(
      usuario,
      "El festejo más grande",
      "Fiesta",
    );

    expect(invitacion.getInvitado()).toBe(usuario);
    expect(invitacion.getEstado()).toBe("pendiente");
    expect(invitacion.getDescripcion()).toBe("El festejo más grande");
    expect(invitacion.getEvento()).toBe("Fiesta");
  });

  test("aceptar la invitación cambia el estado a 'aceptada'", () => {
    const invitacion = new Invitacion(usuario, "Algo", "Fiesta");
    invitacion.aceptar();

    expect(invitacion.getEstado()).toBe("aceptada");
  });

  test("rechazar la invitación cambia el estado a 'rechazada' y guarda motivo", () => {
    const invitacion = new Invitacion(usuario, "", "Reunión");
    invitacion.rechazar("No puedo ese día");

    expect(invitacion.getEstado()).toBe("rechazada");
    expect(invitacion.getDescripcion()).toBe("No puedo ese día");
  });

  test("lanzar error si no se pasa un Usuario como invitado", () => {
    expect(() => new Invitacion("noUsuario", "", "Evento")).toThrow(
      "El invitado debe ser una instancia de la clase usuario.",
    );
  });

  test("modificar invitado, evento y descripción", () => {
    const invitacion = new Invitacion(usuario, "", "Evento 1");
    const nuevoUsuario = new Usuario("Mati Arezo", "ma19@inv.com", "invitado");

    invitacion.setInvitado(nuevoUsuario);
    invitacion.setEvento("Evento B");
    invitacion.setDescripcion("Nuevo detalle");

    expect(invitacion.getInvitado()).toBe(nuevoUsuario);
    expect(invitacion.getEvento()).toBe("Evento B");
    expect(invitacion.getDescripcion()).toBe("Nuevo detalle");
  });

  test("modificar el estado directamente con setEstado", () => {
    const invitacion = new Invitacion(usuario, "", "Evento X");
    invitacion.setEstado("rechazada");

    expect(invitacion.getEstado()).toBe("rechazada");
  });

  test("lanzar error si se asigna un estado inválido", () => {
    const invitacion = new Invitacion(usuario, "", "Fiesta");
    expect(() => invitacion.setEstado("cancelada")).toThrow(
      "Estado inválido. Debe ser pendiente, aceptada o rechazada.",
    );
  });

  test("lanzar error si la descripción no es un string", () => {
    const invitacion = new Invitacion(usuario, "Desc", "Fiesta");
    expect(() => invitacion.setDescripcion(123)).toThrow(
      "La descripción debe ser un texto.",
    );
  });

  test("lanzar error si el evento es un string vacío", () => {
    const invitacion = new Invitacion(usuario, "Algo", "Valido");
    expect(() => invitacion.setEvento("")).toThrow(
      "El evento debe ser un nombre válido.",
    );
  });

  test("lanzar error si se asigna un invitado que no es Usuario", () => {
    const invitacion = new Invitacion(usuario, "Algo", "Fiesta");
    expect(() => invitacion.setInvitado("noUsuario")).toThrow(
      "El invitado debe ser una instancia de la clase Usuario.",
    );
  });

  test("lanzar error si se asigna un invitado no válido usando setInvitado", () => {
    const invitacion = new Invitacion(usuario, "Algo", "Evento");
    expect(() => invitacion.setInvitado("string invalido")).toThrow(
      "El invitado debe ser una instancia de la clase Usuario.",
    );
  });

  test("modificar el estado a 'pendiente' usando setEstado", () => {
    const invitacion = new Invitacion(usuario, "", "Fiesta");
    invitacion.setEstado("pendiente");
    expect(invitacion.getEstado()).toBe("pendiente");
  });

  test("crear invitación sin descripción la asigna como texto vacío", () => {
    const invitacion = new Invitacion(usuario, undefined, "Fiesta");
    expect(invitacion.getDescripcion()).toBe("");
  });

  test("lanzar error si el motivo no es un string al rechazar", () => {
    const invitacion = new Invitacion(usuario, "Desc", "Fiesta");
    expect(() => invitacion.rechazar(123)).toThrow(
      "El motivo debe ser un texto.",
    );
  });

  test("rechazar sin motivo explícito asigna descripción vacía", () => {
    const invitacion = new Invitacion(usuario, "original", "Fiesta");
    invitacion.rechazar(); // sin argumento
    expect(invitacion.getEstado()).toBe("rechazada");
    expect(invitacion.getDescripcion()).toBe(""); // default value
  });

  test("setDescripcion acepta un string válido", () => {
    const invitacion = new Invitacion(usuario, "desc inicial", "Fiesta");
    invitacion.setDescripcion("Una nueva descripción válida");
    expect(invitacion.getDescripcion()).toBe("Una nueva descripción válida");
  });

  test("setDescripcion usa valor por defecto cuando no se pasa argumento", () => {
    const invitacion = new Invitacion(usuario, "desc inicial", "Fiesta");
    invitacion.setDescripcion(); // no se pasa argumento
    expect(invitacion.getDescripcion()).toBe(""); // valor por defecto
  });

  test("modificar la restricción alimentaria de una invitación", () => {
    const invitacion = new Invitacion(usuario, "desc", "Fiesta");
    invitacion.setRestriccion("Celíaco");
    expect(invitacion.getRestriccion()).toBe("Celíaco");
  });

  test("una invitación tiene restricción vacía por defecto", () => {
    const invitacion = new Invitacion(usuario, "desc", "Fiesta");
    expect(invitacion.getRestriccion()).toBe("");
  });

  test("guardar y recuperar mensaje del invitado", () => {
    const usuario = new Usuario("Test", "t@e.com", "invitado");
    const inv = new Invitacion(usuario, "", "Fiesta", "Nos vemos pronto!");

    expect(inv.getMensajeInvitado()).toBe("Nos vemos pronto!");

    inv.setMensajeInvitado("Cambio de idea");
    expect(inv.getMensajeInvitado()).toBe("Cambio de idea");
  });

  test("debería lanzar error si mensajeInvitado no es string al crear la invitación", () => {
    const usuario = new Usuario("Lucía", "lucia@example.com", "invitado");
    expect(() => {
      new Invitacion(usuario, "", "Fiesta", 123);
    }).toThrow("El mensaje debe ser un texto.");
  });

  test("debería lanzar error si se asigna un mensajeInvitado no string con el setter", () => {
    const usuario = new Usuario("Lucía", "lucia@example.com", "invitado");
    const invitacion = new Invitacion(usuario, "", "Fiesta");
    expect(() => {
      invitacion.setMensajeInvitado(456);
    }).toThrow("El mensaje debe ser un texto.");
  });
});
