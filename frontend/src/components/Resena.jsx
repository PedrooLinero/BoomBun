import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Fade,
  Alert,
  Rating,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import StarIcon from "@mui/icons-material/Star";
import SortIcon from "@mui/icons-material/Sort";
import { apiUrl } from "../pages/config";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";

const isAuthenticated = () => {
  const authData = localStorage.getItem("auth");
  if (authData) {
    const { isAuthenticated } = JSON.parse(authData);
    return isAuthenticated;
  }
  return false;
};

function Resena() {
  const [reseñas, setReseñas] = useState([]);
  const [filteredReseñas, setFilteredReseñas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newReseña, setNewReseña] = useState("");
  const [newPuntuacion, setNewPuntuacion] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [auth, setAuth] = useState(isAuthenticated());
  const [filterRating, setFilterRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevancia");
  const [anchorEl, setAnchorEl] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getResenas() {
      try {
        setLoading(true);
        const response = await fetch(apiUrl + "/resenas", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.ok) {
            setReseñas(data.datos || []);
            setFilteredReseñas(data.datos || []);
          } else {
            setError("Error en la respuesta: " + data.mensaje);
          }
        } else {
          setError("Error al obtener las reseñas. Código: " + response.status);
        }
      } catch (err) {
        setError("Error en la solicitud: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    async function getProducts() {
      try {
        const response = await fetch(apiUrl + "/productos", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.ok) {
            setProducts(data.datos || []);
          } else {
            setError("Error al obtener los productos: " + data.mensaje);
          }
        } else {
          setError(
            "Error al obtener los productos. Código: " + response.status
          );
        }
      } catch (err) {
        setError("Error en la solicitud de productos: " + err.message);
      }
    }

    getResenas();
    getProducts();
  }, []);

  useEffect(() => {
    let filtered = reseñas.filter(
      (reseña) =>
        reseña.texto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reseña.usuario?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterRating > 0) {
      filtered = filtered.filter((reseña) => reseña.puntuacion >= filterRating);
    }

    if (sortBy === "relevancia") {
      filtered.sort(
        (a, b) =>
          b.puntuacion * 0.7 +
          new Date(b.fecha).getTime() * 0.3 -
          (a.puntuacion * 0.7 + new Date(a.fecha).getTime() * 0.3)
      );
    } else if (sortBy === "puntuacionDesc") {
      filtered.sort((a, b) => b.puntuacion - a.puntuacion);
    } else if (sortBy === "puntuacionAsc") {
      filtered.sort((a, b) => a.puntuacion - b.puntuacion);
    } else if (sortBy === "fecha") {
      filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }

    setFilteredReseñas(filtered);
  }, [searchTerm, filterRating, sortBy, reseñas]);

  const handleSubmitReseña = async () => {
    if (!newReseña.trim() || newPuntuacion === 0 || !selectedProduct) {
      setError(
        "Por favor, completa todos los campos: reseña, puntuación y producto."
      );
      return;
    }

    const authData = localStorage.getItem("auth");
    let ID_Usuario = null;
    if (authData) {
      const parsed = JSON.parse(authData);
      ID_Usuario = parsed?.user?.id || parsed?.ID_Usuario || null;
    }

    if (!ID_Usuario) {
      setError("No se pudo obtener el usuario autenticado.");
      return;
    }

    try {
      const response = await fetch(apiUrl + "/resenas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID_Usuario: ID_Usuario,
          ID_Producto: selectedProduct,
          Texto: newReseña,
          Puntuacion: Number(newPuntuacion),
        }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.ok) {
          setReseñas([...reseñas, data.datos]);
          setNewReseña("");
          setNewPuntuacion(0);
          setSelectedProduct("");
          setSuccess(true); // Mostrar el snackbar
        } else {
          setError("Error al añadir la reseña: " + data.mensaje);
        }
      } else {
        setError("Error al añadir la reseña. Código: " + response.status);
      }
    } catch (err) {
      setError("Error en la solicitud: " + err.message);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (option) => {
    setSortBy(option);
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #F5F5F5, #E0E0E0)",
        py: { xs: 4, sm: 6 },
      }}
    >
      <Fade in timeout={1000}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h1"
            sx={{
              mb: 6,
              textAlign: "center",
              color: "#1a1a1a",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            Cervecería Boom Bun - Reseñas de Nuestros Clientes
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 4,
                bgcolor: "#fef2f2",
                color: "#b91c1c",
                borderRadius: 2,
                boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
              }}
            >
              {error}
            </Alert>
          )}

          {/* Filtros y Buscador */}
          <Box
            sx={{
              mb: 6,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Busca reseñas por usuario o texto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#6b7280" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                "& .MuiInputLabel-root": {
                  color: "#065f46",
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#065f46",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#064e3b" },
                  "&.Mui-focused fieldset": { borderColor: "#065f46" },
                  transition: "all 0.3s ease",
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <Chip
                  key={rating}
                  label={rating === 0 ? "Todas" : `${rating} estrellas o más`}
                  onClick={() => setFilterRating(rating)}
                  color={filterRating === rating ? "primary" : "default"}
                  sx={{
                    bgcolor: filterRating === rating ? "#065f46" : "#e5e7eb",
                    color: filterRating === rating ? "#ffffff" : "#1a1a1a",
                    "&:hover": {
                      bgcolor: filterRating === rating ? "#047857" : "#d1d5db",
                    },
                  }}
                />
              ))}
            </Box>
            <IconButton
              onClick={handleMenuClick}
              sx={{
                bgcolor: "#065f46",
                color: "#ffffff",
                "&:hover": { bgcolor: "#047857" },
              }}
            >
              <SortIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => handleMenuClose("relevancia")}>
                Más relevante
              </MenuItem>
              <MenuItem onClick={() => handleMenuClose("puntuacionDesc")}>
                Puntuación (mayor a menor)
              </MenuItem>
              <MenuItem onClick={() => handleMenuClose("puntuacionAsc")}>
                Puntuación (menor a mayor)
              </MenuItem>
              <MenuItem onClick={() => handleMenuClose("fecha")}>
                Fecha (más reciente)
              </MenuItem>
            </Menu>
          </Box>

          {/* Lista de reseñas */}
          {filteredReseñas.length === 0 ? (
            <Typography
              variant="body1"
              color="#666666"
              textAlign="center"
              sx={{ py: 4 }}
            >
              No hay reseñas disponibles.
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {filteredReseñas.map((reseña) => (
                <Grid item xs={12} key={reseña.id}>
                  <Card
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      bgcolor: "#ffffff",
                      borderRadius: 2,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                      },
                      p: 2,
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#065f46", mr: 2 }}>
                      {reseña.usuario?.charAt(0) || "A"}
                    </Avatar>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: "#1a1a1a" }}
                        >
                          {reseña.usuario || "Anónimo"}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Rating
                            value={reseña.puntuacion || 0}
                            readOnly
                            precision={0.5}
                            emptyIcon={
                              <StarIcon
                                style={{ opacity: 0.55 }}
                                fontSize="inherit"
                              />
                            }
                          />
                          <Typography
                            variant="body2"
                            sx={{ ml: 1, color: "#666666" }}
                          >
                            {reseña.puntuacion || "Sin puntuación"}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#666666", mb: 2, fontStyle: "italic" }}
                      >
                        {reseña.texto || "Sin comentario"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#90A4AE" }}>
                        {reseña.fecha} - Producto:{" "}
                        {reseña.producto || "Desconocido"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Formulario para dejar reseña */}
          {auth ? (
            <Box
              sx={{
                mt: 6,
                p: { xs: 0.5, sm: 1 }, // Further reduced padding to make it even thinner vertically
                bgcolor: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                border: "1px solid #e5e7eb",
                maxWidth: { xs: "100%", sm: 800, md: 1200 },
                width: "100%",
                mx: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#1a1a1a",
                  mb: 3,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Deja tu reseña
              </Typography>

              {/* Puntuación */}
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Puntuación:
                </Typography>
                <Rating
                  value={newPuntuacion}
                  onChange={(event, newValue) => setNewPuntuacion(newValue)}
                  precision={0.5}
                  size="large"
                  sx={{ fontSize: 36 }}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
              </Box>

              {/* Select de productos */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="product-select-label">
                  Selecciona un producto
                </InputLabel>
                <Select
                  labelId="product-select-label"
                  value={selectedProduct}
                  label="Selecciona un producto"
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  sx={{
                    bgcolor: "#f9fafb",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#e5e7eb" },
                      "&:hover fieldset": { borderColor: "#064e3b" },
                      "&.Mui-focused fieldset": { borderColor: "#065f46" },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Selecciona un producto</em>
                  </MenuItem>
                  {products.map((product) => (
                    <MenuItem
                      key={product.ID_Producto}
                      value={product.ID_Producto}
                    >
                      {product.Nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Textarea de reseña */}
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Escribe tu reseña aquí..."
                value={newReseña}
                onChange={(e) => setNewReseña(e.target.value)}
                sx={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  mb: 3,
                  "& .MuiInputLabel-root": {
                    color: "#065f46",
                    fontWeight: "bold",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#065f46",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#e5e7eb" },
                    "&:hover fieldset": { borderColor: "#064e3b" },
                    "&.Mui-focused fieldset": { borderColor: "#065f46" },
                    transition: "all 0.3s ease",
                  },
                }}
              />

              {/* Botón enviar */}
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleSubmitReseña}
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.5,
                  bgcolor: "#065f46",
                  "&:hover": {
                    bgcolor: "#047857",
                    transform: "scale(1.02)",
                    boxShadow: "0 4px 15px rgba(6, 95, 70, 0.3)",
                  },
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  borderRadius: 2,
                  letterSpacing: 1,
                }}
              >
                Enviar reseña
              </Button>
            </Box>
          ) : (
            <Box sx={{ mt: 6, textAlign: "center" }}>
              <Alert
                severity="info"
                sx={{
                  bgcolor: "#e6f3f7",
                  color: "#065f46",
                  borderRadius: 2,
                  boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
                }}
              >
                Debes iniciar sesión para dejar una reseña.{" "}
                <Button
                  variant="text"
                  onClick={() => navigate("/login")}
                  sx={{ color: "#065f46", "&:hover": { color: "#047857" } }}
                >
                  Inicia sesión aquí
                </Button>
              </Alert>
            </Box>
          )}
          <Snackbar
            open={success}
            autoHideDuration={2500}
            onClose={() => setSuccess(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              severity="success"
              sx={{
                bgcolor: "#d1fae5",
                color: "#065f46",
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                fontWeight: "medium",
              }}
              onClose={() => setSuccess(false)}
            >
              ¡Tu reseña ha sido publicada con éxito!
            </Alert>
          </Snackbar>
        </Container>
      </Fade>
    </Box>
  );
}

export default Resena;
