require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const usuarioRoutes = require("./routes/usuarioRoutes");
const productoRoutes = require("./routes/productoRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const resenaRoutes = require("./routes/resenaRoutes");
const alergenoRoutes = require("./routes/alergenoRoutes");
const config = require("./config/config");
const path = require("path");

const app = express();

// Configurar middleware CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cerveceriaboombun.es", // Añade el dominio del frontend en Railway
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Servir imágenes desde las carpetas images y uploads
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configurar rutas de la API
app.use("/api", usuarioRoutes);
app.use("/api", productoRoutes);
app.use("/api", categoriaRoutes);
app.use("/api", resenaRoutes);
app.use("/api", alergenoRoutes);

// Manejar rutas no encontradas (404) para la API
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `Ruta ${req.method} ${req.url} no encontrada`,
  });
});

// Servir index.html para rutas no API (frontend SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    data: null,
    message: "Error interno del servidor",
  });
});

// Iniciar el servidor solo si no estamos en modo de prueba
if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`Servidor escuchando en el puerto ${config.port}`);
  });
}

module.exports = app;