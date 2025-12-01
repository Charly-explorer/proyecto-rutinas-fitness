import express from 'express';
import * as rutinasService from '../services/rutinasService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rutinas = await rutinasService.getAll();
    res.json(rutinas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener rutinas' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const rutina = await rutinasService.getById(req.params.id);
    if (!rutina) return res.status(404).json({ error: 'Rutina no encontrada' });
    res.json(rutina);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener rutina' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newRutina = await rutinasService.create(req.body);
    res.status(201).json(newRutina);
  } catch (err) {
    if (err.message.includes('Faltan datos')) {
      res.status(400).json({ error: err.message });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Error al crear rutina' });
    }
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await rutinasService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    if (err.message === 'Rutina no encontrada' || err.message === 'No hay datos para actualizar') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al actualizar rutina' });
    }
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await rutinasService.deleteById(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Rutina no encontrada') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al eliminar rutina' });
    }
  }
});

export default router;