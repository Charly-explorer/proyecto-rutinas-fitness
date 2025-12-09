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

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        
        // Validar que el usuario solo pueda ver su propio perfil (a menos que sea admin)
        if (req.user.rol !== 'admin' && req.user.id !== userId) {
            return res.status(403).json({ error: 'No tienes permiso para ver este perfil' });
        }
        
        const data = await usuariosService.getById(userId);
        res.json(data);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const data = await usuariosService.create(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        
        // Validar que el usuario solo pueda actualizar su propio perfil (a menos que sea admin)
        if (req.user.rol !== 'admin' && req.user.id !== userId) {
            return res.status(403).json({ error: 'No tienes permiso para actualizar este perfil' });
        }
        
        const data = await usuariosService.update(userId, req.body);
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
