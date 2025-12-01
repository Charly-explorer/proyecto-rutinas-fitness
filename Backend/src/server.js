import app from './app.js';
import { config } from './config/config.js';

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
  console.log(` Ambiente: ${config.NODE_ENV}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
});