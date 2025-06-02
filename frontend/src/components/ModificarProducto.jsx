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
import { useNavigate, useParams } from "react-router-dom";
import {
  Description as DescriptionIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  RestaurantMenu as RestaurantMenuIcon,
  Image as ImageIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { apiUrl, staticUrl } from "../pages/config";

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
  const [vistaPreviaFoto, setVistaPreviaFoto] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpenModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    const fetchCategorias = fetch(apiUrl + "/categorias")
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

    const fetchAlergenos = fetch(apiUrl +"/alergenos")
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

    const fetchProducto = fetch(`${apiUrl}/productos/${id}`)
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
      });

    Promise.all([fetchCategorias, fetchAlergenos, fetchProducto]).catch(
      (err) => {
        console.error("Error en Promise.all:", err);
        setError("Error al cargar los datos iniciales");
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
        `${apiUrl}/productos/${id}`,
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #F5F5F5, #E0E0E0)",
        p: { xs: 1, sm: 2, md: 3, lg: 4 },
      }}
    >
      <Fade in timeout={1000}>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: { xs: "100%", sm: 600, md: 900, lg: 1200 },
            px: { xs: 1, sm: 2, md: 3, lg: 4 },
          }}
        >
          <Paper
            elevation={4}
            sx={{
              borderRadius: 4,
              bgcolor: "white",
              boxShadow: "0 6px 25px rgba(0, 0, 0, 0.15)",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
              maxWidth: "100%",
            }}
          >
            <Box
              sx={{
                bgcolor: "#065f46",
                p: { xs: 2, sm: 3, md: 4 },
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
                  mb: { xs: 0.5, sm: 1 },
                  fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
                }}
              >
                Cervecería Boom Bun
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: "medium",
                  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                }}
              >
                Modificar Producto
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#d1fae5",
                  mt: { xs: 0.5, sm: 1 },
                  opacity: 0.9,
                  fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                }}
              >
                Edita los detalles del producto
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ p: { xs: 2, sm: 3, md: 4, lg: 5 } }}
            >
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: { xs: 2, sm: 3, md: 3 },
                    bgcolor: "#fef2f2",
                    color: "#b91c1c",
                    borderRadius: 2,
                    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
                    fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                  }}
                >
                  {error}
                </Alert>
              )}

              <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 4 }}>
                {/* Nombre y Categoría */}
                <Grid item xs={12} sm={12} md={6} lg={6}>
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
                      mb: { xs: 2, sm: 0 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
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

                {/* Descripción */}
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

                {/* Fotos del Producto */}
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: { xs: 2, sm: 3, md: 3 },
                      color: "#333",
                      fontWeight: "bold",
                      textAlign: "center",
                      letterSpacing: "0.5px",
                      fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                    }}
                  >
                    Foto del Producto
                  </Typography>

                  {/* Container de fotos con layout responsive mejorado */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "column", md: "row" },
                      gap: { xs: 3, sm: 4, md: 5 },
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    {/* Foto actual */}
                    {producto?.Foto && (
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
                          width: {
                            xs: "280px",
                            sm: "320px",
                            md: "280px",
                            lg: "320px",
                          },
                          height: {
                            xs: "280px",
                            sm: "320px",
                            md: "280px",
                            lg: "320px",
                          },
                          cursor: "pointer",
                          transition: "transform 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.02)",
                          },
                        }}
                        onClick={() =>
                          handleOpenModal(
                            producto.Foto.startsWith("http")
                              ? producto.Foto
                              : `${staticUrl}/${producto.Foto}`
                          )
                        }
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            bgcolor: "#065f46",
                            color: "#ffffff",
                            width: "100%",
                            textAlign: "center",
                            py: { xs: 1, sm: 1.5 },
                            fontWeight: "medium",
                            fontSize: {
                              xs: "0.85rem",
                              sm: "0.9rem",
                              md: "1rem",
                            },
                          }}
                        >
                          Foto Actual
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
                          <img
                            src={
                              producto.Foto.startsWith("http")
                                ? producto.Foto
                                : `${staticUrl}/${producto.Foto}`
                            }
                            alt={datos.nombre}
                            style={{
                              width: "100vh",
                              height: "50vh",
                              objectFit: "contain",
                              borderRadius: "0 0 12px 12px",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                staticUrl + "/uploads/sin_foto.png";
                            }}
                          />
                        </Box>
                      </Box>
                    )}

                    {/* Nueva foto */}
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
                        width: {
                          xs: "280px",
                          sm: "320px",
                          md: "280px",
                          lg: "320px",
                        },
                        height: {
                          xs: "280px",
                          sm: "320px",
                          md: "280px",
                          lg: "320px",
                        },
                        position: "relative",
                        cursor: vistaPreviaFoto ? "pointer" : "pointer",
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
                          py: { xs: 1, sm: 1.5 },
                          fontWeight: "medium",
                          fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
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
                              width: "100vh",
                              height: "50vh",
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
                              gap: 2,
                            }}
                          >
                            <ImageIcon
                              sx={{
                                fontSize: { xs: 40, sm: 45, md: 50 },
                                color: "#9ca3af",
                              }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontStyle: "italic",
                                textAlign: "center",
                                px: 2,
                                fontSize: {
                                  xs: "0.8rem",
                                  sm: "0.85rem",
                                  md: "0.9rem",
                                },
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
                            bottom: 12,
                            right: 12,
                            bgcolor: "#b91c1c",
                            color: "#ffffff",
                            "&:hover": {
                              bgcolor: "#991b1b",
                            },
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.75rem",
                              md: "0.8rem",
                            },
                            px: 2,
                            py: 0.8,
                            borderRadius: "6px",
                            minWidth: "auto",
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

                {/* Alérgenos */}
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: { xs: 2, sm: 3 },
                      color: "#333",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                    }}
                  >
                    Seleccionar Alérgenos
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: { xs: 1, sm: 1.5, md: 2 },
                      justifyContent: "center",
                      p: { xs: 2, sm: 3 },
                      border: "1px solid #e5e7eb",
                      borderRadius: 2,
                      backgroundColor: "#f9fafb",
                      maxHeight: { xs: 180, sm: 200, md: 220 },
                      overflowY: "auto",
                    }}
                  >
                    {alergenos.length === 0 ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: {
                            xs: "0.8rem",
                            sm: "0.85rem",
                            md: "0.9rem",
                          },
                        }}
                      >
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
                                      : `${staticUrl}/uploads/${alergeno.imagen}`
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
                              fontSize: {
                                xs: "0.8rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                              },
                              height: { xs: 32, sm: 34, md: 36 },
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
                        mb: { xs: 1, sm: 2 },
                        color: "#333",
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                      }}
                    >
                      Formatos y Precios
                    </Typography>
                    <FormGroup
                      row
                      sx={{
                        gap: { xs: 1, sm: 2, md: 3 },
                        mb: { xs: 1, sm: 2, md: 3 },
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
                                fontSize: {
                                  xs: "0.8rem",
                                  sm: "0.9rem",
                                  md: "1rem",
                                },
                              }}
                            />
                          }
                          label={
                            formato.charAt(0).toUpperCase() + formato.slice(1)
                          }
                          sx={{
                            fontSize: {
                              xs: "0.8rem",
                              sm: "0.9rem",
                              md: "1rem",
                            },
                          }}
                        />
                      ))}
                    </FormGroup>
                    <Grid
                      container
                      spacing={{ xs: 1, sm: 2, md: 3 }}
                      justifyContent="center"
                    >
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
                                  mb: { xs: 1, sm: 2 },
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
                  mt: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 1, sm: 1.5 },
                  bgcolor: "#065f46",
                  "&:hover": {
                    bgcolor: "#047857",
                    transform: "scale(1.02)",
                    boxShadow: "0 4px 15px rgba(6, 95, 70, 0.3)",
                  },
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
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
                sx={{
                  mt: { xs: 2, sm: 3 },
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                }}
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
            fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
          }}
        >
          ¡Producto actualizado con éxito!
        </Alert>
      </Snackbar>
    </Box>
  );
}
