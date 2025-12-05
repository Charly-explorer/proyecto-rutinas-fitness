import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import ejerciciosRoutes from './routes/ejerciciosRoutes.js';
import rutinasRoutes from './routes/rutinasRoutes.js';
import usuariosRoutes from './routes/usuarioRoute.js';
import progresoUsuariosRoutes from './routes/progresoUsuarioRoutes.js';
import pool from './services/db.js';

const app = express();

app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/ejercicios', ejerciciosRoutes);
app.use('/api/rutinas', rutinasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/progreso-usuario', progresoUsuariosRoutes);



app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Rutinas Fitness funcionando correctamente' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});


app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(' Conectado a MariaDB en Azure, sos demasiado bueno');
    connection.release();
  } catch (err) {
    console.error(' Error conectando a la DB, que idiota que sos:', err);
  }
})();

export default app;