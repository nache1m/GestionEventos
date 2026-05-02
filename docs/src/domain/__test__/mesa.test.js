import { Mesa } from "../mesa.js";
import { Usuario } from "../usuario.js";
import { Evento } from "../evento.js";
import { Invitacion } from "../invitacion.js";
import { expect, test, describe, beforeEach } from "@jest/globals";

describe("Clase Mesa", () => {
  let evento;
  let usuario1;
  let usuario2;
  let invitacion1;
  let invitacion2;
  let mesa;

  beforeEach(() => {
    evento = new Evento("Fiesta Tech", "18:00", "20/08", "Montevideo");
    usuario1 = new Usuario("Ana López", "ana@example.com", "invitado");
    usuario2 = new Usuario("Carlos Pérez", "carlos@example.com", "invitado");
    invitacion1 = new Invitacion(usuario1, "Invitada especial", "Fiesta Tech");
    invitacion2 = new Invitacion(usuario2, "", "Fiesta Tech");
    mesa = new Mesa(1, evento);
  });

  test("crear una mesa válida", () => {
    expect(mesa.getNumero()).toBe(1);
    expect(mesa.getEvento()).toBe(evento);
    expect(mesa.getInvitados()).toEqual([]);
  });

  test("modificar número y evento de la mesa", () => {
    const nuevoEvento = new Evento(
      "Conferencia AI",
      "10:00",
      "25/09",
      "Punta del Este",
    );
    mesa.setNumero(5);
    mesa.setEvento(nuevoEvento);

    expect(mesa.getNumero()).toBe(5);
    expect(mesa.getEvento()).toBe(nuevoEvento);
  });

  test("agregar invitado a la mesa", () => {
    mesa.agregarInvitado(invitacion1);
    expect(mesa.getInvitados()).toContain(invitacion1);
  });

  test("lanzar error si se intenta agregar dos veces el mismo invitado", () => {
    mesa.agregarInvitado(invitacion1);
    expect(() => mesa.agregarInvitado(invitacion1)).toThrow(
      `El usuario Ana López (mail: ana@example.com) ya ha sido agregado a la mesa.`,
    );
  });

  test("quitar invitado de la mesa", () => {
    mesa.agregarInvitado(invitacion2);
    mesa.quitarInvitado(invitacion2);
    expect(mesa.getInvitados()).not.toContain(invitacion2);
  });

  test("lanzar error si se intenta quitar un invitado que no está en la mesa", () => {
    expect(() => mesa.quitarInvitado(invitacion2)).toThrow(
      `El usuario Carlos Pérez (mail: carlos@example.com) no ha sido agregado a esta mesa.`,
    );
  });
});
