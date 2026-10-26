// backend/src/Infraestructura/database/mongo/esquemas/CampoDinamico.js
import { Schema } from 'mongoose';

// Un campo del formulario de un servicio. Ejemplo: "Fluencia", número, en J/cm².
export const CampoDinamicoSchema = new Schema(
  {
    clave: { type: String, required: true },        // nombre interno, p. ej. "fluencia"
    etiqueta: { type: String, required: true },     // texto que ve el especialista
    tipo_dato: { type: String, required: true, enum: ['texto', 'numero', 'lista', 'fecha', 'si_no'] },
    obligatorio: { type: Boolean, default: false },
    opciones: { type: [String], default: [] },      // solo para tipo "lista"
    unidad: { type: String, default: '' },
  },
  { _id: false }
);
