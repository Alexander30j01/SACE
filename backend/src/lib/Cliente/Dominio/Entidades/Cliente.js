// backend/src/lib/Cliente/Dominio/Entidades/Cliente.js
export class Cliente {
  constructor({
    id, sedeId, cedula, nombres, apellidos, fechaNacimiento,
    celular, email, direccion, canalCaptacion, etiquetas = [],
    aceptaConsentimientoDatos = false, activo = true, fichaEstetica = null
  }) {
    if (!aceptaConsentimientoDatos) {
      throw new Error('El cliente debe aceptar el consentimiento de datos personales (LOPDP - RF-001).');
    }
    this.id = id;
    this.sedeId = sedeId;
    this.cedula = cedula;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.fechaNacimiento = fechaNacimiento;
    this.celular = celular;
    this.email = email;
    this.direccion = direccion;
    this.canalCaptacion = canalCaptacion;
    this.etiquetas = etiquetas;
    this.aceptaConsentimientoDatos = aceptaConsentimientoDatos;
    this.activo = activo;
    this.fichaEstetica = fichaEstetica;
  }

  tieneAlertaClinica() {
    return Boolean(
      this.fichaEstetica && 
      (this.fichaEstetica.alergias || this.fichaEstetica.contraindicaciones)
    );
  }

  desactivar() {
    this.activo = false; // Borrado lógico (RF-003)
  }
}