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
    pgm.createTable('pacientes', {
        id: { type: 'serial', primaryKey: true },
        nombre: { type: 'varchar(100)', notNull: true },
        email: { type: 'varchar(100)', notNull: true, unique: true },
        numero_telefono: { type: 'varchar(20)' },
        domicilio: { type: 'varchar(200)' },
        fecha_nacimiento: { type: 'date' },
        fecha_alta: { type: 'timestamp', default: pgm.func('current_timestamp') },
        obra_social: { type: 'varchar(100)' }
    });        
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('pacientes');
};
