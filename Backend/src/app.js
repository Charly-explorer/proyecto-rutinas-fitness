import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from "./routes/authRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';

import swaggerUi from "swagger-ui-express";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



import { config } from './config/config.js';
import ejerciciosRoutes from './routes/ejerciciosRoutes.js';
import rutinasRoutes from './routes/rutinasRoutes.js';
import usuariosRoutes from './routes/usuarioRoute.js';
import progresoUsuariosRoutes from './routes/progresoUsuarioRoutes.js';
import rutinaEjerciciosRoutes from './routes/rutinaEjerciciosRoutes.js';
import usuarioRutinasRoutes from './routes/usuarioRutinasRoutes.js';
import pool from './services/db.js';

const swaggerDocument = JSON.parse(fs.readFileSync("./doc/swagger.json", "utf8"));

const app = express();

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(helmet());


const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' } 
);

const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
);


if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.use(morgan('combined', { stream: accessLogStream }));


app.use(morgan('combined', {
  stream: errorLogStream,
  skip: (req, res) => res.statusCode < 400
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                 // 100 requests por IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/auth', authRoutes);

app.use('/api/ejercicios', ejerciciosRoutes);
app.use('/api/rutinas', rutinasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/progreso-usuario', progresoUsuariosRoutes);
app.use('/api/rutina-ejercicios', rutinaEjerciciosRoutes);
app.use('/api/usuario-rutinas', usuarioRutinasRoutes);



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