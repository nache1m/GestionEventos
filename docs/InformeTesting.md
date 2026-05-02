# Informe Testing
_Link a repositorio testeado:_ https://github.com/IngSoft-FIS-2025-1/proyecto-jorge-mottillo-albarellos

## 1. Introducción

Este informe presenta el análisis funcional y exploratorio del proyecto **Proyecto-Jorge-Mottillo-Albarellos**, evaluado por el equipo **Proyecto-Parrado-Camejo-remlinger** en el marco de la materia *Fundamentos de Ingeniería de Software (FIS)*.

Durante los días 26, 27 y 28 de junio de 2025 se realizaron sesiones de testing funcional y exploratorio aplicando técnicas de caja negra sobre funcionalidades clave como: creación de eventos, invitados, mesas e invitaciones. 

## 2. Metodología

### a. Técnicas aplicadas

- Particiones de equivalencia
- Análisis de valores límite
- Derivación de casos desde Casos de Uso (CDU)
- Testing exploratorio dirigido por funcionalidades

### b. Herramientas utilizadas

- Navegador + Herramientas de desarrollo (consola, inspección)
- Live Server
- Capturas de pantalla
- Markdown para documentación

### c. Bibliografía

- Sommerville, I. (2011). *Ingeniería de software* (9ª ed.). Pearson.

---

## 3. Testing Funcional y Exploratorio

### **Resultados del Testing Funcional por Casos de Prueba**

#### **CDP: Agregar Invitado**
* **Sesión de Prueba:** 27 y 28/06/2025
* **Testers:** Parrado, Camejo, remlinger

| ID de Prueba | Nombre del Caso de Prueba | Propósito | Precondiciones | Pasos a Ejecutar | Resultado Esperado | Resultado Obtenido | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-IN-01** | **Verificación de campos obligatorios vacíos** | Validar que el sistema no permite agregar un invitado si los campos requeridos (nombre, email) están vacíos. | El usuario ha seleccionado un evento y se encuentra en la sección "Tu Evento/Invitados". | 1. Hacer clic en el botón para agregar un nuevo invitado.<br>2. Dejar los campos `Nombre completo` y `Email` vacíos.<br>3. Hacer clic en "Agregar". | El sistema debe mostrar un mensaje de error claro indicando que los campos son obligatorios. | Se controlaron los campos vacíos (nombre, email) y el sistema respondió con el feedback adecuado, impidiendo el registro. | **Pasa** |
| **CP-IN-02** | **Verificación de duplicación de invitados** | Confirmar si el sistema permite agregar un invitado con un nombre y/o email que ya existe en la lista. | Existe un invitado previamente agregado al evento. | 1. Intentar agregar un nuevo invitado utilizando el mismo nombre y email que un invitado existente.<br>2. Observar la respuesta del sistema. | El sistema debería impedir la duplicación mostrando un error, o permitirla si ese es el comportamiento definido. | Se verificó que el sistema permite la duplicación de invitados (mismo email/nombre). Esto se documenta como una sugerencia de mejora en la usabilidad. | **No Pasa** |
| **CP-IN-03** | **Verificación de filtro por restricciones alimenticias** | Validar que la funcionalidad de filtrar invitados según sus restricciones alimenticias opera correctamente. | Existen invitados con y sin restricciones alimenticias cargadas en el evento. | 1. Navegar a la sección "Invitados".<br>2. Utilizar el filtro "Con restricciones".<br>3. Utilizar el filtro "Sin restricciones". | Al seleccionar "Con restricciones", la lista debe mostrar únicamente a los invitados que tienen alguna restricción. Al seleccionar "Sin restricciones", debe mostrar el resto. | Se probaron los filtros por restricciones alimenticias y funcionaron correctamente, mostrando la información esperada en cada caso. | **Pasa** |

 Evidencias:
- ![Ev6](img/informe2/Informe%20testing/invitado%20sin%20nombre%20ni%20email.png)
- ![EV6.1](img/informe2/Informe%20testing/usuariosinmail.png)
- ![Ev7](img/informe2/Informe%20testing/duplicación%20de%20invitación.png)
- ![Ev8](img/informe2/Informe%20testing/filtro%20invitado%20con%20restriccion.png)
- ![Ev9](img/informe2/Informe%20testing/filtro%20invitado%20sin%20restricción.png)
- ![Ev10](img/informe2/Informe%20testing/agrega_invitado.png)
- ![Ev11](img/informe2/Informe%20testing/modifiacion_correcta_invitados.png)

---
#### **CDP: Crear Mesa**
* **Sesión de Prueba:** 27/06/2025
* **Testers:** Parrado, Camejo, remlinger

| ID de Prueba | Nombre del Caso de Prueba | Propósito | Precondiciones | Pasos a Ejecutar | Resultado Esperado | Resultado Obtenido | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-ME-01** | **Verificación de creación de mesa con campos vacíos y duplicados** | Validar que el sistema controla que los campos para crear una mesa no estén vacíos y que el ID no esté duplicado. | El usuario ha seleccionado un evento y se encuentra en la sección "Mesas". | 1. Intentar crear una mesa dejando el campo `ID` vacío.<br>2. Intentar crear una mesa con un `ID` que ya existe. | El sistema debe mostrar un mensaje de error en ambos escenarios, impidiendo la creación de la mesa. | Se probó la creación de mesas con campos vacíos y duplicados. Si bien s eocnfirma que no s ecrean mesas con identificadores nulos o vacios, se observa que se pueden crear mesas con identificadores duplicados. | **Pasa parcialmente** |
| **CP-ME-02** | **Creación de mesa con datos correctos (Camino Feliz)** | Verificar que una mesa puede ser creada correctamente cuando se proporcionan datos válidos y únicos. | El usuario ha seleccionado un evento y se encuentra en la sección "Mesas". | 1. Ingresar un `ID` y `Nombre` únicos para la nueva mesa.<br>2. Hacer clic en "Añadir Mesa". | La mesa debe ser creada exitosamente y aparecer en la lista de mesas del evento. | La creación de mesas con datos correctos y únicos se realizó de forma exitosa, como se evidencia en la captura `creación de mesa.png`. | **Pasa** |

 Evidencias:
- ![Ev12](img/informe2/Informe%20testing/mesa%20vacia.png)
- ![Ev13](img/informe2/Informe%20testing/creación%20de%20mesa.png)



---
#### **CDP: Crear y Enviar Invitación**
* **Sesión de Prueba:** 28/06/2025
* **Testers:** Parrado, Camejo, remlinger

| ID de Prueba | Nombre del Caso de Prueba | Propósito | Precondiciones | Pasos a Ejecutar | Resultado Esperado | Resultado Obtenido | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-INV-01** | **Generación de invitación con campos requeridos** | Verificar que la invitación se genera y se envía correctamente al completar los campos del formulario. | El usuario ha seleccionado un evento y está en la sección "Invitados". | 1. Completar los campos requeridos en el formulario de la invitación.<br>2. Hacer clic en "Confirmar y enviar". | El sistema debe confirmar el envío de la invitación con un mensaje de éxito. | Se generó la invitación correctamente con los campos requeridos y el sistema notificó el envío de forma exitosa. | **Pasa** |
| **CP-INV-02** | **Verificación de trazabilidad de invitación** | Observar si el envío de una invitación queda registrado o vinculado a los invitados del evento. | Un evento con invitados cargados. | 1. Enviar una invitación (pasos del CP-INV-01).<br>2. Navegar a la sección de "Invitados" y observar si hay cambios. | Un sistema con trazabilidad debería actualizar el estado del invitado o registrar de alguna forma que la invitación fue enviada. | El sistema notifica al enviar, pero se observó que no mantiene trazabilidad con los invitados. Esto se registró como una sugerencia de mejora funcional. | **Pasa** |

- ![Ev14](img/informe2/Informe%20testing/invitadoAgregado.png)
- ![Ev15](img/informe2/Informe%20testing/impactoInvitacion.png)



## Sección: Creación de Evento
CE-001 – Crear evento con menos de 30 invitados (límite inferior)

CE-002 – Crear evento con más de 500 invitados (límite superior)

CE-003 – Crear evento con nombre vacío

CE-004 – Crear evento con fecha en el pasado

CE-005 – Crear evento sin ubicación

## Sección: Invitados

IN-001 – Agregar invitado con nombre vacío

IN-002 – Agregar invitado con email vacío

IN-003 – Agregar invitado duplicado (nombre y email iguales)

IN-004 – Agregar invitado sin restricción alimentaria y verificar filtro

IN-005 – Agregar invitado con restricción alimentaria y verificar filtro

IN-006 – Eliminar invitados agregados


## Sección: Mesas
ME-001 – Crear mesa sin ID

ME-002 – Crear mesa duplicada

ME-003 –  Creación de mesa con invitados mayor al establecido en sistema y máximo 

 Sección: Invitaciones

IV-001 – Crear invitación sin link de confirmación

IV-002 – Enviar invitación sin invitados

IV-003 – Crear y enviar invitación con diseño

### Caso de prueba: Crear evento con menos de 30 invitados

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | CE-001                                                                               |
| **Nombre**               | Crear evento con menos de 30 invitados                                               |
| **Propósito**            | Verificar límite inferior de invitados                                               |
| **Precondiciones**       | Usuario en pantalla correspondiente            	                                    |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso  2. Click en guardar              |
| **Datos de prueba**      | Se prueba con 0 invitados y valor negativo -20                                       |
| **Resultado esperado**   | Alerta sobre número de invitados		                                                  |
| **Resultado obtenido**   | Correcta alerta de sistema indicando que invitados debe estar entre 30 y 500         |
| **Estado**               | Pasa              					                                                          |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 26/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | ![Ev3](img/informe2/Informe%20testing/invitados%200%20en%20creación%20de%20evento.png)|          
![Ev4](img/informe2/Informe%20testing/Invitados%20negativos%20en%20creación%20de%20evento.png)                    |
-------------------------------------------------------------------------------------------------------------------


### Caso de prueba: Crear evento con más de 500 invitados

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | CE-002                                                                               |
| **Nombre**               | Crear evento con más de 500 invitados                                                |
| **Propósito**            | Verificar límite superior de invitados                                               |
| **Precondiciones**       | Usuario en pantalla correspondiente                                                  |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso  2. Click en guardar              |
| **Datos de prueba**      | (Completar)                                                                          |
| **Resultado esperado**   | Sistema notifique cantidad de invitados en rangos esperados                          |
| **Resultado obtenido**   | Correcta alerta de sistema indicando que invitados debe estar entre 30 y 500         |
| **Estado**               | Pasa                                                                                 |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 26/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | [Ev5](img/informe2/Informe%20testing/modificacion_eventopng.png)                     |
-------------------------------------------------------------------------------------------------------------------
Se probo creando, y también modificando evento, se adjunta evidencia en modificación, utilizan misma logica de control.

### Caso de prueba: Crear evento con nombre vacío

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | CE-003                                                                               |
| **Nombre**               | Crear evento con nombre vacío                                                        |
| **Propósito**            | Validar que el nombre del evento no esté vacío                                       |
| **Precondiciones**       | Usuario en pantalla correspondiente                                                  |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso <br> 2. Click en guardar          |
| **Datos de prueba**      | Comprobar en captura                                                                 |
| **Resultado esperado**   | Sistema notifique nombre de evento no puede ser vacio                                |
| **Resultado obtenido**   | Correcto control y alerta sobre el campo que se notifica visualmente mediante feedback|
| **Estado**               | Pasa                                                                                 |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 26/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | ![Ev1](img/informe2/Informe%20testing/control%20nombre%20evento%20vacio.png)         |
-------------------------------------------------------------------------------------------------------------------

### Caso de prueba: Crear evento con fecha en el pasado

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | CE-004                                                                               |
| **Nombre**               | Crear evento con fecha en el pasado                                                  |
| **Propósito**            | Validar que no se acepten fechas pasadas                                             |
| **Precondiciones**       | Usuario en pantalla correspondiente                                                  |
| **Pasos a ejecutar**     | Completar el formulario con datos según el caso - 2. Click en guardar                |
| **Datos de prueba**      | Se ingresa una fecha previa en la generación del evento a la actual                  |
| **Resultado esperado**   | Notificación de sistema y control de fecha actual                                    |
| **Resultado obtenido**   | Se notifica correctamente al usuario mediante feedback que se debe ingresar una fecha |
                            posterior a la actua para la generación del evento                                    |
| **Estado**               | Pasa                                                                                 |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 26/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | ![Ev2](img/informe2/Informe%20testing/creación%20de%20evento%20en%20fecha%20pasada.png)|
-------------------------------------------------------------------------------------------------------------------

### Caso de prueba: Crear evento sin ubicación

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | CE-005                                                                               |
| **Nombre**               | Crear evento sin ubicación                                                           |
| **Propósito**            | Validar campo obligatorio de ubicación                                               |
| **Precondiciones**       | Usuario en pantalla correspondiente                                                  |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso  2. Click en guardar              |
| **Datos de prueba**      | (Completar)                                                                          |
| **Resultado esperado**   | (Completar según lógica del sistema)                                                 |
| **Resultado obtenido**   | (Completar)                                                                          |
| **Estado**               | (Pasa / Falla / Bloqueado / No ejecutado)                                            |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 26/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | ![Evento sin dirección](img/informe2/Informe%20testing/evento_sin_direcci%C3%B3n.png)|
-------------------------------------------------------------------------------------------------------------------


### Caso de prueba: Agregar invitado con nombre vacío

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | IN-001                                                                               |
| **Nombre**               | Agregar invitado con nombre vacío                                                    |
| **Propósito**            | Verificar validación de nombre                                                       |
| **Precondiciones**       | Usuario en pantalla correspondiente                                                  |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso <br> 2. Click en guardar          |
| **Datos de prueba**      | Se ingresa nombre de invitado vacio                                                  |
| **Resultado esperado**   | Sistema notifique que se debe ingresar nombre                                        |
| **Resultado obtenido**   | Correcto control y feedback al usuario notificando campo vacio                       |
| **Estado**               | Pasa                                                                                 |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 27/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | ![Ev6](img/informe2/Informe%20testing/invitado%20sin%20nombre%20ni%20email.png)      |
-------------------------------------------------------------------------------------------------------------------

### Caso de prueba: Agregar invitado con email vacío

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | IN-002                                                                               |
| **Nombre**               | Agregar invitado con email vacío                                                     |
| **Propósito**            | Verificar validación de email                                                        |
| **Precondiciones**       | Usuario en pantalla correspondiente                                                  |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso <br> 2. Click en guardar          |
| **Datos de prueba**      | Se ingresa email de invitado vacio                                                   |
| **Resultado esperado**   | Sistema notifique que se debe ingresar email                                         |
| **Resultado obtenido**   | Correcto control y feedback al usuario notificando campo vacio                       |
| **Estado**               | Pasa                                                                                 |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 27/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | ![Ev6](img/informe2/Informe%20testing/invitado%20sin%20nombre%20ni%20email.png)      |
-------------------------------------------------------------------------------------------------------------------

### Caso de prueba: Agregar invitado duplicado

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | IN-003                                                                               |
| **Nombre**               | Agregar invitado duplicado                                                           |
| **Propósito**            | Evitar duplicación de nombre y email                                                 |
| **Precondiciones**       | Usuario en pantalla correspondiente  con evento creado                               |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso <br> 2. Click en guardar          |
| **Datos de prueba**      | Se ingresa invitado con mismos campos que invitado ya agregado                       |
| **Resultado esperado**   | Sistema notifique que no se puede ingresar por datos duplicados                      |
| **Resultado obtenido**   | Permite ingresar al mismo invitado con mismos datos, no controla que invitado que ya este ingresado    |
| **Estado**               | Falla                                                                                |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 27/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | ![Ev8](img/informe2/Informe%20testing/filtro%20invitado%20con%20restriccion.png)     |
-------------------------------------------------------------------------------------------------------------------


### Caso de prueba: Agregar invitado con restricción alimentaria y verificar filtro

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | IN-004                                                                               |
| **Nombre**               | Agregar invitado con restricción alimentaria y verificar filtro                      |
| **Propósito**            | Probar filtro por restricción                                                        |
| **Precondiciones**       | Usuario en pantalla correspondiente, con evento creado                               |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso <br> 2. Click en guardar          |
| **Datos de prueba**      | Se agregan invitados con restriccion y sin restricciones                             |
| **Resultado esperado**   | Poder filtrar en sección invitados por restricción                                   |
| **Resultado obtenido**   | Se filtra correctamente                                                              |
| **Estado**               | Pasa                                                                                 |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 27/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | - ![Ev8](img/informe2/Informe%20testing/filtro%20invitado%20con%20restriccion.png)   |
-------------------------------------------------------------------------------------------------------------------

### Caso de prueba: Agregar invitado sin restricción alimentaria y verificar filtro

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | IN-005                                                                               |
| **Nombre**               | Agregar invitado con restricción alimentaria y verificar filtro                      |
| **Propósito**            | Probar filtro por restricción                                                        |
| **Precondiciones**       | Usuario en pantalla correspondiente, con evento creado                               |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso <br> 2. Click en guardar          |
| **Datos de prueba**      | Se agregan invitados con restriccion y sin restricciones                             |
| **Resultado esperado**   | Poder filtrar en sección invitados por sin restricción                               |
| **Resultado obtenido**   | Se filtra correctamente                                                              |
| **Estado**               | Pasa                                                                                 |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 27/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | - ![Ev9](img/informe2/Informe%20testing/filtro%20invitado%20sin%20restricción.png)   |
-------------------------------------------------------------------------------------------------------------------

### Caso de prueba:  Eliminar invitados agregados

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | IN-006                                                                               |
| **Nombre**               | Elminar invitados agregados                                                          |
| **Propósito**            | Probar filtro por restricción                                                        |
| **Precondiciones**       | Usuario en pantalla correspondiente, con evento creado                               |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso <br> 2. Click en guardar          |
| **Datos de prueba**      | Eliminar invitados ingresados                                                        |
| **Resultado esperado**   | Permite eliminar correctamente a los invitados agregados/modificados                 |
| **Resultado obtenido**   | Borrado de invitados                                                                 |
| **Estado**               | Pasa                                                                                 |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 27/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | - ![Eliminación de invitados](img/informe2/Informe%20testing/eliminaci%C3%B3n_Invitados.png) |
-------------------------------------------------------------------------------------------------------------------

### Caso de prueba: Crear mesa sin ID

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | ME-001                                                                               |
| **Nombre**               | Crear mesa sin ID                                                                    |
| **Propósito**            | Validar campo ID obligatorio                                                         |
| **Precondiciones**       | Usuario en pantalla correspondiente                                                  |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso <br> 2. Click en guardar          |
| **Datos de prueba**      | Se ingresa mesa sin campo identificador                                              |
| **Resultado esperado**   | Se notifica correctamente sobre campo vacio                                          |
| **Resultado obtenido**   | No Permite agregar mesa sin ID o nombre                                              |
| **Estado**               |  Pasa                                                                                |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 28/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | ![Ev12](img/informe2/Informe%20testing/mesa%20vacia.png)                             |
-------------------------------------------------------------------------------------------------------------------


---
### Caso de prueba: Crear mesa duplicada

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | ME-002                                                                               |
| **Nombre**               | Crear mesa duplicada                                                                 |
| **Propósito**            | Evitar creación de mesas con ID repetido                                             |
| **Precondiciones**       | Usuario en pantalla correspondiente                                                  |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso <br> 2. Click en guardar          |
| **Datos de prueba**      | Se ingresa mesa con campos ya ingresado en tra mesa anteriormente                    |
| **Resultado esperado**   | Notifiación de sistema sobre mesa con datos ya ingresados                            |
| **Resultado obtenido**   | Se permite agregar mesa correctamente y no se controla duplicidad                    |
| **Estado**               | Falla                                                                                |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 28/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | ![Ev13](img/informe2/Informe%20testing/creación%20de%20mesa.png)                     |
-------------------------------------------------------------------------------------------------------------------

### Caso de prueba: Creación de mesa con invitados mayor al establecido en sistema y máximo 

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | ME-003                                                                               |
| **Nombre**               | Crear mesa con más invitados que en el evento                                        |
| **Propósito**            | Verificar límites de capacidad                                                       |
| **Precondiciones**       | Usuario en pantalla correspondiente                                                  |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso <br> 2. Click en guardar          |
| **Datos de prueba**      | Se setea un valor 300 invitados en la creación del evento, se crea mesa con valores 
                            mayores a los establecidos en el evento                                               |
| **Resultado esperado**   | Notificación sobre mesa excede al total de invitados                                 |
| **Resultado obtenido**   | Se genera correctamente la mesa, sin notificaciones                                  |
| **Estado**               |  Falla                                                                               |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 28/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | ![](mesa con mas invitados.png)                                                      |
-------------------------------------------------------------------------------------------------------------------

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | IV-001                                                                               |
| **Nombre**               | Crear invitación sin link de confirmación                                            |
| **Propósito**            | Validar campo obligatorio 'link'                                                     |
| **Precondiciones**       | Usuario en pantalla correspondiente                                                  |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso <br> 2. Click en guardar          |
| **Datos de prueba**      | Se generan datos de la invitación, y se envía sin link de la misma                   |
| **Resultado esperado**   | Deberia notificar que no hay link de invitación                                      |
| **Resultado obtenido**   | Notifica sobre correcto envío de invitación, a su vez permite el envio nuevamente de las invitaciones |
| **Estado**               | Falla                                                                                |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 28/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | ![Ev7](img/informe2/Informe%20testing/duplicación%20de%20invitación.png)             |
-------------------------------------------------------------------------------------------------------------------


### Caso de prueba: Enviar invitación sin invitados

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | IV-002                                                                               |
| **Nombre**               | Enviar invitación sin invitados                                                      |
| **Propósito**            | Verificar restricción por lista vacía                                                |
| **Precondiciones**       | Usuario en pantalla correspondiente                                                  |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso <br> 2. Click en guardar          |
| **Datos de prueba**      | Se crea invitación con datos validos sin invitados agregados al evento               |
| **Resultado esperado**   | Notifiación de deben tener invitados registrados                                     |
| **Resultado obtenido**   | Sistema permite enviar invitación sin invitados agregados                            |
| **Estado**               | Falla                                                                                |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 28/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | ![](armado de invitación.png)                                                        |
-------------------------------------------------------------------------------------------------------------------

### Caso de prueba: Crear y enviar invitación con diseño

| Campo                    | Detalle                                                                              |
|--------------------------|--------------------------------------------------------------------------------------|
| **Identificador**        | IV-003                                                                               |
| **Nombre**               | Crear y enviar invitación con diseño                                                 |
| **Propósito**            | Verificar flujo completo de invitación                                               |
| **Precondiciones**       | Usuario en pantalla correspondiente                                                  |
| **Pasos a ejecutar**     | 1. Completar el formulario con datos según el caso <br> 2. Click en guardar          |
| **Datos de prueba**      | Creación de invitacion con datos validos                                             |
| **Resultado esperado**   | Correcta creación y envio de invitación                                              |
| **Resultado obtenido**   | Se notifica sobre envío de invitación, no se tiene en scope control de invitados ni trazabilidad de la misma  |
| **Estado**               | Pasa                                                                                 |
| **Tester**               | Cristian Camejo                                                                      |
| **Fecha de ejecución**   | 28/06/2025                                                                           |
| **Identificador defecto**| -                                                                                    |
| **Captura**              | ![](tuevento_inicio.png)                                                             |
-------------------------------------------------------------------------------------------------------------------



## 4. Evaluación de Calidad y Usabilidad

- **Navegación clara:** correcta separación por secciones en la interfaz con estetica clara para el usuario.
- **Validaciones robustas:** campos como nombre, cantidad de invitados, fechas y emails están bien controlados.
- **Responsive:** visualizado correctamente en simuladores de distintos tamaños.
- **Feedback adecuado:** mensajes informativos y de error acompañan cada acción.
- **Sugerencias:**
  - Agregar selección explícita del evento activo cuando hay más de uno.
  - Evitar duplicación de invitados mediante validación compuesta (email/nombre).
  - Vincular invitados con las invitaciones generadas.
  - Permitir trazabilidad de la aceptación de las invitaciones.
  - Agregar asignación efectiva de invitados a mesas (no implementado).
  - Permitir cargar invitados masivamente en formato .csv

---

## 5. Conclusiones

- El sistema permite crear eventos, cargar invitados, mesas e invitaciones de forma funcional.
- Se observó un correcto uso de validaciones y feedback al usuario incluso en valores limites desginados para las diferentes variables.
- El comportamiento fue estable, sin bugs de ejecución, pero con margen de mejora funcional y de trazabilidad de información.

---

## 6. Anexos

- Capturas de pantalla con validaciones
- Casos documentados vinculados a CDU