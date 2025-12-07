import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import usuariosService from '../services/usuarioService.js';
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const usuario = await usuariosService.getByEmail(email);

    if (!usuario) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValida) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const payload = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    };

    const token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN
    });

    return res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error interno en el login' });
  }
};
