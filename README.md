# Sistema de Gestión de Casos Clínicos

Este proyecto es una demo técnica de una aplicación de gestión de casos clínicos, desarrollada como parte de mi portafolio para demostrar mis habilidades en el desarrollo web full-stack. La aplicación permite registrar, consultar, actualizar y eliminar información de pacientes y sus respectivos casos clínicos.

## Tecnologías Utilizadas

* **Backend:**
    * [Node.js](https://nodejs.org/): Entorno de ejecución para JavaScript.
    * [Express.js](https://expressjs.com/): Framework para la creación de la API REST.
    * [PostgreSQL](https://www.postgresql.org/): Base de datos relacional.
    * [pg](): Librería usada para la conexión.

* **Frontend:**
    * [React.js](https://reactjs.org/): Biblioteca para la interfaz de usuario.

## Modelo de Datos

El sistema se basa en un modelo de datos simple con dos entidades principales:

1.  **Pacientes:** Contiene la información personal del paciente (nombre, apellido, DNI, etc.).
2.  **Casos Clínicos:** Registra los detalles de cada caso, asociados a un paciente específico.



## Endpoints de la API

La API REST expone los siguientes endpoints para interactuar con los datos:

* `GET /api/pacientes`
* `POST /api/pacientes`
* `GET /api/pacientes/:id`
* `PUT /api/pacientes/:id`
* `DELETE /api/pacientes/:id`
* `GET /api/pacientes/:pacienteId/casos`
* `POST /api/pacientes/:pacienteId/casos`
* ...y así sucesivamente, listando todos los endpoints.

## Configuración y Ejecución Local

1.  Clona el repositorio: `git clone <URL_del_repositorio>`
2.  Instala las dependencias del backend: `cd backend` y `npm install`
3.  Configura tu base de datos PostgreSQL.
4.  Crea un archivo `.env` con tus credenciales de la base de datos (ej. `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`).
5.  Inicia el servidor: `npm start`
6.  (Repite los pasos para el frontend, si ya lo tienes separado.)

## Autor

* **Daniel Mamani:** [LinkedIn](https://www.linkedin.com/in/daniel-mamani-b03b5a204)
* **GitHub:** [daniel1002-jpg](https://github.com/daniel1002-jpg)
