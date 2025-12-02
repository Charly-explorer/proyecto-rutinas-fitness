import progresoService from "../services/progresoUsuarioService.js";

async function crear(req, res) {
    try {
        const nuevoId = await progresoService.crearProgreso(req.body);
        res.status(201).json({ id: nuevoId });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function listarPorUsuario(req, res) {
    try {
        const usuario_id = req.params.usuario_id;
        const progreso = await progresoService.obtenerProgresoUsuario(usuario_id);
        res.json(progreso);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function obtener(req, res) {
    try {
        const progreso = await progresoService.obtenerProgreso(req.params.id);
        res.json(progreso);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

async function actualizar(req, res) {
    try {
        const mensaje = await progresoService.actualizarProgreso(req.params.id, req.body);
        res.json(mensaje);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function eliminar(req, res) {
    try {
        const mensaje = await progresoService.eliminarProgreso(req.params.id);
        res.json(mensaje);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export default {
    crear,
    listarPorUsuario,
    obtener,
    actualizar,
    eliminar
};
