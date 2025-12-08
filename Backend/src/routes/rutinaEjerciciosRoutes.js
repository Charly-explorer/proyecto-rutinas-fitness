import express from 'express';
import * as rutinaEjerciciosService from '../services/rutinaEjerciciosService.js';
import { verifyToken, hasRole } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/rutina/:rutina_id', async (req, res) => {
  try {
    const ejercicios = await rutinaEjerciciosService.getByRutina(req.params.rutina_id);
    res.json(ejercicios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener ejercicios de la rutina' });
  }
});


router.get('/rutina/:rutina_id/grouped', async (req, res) => {
  try {
    const ejerciciosGrouped = await rutinaEjerciciosService.getByRutinaGroupedByDay(req.params.rutina_id);
    res.json(ejerciciosGrouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener ejercicios agrupados' });
  }
});


router.post('/', verifyToken, async (req, res) => {
  try {
    const newRelacion = await rutinaEjerciciosService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Ejercicio asignado a la rutina',
      data: newRelacion
    });
  } catch (err) {
    console.error(err);
    if (err.message.includes('obligatorios')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error al asignar ejercicio a rutina' });
  }
});


router.post('/bulk', verifyToken, async (req, res) => {
  try {
    const { rutina_id, ejercicios } = req.body;
    
    if (!rutina_id || !ejercicios) {
      return res.status(400).json({ error: 'rutina_id y ejercicios son requeridos' });
    }

    const result = await rutinaEjerciciosService.createMultiple(rutina_id, ejercicios);
    res.status(201).json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', verifyToken, async (req, res) => {
  try {
    const result = await rutinaEjerciciosService.update(req.params.id, req.body);
    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error(err);
    if (err.message.includes('no encontrada')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error al actualizar relación' });
  }
});


router.delete('/:id', verifyToken, hasRole(['admin']), async (req, res) => {
  try {
    const result = await rutinaEjerciciosService.deleteById(req.params.id);
    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error(err);
    if (err.message.includes('no encontrada')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error al eliminar ejercicio de la rutina' });
  }
});


router.delete('/rutina/:rutina_id', verifyToken, hasRole(['admin']), async (req, res) => {
  try {
    const result = await rutinaEjerciciosService.deleteByRutina(req.params.rutina_id);
    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar ejercicios de la rutina' });
  }
});

export default router;
