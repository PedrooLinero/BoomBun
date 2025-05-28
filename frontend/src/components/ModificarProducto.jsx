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
  Paper,
  Grid,
  Fade,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  Box,
  Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  Description as DescriptionIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  RestaurantMenu as RestaurantMenuIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

export default function ModificarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [alergenos, setAlergenos] = useState([]);
  const [producto, setProducto] = useState(null);
  const [datos, setDatos] = useState({
    nombre: "",
    Descripcion: "",
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
    foto: null,
    alergenosSeleccionados: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [vistaPreviaFoto, setVistaPreviaFoto] = useState(null); // Nuevo estado para la vista previa

  useEffect(() => {
    const fetchCategorias = fetch("http://localhost:3000/api/categorias")
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Error al cargar categorías")
      )
      .then((data) => {
        const cats = Array.isArray(data) ? data : data.datos || [];
        setCategorias(cats);
      })
      .catch((err) => {
        console.error("Categorías:", err);
        setError("Error al cargar categorías: " + err.message);
      });

    const fetchAlergenos = fetch("http://localhost:3000/api/alergenos")
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Error al cargar alérgenos")
      )
      .then((data) => {
        const alers = (Array.isArray(data) ? data : data.datos || []).map(
          (a) => ({
            id: Number(a.id || a.ID_Alergeno),
            nombre: a.nombre || a.Nombre,
            imagen: a.imagen || a.Imagen || null,
          })
        );
        setAlergenos(alers);
      })
      .catch((err) => {
        console.error("Alérgenos:", err);
        setError("Error al cargar alérgenos: " + err.message);
      });

    const fetchProducto = fetch(`http://localhost:3000/api/productos/${id}`)
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Error al cargar producto")
      )
      .then((data) => {
        const producto = data.datos;
        if (!producto) throw new Error("Producto no encontrado");
        const formatos = {
          tapa: false,
          media: false,
          plato: false,
          unidad: false,
          copa: false,
          botella: false,
        };
        const precios = {
          tapa: "",
          media: "",
          plato: "",
          unidad: "",
          copa: "",
          botella: "",
        };
        (producto.Precios || []).forEach((p) => {
          const formatoLower = p.Formato.toLowerCase();
          // eslint-disable-next-line no-prototype-builtins
          if (formatos.hasOwnProperty(formatoLower)) {
            formatos[formatoLower] = true;
            precios[formatoLower] = p.Precio.toString();
          }
        });
        setProducto(producto);
        setDatos({
          nombre: producto.Nombre || "",
          Descripcion: producto.Descripcion || "",
          idCategoria: producto.ID_Categoria || "",
          formatos,
          precios,
          foto: null,
          alergenosSeleccionados: (producto.Alergenos || []).map((a) =>
            Number(a.ID_Alergeno)
          ),
        });
      })
      .catch((err) => {
        console.error("Producto:", err);
        setError("Error al cargar producto: " + err.message);
      })
      .finally(() => setLoadingProduct(false));

    Promise.all([fetchCategorias, fetchAlergenos, fetchProducto]).catch(
      (err) => {
        console.error("Error en Promise.all:", err);
        setError("Error al cargar los datos iniciales");
        setLoadingProduct(false);
      }
    );
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
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

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setDatos((prev) => ({
      ...prev,
      foto: file || null,
    }));
    // Crear vista previa de la nueva foto
    if (file) {
      const urlVistaPrevia = URL.createObjectURL(file);
      setVistaPreviaFoto(urlVistaPrevia);
    } else {
      setVistaPreviaFoto(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("Nombre", datos.nombre);
    formData.append("Descripcion", datos.Descripcion || "");
    formData.append("ID_Categoria", Number(datos.idCategoria));

    const preciosArray = Object.entries(datos.formatos)
      .filter(([, activo]) => activo)
      .map(([formato]) => ({
        Formato: formato.charAt(0).toUpperCase() + formato.slice(1),
        Precio: parseFloat(datos.precios[formato]) || 0,
      }));
    formData.append("Precios", JSON.stringify(preciosArray));

    if (datos.foto) {
      formData.append("Foto", datos.foto);
    }
    if (datos.alergenosSeleccionados.length > 0) {
      formData.append(
        "Alergenos",
        JSON.stringify(
          datos.alergenosSeleccionados.map((id) => ({ ID_Alergeno: id }))
        )
      );
    }

    const formDataEntries = {};
    for (let [key, value] of formData.entries()) {
      formDataEntries[key] = value;
    }
    console.log("FormData enviado:", formDataEntries);

    try {
      const response = await fetch(
        `http://localhost:3000/api/productos/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/carta"), 2000);
      } else {
        throw new Error(data.mensaje || "Error desconocido");
      }
    } catch (error) {
      setError("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #F5F5F5, #E0E0E0)",
        }}
      >
        <CircularProgress sx={{ color: "#065f46" }} />
      </Box>
    );
  }

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
                Modificar Producto
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#d1fae5", mt: 1, opacity: 0.9 }}
              >
                Edita los detalles del producto
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ p: { xs: 3, lg: 5 } }}
            >
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

                <Grid item xs={12}>
                  <TextField
                    label="Descripción"
                    name="Descripcion"
                    value={datos.Descripcion}
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

                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      color: "#333",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Foto del Producto
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    {vistaPreviaFoto ? (
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            p: 1,
                            height: "150px",
                            backgroundColor: "#f9fafb",
                          }}
                        >
                          <img
                            src={producto.Foto}
                            alt={datos.nombre}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              borderRadius: "8px",
                              objectFit: "contain",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentElement.innerHTML =
                                "No se pudo cargar la imagen";
                            }}
                          />
                        </Box>
                      </Grid>
                    ) : producto?.Foto ? (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              p: 1,
                              height: "150px",
                              backgroundColor: "#f9fafb",
                            }}
                          >
                            <img
                              src={`http://localhost:3000/uploads/${producto.Foto}`}
                              alt={datos.nombre}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                borderRadius: "8px",
                                objectFit: "contain",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentElement.innerHTML =
                                  "No se pudo cargar la imagen";
                              }}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Cambiar foto del producto"
                            type="file"
                            name="foto"
                            onChange={handleFotoChange}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                            inputProps={{
                              accept: "image/*",
                            }}
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <ImageIcon sx={{ color: "#6b7280" }} />
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
                                "&.Mui-focused fieldset": {
                                  borderColor: "#065f46",
                                },
                                transition: "all 0.3s ease",
                              },
                            }}
                          />
                        </Grid>
                      </>
                    ) : (
                      <Grid item xs={12}>
                        <TextField
                          label="Subir foto del producto"
                          type="file"
                          name="foto"
                          onChange={handleFotoChange}
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            accept: "image/*",
                          }}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ImageIcon sx={{ color: "#6b7280" }} />
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
                              "&.Mui-focused fieldset": {
                                borderColor: "#065f46",
                              },
                              transition: "all 0.3s ease",
                            },
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      color: "#333",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Seleccionar Alérgenos
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      justifyContent: "center",
                      p: 2,
                      border: "1px solid #e5e7eb",
                      borderRadius: 2,
                      backgroundColor: "#f9fafb",
                      maxHeight: 200,
                      overflowY: "auto",
                    }}
                  >
                    {alergenos.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No hay alérgenos disponibles
                      </Typography>
                    ) : (
                      alergenos.map((alergeno) => {
                        const isSelected =
                          datos.alergenosSeleccionados.includes(alergeno.id);
                        return (
                          <Chip
                            key={alergeno.id}
                            avatar={
                              alergeno.imagen && (
                                <img
                                  src={
                                    alergeno.imagen.startsWith("http")
                                      ? alergeno.imagen
                                      : `http://localhost:3000/uploads/${alergeno.imagen}`
                                  }
                                  alt={alergeno.nombre}
                                  style={{ width: 20, height: 20 }}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              )
                            }
                            label={alergeno.nombre}
                            onClick={() => {
                              setDatos((prev) => ({
                                ...prev,
                                alergenosSeleccionados: isSelected
                                  ? prev.alergenosSeleccionados.filter(
                                      (id) => id !== alergeno.id
                                    )
                                  : [
                                      ...prev.alergenosSeleccionados,
                                      alergeno.id,
                                    ],
                              }));
                            }}
                            sx={{
                              bgcolor: isSelected ? "#065f46" : "#fff",
                              color: isSelected ? "#fff" : "#333",
                              border: `1px solid ${
                                isSelected ? "#065f46" : "#e5e7eb"
                              }`,
                              "&:hover": {
                                bgcolor: isSelected ? "#047857" : "#f1f5f9",
                              },
                              transition: "all 0.3s ease",
                              fontSize: "0.85rem",
                              height: 32,
                            }}
                          />
                        );
                      })
                    )}
                  </Box>
                </Grid>

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
                      sx={{
                        mb: 2,
                        color: "#333",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
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
                      {[
                        "tapa",
                        "media",
                        "plato",
                        "unidad",
                        "copa",
                        "botella",
                      ].map((formato) => (
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
                          label={
                            formato.charAt(0).toUpperCase() + formato.slice(1)
                          }
                        />
                      ))}
                    </FormGroup>
                    <Grid container spacing={3} justifyContent="center">
                      {Object.entries(datos.formatos).map(
                        ([formato, activo]) =>
                          activo && (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              lg={3}
                              key={formato}
                            >
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
                                    "&:hover fieldset": {
                                      borderColor: "#064e3b",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#065f46",
                                    },
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
                  borderRadius: "6px",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Actualizar Producto"
                )}
              </Button>

              <Typography
                variant="body2"
                sx={{ mt: 3, textAlign: "center", color: "#6b7280" }}
              >
                ¿No quieres modificar el producto?{" "}
                <Box
                  component="span"
                  onClick={() => navigate("/carta")}
                  sx={{
                    color: "#065f46",
                    cursor: "pointer",
                    fontWeight: "bold",
                    "&:hover": {
                      textDecoration: "underline",
                      color: "#047857",
                    },
                    transition: "color 0.3s ease",
                  }}
                >
                  Volver a la carta
                </Box>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Fade>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          sx={{
            bgcolor: "#d1fae5",
            color: "#065f46",
            borderRadius: 4,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            fontWeight: "medium",
          }}
        >
          ¡Producto actualizado con éxito!
        </Alert>
      </Snackbar>
    </Box>
  );
}
