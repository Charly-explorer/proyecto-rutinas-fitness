import pool from '../services/db.js';
import bcrypt from 'bcryptjs';

const usuariosService = {

    async getAll() {
        const sql = "SELECT * FROM usuarios";
        const [rows] = await pool.query(sql);
        return rows;
    },
    async getById(id) {
        const sql = "SELECT * FROM usuarios WHERE id = ?";
        const [rows] = await pool.query(sql, [id]);

        if (rows.length === 0) {
            throw new Error("Usuario no encontrado");
        }

        return rows[0];
    },

    async getByEmail(email) {
        const sql = "SELECT * FROM usuarios WHERE email = ?";
        const [rows] = await pool.query(sql, [email]);
        return rows[0]; 
    },

    async create(data) {
        if (!data.nombre) throw new Error("El nombre es obligatorio");
        if (!data.email) throw new Error("El email es obligatorio");
        if (!data.password_hash) throw new Error("La contraseña es obligatoria (hash)");
        if (!data.rol) throw new Error("El rol es obligatorio");

        let passwordHash = data.password_hash;
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            passwordHash = await bcrypt.hash(data.password, salt);
        }



        const usuario = {
            nombre: data.nombre,
            email: data.email,
            password_hash: data.password_hash,
            edad: data.edad || null,
            estatura_cm: data.estatura_cm || null,
            peso_kg: data.peso_kg || null,
            nivel_actividad: data.nivel_actividad || null,
            objetivo: data.objetivo || null,
            rol: data.rol
        };

        const sql = "INSERT INTO usuarios SET ?";
        const [result] = await pool.query(sql, usuario);

        return { id: result.insertId, ...usuario };
    },

   async update(id, data) {
    const usuarioActual = await this.getById(id);

    let passwordHash = usuarioActual.password_hash;
    if (data.password) {
        const salt = await bcrypt.genSalt(10);
        passwordHash = await bcrypt.hash(data.password, salt);
    } else if (data.password_hash) {
        passwordHash = data.password_hash;
    }
    const usuarioActualizado = {
        nombre: data.nombre ?? usuarioActual.nombre,
        email: data.email ?? usuarioActual.email,
        password_hash: data.password_hash ?? usuarioActual.password_hash,
        edad: data.edad ?? usuarioActual.edad,
        estatura_cm: data.estatura_cm ?? usuarioActual.estatura_cm,
        peso_kg: data.peso_kg ?? usuarioActual.peso_kg,
        nivel_actividad: data.nivel_actividad ?? usuarioActual.nivel_actividad,
        objetivo: data.objetivo ?? usuarioActual.objetivo,
        rol: data.rol ?? usuarioActual.rol,
    };
    const sql = "UPDATE usuarios SET ? WHERE id = ?";
    await pool.query(sql, [usuarioActualizado, id]);

    return { id, ...usuarioActualizado };
},
    async delete(id) {
        await this.getById(id); 

        const sql = "DELETE FROM usuarios WHERE id = ?";
        await pool.query(sql, [id]);

        return { message: "Usuario eliminado correctamente" };
    }
};
export default usuariosService;
