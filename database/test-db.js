const db = require('./db');

async function testConnection() {
    try {
        const res = await db.query('SELECT NOW()');
        console.log('Conexión exitosa:', res.rows[0]);
    } catch (err) {
        console.error('Error de conexión:', err);
    }
}

testConnection();