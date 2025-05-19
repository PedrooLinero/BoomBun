import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Stack,
  Paper,
  Grid,
  Fade,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Description as DescriptionIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  RestaurantMenu as RestaurantMenuIcon,
} from "@mui/icons-material";
import { apiUrl } from "../pages/config";

export default function AñadirProducto() {
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    nombre: "",
    descripcion: "",
    idCategoria: "",
    formatos: {
      tapa: false,
      media: false,
      plato: false,
      unidad: false,
      copa: false,
      botella: false,
    },
    precios: {
      tapa: "",
      media: "",
      plato: "",
      unidad: "",
      copa: "",
      botella: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/categorias")
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Error al cargar categorías")
      )
      .then((data) => {
        const cats = Array.isArray(data) ? data : data.datos || [];
        setCategorias(cats);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar categorías: " + err.message);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setDatos((prev) => ({
      ...prev,
      formatos: { ...prev.formatos, [name]: checked },
      precios: { ...prev.precios, [name]: checked ? prev.precios[name] : "" },
    }));
  };

  const handlePrecioChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({
      ...prev,
      precios: { ...prev.precios, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const requestBody = {
      Nombre: datos.nombre,
      Descripcion: datos.descripcion,
      ID_Categoria: Number(datos.idCategoria),
      Precios: Object.entries(datos.formatos)
        .filter(([, activo]) => activo)
        .map(([formato]) => ({
          Formato: formato.charAt(0).toUpperCase() + formato.slice(1),
          Precio: parseFloat(datos.precios[formato]) || 0,
        })),
      Foto: null,
    };

    try {
      const response = await fetch(apiUrl + "/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        throw new Error(data.mensaje || "Error desconocido");
      }
    } catch (error) {
      setError("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #F5F5F5, #E0E0E0)",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Fade in timeout={1000}>
        <Container maxWidth={false} sx={{ maxWidth: { xs: 600, lg: 1200 } }}>
          <Paper
            elevation={4}
            sx={{
              borderRadius: 4,
              bgcolor: "white",
              boxShadow: "0 6px 25px rgba(0, 0, 0, 0.15)",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            {/* Encabezado */}
            <Box
              sx={{
                bgcolor: "#065f46",
                p: 4,
                textAlign: "center",
                borderBottom: "3px solid #047857",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  letterSpacing: 1,
                  mb: 1,
                }}
              >
                Cervecería Boom Bun
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "white", fontWeight: "medium" }}
              >
                Añadir Nuevo Producto
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#d1fae5", mt: 1, opacity: 0.9 }}
              >
                Agrega un nuevo producto a la carta
              </Typography>
            </Box>

            {/* Formulario */}
            <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, lg: 5 } }}>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    bgcolor: "#fef2f2",
                    color: "#b91c1c",
                    borderRadius: 2,
                    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  {error}
                </Alert>
              )}

              <Grid container spacing={4}>
                {/* Primera fila: Nombre y Categoría */}
                <Grid item xs={12} lg={6}>
                  <TextField
                    label="Nombre"
                    name="nombre"
                    placeholder="Nombre del producto"
                    value={datos.nombre}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RestaurantMenuIcon sx={{ color: "#6b7280" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
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
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel sx={{ color: "#065f46", fontWeight: "bold" }}>
                      Categoría
                    </InputLabel>
                    <Select
                      name="idCategoria"
                      value={datos.idCategoria}
                      label="Categoría"
                      onChange={handleChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <CategoryIcon sx={{ color: "#6b7280", mr: 1 }} />
                        </InputAdornment>
                      }
                      sx={{
                        "& .MuiSelect-select": { color: "#333" },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#e5e7eb",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#064e3b",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#065f46",
                        },
                      }}
                    >
                      <MenuItem value="">Seleccione categoría</MenuItem>
                      {categorias.map((cat) => (
                        <MenuItem
                          key={cat.ID_Categoria}
                          value={cat.ID_Categoria}
                        >
                          {cat.Nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Segunda fila: Descripción */}
                <Grid item xs={12}>
                  <TextField
                    label="Descripción"
                    name="descripcion"
                    value={datos.descripcion}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={3}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon sx={{ color: "#6b7280" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
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
                </Grid>

                {/* Formatos y Precios */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: "#333", fontWeight: "bold", textAlign: "center" }}
                    >
                      Formatos y Precios
                    </Typography>
                    <FormGroup
                      row
                      sx={{
                        gap: { xs: 2, lg: 3 },
                        mb: 3,
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {["tapa", "media", "plato", "unidad", "copa", "botella"].map((formato) => (
                        <FormControlLabel
                          key={formato}
                          control={
                            <Checkbox
                              checked={datos.formatos[formato]}
                              onChange={handleCheckboxChange}
                              name={formato}
                              sx={{
                                color: "#065f46",
                                "&.Mui-checked": { color: "#065f46" },
                              }}
                            />
                          }
                          label={formato.charAt(0).toUpperCase() + formato.slice(1)}
                        />
                      ))}
                    </FormGroup>
                    <Grid container spacing={3} justifyContent="center">
                      {Object.entries(datos.formatos).map(
                        ([formato, activo]) =>
                          activo && (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={formato}>
                              <TextField
                                label={`Precio ${formato}`}
                                name={formato}
                                type="number"
                                value={datos.precios[formato]}
                                onChange={handlePrecioChange}
                                fullWidth
                                required
                                inputProps={{ step: "0.01" }}
                                variant="outlined"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <MoneyIcon sx={{ color: "#6b7280" }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
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
                            </Grid>
                          )
                      )}
                    </Grid>
                  </Box>
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 4,
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
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Guardar Producto"
                )}
              </Button>

              <Typography
                variant="body2"
                sx={{ mt: 3, textAlign: "center", color: "#6b7280" }}
              >
                ¿No quieres añadir un producto?{" "}
                <Box
                  component="span"
                  onClick={() => navigate("/")}
                  sx={{
                    color: "#065f46",
                    cursor: "pointer",
                    fontWeight: "medium",
                    "&:hover": {
                      textDecoration: "underline",
                      color: "#047857",
                    },
                    transition: "color 0.3s ease",
                  }}
                >
                  Volver al inicio
                </Box>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Fade>

      <Snackbar
        open={success}
        autoHideDuration={1500}
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
        >
          ¡Producto añadido con éxito!
        </Alert>
      </Snackbar>
    </Box>
  );
}