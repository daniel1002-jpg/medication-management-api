/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createExtension("pgcrypto", { ifNotExists: true });
  pgm.createTable("pacientes", {
    domicilio: { type: "varchar(200)" },
    email: { notNull: true, type: "varchar(100)", unique: true },
    fecha_alta: { default: pgm.func("current_timestamp"), type: "timestamp" },
    fecha_nacimiento: { type: "date" },
    id: {
      default: pgm.func("gen_random_uuid()"),
      primaryKey: true,
      type: "uuid",
    },
    nombre: { notNull: true, type: "varchar(100)" },
    numero_telefono: { type: "varchar(20)" },
    obra_social: { type: "varchar(100)" },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("pacientes");
};
