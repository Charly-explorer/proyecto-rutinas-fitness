import express from "express";
import * as progresoService from "../services/progresoUsuarioService.js";

const router = express.Router();

// GET: obtener todos los progresos con filtros extendidos
router.get("/", async (req, res) => {
  try {
    const filters = {
      usuario_id: req.query.usuario_id || null,
      fecha: req.query.fecha || null,
      rutina_id: req.query.rutina_id || null,
      ejercicio_id: req.query.ejercicio_id || null,
    };

    const progresos = await progresoService.getAll(filters);
    res.json(progresos);
  } catch (error) {
    console.error("Error obteniendo progresos:", error);
    res.status(500).json({ error: "Error al obtener progresos" });
  }
});

// POST: crear progreso
router.post("/", async (req, res) => {
  try {
    const nuevo = await progresoService.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error en POST progreso_usuario:", error);
    res.status(500).json({ error: error.message || "Error al registrar progreso" });
  }
});

// GET: por usuario
router.get("/usuario/:usuario_id", async (req, res) => {
  try {
    const data = await progresoService.getByUser(req.params.usuario_id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET: un progreso por ID
router.get("/:id", async (req, res) => {
  try {
    const data = await progresoService.getById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

// PUT: Actualizar progreso con campos extendidos
router.put("/:id", async (req, res) => {
  try {
    const { usuario_id } = req.body;
    const { id } = req.params;

    if (!usuario_id) {
      return res.status(400).json({ error: "usuario_id es requerido" });
    }

    const message = await progresoService.updateProgresoUsuario(id, usuario_id, req.body);
    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Eliminar progreso
router.delete("/:id", async (req, res) => {
  try {
    const { usuario_id } = req.body;
    const { id } = req.params;

    const message = await progresoService.deleteProgresoUsuario(id, usuario_id);
    res.json({ message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
