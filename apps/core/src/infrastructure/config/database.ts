import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const isTestEnvironment = process.env.NODE_ENV === "test";
const databaseName = isTestEnvironment
  ? "clinical_cases_test_db"
  : process.env.DB_NAME || "clinical_cases_db";

const pool = new Pool({
  database: databaseName,
  host: process.env.DB_HOST || "localhost",
  password: process.env.DB_PASSWORD || "clinical_db_password123",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  user: process.env.DB_USER || "postgres",
});

export const db = {
  pool,
  query: (
    text: string,
    params?: (boolean | Date | null | number | string | undefined)[],
  ) => pool.query(text, params),
};
