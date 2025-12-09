import pool from "./db.js";


// Obtener todas las rutinas asignadas a un usuario
export const getByUsuario = async (usuario_id) => {
  const query = `
    SELECT 
      ur.id,
      ur.usuario_id,
      ur.rutina_id,
      ur.fecha_asignacion,
      ur.activa,
      r.nombre,
      r.objetivo,
      r.nivel,
      r.dias_por_semana,
      r.tipo
    FROM usuario_rutinas ur
    INNER JOIN rutinas r ON ur.rutina_id = r.id
    WHERE ur.usuario_id = ?
    ORDER BY ur.fecha_asignacion DESC
  `;
  
  const [rows] = await pool.query(query, [usuario_id]);
  return rows;
};

// Obtener la rutina activa de un usuario
export const getActivaByUsuario = async (usuario_id) => {
  const query = `
    SELECT 
      ur.id,
      ur.usuario_id,
      ur.rutina_id,
      ur.fecha_asignacion,
      ur.activa,
      r.nombre,
      r.objetivo,
      r.nivel,
      r.dias_por_semana,
      r.tipo
    FROM usuario_rutinas ur
    INNER JOIN rutinas r ON ur.rutina_id = r.id
    WHERE ur.usuario_id = ? AND ur.activa = TRUE
    LIMIT 1
  `;
  
  const [rows] = await pool.query(query, [usuario_id]);
  return rows[0] || null;
};

// Obtener todos los usuarios asignados a una rutina específica
export const getUsuariosByRutina = async (rutina_id) => {
  const query = `
    SELECT 
      ur.id,
      ur.usuario_id,
      ur.fecha_asignacion,
      ur.activa,
      u.nombre,
      u.email,
      u.edad,
      u.nivel_actividad,
      u.objetivo
    FROM usuario_rutinas ur
    INNER JOIN usuarios u ON ur.usuario_id = u.id
    WHERE ur.rutina_id = ?
    ORDER BY ur.fecha_asignacion DESC
  `;
  
  const [rows] = await pool.query(query, [rutina_id]);
  return rows;
};

// Asignar una rutina a un usuario
export const create = async (data) => {
  const { usuario_id, rutina_id, fecha_asignacion, activa } = data;

  if (!usuario_id || !rutina_id) {
    throw new Error("usuario_id y rutina_id son obligatorios");
  }

  // Si se marca como activa, desactivar otras rutinas del usuario
  if (activa === true || activa === 1) {
    await pool.query(
      'UPDATE usuario_rutinas SET activa = FALSE WHERE usuario_id = ?',
      [usuario_id]
    );
  }

  const query = `
    INSERT INTO usuario_rutinas (usuario_id, rutina_id, fecha_asignacion, activa)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    usuario_id,
    rutina_id,
    fecha_asignacion || new Date().toISOString().split('T')[0],
    activa !== undefined ? activa : true
  ]);

  return {
    id: result.insertId,
    usuario_id,
    rutina_id,
    fecha_asignacion: fecha_asignacion || new Date().toISOString().split('T')[0],
    activa: activa !== undefined ? activa : true
  };
};


export const setActiva = async (id, usuario_id) => {

  const [check] = await pool.query(
    'SELECT * FROM usuario_rutinas WHERE id = ? AND usuario_id = ?',
    [id, usuario_id]
  );

  if (check.length === 0) {
    throw new Error("Asignación no encontrada o no pertenece al usuario");
  }


  await pool.query(
    'UPDATE usuario_rutinas SET activa = FALSE WHERE usuario_id = ?',
    [usuario_id]
  );

 
  await pool.query(
    'UPDATE usuario_rutinas SET activa = TRUE WHERE id = ?',
    [id]
  );

  return { message: "Rutina activada exitosamente" };
};


export const update = async (id, data) => {
  const { fecha_asignacion, activa } = data;

  const fields = [];
  const values = [];

  if (fecha_asignacion !== undefined) {
    fields.push('fecha_asignacion = ?');
    values.push(fecha_asignacion);
  }
  if (activa !== undefined) {
    fields.push('activa = ?');
    values.push(activa);
  }

  if (fields.length === 0) {
    throw new Error("No hay datos para actualizar");
  }

  values.push(id);
  const query = `UPDATE usuario_rutinas SET ${fields.join(', ')} WHERE id = ?`;

  const [result] = await pool.query(query, values);

  if (result.affectedRows === 0) {
    throw new Error("Asignación no encontrada");
  }

  return { message: "Actualización exitosa" };
};


export const deleteById = async (id, usuario_id) => {
  const [result] = await pool.query(
    'DELETE FROM usuario_rutinas WHERE id = ? AND usuario_id = ?',
    [id, usuario_id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Asignación no encontrada o no pertenece al usuario");
  }

  return { message: "Rutina desasignada del usuario" };
};

export const deleteByUsuario = async (usuario_id) => {
  const [result] = await pool.query(
    'DELETE FROM usuario_rutinas WHERE usuario_id = ?',
    [usuario_id]
  );

  return {
    deletedCount: result.affectedRows,
    message: `${result.affectedRows} rutinas desasignadas`
  };
};
