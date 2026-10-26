// backend/src/Infraestructura/database/postgres/conexion.js
import { Sequelize } from 'sequelize';
import pg from 'pg';
import { definirModelosYAsociaciones } from './modelos/index.js';

const DB_NAME = process.env.PG_DATABASE || 'sace_db';
const DB_USER = process.env.PG_USER || 'postgres';
const DB_PASSWORD = process.env.PG_PASSWORD || 'root';
const DB_HOST = process.env.PG_HOST || 'localhost';
const DB_PORT = process.env.PG_PORT || 5432;

// 1. Crea la base de datos en PostgreSQL si no existe
async function asegurarBaseDeDatos() {
  const client = new pg.Client({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: 'postgres', // Base administrativa por defecto
  });

  try {
    await client.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );
    if (res.rowCount === 0) {
      console.log(`[PostgreSQL] Base de datos "${DB_NAME}" no encontrada. Creándola...`);
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`[PostgreSQL] Base de datos "${DB_NAME}" creada con éxito.`);
    }
  } finally {
    await client.end();
  }
}

// 2. Instancia de Sequelize con configuración snake_case (Guía de estudio pág. 21)
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true,      // Convierte fechaNacimiento -> fecha_nacimiento
    timestamps: true,       // created_at y updated_at automáticos
    freezeTableName: true,  // Respeta el nombre exacto de cada tabla en singular
  },
});

export const modelos = definirModelosYAsociaciones(sequelize);

// 3. Función de arranque para llamar desde index.js / app.js
export async function inicializarPostgres() {
  await asegurarBaseDeDatos();
  await sequelize.authenticate();
  console.log('[Sequelize] Conexión a PostgreSQL establecida.');

  // Crea/actualiza las 28 tablas automáticamente al arrancar
  await sequelize.sync({ alter: true });
  console.log('[Sequelize] Las 28 tablas del ORM han sido sincronizadas.');
}