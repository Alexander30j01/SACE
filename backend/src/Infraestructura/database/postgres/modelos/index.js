// backend/src/Infraestructura/database/postgres/modelos/index.js
import { DataTypes } from 'sequelize';

export function definirModelosYAsociaciones(sequelize) {
  // ==========================================================================
  // 1. MÓDULO USUARIOS, SEDES Y SEGURIDAD (6 Modelos)
  // ==========================================================================
  const Sede = sequelize.define('Sede', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    direccion: { type: DataTypes.STRING(255), allowNull: false },
    telefono: { type: DataTypes.STRING(20) },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'sede' });

  const Rol = sequelize.define('Rol', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    descripcion: { type: DataTypes.STRING(200) }
  }, { tableName: 'rol' });

  const Permiso = sequelize.define('Permiso', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    codigo: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    modulo: { type: DataTypes.STRING(50), allowNull: false },
    descripcion: { type: DataTypes.STRING(200) }
  }, { tableName: 'permiso' });

  // Tabla intermedia 1: rol_permiso (RF-044)
  const RolPermiso = sequelize.define('RolPermiso', {
    rolId: { type: DataTypes.UUID, primaryKey: true },
    permisoId: { type: DataTypes.UUID, primaryKey: true }
  }, { tableName: 'rol_permiso', timestamps: false });

  const Usuario = sequelize.define('Usuario', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    sedeId: { type: DataTypes.UUID, allowNull: false },
    rolId: { type: DataTypes.UUID, allowNull: false },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    totpSecret: { type: DataTypes.STRING(100) },
    intentosFallidos: { type: DataTypes.INTEGER, defaultValue: 0 },
    bloqueadoHasta: { type: DataTypes.DATE },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'usuario' });

  const Auditoria = sequelize.define('Auditoria', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    usuarioId: { type: DataTypes.UUID },
    entidad: { type: DataTypes.STRING(60), allowNull: false },
    registroId: { type: DataTypes.UUID, allowNull: false },
    accion: { type: DataTypes.STRING(20), allowNull: false },
    detalle: { type: DataTypes.JSONB, allowNull: false } // Excepción 3FN documentada
  }, { tableName: 'auditoria', updatedAt: false });

  // ==========================================================================
  // 2. MÓDULO CLIENTES (4 Modelos)
  // ==========================================================================
  const Cliente = sequelize.define('Cliente', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    sedeId: { type: DataTypes.UUID, allowNull: false },
    cedula: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    nombres: { type: DataTypes.STRING(100), allowNull: false },
    apellidos: { type: DataTypes.STRING(100), allowNull: false },
    fechaNacimiento: { type: DataTypes.DATEONLY, allowNull: false },
    celular: { type: DataTypes.STRING(20), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255) },
    direccion: { type: DataTypes.TEXT },
    canalCaptacion: { type: DataTypes.STRING(50) },
    etiquetas: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] }, // Excepción 3FN
    aceptaConsentimientoDatos: { type: DataTypes.BOOLEAN, defaultValue: false },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'cliente' });

  const FichaEstetica = sequelize.define('FichaEstetica', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    clienteId: { type: DataTypes.UUID, allowNull: false, unique: true }, // Relación 1:1
    alergias: { type: DataTypes.TEXT },
    condicionesMedicas: { type: DataTypes.TEXT },
    medicacion: { type: DataTypes.TEXT },
    fototipo: { type: DataTypes.STRING(10) },
    tipoPiel: { type: DataTypes.STRING(50) },
    contraindicaciones: { type: DataTypes.TEXT }
  }, { tableName: 'ficha_estetica' });

  const Consentimiento = sequelize.define('Consentimiento', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    clienteId: { type: DataTypes.UUID, allowNull: false },
    servicioId: { type: DataTypes.UUID, allowNull: false },
    archivoUrl: { type: DataTypes.STRING(500), allowNull: false },
    fechaFirma: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    vigente: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'consentimiento' });

  const SolicitudLopdp = sequelize.define('SolicitudLopdp', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    clienteId: { type: DataTypes.UUID, allowNull: false },
    tipo: { type: DataTypes.ENUM('Acceso', 'Rectificacion', 'Eliminacion', 'Oposicion'), allowNull: false },
    estado: { type: DataTypes.ENUM('Pendiente', 'Atendida', 'Rechazada'), defaultValue: 'Pendiente' },
    observaciones: { type: DataTypes.TEXT }
  }, { tableName: 'solicitud_lopdp' });

  // ==========================================================================
  // 3. MÓDULO TRABAJADORES (5 Modelos)
  // ==========================================================================
  const Trabajador = sequelize.define('Trabajador', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    usuarioId: { type: DataTypes.UUID, unique: true },
    sedeId: { type: DataTypes.UUID, allowNull: false },
    nombres: { type: DataTypes.STRING(100), allowNull: false },
    apellidos: { type: DataTypes.STRING(100), allowNull: false },
    cargo: { type: DataTypes.STRING(80), allowNull: false },
    especialidades: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'trabajador' });

  const HorarioTrabajador = sequelize.define('HorarioTrabajador', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    trabajadorId: { type: DataTypes.UUID, allowNull: false },
    diaSemana: { type: DataTypes.INTEGER, allowNull: false },
    horaInicio: { type: DataTypes.TIME, allowNull: false },
    horaFin: { type: DataTypes.TIME, allowNull: false },
    descansoInicio: { type: DataTypes.TIME },
    descansoFin: { type: DataTypes.TIME }
  }, { tableName: 'horario_trabajador', timestamps: false });

  const Ausencia = sequelize.define('Ausencia', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    trabajadorId: { type: DataTypes.UUID, allowNull: false },
    tipo: { type: DataTypes.ENUM('Vacaciones', 'Permiso', 'Licencia'), allowNull: false },
    fechaInicio: { type: DataTypes.DATE, allowNull: false },
    fechaFin: { type: DataTypes.DATE, allowNull: false },
    motivo: { type: DataTypes.TEXT }
  }, { tableName: 'ausencia' });

  const Certificacion = sequelize.define('Certificacion', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    trabajadorId: { type: DataTypes.UUID, allowNull: false },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    entidadEmisora: { type: DataTypes.STRING(150) },
    fechaVigencia: { type: DataTypes.DATEONLY, allowNull: false }
  }, { tableName: 'certificacion' });

  // Tabla intermedia 2: trabajador_servicio (RF-017)
  const TrabajadorServicio = sequelize.define('TrabajadorServicio', {
    trabajadorId: { type: DataTypes.UUID, primaryKey: true },
    servicioId: { type: DataTypes.UUID, primaryKey: true },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'trabajador_servicio', timestamps: false });

  // ==========================================================================
  // 4. MÓDULO SERVICIOS (3 Modelos)
  // ==========================================================================
  const CategoriaServicio = sequelize.define('CategoriaServicio', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nombre: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    descripcion: { type: DataTypes.STRING(200) }
  }, { tableName: 'categoria_servicio', timestamps: false });

  const Servicio = sequelize.define('Servicio', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    categoriaId: { type: DataTypes.UUID, allowNull: false },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    duracionMinutos: { type: DataTypes.INTEGER, allowNull: false },
    precioReferencial: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    sesionesRecomendadas: { type: DataTypes.INTEGER, defaultValue: 1 },
    intervaloDias: { type: DataTypes.INTEGER, defaultValue: 0 },
    requiereConsentimiento: { type: DataTypes.BOOLEAN, defaultValue: false },
    indicacionesPost: { type: DataTypes.TEXT },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'servicio' });

  // Tabla intermedia 3: receta_insumo (RF-025)
  const RecetaInsumo = sequelize.define('RecetaInsumo', {
    servicioId: { type: DataTypes.UUID, primaryKey: true },
    insumoId: { type: DataTypes.UUID, primaryKey: true },
    cantidadEstandar: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
  }, { tableName: 'receta_insumo', timestamps: false });

  // ==========================================================================
  // 5. MÓDULO CITAS Y AGENDA (4 Modelos)
  // ==========================================================================
  const Cabina = sequelize.define('Cabina', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    sedeId: { type: DataTypes.UUID, allowNull: false },
    nombre: { type: DataTypes.STRING(50), allowNull: false },
    descripcion: { type: DataTypes.STRING(200) },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'cabina' });

  const Cita = sequelize.define('Cita', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    sedeId: { type: DataTypes.UUID, allowNull: false },
    clienteId: { type: DataTypes.UUID, allowNull: false },
    servicioId: { type: DataTypes.UUID, allowNull: false },
    trabajadorId: { type: DataTypes.UUID, allowNull: false },
    cabinaId: { type: DataTypes.UUID, allowNull: false },
    planId: { type: DataTypes.UUID }, // Puente lógico hacia MongoDB (Guía pág. 18)
    fechaHoraInicio: { type: DataTypes.DATE, allowNull: false },
    fechaHoraFin: { type: DataTypes.DATE, allowNull: false },
    estado: {
      type: DataTypes.ENUM('Agendada', 'Confirmada', 'En_atencion', 'Atendida', 'Cancelada', 'No_asistio'),
      defaultValue: 'Agendada'
    },
    canal: { type: DataTypes.ENUM('Recepcion', 'Chatbot'), defaultValue: 'Recepcion' },
    motivoCancelacion: { type: DataTypes.TEXT },
    recordatorioEnviado: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { tableName: 'cita' });

  const CitaHistorial = sequelize.define('CitaHistorial', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    citaId: { type: DataTypes.UUID, allowNull: false },
    usuarioId: { type: DataTypes.UUID },
    estadoAnterior: { type: DataTypes.STRING(30) },
    estadoNuevo: { type: DataTypes.STRING(30), allowNull: false },
    motivo: { type: DataTypes.TEXT },
    fechaCambio: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'cita_historial', timestamps: false });

  const ListaEspera = sequelize.define('ListaEspera', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    clienteId: { type: DataTypes.UUID, allowNull: false },
    servicioId: { type: DataTypes.UUID, allowNull: false },
    fechaDeseada: { type: DataTypes.DATEONLY, allowNull: false },
    estado: { type: DataTypes.ENUM('Pendiente', 'Notificado', 'Atendido'), defaultValue: 'Pendiente' }
  }, { tableName: 'lista_espera' });

  // ==========================================================================
  // 6. MÓDULO INSUMOS E INVENTARIO (5 Modelos)
  // ==========================================================================
  const Proveedor = sequelize.define('Proveedor', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ruc: { type: DataTypes.STRING(13), allowNull: false, unique: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    contacto: { type: DataTypes.STRING(100) },
    telefono: { type: DataTypes.STRING(20) },
    email: { type: DataTypes.STRING(150) },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'proveedor' });

  const CategoriaInsumo = sequelize.define('CategoriaInsumo', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nombre: { type: DataTypes.STRING(80), allowNull: false, unique: true }
  }, { tableName: 'categoria_insumo', timestamps: false });

  const Insumo = sequelize.define('Insumo', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    sedeId: { type: DataTypes.UUID, allowNull: false },
    categoriaId: { type: DataTypes.UUID, allowNull: false },
    proveedorId: { type: DataTypes.UUID },
    codigo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    unidadMedida: { type: DataTypes.STRING(20), allowNull: false },
    costoUnitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stockActual: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    stockMinimo: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    controlaLote: { type: DataTypes.BOOLEAN, defaultValue: true },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'insumo' });

  const Lote = sequelize.define('Lote', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    insumoId: { type: DataTypes.UUID, allowNull: false },
    numeroLote: { type: DataTypes.STRING(50), allowNull: false },
    fechaCaducidad: { type: DataTypes.DATEONLY, allowNull: false },
    cantidadDisponible: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
  }, { tableName: 'lote' });

  const MovimientoInventario = sequelize.define('MovimientoInventario', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    insumoId: { type: DataTypes.UUID, allowNull: false },
    loteId: { type: DataTypes.UUID },
    citaId: { type: DataTypes.UUID },
    usuarioId: { type: DataTypes.UUID },
    tipo: { type: DataTypes.ENUM('Entrada', 'Salida', 'Ajuste', 'Perdida'), allowNull: false },
    cantidad: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    motivo: { type: DataTypes.STRING(255) }
  }, { tableName: 'movimiento_inventario', updatedAt: false });

  // ==========================================================================
  // 7. MÓDULO CHATBOT INTEGRADO (2 Modelos)
  // ==========================================================================
  const Conversacion = sequelize.define('Conversacion', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    clienteId: { type: DataTypes.UUID, allowNull: false },
    atendidaPorId: { type: DataTypes.UUID },
    estado: { type: DataTypes.ENUM('Bot', 'Derivada', 'En_humano', 'Cerrada'), defaultValue: 'Bot' },
    intentosFallidos: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, { tableName: 'conversacion' });

  const Mensaje = sequelize.define('Mensaje', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    conversacionId: { type: DataTypes.UUID, allowNull: false },
    emisor: { type: DataTypes.ENUM('Cliente', 'Bot', 'Recepcionista'), allowNull: false },
    contenido: { type: DataTypes.TEXT, allowNull: false },
    intencion: { type: DataTypes.STRING(80) }
  }, { tableName: 'mensaje', updatedAt: false });

  // ==========================================================================
  // ASOCIACIONES BIDIRECCIONALES SEQUELIZE (Guía de estudio pág. 21-22)
  // ==========================================================================
  // 1:1 Cliente <-> FichaEstetica y Usuario <-> Trabajador
  Cliente.hasOne(FichaEstetica, { foreignKey: 'clienteId' });
  FichaEstetica.belongsTo(Cliente, { foreignKey: 'clienteId' });

  Usuario.hasOne(Trabajador, { foreignKey: 'usuarioId' });
  Trabajador.belongsTo(Usuario, { foreignKey: 'usuarioId' });

  // N:M con Tablas Intermedias (belongsToMany)
  Rol.belongsToMany(Permiso, { through: RolPermiso, foreignKey: 'rolId', otherKey: 'permisoId' });
  Permiso.belongsToMany(Rol, { through: RolPermiso, foreignKey: 'permisoId', otherKey: 'rolId' });

  Trabajador.belongsToMany(Servicio, { through: TrabajadorServicio, foreignKey: 'trabajadorId', otherKey: 'servicioId' });
  Servicio.belongsToMany(Trabajador, { through: TrabajadorServicio, foreignKey: 'servicioId', otherKey: 'trabajadorId' });

  Servicio.belongsToMany(Insumo, { through: RecetaInsumo, foreignKey: 'servicioId', otherKey: 'insumoId' });
  Insumo.belongsToMany(Servicio, { through: RecetaInsumo, foreignKey: 'insumoId', otherKey: 'servicioId' });

  // 1:N Relaciones Principales
  Sede.hasMany(Usuario, { foreignKey: 'sedeId' });
  Usuario.belongsTo(Sede, { foreignKey: 'sedeId' });

  Sede.hasMany(Cliente, { foreignKey: 'sedeId' });
  Cliente.belongsTo(Sede, { foreignKey: 'sedeId' });

  Sede.hasMany(Trabajador, { foreignKey: 'sedeId' });
  Trabajador.belongsTo(Sede, { foreignKey: 'sedeId' });

  Sede.hasMany(Cabina, { foreignKey: 'sedeId' });
  Cabina.belongsTo(Sede, { foreignKey: 'sedeId' });

  Sede.hasMany(Insumo, { foreignKey: 'sedeId' });
  Insumo.belongsTo(Sede, { foreignKey: 'sedeId' });

  Sede.hasMany(Cita, { foreignKey: 'sedeId' });
  Cita.belongsTo(Sede, { foreignKey: 'sedeId' });

  Rol.hasMany(Usuario, { foreignKey: 'rolId' });
  Usuario.belongsTo(Rol, { foreignKey: 'rolId' });

  Usuario.hasMany(Auditoria, { foreignKey: 'usuarioId' });
  Auditoria.belongsTo(Usuario, { foreignKey: 'usuarioId' });

  Cliente.hasMany(Cita, { foreignKey: 'clienteId' });
  Cita.belongsTo(Cliente, { foreignKey: 'clienteId' });

  Cliente.hasMany(Consentimiento, { foreignKey: 'clienteId' });
  Consentimiento.belongsTo(Cliente, { foreignKey: 'clienteId' });

  Cliente.hasMany(SolicitudLopdp, { foreignKey: 'clienteId' });
  SolicitudLopdp.belongsTo(Cliente, { foreignKey: 'clienteId' });

  Cliente.hasMany(ListaEspera, { foreignKey: 'clienteId' });
  ListaEspera.belongsTo(Cliente, { foreignKey: 'clienteId' });

  Trabajador.hasMany(HorarioTrabajador, { foreignKey: 'trabajadorId' });
  HorarioTrabajador.belongsTo(Trabajador, { foreignKey: 'trabajadorId' });

  Trabajador.hasMany(Ausencia, { foreignKey: 'trabajadorId' });
  Ausencia.belongsTo(Trabajador, { foreignKey: 'trabajadorId' });

  Trabajador.hasMany(Certificacion, { foreignKey: 'trabajadorId' });
  Certificacion.belongsTo(Trabajador, { foreignKey: 'trabajadorId' });

  Trabajador.hasMany(Cita, { foreignKey: 'trabajadorId' });
  Cita.belongsTo(Trabajador, { foreignKey: 'trabajadorId' });

  CategoriaServicio.hasMany(Servicio, { foreignKey: 'categoriaId' });
  Servicio.belongsTo(CategoriaServicio, { foreignKey: 'categoriaId' });

  Servicio.hasMany(Cita, { foreignKey: 'servicioId' });
  Cita.belongsTo(Servicio, { foreignKey: 'servicioId' });

  Servicio.hasMany(Consentimiento, { foreignKey: 'servicioId' });
  Consentimiento.belongsTo(Servicio, { foreignKey: 'servicioId' });

  Servicio.hasMany(ListaEspera, { foreignKey: 'servicioId' });
  ListaEspera.belongsTo(Servicio, { foreignKey: 'servicioId' });

  Cabina.hasMany(Cita, { foreignKey: 'cabinaId' });
  Cita.belongsTo(Cabina, { foreignKey: 'cabinaId' });

  Cita.hasMany(CitaHistorial, { foreignKey: 'citaId' });
  CitaHistorial.belongsTo(Cita, { foreignKey: 'citaId' });

  CategoriaInsumo.hasMany(Insumo, { foreignKey: 'categoriaId' });
  Insumo.belongsTo(CategoriaInsumo, { foreignKey: 'categoriaId' });

  Proveedor.hasMany(Insumo, { foreignKey: 'proveedorId' });
  Insumo.belongsTo(Proveedor, { foreignKey: 'proveedorId' });

  Insumo.hasMany(Lote, { foreignKey: 'insumoId' });
  Lote.belongsTo(Insumo, { foreignKey: 'insumoId' });

  Insumo.hasMany(MovimientoInventario, { foreignKey: 'insumoId' });
  MovimientoInventario.belongsTo(Insumo, { foreignKey: 'insumoId' });

  Lote.hasMany(MovimientoInventario, { foreignKey: 'loteId' });
  MovimientoInventario.belongsTo(Lote, { foreignKey: 'loteId' });

  Cita.hasMany(MovimientoInventario, { foreignKey: 'citaId' });
  MovimientoInventario.belongsTo(Cita, { foreignKey: 'citaId' });

  Cliente.hasMany(Conversacion, { foreignKey: 'clienteId' });
  Conversacion.belongsTo(Cliente, { foreignKey: 'clienteId' });

  // Asociación con alias explícito según Guía de estudio pág. 22
  Conversacion.belongsTo(Usuario, { as: 'atendidaPor', foreignKey: 'atendidaPorId' });
  Usuario.hasMany(Conversacion, { as: 'conversacionesAtendidas', foreignKey: 'atendidaPorId' });

  Conversacion.hasMany(Mensaje, { foreignKey: 'conversacionId' });
  Mensaje.belongsTo(Conversacion, { foreignKey: 'conversacionId' });

  return {
    Sede, Rol, Permiso, RolPermiso, Usuario, Auditoria,
    Cliente, FichaEstetica, Consentimiento, SolicitudLopdp,
    Trabajador, HorarioTrabajador, Ausencia, Certificacion, TrabajadorServicio,
    CategoriaServicio, Servicio, RecetaInsumo,
    Cabina, Cita, CitaHistorial, ListaEspera,
    Proveedor, CategoriaInsumo, Insumo, Lote, MovimientoInventario,
    Conversacion, Mensaje
  };
}