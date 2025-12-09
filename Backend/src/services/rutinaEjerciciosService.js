import pool from "./db.js";

/**
 * Servicio para manejar la relación entre rutinas y ejercicios
 * Permite asignar ejercicios a rutinas con información de día y orden
 */

// Obtener todos los ejercicios de una rutina específica
export const getByRutina = async (rutina_id) => {
  const query = `
    SELECT 
      re.id,
      re.rutina_id,
      re.ejercicio_id,
      re.dia_semana,
      re.orden,
      e.nombre,
      e.descripcion,
      e.musculo_principal,
      e.musculos_secundarios,
      e.equipamiento,
      e.nivel,
      e.tipo,
      e.repeticiones_sugeridas,
      e.series_sugeridas,
      e.peso_sugerido,
      e.riesgos
    FROM rutina_ejercicios re
    INNER JOIN ejercicios e ON re.ejercicio_id = e.id
    WHERE re.rutina_id = ?
    ORDER BY re.dia_semana ASC, re.orden ASC
  `;
  
  const [rows] = await pool.query(query, [rutina_id]);
  return rows;
};

// Obtener ejercicios de una rutina agrupados por día
export const getByRutinaGroupedByDay = async (rutina_id) => {
  const ejercicios = await getByRutina(rutina_id);
  
  // Agrupar por día de la semana
  const grouped = {};
  ejercicios.forEach(ej => {
    const dia = ej.dia_semana || 'sin_dia';
    if (!grouped[dia]) {
      grouped[dia] = [];
    }
    grouped[dia].push(ej);
  });
  
  return grouped;
};

// Asignar un ejercicio a una rutina
export const create = async (data) => {
  const { rutina_id, ejercicio_id, dia_semana, orden } = data;

  if (!rutina_id || !ejercicio_id) {
    throw new Error("rutina_id y ejercicio_id son obligatorios");
  }

  const query = `
    INSERT INTO rutina_ejercicios (rutina_id, ejercicio_id, dia_semana, orden)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    rutina_id,
    ejercicio_id,
    dia_semana || null,
    orden || null
  ]);

  return {
    id: result.insertId,
    rutina_id,
    ejercicio_id,
    dia_semana,
    orden
  };
};

// Asignar múltiples ejercicios a una rutina (bulk insert)
export const createMultiple = async (rutina_id, ejercicios) => {
  if (!rutina_id || !ejercicios || ejercicios.length === 0) {
    throw new Error("rutina_id y ejercicios son obligatorios");
  }

  const values = ejercicios.map(ej => [
    rutina_id,
    ej.ejercicio_id,
    ej.dia_semana || null,
    ej.orden || null
  ]);

  const query = `
    INSERT INTO rutina_ejercicios (rutina_id, ejercicio_id, dia_semana, orden)
    VALUES ?
  `;

  const [result] = await pool.query(query, [values]);

  return {
    insertedCount: result.affectedRows,
    message: `${result.affectedRows} ejercicios asignados a la rutina`
  };
};

// Actualizar día u orden de un ejercicio en la rutina
export const update = async (id, data) => {
  const { dia_semana, orden } = data;

  const fields = [];
  const values = [];

  if (dia_semana !== undefined) {
    fields.push('dia_semana = ?');
    values.push(dia_semana);
  }
  if (orden !== undefined) {
    fields.push('orden = ?');
    values.push(orden);
  }

  if (fields.length === 0) {
    throw new Error("No hay datos para actualizar");
  }

  values.push(id);
  const query = `UPDATE rutina_ejercicios SET ${fields.join(', ')} WHERE id = ?`;

  const [result] = await pool.query(query, values);

  if (result.affectedRows === 0) {
    throw new Error("Relación rutina-ejercicio no encontrada");
  }

  return { message: "Actualización exitosa" };
};

// Eliminar un ejercicio de una rutina
export const deleteById = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM rutina_ejercicios WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Relación rutina-ejercicio no encontrada");
  }

  return { message: "Ejercicio eliminado de la rutina" };
};

// Eliminar todos los ejercicios de una rutina
export const deleteByRutina = async (rutina_id) => {
  const [result] = await pool.query(
    'DELETE FROM rutina_ejercicios WHERE rutina_id = ?',
    [rutina_id]
  );

  return {
    deletedCount: result.affectedRows,
    message: `${result.affectedRows} ejercicios eliminados de la rutina`
  };
};
