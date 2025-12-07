import pool from "./db.js";

export const getAll = async () => {
  const [rows] = await pool.execute('SELECT * FROM rutinas ORDER BY id DESC');
  return rows;
};

export const getById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, nombre, objetivo, nivel, dias_por_semana, tipo FROM rutinas WHERE id = ?', [id]);
  return rows[0];
};

export const create = async (rutina) => {
  const { nombre, objetivo, nivel, dias_por_semana, tipo } = rutina;

  if (!nombre || !objetivo || !nivel || !dias_por_semana || !tipo)
    throw new Error('Faltan datos de la rutina');

  const [result] = await pool.execute(
    'INSERT INTO rutinas (nombre, objetivo, nivel, dias_por_semana, tipo) VALUES (?, ?, ?, ?, ?)', 
    [nombre, objetivo, nivel, dias_por_semana, tipo]
  );
  return getById(result.insertId);
};

export const update = async (id, rutina) => {
  const { nombre, objetivo, nivel, dias_por_semana, tipo } = rutina;

  const fields = [];
  const values = [];

  if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
  if (objetivo !== undefined) { fields.push('objetivo = ?'); values.push(objetivo); }
  if (nivel !== undefined) { fields.push('nivel = ?'); values.push(nivel); }
  if (dias_por_semana !== undefined) { fields.push('dias_por_semana = ?'); values.push(dias_por_semana); }
  if (tipo !== undefined) { fields.push('tipo = ?'); values.push(tipo); }

  if (fields.length === 0) throw new Error('No hay datos para actualizar');

  values.push(id);
  const [result] = await pool.execute(
    `UPDATE rutinas SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  if (result.affectedRows === 0) throw new Error('Rutina no encontrada');

  return getById(id);
};

export const deleteById = async (id) => {
  const [result] = await pool.execute('DELETE FROM rutinas WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw new Error('Rutina no encontrada');
  return { message: 'Rutina eliminada correctamente' };
};