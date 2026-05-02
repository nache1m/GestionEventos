import { expect, test, describe } from "@jest/globals";
import { Evento } from "../evento.js";
import { EventoList } from "../eventolist.js";
import { Usuario } from "../usuario.js";

describe("pruebas sobre la clase eventolist", () => {
  test("Crear una lista de eventos vacia", () => {
    const listaeventos = new EventoList();
    const expectedLength = 0;
    expect(listaeventos.getEventos().length).toBe(expectedLength);
  });

  test("Agregar un evento con nombre repetido a la lista", () => {
    const listaeventos = new EventoList();
    const eventonuevo = new Evento(
      "cumple",
      "festejo de cumple",
      "28/09/1891",
      "las acacias",
      "cds",
    );
    listaeventos.add(eventonuevo);
    const expectedErrorMessage =
      "No se pudo agregar cumple. Ya se agendó un evento con ese nombre.";
    expect(() => listaeventos.add(eventonuevo)).toThrow(expectedErrorMessage);
  });

  test("Error al no pasar una instancia de tipo usuario para consultar las invitaciones del mismo", () => {
    const listaeventos = new EventoList();
    const mensajeError =
      "El parámetro debe ser una instancia de la clase Usuario para poder buscar sus invitaciones.";
    expect(() => listaeventos.getInvitacionesDelUsuario("diego")).toThrow(
      mensajeError,
    );
  });

  test("Consultar las invitaciones de un usuario sin invitaciones", () => {
    const invitado = new Usuario("diego", "diego@gmail.com");

    const listaeventos = new EventoList();
    expect(listaeventos.getInvitacionesDelUsuario(invitado)).toStrictEqual([]);
  });

  test("Consultar las invitaciones de un usuario con una invitacion enviada", () => {
    const invitado = new Usuario("diego", "diego@gmail.com");

    const eventonuevo = new Evento(
      "cumple",
      "festejo de cumple",
      "28/09/1891",
      "las acacias",
      "cds",
    );

    const listaeventos = new EventoList();
    listaeventos.add(eventonuevo);
    listaeventos.invitarUsuarioAEvento(invitado, eventonuevo);
    const invsDelInvitado = listaeventos.getInvitacionesDelUsuario(invitado);

    expect(invsDelInvitado[0].getEvento()).toBe(eventonuevo);
  });

  test("Un usuario no puede acpetar invitacion a un evento que no esta invitado", () => {
    const invitado = new Usuario("diego", "diego@gmail.com");

    const eventonuevo = new Evento(
      "cumple",
      "festejo de cumple",
      "28/09/1891",
      "las acacias",
      "cds",
    );

    const listaeventos = new EventoList();
    listaeventos.add(eventonuevo);
    const mensaje =
      "El usuario diego no tiene una invitación para el evento cumple.";

    expect(() => listaeventos.aceptarInvitacion(invitado, eventonuevo)).toThrow(
      mensaje,
    );
  });

  test("debería lanzar un error si pasamos algo que no sea un usuario para aceptar una invitacion", () => {
    const listaeventos = new EventoList();
    const evento = new Evento(
      "Conferencia Anual",
      "Corporativo",
      "2025-10-20",
      "Hotel Radisson",
      "",
    );
    listaeventos.add(evento);

    const mensaje =
      "El objeto a invitar debe ser una instancia de la clase Usuario.";

    expect(() => listaeventos.invitarUsuarioAEvento(1, evento)).toThrow(
      mensaje,
    );
  });

  test("debería lanzar un error si no pasamos un evento al invitar un usuario a un evento", () => {
    const listaeventos = new EventoList();
    const invitado = new Usuario("diego", "diego@gmail.com");

    const mensaje = "El destino debe ser una instancia de la clase Evento.";

    expect(() => listaeventos.invitarUsuarioAEvento(invitado, 1)).toThrow(
      mensaje,
    );
  });

  test("debería lanzar un error si pasamos un evento no registrado en el sistema para invitar a un usuario", () => {
    const listaeventos = new EventoList();
    const evento = new Evento(
      "Conferencia Anual",
      "Corporativo",
      "2025-10-20",
      "Hotel Radisson",
      "",
    );
    const invitado = new Usuario("diego", "diego@gmail.com");
    const mensaje =
      "El evento Conferencia Anual no se encuentra en el sistema y no se puede enviar la invitación.";

    expect(() => listaeventos.invitarUsuarioAEvento(invitado, evento)).toThrow(
      mensaje,
    );
  });

  test("error al eliminarInvitacionDeUsuario y no pasar un usuario", () => {
    const mensaje = "El parámetro debe ser una instancia de la clase Usuario.";

    const listaeventos = new EventoList();
    expect(() => listaeventos.eliminarInvitacionesDeUsuario(1)).toThrow(
      mensaje,
    );
  });

  test("error al quitar un evento y no pasar un evento", () => {
    const listaeventos = new EventoList();
    const mensaje =
      "El evento suministrado debe ser una instancia de la clase Evento.";
    expect(() => listaeventos.quitarEvento(1)).toThrow(mensaje);
  });

  test("error al quitar un evento y no pasar un evento que pertenezca", () => {
    const listaeventos = new EventoList();
    const evento = new Evento(
      "Conferencia Anual",
      "Corporativo",
      "2025-10-20",
      "Hotel Radisson",
      "",
    );

    const mensaje = "El evento Conferencia Anual no se encontró en el sistema.";
    expect(() => listaeventos.quitarEvento(evento)).toThrow(mensaje);
  });

  test("quitar un evento", () => {
    const listaeventos = new EventoList();
    const evento = new Evento(
      "Conferencia Anual",
      "Corporativo",
      "2025-10-20",
      "Hotel Radisson",
      "",
    );
    listaeventos.add(evento);
    listaeventos.quitarEvento(evento);

    expect(listaeventos.getEventos().length).toBe(0);
  });
});
