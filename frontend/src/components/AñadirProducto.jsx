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
  Modal,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Description as DescriptionIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  RestaurantMenu as RestaurantMenuIcon,
  Image as ImageIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { apiUrl } from "../pages/config";

export default function AñadirProducto() {
  const [categorias, setCategorias] = useState([]);
  const [alergenos, setAlergenos] = useState([]);
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
    foto: null,
    alergenosSeleccionados: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [vistaPreviaFoto, setVistaPreviaFoto] = useState(null); // Estado para la vista previa
  const [openModal, setOpenModal] = useState(false); // Estado para el modal
  const [selectedImage, setSelectedImage] = useState(""); // Imagen seleccionada para el modal

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
        console.error(err);
        setError("Error al cargar categorías: " + err.message);
      });

    const fetchAlergenos = fetch("http://localhost:3000/api/alergenos")
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Error al cargar alérgenos")
      )
      .then((data) => {
        const alers = data.datos.map((a) => ({
          id: a.id,
          nombre: a.nombre,
          imagen: a.imagen || null,
        }));
        setAlergenos(alers);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar alérgenos: " + err.message);
      });

    Promise.all([fetchCategorias, fetchAlergenos]);
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

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setDatos((prev) => ({
      ...prev,
      foto: file || null,
    }));
    if (file) {
      const urlVistaPrevia = URL.createObjectURL(file);
      setVistaPreviaFoto(urlVistaPrevia);
    } else {
      setVistaPreviaFoto(null);
    }
  };

  const handleOpenModal = (image) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("Nombre", datos.nombre);
    formData.append("Descripcion", datos.descripcion);
    formData.append("ID_Categoria", Number(datos.idCategoria));
    formData.append(
      "Precios",
      JSON.stringify(
        Object.entries(datos.formatos)
          .filter(([, activo]) => activo)
          .map(([formato]) => ({
            Formato: formato.charAt(0).toUpperCase() + formato.slice(1),
            Precio: parseFloat(datos.precios[formato]) || 0,
          }))
      )
    );
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

    try {
      const response = await fetch(apiUrl + "/productos", {
        method: "POST",
        body: formData,
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

                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      color: "#333",
                      fontWeight: "bold",
                      textAlign: "center",
                      letterSpacing: "0.5px",
                      fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                    }}
                  >
                    Foto del Producto
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: "2px solid #e5e7eb",
                        bgcolor: "#fafafa",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        width: { xs: 200, sm: 220, md: 300 },
                        height: { xs: 200, sm: 220, md: 300 },
                        position: "relative",
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      }}
                      onClick={() => {
                        if (vistaPreviaFoto) {
                          handleOpenModal(vistaPreviaFoto);
                        } else {
                          document.getElementById("file-input").click();
                        }
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          bgcolor: "#065f46",
                          color: "#ffffff",
                          width: "100%",
                          textAlign: "center",
                          py: { xs: 0.5, sm: 1 },
                          fontWeight: "medium",
                          fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                        }}
                      >
                        Nueva Foto
                      </Typography>
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        {vistaPreviaFoto ? (
                          <img
                            src={vistaPreviaFoto}
                            alt="Vista previa"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              borderRadius: "0 0 12px 12px",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: "#f1f5f9",
                              gap: 1,
                            }}
                          >
                            <ImageIcon
                              sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: "#9ca3af" }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontStyle: "italic",
                                textAlign: "center",
                                px: 2,
                                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                              }}
                            >
                              Selecciona una imagen
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      {vistaPreviaFoto && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVistaPreviaFoto(null);
                            setDatos((prev) => ({ ...prev, foto: null }));
                            document.getElementById("file-input").value = "";
                          }}
                          sx={{
                            position: "absolute",
                            bottom: 10,
                            right: 10,
                            bgcolor: "#b91c1c",
                            color: "#ffffff",
                            "&:hover": {
                              bgcolor: "#991b1b",
                            },
                            fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" },
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "6px",
                          }}
                        >
                          Eliminar
                        </Button>
                      )}
                    </Box>
                  </Box>
                  <input
                    id="file-input"
                    type="file"
                    name="foto"
                    onChange={handleFotoChange}
                    accept="image/*"
                    style={{ display: "none" }}
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
                    {alergenos.map((alergeno) => {
                      const isSelected = datos.alergenosSeleccionados.includes(
                        alergeno.id
                      );
                      return (
                        <Chip
                          key={alergeno.id}
                          avatar={
                            alergeno.imagen && (
                              <img
                                src={
                                  alergeno.imagen.startsWith("http")
                                    ? alergeno.imagen
                                    : `http://localhost:3000/${alergeno.imagen}`
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
                                : [...prev.alergenosSeleccionados, alergeno.id],
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
                    })}
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

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "relative",
              maxWidth: { xs: "90vw", sm: "80vw", md: "70vw" },
              maxHeight: "90vh",
              bgcolor: "transparent",
              outline: "none",
            }}
          >
            <img
              src={selectedImage}
              alt="Imagen ampliada"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                bgcolor: "rgba(0, 0, 0, 0.5)",
                color: "#ffffff",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.7)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}