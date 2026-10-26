// backend/src/Infraestructura/database/mongo/esquemas/InsumoConsumido.js
import { Schema } from 'mongoose';

// "Foto" del insumo usado en una sesión (RF-026). Se copia el nombre y la unidad
// para que el historial no cambie si luego se edita el insumo en PostgreSQL.
export const InsumoConsumidoSchema = new Schema(
  {
    insumo_id: { type: Schema.Types.UUID, required: true },      // insumo en PostgreSQL
    nombre_insumo: { type: String, required: true },
    cantidad_real_usada: { type: Number, required: true, min: 0 },
    unidad_medida: { type: String, required: true },
  },
  { _id: false }
);
