import express from 'express';
import usuariosService from '../services/usuarioService.js';
import { verifyToken, hasRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, hasRole("admin"), async (req, res) => {
    try {
        const data = await usuariosService.getAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', verifyToken, hasRole('admin'), async (req, res) => {
    try {
        const data = await usuariosService.getById(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

router.post('/', verifyToken, hasRole('admin'), async (req, res) => {
    try {
        const data = await usuariosService.create(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', verifyToken, hasRole('admin'), async (req, res) => {
    try {
        const data = await usuariosService.update(req.params.id, req.body);
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', verifyToken, hasRole('admin'), async (req, res) => {
    try {
        const data = await usuariosService.delete(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

export default router;
