import pool from "./db.js";

export const getAll = async (filters = {}) => {
  let query = "SELECT * FROM ejercicios WHERE 1=1";
  const params = [];

  if (filters.nivel) {
    query += " AND nivel = ?";
    params.push(filters.nivel);
  }

  if (filters.tipo) {
    query += " AND tipo = ?";
    params.push(filters.tipo);
  }

  if (filters.musculo_principal) {
    query += " AND musculo_principal LIKE ?";
    params.push(`%${filters.musculo_principal}%`);
  }

  query += " ORDER BY nombre ASC";

  const [rows] = await pool.execute(query, params);
  return rows;
};

export const getById = async (id) => {
  const [rows] = await pool.execute("SELECT * FROM ejercicios WHERE id = ?", [
    id,
  ]);
  if (rows.length === 0) {
    throw new Error("El ejerciciio no fue encontrado");
  }
  return rows[0];
};

export const create = async (ejercicioData) => {
  const {
    nombre,
    descripcion,
    musculo_principal,
    musculos_secundarios,
    equipamiento,
    nivel,
    tipo,
    repeticiones_sugeridas,
    series_sugeridas,
    peso_sugerido,
    riesgos,
  } = ejercicioData;

  if (!nombre || !musculo_principal || !nivel || !tipo) {
    throw new Error("Faltan campos obligatorios para crear el ejercicio");
  }

  const [result] = await pool.execute(
    `INSERT INTO ejercicios (
      nombre, descripcion, musculo_principal, musculos_secundarios,
      equipamiento, nivel, tipo, repeticiones_sugeridas,
      series_sugeridas, peso_sugerido, riesgos
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre,
      descripcion || null,
      musculo_principal,
      musculos_secundarios || null,
      equipamiento || null,
      nivel,
      tipo,
      repeticiones_sugeridas || null,
      series_sugeridas || null,
      peso_sugerido || null,
      riesgos || null,
    ]
  );

  const [newEjercicio] = await pool.execute(
    "SELECT * FROM ejercicios WHERE id = ?",[result.insertId]
  );
  return newEjercicio[0];
};

export const update = async (id, ejercicioData) => {
  const {
    nombre,
    descripcion,
    musculo_principal,
    musculos_secundarios,
    equipamiento,
    nivel,
    tipo,
    repeticiones_sugeridas,
    series_sugeridas,
    peso_sugerido,
    riesgos,
  } = ejercicioData;

  const [result] = await pool.execute(
    `UPDATE ejercicios SET
      nombre = ?,
      descripcion = ?,
      musculo_principal = ?,
      musculos_secundarios = ?,
      equipamiento = ?,
      nivel = ?,
      tipo = ?,
      repeticiones_sugeridas = ?,
      series_sugeridas = ?,
      peso_sugerido = ?,
      riesgos = ?
    WHERE id = ?`,
    [
      nombre,
      descripcion,
      musculo_principal,
      musculos_secundarios,
      equipamiento,
      nivel,
      tipo,
      repeticiones_sugeridas,
      series_sugeridas,
      peso_sugerido,
      riesgos,
      id,
    ]
  );

  if (result.affectedRows === 0) {
    throw new Error("El ejercicio que intenta actualizar no fue encontrado");
  }
  const [update] = await pool.execute("SELECT * FROM ejercicios WHERE id = ?", [id]);
  return update[0];
};
export const deleteById = async(id)=>{
    const[result]= await pool.execute('DELETE FROM ejercicios WHERE id = ?', [id]);
   
    if (result.affectedRows === 0) {
    throw new Error('Ejercicio no encontrado');
  }
  
  return { message: 'Ejercicio eliminado exitosamente' };
}
