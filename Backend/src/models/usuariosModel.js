const db = require('../database'); // conexión a MySQL (mysql2/promise)

const usuariosModel = {

    getAll() {
        const sql = "SELECT * FROM usuarios";
        return db.query(sql);
    },

    getById(id) {
        const sql = "SELECT * FROM usuarios WHERE id = ?";
        return db.query(sql, [id]);
    },

    create(data) {
        const sql = "INSERT INTO usuarios SET ?";
        return db.query(sql, [data]);
    },

    update(id, data) {
        const sql = "UPDATE usuarios SET ? WHERE id = ?";
        return db.query(sql, [data, id]);
    },

    delete(id) {
        const sql = "DELETE FROM usuarios WHERE id = ?";
        return db.query(sql, [id]);
    }
};

module.exports = usuariosModel;