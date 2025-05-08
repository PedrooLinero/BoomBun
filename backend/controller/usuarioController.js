// controller/usuarioController.js
const Respuesta = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config.js");

const models = initModels(sequelize);
const Usuario = models.Usuario;
const saltRounds = 10;  // Define salt rounds once

class UsuarioController {
  async login(req, res) {
    const { Correo, Contraseña } = req.body;

    if (!Correo || !Contraseña) {
      return res.status(400).json(
        Respuesta.error(null, "El correo y la contraseña son obligatorios")
      );
    }

    try {
      const user = await Usuario.findOne({
        where: { Correo: Correo.toLowerCase() },
      });
      if (!user) {
        return res.status(401).json(Respuesta.error(null, "Usuario no encontrado"));
      }

      // Detectar si la contraseña en DB es un hash bcrypt
      const bcryptHashRegex = /^\$2[aby]\$\d{2}\$/;
      let isPasswordValid = false;

      if (bcryptHashRegex.test(user.Contraseña)) {
        // Comparar con hash
        isPasswordValid = await bcrypt.compare(Contraseña, user.Contraseña);
      } else if (Contraseña === user.Contraseña) {
        // Contraseña en claro: migrar a hash
        const hashed = await bcrypt.hash(Contraseña, saltRounds);
        await user.update({ Contraseña: hashed });
        isPasswordValid = true;
      }

      if (!isPasswordValid) {
        return res.status(401).json(Respuesta.error(null, "Credenciales inválidas"));
      }

      // Generar token JWT
      const token = jwt.sign(
        { sub: user.ID_Usuario, Correo: user.Correo, Tipo: user.Tipo },
        config.secretKey,
        { expiresIn: "1h" }
      );

      // Enviar cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 3600000,
      });

      const salida = { id: user.ID_Usuario, nombre: user.Nombre, tipo: user.Tipo };
      return res.status(200).json(Respuesta.exito(salida, "Inicio de sesión exitoso"));
    } catch (err) {
      logMensaje(`Error en login: ${err.message}, Stack: ${err.stack}`, "error");
      return res.status(500).json(Respuesta.error(null, "Error interno del servidor"));
    }
  }

  async logout(req, res) {
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    return res.status(200).json(Respuesta.exito(null, "Cierre de sesión exitoso"));
  }

  async getAllUsers(req, res) {
    try {
      const users = await Usuario.findAll({
        attributes: ["ID_Usuario", "Nombre", "Correo", "Tipo"],
      });
      return res.status(200).json(Respuesta.exito(users));
    } catch (err) {
      logMensaje(`Error al obtener usuarios: ${err.message}, Stack: ${err.stack}`, "error");
      return res.status(500).json(Respuesta.error(null, "Error al obtener los usuarios"));
    }
  }

  async register(req, res) {
    const { Nombre, Correo, Contraseña, Tipo } = req.body;

    if (!Nombre || !Correo || !Contraseña || !Tipo) {
      return res.status(400).json(Respuesta.error(null, "Todos los campos son obligatorios"));
    }

    try {
      const existingUser = await Usuario.findOne({ where: { Correo: Correo.toLowerCase() } });
      if (existingUser) {
        return res.status(400).json(Respuesta.error(null, "El correo ya está registrado"));
      }

      const hashedPassword = await bcrypt.hash(Contraseña, saltRounds);
      const newUser = await Usuario.create({
        Nombre,
        Correo: Correo.toLowerCase(),
        Contraseña: hashedPassword,
        Tipo,
      });

      const salida = { id: newUser.ID_Usuario, nombre: newUser.Nombre, tipo: newUser.Tipo };
      return res.status(201).json(Respuesta.exito(salida, "Usuario registrado exitosamente"));
    } catch (err) {
      logMensaje(`Error en registro: ${err.message}, Stack: ${err.stack}`, "error");
      return res.status(500).json(Respuesta.error(null, "Error interno del servidor"));
    }
  }
}

module.exports = new UsuarioController();