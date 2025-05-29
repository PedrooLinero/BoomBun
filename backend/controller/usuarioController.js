const Respuesta = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config.js");
const nodemailer = require("nodemailer");

const models = initModels(sequelize);
const Usuario = models.Usuario;
const saltRounds = 10;

// Cache simple en memoria para intentos de login
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutos

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "cerveceriaboombun@gmail.com",
    pass: "uqir bszp hyrb vawb",
  },
});

class UsuarioController {
  // ... (métodos login y logout existentes sin cambios)

  /**
   * POST /api/register
   * Registro seguro con asignación manual de roles (solo para administradores)
   * Body: { Nombre, Correo, Contraseña, Tipo? } (Tipo solo si es Jefe)
   */
  async register(req, res) {
    const { Nombre, Correo, Contraseña, Tipo = "Cliente" } = req.body; // Valor por defecto: Cliente
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const tiposPermitidos = ["Cliente", "Jefe"];

    // Validación básica
    if (!Nombre || !Correo || !Contraseña) {
      return res
        .status(400)
        .json(
          Respuesta.error(null, "Nombre, correo y contraseña son obligatorios")
        );
    }

    // Validación de email
    if (!emailRegex.test(Correo)) {
      return res
        .status(400)
        .json(Respuesta.error(null, "Formato de correo inválido"));
    }

    // Validación de contraseña
    if (Contraseña.length < 8) {
      return res
        .status(400)
        .json(
          Respuesta.error(null, "La contraseña debe tener mínimo 8 caracteres")
        );
    }

    // Validación de tipo de usuario
    if (!tiposPermitidos.includes(Tipo)) {
      return res
        .status(403)
        .json(Respuesta.error(null, "Tipo de usuario no permitido"));
    }

    try {
      // Verificar usuario existente
      const usuarioExistente = await Usuario.findOne({
        where: { Correo: Correo.toLowerCase().trim() },
      });

      if (usuarioExistente) {
        return res
          .status(409)
          .json(Respuesta.error(null, "El correo ya está registrado"));
      }

      // Hash de contraseña
      const hashContraseña = await bcrypt.hash(Contraseña, saltRounds);

      // Crear usuario (el Tipo lo decides tú desde el request)
      const nuevoUsuario = await Usuario.create({
        Nombre: Nombre.trim(),
        Correo: Correo.toLowerCase().trim(),
        Contraseña: hashContraseña,
        Tipo: Tipo, // Asignas el tipo que decidas
      });

      // Enviar correo con estilo HTML
      await transporter.sendMail({
        from: '"Cervecería Boom Bun" <cerveceriaboombun@gmail.com>',
        to: Correo,
        subject: "¡Bienvenido/a a Cervecería Boom Bun!",
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                color: #1a1a1a;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              }
              .header {
                background-color: #065f46;
                color: #fff;
                padding: 20px;
                text-align: center;
                border-bottom: 3px solid #047857;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: bold;
              }
              .content {
                padding: 20px;
                text-align: center;
              }
              .content h2 {
                color: #c98c26;
                font-size: 20px;
                margin-bottom: 10px;
              }
              .content p {
                font-size: 16px;
                line-height: 1.5;
                color: #666666;
              }
              .footer {
                background-color: #e0e0e0;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                color: #666666;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #c98c26;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin-top: 20px;
              }
              .button:hover {
                background-color: #a76f1f;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Cervecería Boom Bun</h1>
              </div>
              <div class="content">
                <h2>¡Bienvenido/a, ${Nombre}!</h2>
                <p>Gracias por unirte a nuestra comunidad. Estamos emocionados de tenerte como parte de Cervecería Boom Bun. Explora nuestra carta, disfruta de nuestra mejor cerveza y déjanos saber tu experiencia.</p>
                <p>Si tienes alguna pregunta, no dudes en contactarnos. ¡Esperamos verte pronto!</p>
                <a href="https://tu-sitio-web.com" class="button">Visita nuestro sitio</a>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Cervecería Boom Bun. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      // Respuesta sin datos sensibles
      const datosUsuario = {
        id: nuevoUsuario.ID_Usuario,
        nombre: nuevoUsuario.Nombre,
        tipo: nuevoUsuario.Tipo,
      };

      return res
        .status(201)
        .json(Respuesta.exito(datosUsuario, "Usuario registrado exitosamente"));
    } catch (error) {
      logMensaje(`Error en registro: ${error.message}`, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error interno del servidor"));
    }
  }

  async login(req, res) {
    const { Correo, Contraseña } = req.body;
    const ip = req.ip;

    // Validación básica
    if (!Correo || !Contraseña) {
      return res
        .status(400)
        .json(Respuesta.error(null, "Correo y contraseña son obligatorios"));
    }

    try {
      // Verificar bloqueo por IP
      const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
      if (
        attempts.count >= MAX_ATTEMPTS &&
        Date.now() - attempts.lastAttempt < LOCK_TIME
      ) {
        const remainingTime = Math.ceil(
          (LOCK_TIME - (Date.now() - attempts.lastAttempt)) / 60000
        );
        return res
          .status(429)
          .json(
            Respuesta.error(
              null,
              `Demasiados intentos. Espere ${remainingTime} minutos`
            )
          );
      }

      // Buscar usuario
      const user = await Usuario.findOne({
        where: { Correo: Correo.toLowerCase().trim() },
      });

      if (!user) {
        loginAttempts.set(ip, {
          count: attempts.count + 1,
          lastAttempt: Date.now(),
        });
        return res
          .status(401)
          .json(Respuesta.error(null, "Credenciales inválidas"));
      }

      // Verificar contraseña
      let isValid = false;
      if (/^\$2[aby]\$/.test(user.Contraseña)) {
        isValid = await bcrypt.compare(Contraseña, user.Contraseña);
      } else {
        isValid = Contraseña === user.Contraseña;
        if (isValid) {
          // Migrar a hash si coincide
          const hash = await bcrypt.hash(Contraseña, saltRounds);
          await user.update({ Contraseña: hash });
        }
      }

      if (!isValid) {
        loginAttempts.set(ip, {
          count: attempts.count + 1,
          lastAttempt: Date.now(),
        });
        return res
          .status(401)
          .json(Respuesta.error(null, "Credenciales inválidas"));
      }

      // Resetear intentos si es exitoso
      loginAttempts.delete(ip);

      // Generar JWT
      const token = jwt.sign(
        {
          sub: user.ID_Usuario,
          Correo: user.Correo,
          Tipo: user.Tipo,
        },
        config.secretKey,
        { expiresIn: "1h" }
      );

      // Configurar cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      });

      return res.status(200).json(
        Respuesta.exito(
          {
            id: user.ID_Usuario,
            nombre: user.Nombre,
            tipo: user.Tipo,
          },
          "Login exitoso"
        )
      );
    } catch (error) {
      logMensaje(`Error en login: ${error.message}`, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error interno del servidor"));
    }
  }

  async logout(req, res) {
    try {
      // Eliminar cookie de autenticación
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res
        .status(200)
        .json(Respuesta.exito(null, "Sesión cerrada exitosamente"));
    } catch (error) {
      logMensaje(`Error en logout: ${error.message}`, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error al cerrar sesión"));
    }
  }
}

module.exports = new UsuarioController();