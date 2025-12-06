import pool from "../services/db.js";

// Obtener progreso por usuario
export const getByUser = async (usuario_id) => {
  const [rows] = await pool.query(
    "SELECT * FROM progreso_usuarios WHERE usuario_id = ?",
    [usuario_id]
  );

  if (rows.length === 0) {
    throw new Error("No hay progresos para este usuario");
  }

  return rows;
};

// Obtener progreso por ID
export const getById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM progreso_usuarios WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    throw new Error("Progreso no encontrado");
  }

  return rows[0];
};

// Actualizar progreso
export const updateProgresoUsuario = async (id, usuario_id, { fecha, peso_kg, notas }) => {
  const [result] = await pool.query(
    `UPDATE progreso_usuarios
     SET fecha = ?, peso_kg = ?, notas = ?
     WHERE id = ? AND usuario_id = ?`,
    [fecha, peso_kg || null, notas || null, id, usuario_id]
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


// Obtener todos los progresos
export const getAll = async (filters = {}) => {
  let query = `SELECT * FROM progreso_usuarios WHERE 1=1`;
  const params = [];

  if (filters.usuario_id) {
    query += ` AND usuario_id = ?`;
    params.push(filters.usuario_id);
  }

  if (filters.fecha) {
    query += ` AND fecha = ?`;
    params.push(filters.fecha);
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

// Crear progreso
export const create = async (data) => {
  const { usuario_id, fecha, peso_kg, notas } = data;

  const [result] = await pool.query(
    `INSERT INTO progreso_usuarios (usuario_id, fecha, peso_kg, notas)
     VALUES (?, ?, ?, ?)`,
    [usuario_id, fecha, peso_kg, notas]
  );

  return { id: result.insertId, ...data };
};
