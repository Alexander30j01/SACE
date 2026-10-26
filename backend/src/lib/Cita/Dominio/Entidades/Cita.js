// backend/src/lib/Cita/Dominio/Entidades/Cita.js
export class Cita {
  constructor({
    id, sedeId, clienteId, servicioId, trabajadorId, cabinaId,
    planId = null, fechaHoraInicio, fechaHoraFin,
    estado = 'Agendada', canal = 'Recepcion', motivoCancelacion = null
  }) {
    if (new Date(fechaHoraInicio) >= new Date(fechaHoraFin)) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin.');
    }
    this.id = id;
    this.sedeId = sedeId;
    this.clienteId = clienteId;
    this.servicioId = servicioId;
    this.trabajadorId = trabajadorId;
    this.cabinaId = cabinaId;
    this.planId = planId;
    this.fechaHoraInicio = fechaHoraInicio;
    this.fechaHoraFin = fechaHoraFin;
    this.estado = estado;
    this.canal = canal;
    this.motivoCancelacion = motivoCancelacion;
  }

  cancelar(motivo) {
    if (!motivo) throw new Error('Debe registrar el motivo de cancelación (RF-013).');
    this.estado = 'Cancelada';
    this.motivoCancelacion = motivo;
  }
}