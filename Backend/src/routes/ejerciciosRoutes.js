import express from 'express';
import * as ejerciciosService from '../services/ejerciciosService.js';
import { verifyToken, hasRole } from '../middlewares/authMiddleware.js';
const router = express.Router();


//GET para obtener todos los ejercicios
router.get('/', async(req, res)=>{
    try{
        const {nivel, tipo, musculo_principal} = req.query;
        const filters = {};

        if(nivel)  filters.nivel = nivel;
        if(tipo) filters.tipo = tipo;
        if(musculo_principal) filters.musculo_principal = musculo_principal;

        const ejercicios = await ejerciciosService.getAll(filters);
        res.json({succes: true, count: ejercicios.length, data: ejercicios});
    }catch(err){
        console.error('Error', err);
        res.status(500).json({succes:false,error:'Error en la base de datos contacte con Diios'});
    }
});
// GET por el id
router.get('/:id', async (req,res)=>{
    try{
        const {id} =req.params;
        const ejercicio = await ejerciciosService.getById(id);
        res.json({succes:true, data: ejercicio});
    }catch(err){
        if(err.message === 'El ejerciciio no fue encontrado'){
            res.status(400).json({succes:false, error: err.message });
        }else{
            console.error('Error al obtener ejercicio:', err);
            res.status(500).json({ success: false, error: 'Error al obtener ejercicio' });
        }
    }
});

//POST para crear un ejercicio.

router.post('/', verifyToken, hasRole('admin'), async(req,res)=>{
    try{
    const nuevoEjercicio = await ejerciciosService.create(req.body)
    res.status(201).json({succes:true, message: 'El ejercicio se creo exitosamente', data: nuevoEjercicio});
    }catch(err){
        if(err.message.includes('Faltan campos obligatorios para crear el ejercicio')){
            res.status(400).json({succes: false, error: err.message});
        }else{
            console.error('Error al crear ejercicio:', err);
            res.status(500).json({ success: false, error: 'Error al crear ejercicio' });
        }
    }
});

//PUT para actualizar ejercicio

router.put('/:id', verifyToken, hasRole('admin'), async(req,res)=>{
    try{
        const {id} = req.params;
        const ejercicioActualizado = await ejerciciosService.update(id, req.body);
        res.json({succes: true, message: 'El ejercicio se actualizo', data: ejercicioActualizado});
    }catch(err){
        if (err.message === 'Ejercicio no encontrado') {
      res.status(404).json({ success: false, error: err.message });
    } else {
      console.error('Error al actualizar ejercicio:', err);
      res.status(500).json({ success: false, error: 'Error al actualizar ejercicio' });
    }
    }
});


//DELETE eliminar ejercicio por id

router.delete('/:id', verifyToken, hasRole('admin'), async( req,res)=>{
    try {
    const { id } = req.params;
    const result = await ejerciciosService.deleteById(id);
    res.json({ success: true, message: result.message, data: { id } });
  } catch (err) {
    if (err.message === 'Ejercicio no encontrado') {
      res.status(404).json({ success: false, error: err.message });
    } else {
      console.error('Error al eliminar ejercicio:', err);
      res.status(500).json({ success: false, error: 'Error al eliminar ejercicio' });
    }
  }
});

export default router;