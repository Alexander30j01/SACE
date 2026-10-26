// backend/src/Infraestructura/database/mongo/esquemas/SesionTratamiento.js
import { Schema } from 'mongoose';
import { InsumoConsumidoSchema } from './InsumoConsumido.js';

// Cada sesión atendida dentro de un plan (RF-030). Va embebida en el plan.
export const SesionTratamientoSchema = new Schema({
  numero_sesion: { type: Number, required: true, min: 1 },
  cita_id: { type: Schema.Types.UUID, required: true },          // cita en PostgreSQL
  especialista_id: { type: Schema.Types.UUID, required: true },  // trabajador en PostgreSQL
  fecha_atencion: { type: Date, required: true },
  // Datos que cambian según el servicio (definidos en su plantilla). Se guardan cifrados (RNF-008).
  parametros_clinicos_cifrados: { type: Schema.Types.Mixed, default: null },
  insumos_aplicados: { type: [InsumoConsumidoSchema], default: [] },
  observaciones_cifradas: { type: Schema.Types.Mixed, default: null },
  reacciones_adversas: { type: String, default: '' },
});
