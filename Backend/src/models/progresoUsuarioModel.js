import pool from "../services/db.js";

const ProgresoUsuario = {
    async create(data) {
        const { usuario_id, fecha, peso_kg, notas } = data;
        const [result] = await pool.query(
            `INSERT INTO progreso_usuarios (usuario_id, fecha, peso_kg, notas)
             VALUES (?, ?, ?, ?)`,
            [usuario_id, fecha, peso_kg, notas]
        );
        return result.insertId;
    },

    async findAllByUser(usuario_id) {
        const [rows] = await pool.query(
            `SELECT * FROM progreso_usuarios WHERE usuario_id = ? ORDER BY fecha DESC`,
            [usuario_id]
        );
        return rows;
    },

    async findOne(id) {
        const [rows] = await pool.query(
            `SELECT * FROM progreso_usuarios WHERE id = ?`,
            [id]
        );
        return rows[0];
    },

    async update(id, data) {
        const { fecha, peso_kg, notas } = data;
        await pool.query(
            `UPDATE progreso_usuarios SET fecha = ?, peso_kg = ?, notas = ? WHERE id = ?`,
            [fecha, peso_kg, notas, id]
        );
        return true;
    },

    async remove(id) {
        await pool.query(
            `DELETE FROM progreso_usuarios WHERE id = ?`,
            [id]
        );
        return true;
    }
};

export default ProgresoUsuario;
