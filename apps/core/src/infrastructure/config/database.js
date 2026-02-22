import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const isTestEnvironment = process.env.NODE_ENV === 'test';
const databaseName = isTestEnvironment ? 'clinical_cases_test_db' :  process.env.DB_NAME || 'clinical_cases_db';

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: databaseName,
    password: process.env.DB_PASSWORD || 'clinical_db_password123',
    port: process.env.DB_PORT || 5432,
});

export const db = {
    query: (text, params) => pool.query(text, params),
    pool,
};
