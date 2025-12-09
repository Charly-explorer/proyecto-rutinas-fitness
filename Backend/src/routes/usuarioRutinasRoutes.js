import express from "express";
import * as usuarioRutinasService from "../services/usuarioRutinasService.js";
import { verifyToken, hasRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/usuario/:usuario_id", verifyToken, async (req, res) => {
  try {
    const usuario_id = parseInt(req.params.usuario_id);

    if (req.user.rol !== "admin" && req.user.id !== usuario_id) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para ver estas rutinas" });
    }

    const rutinas = await usuarioRutinasService.getByUsuario(usuario_id);
    res.json(rutinas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener rutinas del usuario" });
  }
});

router.get("/usuario/:usuario_id/activa", verifyToken, async (req, res) => {
  try {
    const usuario_id = parseInt(req.params.usuario_id);

    if (req.user.rol !== "admin" && req.user.id !== usuario_id) {
      return res
        .status(403)
        .json({
          error: "No tienes permiso para ver esta información, por playo",
        });
    }

    const rutinaActiva = await usuarioRutinasService.getActivaByUsuario(
      usuario_id
    );

    if (!rutinaActiva) {
      return res
        .status(404)
        .json({ message: "No hay rutina activa para este usuario" });
    }

    res.json(rutinaActiva);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener rutina activa" });
  }
});

router.get("/rutina/:rutina_id/usuarios",
  verifyToken,
  hasRole("admin"),
  async (req, res) => {
    try {
      const usuarios = await usuarioRutinasService.getUsuariosByRutina(
        req.params.rutina_id
      );
      res.json(usuarios);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener usuarios de la rutina" });
    }
  }
);

router.post("/", verifyToken, async (req, res) => {
  try {
    const { usuario_id, rutina_id, fecha_asignacion, activa } = req.body;

    if (req.user.rol !== "admin" && req.user.id !== usuario_id) {
      return res
        .status(403)
        .json({
          error: "No tienes permiso para asignar rutinas a otros usuarios",
        });
    }

    const newAsignacion = await usuarioRutinasService.create({
      usuario_id,
      rutina_id,
      fecha_asignacion,
      activa,
    });

    res.status(201).json({
      success: true,
      message: "Rutina asignada al usuario",
      data: newAsignacion,
    });
  } catch (err) {
    console.error(err);
    if (err.message.includes("obligatorios")) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Error al asignar rutina al usuario" });
  }
});

router.put("/:id/activar", verifyToken, async (req, res) => {
  try {
    const { usuario_id } = req.body;

    if (req.user.rol !== "admin" && req.user.id !== usuario_id) {
      return res
        .status(403)
        .json({
          error: "No tienes permiso para modificar rutinas de otros usuarios",
        });
    }

    const result = await usuarioRutinasService.setActiva(
      req.params.id,
      usuario_id
    );
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error(err);
    if (
      err.message.includes("no encontrada") ||
      err.message.includes("no pertenece")
    ) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Error al activar rutina" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const result = await usuarioRutinasService.update(req.params.id, req.body);
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error(err);
    if (err.message.includes("no encontrada")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Error al actualizar asignación" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { usuario_id } = req.body;

    if (req.user.rol !== "admin" && req.user.id !== usuario_id) {
      return res
        .status(403)
        .json({
          error: "No tienes permiso para eliminar rutinas de otros usuarios",
        });
    }

    const result = await usuarioRutinasService.deleteById(
      req.params.id,
      usuario_id
    );
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error(err);
    if (
      err.message.includes("no encontrada") ||
      err.message.includes("no pertenece")
    ) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Error al desasignar rutina" });
  }
});

export default router;
