// backend/src/Infraestructura/database/mongo/esquemas/AuditoriaMetadata.js
import { Schema } from 'mongoose';

// Quién creó o modificó el documento y cuándo (embebido, sin colección propia)
export const AuditoriaMetadataSchema = new Schema(
  {
    creado_por: { type: Schema.Types.UUID, default: null },     // usuario en PostgreSQL
    creado_en: { type: Date, default: Date.now },
    modificado_por: { type: Schema.Types.UUID, default: null },
    modificado_en: { type: Date, default: Date.now },
  },
  { _id: false }
);
