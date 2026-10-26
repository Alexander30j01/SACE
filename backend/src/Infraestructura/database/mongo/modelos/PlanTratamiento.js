// backend/src/Infraestructura/database/mongo/modelos/PlanTratamiento.js
import { Schema, model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { SesionTratamientoSchema } from '../esquemas/SesionTratamiento.js';
import { EncuestaSatisfaccionSchema } from '../esquemas/EncuestaSatisfaccion.js';
import { AuditoriaMetadataSchema } from '../esquemas/AuditoriaMetadata.js';

export const ESTADOS_PLAN = ['Activo', 'Pausado', 'Completado', 'Abandonado'];

// Colección "planes_tratamiento": un documento por plan, con sus sesiones adentro (RF-029 a RF-033).
// El _id es UUID (no ObjectId) para que la columna cita.plan_id de PostgreSQL pueda guardarlo.
const PlanTratamientoSchema = new Schema(
  {
    _id: { type: Schema.Types.UUID, default: () => randomUUID() },
    sede_id: { type: Schema.Types.UUID, required: true },
    cliente_id: { type: Schema.Types.UUID, required: true },
    servicio_id: { type: Schema.Types.UUID, required: true },
    especialista_responsable_id: { type: Schema.Types.UUID, required: true },
    objetivos_tratamiento: { type: String, default: '' },
    fecha_inicio: { type: Date, required: true },
    fecha_fin_estimada: { type: Date, default: null },
    sesiones_planificadas: { type: Number, required: true, min: 1 },
    sesiones_realizadas: { type: Number, default: 0, min: 0 },
    porcentaje_avance: { type: Number, default: 0, min: 0, max: 100 },  // RF-031
    frecuencia_dias: { type: Number, required: true, min: 1 },
    tolerancia_alerta_dias: { type: Number, default: 3, min: 0 },       // RF-032
    fecha_ultima_sesion: { type: Date, default: null },
    alerta_abandono_activa: { type: Boolean, default: false },          // RF-032
    estado: { type: String, enum: ESTADOS_PLAN, default: 'Activo' },
    resultado_final: { type: String, default: '' },                     // RF-033
    sesiones: { type: [SesionTratamientoSchema], default: [] },
    encuesta_cierre: { type: EncuestaSatisfaccionSchema, default: null },
    auditoria: { type: AuditoriaMetadataSchema, default: () => ({}) },
  },
  { collection: 'planes_tratamiento', versionKey: 'version' }
);

// Índices para las búsquedas más frecuentes
PlanTratamientoSchema.index({ cliente_id: 1, estado: 1 });              // planes de un cliente
PlanTratamientoSchema.index({ 'sesiones.cita_id': 1 });                 // sesión de una cita
PlanTratamientoSchema.index({ estado: 1, alerta_abandono_activa: 1 });  // alertas de abandono

export const PlanTratamiento = model('PlanTratamiento', PlanTratamientoSchema);
