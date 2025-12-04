import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

// Verifica que el token exista y sea válido
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // "Bearer token"
  if (!authHeader) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    // Queda info del usuario disponible en la request
    req.user = decoded; // { id, email, role, ... }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Autoriza por lista de roles permitidos
export const hasRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tiene permisos suficientes' });
    }

    next();
  };
};
