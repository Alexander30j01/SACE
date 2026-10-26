// backend/src/Infraestructura/database/semillas/semillaMongo.js
// Guarda en MongoDB los formularios de sesión de 3 servicios de ejemplo.
// Uso (desde la raíz del proyecto): npm run semilla:mongo   — se puede repetir, no duplica.
import 'dotenv/config';
import { inicializarMongo, cerrarMongo, modelosMongo } from '../mongo/conexion.js';

const { PlantillaFormulario } = modelosMongo;

// IMPORTANTE: estos UUID deben coincidir con los servicios que se creen en la tabla "servicio"
// de PostgreSQL. Cuando exista la semilla de PostgreSQL, usen los mismos IDs.
const SERVICIOS = {
  facial: '55555555-0000-4000-8000-000000000001',
  laser: '55555555-0000-4000-8000-000000000002',
  corporal: '55555555-0000-4000-8000-000000000003',
};

const PLANTILLAS = [
  {
    servicio_id: SERVICIOS.laser, nombre_servicio: 'Depilación láser', version: 1,
    esquema_campos: [
      { clave: 'zona', etiqueta: 'Zona tratada', tipo_dato: 'lista', obligatorio: true, opciones: ['Axilas', 'Piernas', 'Bikini', 'Rostro', 'Brazos'] },
      { clave: 'fototipo', etiqueta: 'Fototipo (Fitzpatrick)', tipo_dato: 'lista', obligatorio: true, opciones: ['I', 'II', 'III', 'IV', 'V', 'VI'] },
      { clave: 'fluencia', etiqueta: 'Fluencia', tipo_dato: 'numero', obligatorio: true, unidad: 'J/cm²' },
      { clave: 'spot', etiqueta: 'Tamaño de spot', tipo_dato: 'numero', unidad: 'mm' },
    ],
  },
  {
    servicio_id: SERVICIOS.facial, nombre_servicio: 'Limpieza facial profunda', version: 1,
    esquema_campos: [
      { clave: 'tipo_piel', etiqueta: 'Tipo de piel', tipo_dato: 'lista', obligatorio: true, opciones: ['Normal', 'Seca', 'Grasa', 'Mixta', 'Sensible'] },
      { clave: 'extraccion', etiqueta: 'Se realizó extracción', tipo_dato: 'si_no', obligatorio: true },
      { clave: 'producto_final', etiqueta: 'Producto aplicado al final', tipo_dato: 'texto' },
    ],
  },
  {
    servicio_id: SERVICIOS.corporal, nombre_servicio: 'Reductor corporal', version: 1,
    esquema_campos: [
      { clave: 'zona', etiqueta: 'Zona tratada', tipo_dato: 'lista', obligatorio: true, opciones: ['Abdomen', 'Piernas', 'Brazos', 'Glúteos'] },
      { clave: 'aparato', etiqueta: 'Aparato usado', tipo_dato: 'lista', obligatorio: true, opciones: ['Radiofrecuencia', 'Cavitación', 'Presoterapia'] },
      { clave: 'minutos', etiqueta: 'Minutos de aplicación', tipo_dato: 'numero', obligatorio: true, unidad: 'min' },
    ],
  },
];

try {
  await inicializarMongo();
  for (const plantilla of PLANTILLAS) {
    // upsert: la crea si no existe o la actualiza si ya estaba
    await PlantillaFormulario.updateOne(
      { servicio_id: plantilla.servicio_id, version: plantilla.version },
      { $set: plantilla },
      { upsert: true }
    );
  }
  console.log(`[Semilla] ${PLANTILLAS.length} plantillas guardadas en "plantillas_formularios".`);
} catch (error) {
  console.error('[Semilla] Error:', error.message);
  process.exitCode = 1;
} finally {
  await cerrarMongo();
}
