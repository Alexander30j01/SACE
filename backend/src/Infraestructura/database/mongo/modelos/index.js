// backend/src/Infraestructura/database/mongo/modelos/index.js
// Los 2 modelos (colecciones) del diagrama ODM
import { PlanTratamiento } from './PlanTratamiento.js';
import { PlantillaFormulario } from './PlantillaFormulario.js';

export const modelosMongo = { PlanTratamiento, PlantillaFormulario };
