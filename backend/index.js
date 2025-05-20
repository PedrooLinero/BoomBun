const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const usuarioRoutes = require("./routes/usuarioRoutes");
const productoRoutes = require("./routes/productoRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const resenaRoutes = require("./routes/resenaRoutes"); // Asegúrate de importar las rutas de reseñas
const config = require("./config/config");
const path = require("path"); // Importar el módulo path

const app = express();
const port = process.env.PORT || 3000;

// Configurar middleware CORS con opciones específicas
app.use(cors({
  origin: 'http://localhost:5173', // Especifica el origen permitido
  credentials: true, // Habilita el envío de credenciales (cookies, etc.)
}));

app.use(express.json());
app.use(cookieParser());

// Configurar la carpeta images como estática para servir imágenes
app.use("/images", express.static(path.join(__dirname, "images")));

// Configurar rutas de la API
app.use("/api", usuarioRoutes);
app.use("/api", productoRoutes);
app.use("/api", categoriaRoutes);
app.use("/api", resenaRoutes); // Asegúrate de importar y usar las rutas de reseñas

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
    message: 'Error interno del servidor'
  });
});

// Iniciar el servidor solo si no estamos en modo de prueba
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
}

module.exports = app;