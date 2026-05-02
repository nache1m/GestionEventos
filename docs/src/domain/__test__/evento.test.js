import { expect, test, describe, beforeEach } from "@jest/globals";
import { Evento } from "../evento.js";
import { Usuario } from "../usuario.js";
import { EventoList } from "../eventolist.js";
import { Mesa } from "../mesa.js";

describe("Tests sobre evento", () => {
  test("Evento con nombre null", () => {
    const event = new Evento(null);
    const expectedErrorMessage = "El nombre del evento no puede ser vacío";
    expect(() => event.isValid()).toThrow(expectedErrorMessage);
  });

  test("Evento con nombre undefined", () => {
    const event = new Evento(undefined);
    const expectedErrorMessage = "El nombre del evento no puede ser vacío";
    expect(() => event.isValid()).toThrow(expectedErrorMessage);
  });

  test("Evento con nombre vacio", () => {
    const event = new Evento("");
    const expectedErrorMessage = "El nombre del evento no puede ser vacío";
    expect(() => event.isValid()).toThrow(expectedErrorMessage);
  });

  test("Crear un evento y verificar nombre", () => {
    const eventonuevo = new Evento(
      "cumple",
      "festejo de cumple",
      "28/09/1891",
      "las acacias",
      "cds",
      "formal",
    );
    const nombredelevento = eventonuevo.getNombre();
    const expectedName = "cumple";
    expect(nombredelevento).toBe(expectedName);
    expect(eventonuevo.isValid()).toBeTruthy();
  });

  test("Test sobre getters y setters", () => {
    const eventonuevo = new Evento(
      "cumple",
      "festejo de cumple",
      "28/09/1891",
      "las acacias",
      "cds",
      "formal",
      100,
    );
    expect(eventonuevo.getNombre()).toBe("cumple");
    eventonuevo.setNombre("festejo");
    expect(eventonuevo.getNombre()).toBe("festejo");

    expect(eventonuevo.getTipo()).toBe("festejo de cumple");
    eventonuevo.setTipo("cumplanito");
    expect(eventonuevo.getTipo()).toBe("cumplanito");

    expect(eventonuevo.getFecha()).toBe("28/09/1891");
    eventonuevo.setFecha("28/09/2025");
    expect(eventonuevo.getFecha()).toBe("28/09/2025");

    expect(eventonuevo.getUbicacion()).toBe("las acacias");
    eventonuevo.setUbicacion("cds");
    expect(eventonuevo.getUbicacion()).toBe("cds");

    expect(eventonuevo.getDescripcion()).toBe("cds");
    eventonuevo.setDescripcion("el capo del continente");
    expect(eventonuevo.getDescripcion()).toBe("el capo del continente");

    expect(eventonuevo.getDresscode()).toBe("formal");
    eventonuevo.setDresscode("informal");
    expect(eventonuevo.getDresscode()).toBe("informal");

    expect(eventonuevo.getCapacidad()).toBe(100);
    eventonuevo.setCapacidad(120);
    expect(eventonuevo.getCapacidad()).toBe(120);
  });

  describe("teste sobre el manejo de mesas en un evento", () => {
    let evento;
    beforeEach(() => {
      evento = new Evento(
        "Mi Fiesta",
        "Cumpleaños",
        "2025-12-01",
        "Mi Casa",
        "Fiesta",
      );
    });

    test("debería permitir agregar y quitar mesas válidas", () => {
      const mesa1 = new Mesa(1, evento);
      const mesa5 = new Mesa(5, evento);
      const mesa10 = new Mesa(10, evento);

      evento.agregarMesa(mesa1);
      expect(evento.getCantMesas()).toBe(1);
      expect(evento.getMesas().length).toBe(1);

      evento.agregarMesa(mesa5);
      evento.agregarMesa(mesa10);
      expect(evento.getCantMesas()).toBe(3);

      expect(evento.getIdsMesas()).toStrictEqual([1, 5, 10]);

      evento.quitarMesa(5);
      expect(evento.getCantMesas()).toBe(2);
      expect(evento.getIdsMesas()).toStrictEqual([1, 10]);
    });

    test("debería lanzar un error al agregar una mesa con un numero duplicado", () => {
      const mesa1 = new Mesa(1, evento);
      const otraMesaConMismoNumero = new Mesa(1, evento);
      evento.agregarMesa(mesa1);

      const errorMsg = `Ya existe una mesa con el número ${mesa1.getNumero()}.`;

      expect(() => evento.agregarMesa(otraMesaConMismoNumero)).toThrow(
        errorMsg,
      );
    });

    test("debería lanzar un error si se intenta agregar algo que no es una instancia de Mesa", () => {
      const errorMsg = "Debe pasarse una instancia válida de Mesa.";

      expect(() => evento.agregarMesa("")).toThrow(errorMsg);
      expect(() => evento.agregarMesa(123)).toThrow(errorMsg);
      expect(() => evento.agregarMesa(null)).toThrow(errorMsg);
      expect(() => evento.agregarMesa({})).toThrow(errorMsg);
    });

    test("debería lanzar un error al intentar quitar una mesa que no existe", () => {
      const mesa1 = new Mesa(1, evento);
      evento.agregarMesa(mesa1);
      const numeroDeMesaInexistente = 99;
      const errorMsg = `La mesa número ${numeroDeMesaInexistente} no se encontró y no puede ser eliminada.`;

      expect(() => evento.quitarMesa(numeroDeMesaInexistente)).toThrow(
        errorMsg,
      );
    });
  });

  test("Test sobre invitaciones a usuarios", () => {
    const inv = new Usuario("diego", "diego@gmail.com");
    const eventonuevo = new Evento(
      "cumple",
      "festejo de cumple",
      "28/09/1891",
      "las acacias",
      "cds",
    );

    const listaeventos = new EventoList();
    listaeventos.add(eventonuevo);

    eventonuevo.invitarUsuario(inv);
    expect(eventonuevo.getInvitadosConfirmados().length).toBe(0);

    //el invitado acepta la invitacion, y se chequea que quede impactado
    listaeventos.aceptarInvitacion(inv, eventonuevo);
    expect(eventonuevo.getInvitadosConfirmados().length).toBe(1);

    const mensajeEsperado =
      "El usuario diego (mail: diego@gmail.com) ya ha sido invitado.";
    expect(() => eventonuevo.invitarUsuario(inv)).toThrow(mensajeEsperado);

    eventonuevo.eliminarTodasLasInvitaciones();
    expect(eventonuevo.getInvitaciones().length).toBe(0);

    const eventoenlista = listaeventos.getEventos()[0];
    expect(eventoenlista.getInvitaciones().length).toBe(0);
  });

  test("debería lanzar un error al intentar invitar a más usuarios que la capacidad permitida", () => {
    const eventoConLimite = new Evento(
      "Fiesta Exclusiva",
      "Privado",
      "2025-01-01",
      "Terraza",
      "VIP",
      "Elegante",
      2,
    );

    const invitado1 = new Usuario("Ana", "ana@test.com");
    const invitado2 = new Usuario("Juan", "juan@test.com");
    const invitado3 = new Usuario("Pedro", "pedro@test.com");

    eventoConLimite.invitarUsuario(invitado1);
    eventoConLimite.invitarUsuario(invitado2);

    expect(eventoConLimite.getInvitaciones()).toHaveLength(2);

    const errorMsg = `El evento "Fiesta Exclusiva" ha alcanzado su capacidad máxima de 2 invitados y no se pueden enviar más invitaciones.`;

    expect(() => eventoConLimite.invitarUsuario(invitado3)).toThrow(errorMsg);

    expect(eventoConLimite.getInvitaciones()).toHaveLength(2);
  });
});
