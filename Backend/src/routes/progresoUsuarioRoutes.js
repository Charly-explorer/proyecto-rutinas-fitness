import express from "express";
import progresoController from "../controllers/progresoUsuarioController.js";

const router = express.Router();

router.post("/", progresoController.crear);
router.get("/usuario/:usuario_id", progresoController.listarPorUsuario);
router.get("/:id", progresoController.obtener);
router.put("/:id", progresoController.actualizar);
router.delete("/:id", progresoController.eliminar);

export default router;