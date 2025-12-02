import ProgresoUsuario from "../models/progresoUsuarioModel.js";

async function crearProgreso(data) {
    return await ProgresoUsuario.create(data);
}

async function obtenerProgresoUsuario(usuario_id) {
    return await ProgresoUsuario.findAllByUser(usuario_id);
}

async function obtenerProgreso(id) {
    const progreso = await ProgresoUsuario.findOne(id);
    if (!progreso) throw new Error("Registro de progreso no encontrado.");
    return progreso;
}

async function actualizarProgreso(id, data) {
    await ProgresoUsuario.update(id, data);
    return { message: "Progreso actualizado correctamente" };
}

async function eliminarProgreso(id) {
    await ProgresoUsuario.remove(id);
    return { message: "Progreso eliminado correctamente" };
}

export default {
    crearProgreso,
    obtenerProgresoUsuario,
    obtenerProgreso,
    actualizarProgreso,
    eliminarProgreso
};
