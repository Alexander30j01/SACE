// backend/src/Infraestructura/database/mongo/modelos/PlantillaFormulario.js
import { Schema, model } from 'mongoose';
import { CampoDinamicoSchema } from '../esquemas/CampoDinamico.js';
import { AuditoriaMetadataSchema } from '../esquemas/AuditoriaMetadata.js';

// Colección "plantillas_formularios": qué datos se registran en cada sesión según el servicio (RF-030).
const PlantillaFormularioSchema = new Schema(
  {
    servicio_id: { type: Schema.Types.UUID, required: true },   // servicio en PostgreSQL
    nombre_servicio: { type: String, required: true },
    version: { type: Number, required: true, min: 1 },
    activo: { type: Boolean, default: true },
    esquema_campos: { type: [CampoDinamicoSchema], default: [] },
    auditoria: { type: AuditoriaMetadataSchema, default: () => ({}) },
  },
  { collection: 'plantillas_formularios', versionKey: false }
);

// Un servicio no puede tener dos plantillas con la misma versión
PlantillaFormularioSchema.index({ servicio_id: 1, version: 1 }, { unique: true });

export const PlantillaFormulario = model('PlantillaFormulario', PlantillaFormularioSchema);
