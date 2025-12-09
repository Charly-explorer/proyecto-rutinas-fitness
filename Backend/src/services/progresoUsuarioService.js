import pool from "../services/db.js";

// Obtener progreso por usuario con detalles de rutina y ejercicio
export const getByUser = async (usuario_id) => {
  const query = `
    SELECT 
      p.*,
      r.nombre as rutina_nombre,
      r.objetivo as rutina_objetivo,
      e.nombre as ejercicio_nombre,
      e.musculo_principal
    FROM progreso_usuarios p
    LEFT JOIN rutinas r ON p.rutina_id = r.id
    LEFT JOIN ejercicios e ON p.ejercicio_id = e.id
    WHERE p.usuario_id = ?
    ORDER BY p.fecha DESC
  `;
  
  const [rows] = await pool.query(query, [usuario_id]);

  if (rows.length === 0) {
    throw new Error("No hay progresos para este usuario");
  }

  return rows;
};

// Obtener progreso por ID con detalles
export const getById = async (id) => {
  const query = `
    SELECT 
      p.*,
      r.nombre as rutina_nombre,
      r.objetivo as rutina_objetivo,
      e.nombre as ejercicio_nombre,
      e.musculo_principal
    FROM progreso_usuarios p
    LEFT JOIN rutinas r ON p.rutina_id = r.id
    LEFT JOIN ejercicios e ON p.ejercicio_id = e.id
    WHERE p.id = ?
  `;
  
  const [rows] = await pool.query(query, [id]);

  if (rows.length === 0) {
    throw new Error("Progreso no encontrado");
  }

  return rows[0];
};

// Actualizar progreso
export const updateProgresoUsuario = async (id, usuario_id, data) => {
  const { 
    fecha, 
    peso_kg, 
    notas, 
    rutina_id, 
    ejercicio_id, 
    series_completadas, 
    repeticiones_completadas, 
    peso_usado_kg 
  } = data;

  const fields = [];
  const values = [];

  if (fecha !== undefined) { fields.push('fecha = ?'); values.push(fecha); }
  if (peso_kg !== undefined) { fields.push('peso_kg = ?'); values.push(peso_kg); }
  if (notas !== undefined) { fields.push('notas = ?'); values.push(notas); }
  if (rutina_id !== undefined) { fields.push('rutina_id = ?'); values.push(rutina_id); }
  if (ejercicio_id !== undefined) { fields.push('ejercicio_id = ?'); values.push(ejercicio_id); }
  if (series_completadas !== undefined) { fields.push('series_completadas = ?'); values.push(series_completadas); }
  if (repeticiones_completadas !== undefined) { fields.push('repeticiones_completadas = ?'); values.push(repeticiones_completadas); }
  if (peso_usado_kg !== undefined) { fields.push('peso_usado_kg = ?'); values.push(peso_usado_kg); }

  if (fields.length === 0) {
    throw new Error("No hay datos para actualizar");
  }

  values.push(id, usuario_id);
  
  const [result] = await pool.query(
    `UPDATE progreso_usuarios SET ${fields.join(', ')} WHERE id = ? AND usuario_id = ?`,
    values
  );

  if (result.affectedRows === 0) {
    throw new Error("Progreso no encontrado o no pertenece a este usuario");
  }

  return "Progreso actualizado correctamente";
};

// Eliminar un registro de progreso
export async function deleteProgresoUsuario(id, usuario_id) {
  const [result] = await pool.query(
    `DELETE FROM progreso_usuarios 
     WHERE id = ? AND usuario_id = ?`,
    [id, usuario_id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Progreso no encontrado o no pertenece a este usuario");
  }

  return "Progreso eliminado correctamente";
}

// Obtener todos los progresos con filtros
export const getAll = async (filters = {}) => {
  let query = `
    SELECT 
      p.*,
      r.nombre as rutina_nombre,
      r.objetivo as rutina_objetivo,
      e.nombre as ejercicio_nombre,
      e.musculo_principal
    FROM progreso_usuarios p
    LEFT JOIN rutinas r ON p.rutina_id = r.id
    LEFT JOIN ejercicios e ON p.ejercicio_id = e.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.usuario_id) {
    query += ` AND p.usuario_id = ?`;
    params.push(filters.usuario_id);
  }

  if (filters.fecha) {
    query += ` AND p.fecha = ?`;
    params.push(filters.fecha);
  }

  if (filters.rutina_id) {
    query += ` AND p.rutina_id = ?`;
    params.push(filters.rutina_id);
  }

  if (filters.ejercicio_id) {
    query += ` AND p.ejercicio_id = ?`;
    params.push(filters.ejercicio_id);
  }

  query += ` ORDER BY p.fecha DESC`;

  const [rows] = await pool.query(query, params);
  return rows;
};

// Crear progreso con nuevos campos
export const create = async (data) => {
  const { 
    usuario_id, 
    fecha, 
    peso_kg, 
    notas, 
    rutina_id, 
    ejercicio_id, 
    series_completadas, 
    repeticiones_completadas, 
    peso_usado_kg 
  } = data;

  if (!usuario_id || !fecha) {
    throw new Error("usuario_id y fecha son obligatorios");
  }

  const [result] = await pool.query(
    `INSERT INTO progreso_usuarios 
    (usuario_id, rutina_id, ejercicio_id, fecha, series_completadas, repeticiones_completadas, peso_usado_kg, peso_kg, notas)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario_id, 
      rutina_id || null, 
      ejercicio_id || null, 
      fecha, 
      series_completadas || null, 
      repeticiones_completadas || null, 
      peso_usado_kg || null, 
      peso_kg || null, 
      notas || null
    ]
  );

  return { id: result.insertId, ...data };
};
