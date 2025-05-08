const jwt = require("jsonwebtoken");
const { logMensaje } = require("../utils/logger.js");
const Respuesta = require("../utils/respuesta.js");
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});
const config = require("../config/config.js");

function verifyToken(req, res, next) {
  let token = req.cookies.token;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(Respuesta.error(null, "Token no proporcionado o formato inválido"));
    }
    token = authHeader.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, config.secretKey);
    req.user = decoded; // { sub: ID_Usuario, Correo, Tipo, iat, exp }
    return next();
  } catch (err) {
    logMensaje(`Error al verificar token: ${err.message}, Stack: ${err.stack}`, "error");
    return res
      .status(403)
      .json(Respuesta.error(null, "Token inválido o expirado"));
  }
}

function verificarRol(tiposPermitidos = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json(Respuesta.error(null, "No autorizado"));
    }

    if (!tiposPermitidos.includes(req.user.Tipo)) {
      return res
        .status(403)
        .json(Respuesta.error(null, "Acceso denegado. Permisos insuficientes"));
    }

    next();
  };
}

module.exports = { verifyToken, verificarRol };