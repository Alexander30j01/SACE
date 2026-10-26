// backend/src/Infraestructura/database/mongo/conexion.js
import mongoose from 'mongoose';
import { modelosMongo } from './modelos/index.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sace_db';

export { modelosMongo };

// Conecta a MongoDB y crea la base, las colecciones y los índices del diagrama ODM.
// MongoDB crea la base "sace_db" sola en cuanto se crea su primera colección.
export async function inicializarMongo() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log(`[MongoDB] Conexión establecida con la base "${mongoose.connection.name}".`);

  // init() crea la colección (si no existe) y sus índices
  for (const modelo of Object.values(modelosMongo)) {
    await modelo.init();
  }

  const colecciones = (await mongoose.connection.db.listCollections().toArray()).map((c) => c.name);
  console.log(`[Mongoose] Colecciones del ODM listas: ${colecciones.join(', ')}`);

  mongoose.connection.on('disconnected', () => console.warn('[MongoDB] Desconectado.'));
  mongoose.connection.on('error', (error) => console.error('[MongoDB] Error:', error.message));
}

export async function cerrarMongo() {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
}
