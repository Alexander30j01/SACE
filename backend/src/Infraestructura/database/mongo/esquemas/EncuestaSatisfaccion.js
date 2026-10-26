// backend/src/Infraestructura/database/mongo/esquemas/EncuestaSatisfaccion.js
import { Schema } from 'mongoose';

// Encuesta al cerrar el plan (RF-033). Va embebida en el plan.
export const EncuestaSatisfaccionSchema = new Schema(
  {
    calificacion: { type: Number, required: true, min: 1, max: 5 },
    comentario: { type: String, default: '' },
    fecha_respuesta: { type: Date, default: Date.now },
    cita_mantenimiento_sugerida_id: { type: Schema.Types.UUID, default: null },
  },
  { _id: false }
);
