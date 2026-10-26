// backend/src/index.js
import 'dotenv/config';
import express from 'express';
import { inicializarPostgres } from './Infraestructura/database/postgres/conexion.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    // 1. Crea la BD si no existe y sincroniza los 28 modelos ORM
    await inicializarPostgres();

    // 2. Levanta el servidor HTTP
    app.listen(PORT, () => {
      console.log(`[SACE] Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[SACE] Error fatal al iniciar el sistema:', error);
    process.exit(1);
  }
}

iniciarServidor();