require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const usuarioRoutes = require("./routes/usuarioRoutes");
const productoRoutes = require("./routes/productoRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const resenaRoutes = require("./routes/resenaRoutes"); // Asegúrate de importar las rutas de reseñas
const config = require("./config/config");
const path = require("path"); // Importar el módulo path
const alergenoRoutes = require("./routes/alergenoRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Configurar middleware CORS con opciones específicas
app.use(
  cors({
    origin: "http://localhost:5173", // Especifica el origen permitido
    credentials: true, // Habilita el envío de credenciales (cookies, etc.)
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public"))); // Servir archivos estáticos desde la carpeta public

//Ruta para manejar las solicitudes al archivo index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Configurar la carpeta images como estática para servir imágenes
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configurar rutas de la API
app.use("/api", usuarioRoutes);
app.use("/api", productoRoutes);
app.use("/api", categoriaRoutes);
app.use("/api", resenaRoutes); // Asegúrate de importar y usar las rutas de reseñas
app.use("/api", alergenoRoutes);

// Manejar rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `Ruta ${req.method} ${req.url} no encontrada`,
  });
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
