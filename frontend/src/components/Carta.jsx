import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Grid,
  Button,
  Container,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
  InputAdornment,
  Fade,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import IcecreamIcon from "@mui/icons-material/Icecream";
import CloseIcon from "@mui/icons-material/Close";
import { apiUrl } from "../pages/config";
import { staticUrl } from "../pages/config";

import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import sinFoto from "../assets/sin_foto.png";

const ProductCard = styled(Card)(() => ({
  display: "flex",
  flexDirection: "row",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },
  background: "#ffffff",
  minHeight: 230, // Altura mínima fija para todos los cards
}));

const CategoryHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: "#065f46",
  color: "#ffffff",
  borderRadius: "12px",
  textAlign: "left",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const PriceTag = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  margin: theme.spacing(0.5),
  background: "#065f46",
  color: "#ffffff",
  padding: theme.spacing(0.5, 1),
  "&:hover": {
    background: "#047857",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
  },
}));

const AddButton = styled(Button)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  width: 56,
  height: 56,
  borderRadius: "50%",
  fontSize: "1.5rem",
  backgroundColor: "#065f46",
  color: "#ffffff",
  boxShadow: "0 4px 15px rgba(6, 95, 70, 0.4)",
  "&:hover": {
    backgroundColor: "#047857",
    transform: "scale(1.1)",
  },
  transition: "all 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    width: 48,
    height: 48,
    fontSize: "1.2rem",
  },
}));

const AllergensButton = styled(Button)(() => ({
  border: "none", // Sin borde
  color: "#065f46",
  backgroundColor: "transparent",
  padding: 0,
  minWidth: "auto",
  fontSize: "0.85rem",
  textTransform: "none",
  fontWeight: 400,
  textDecoration: "underline", // Como enlace
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#047857",
    textDecoration: "underline",
    boxShadow: "none",
  },
}));

const CartaCompleta = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isJefe, setIsJefe] = useState(false);
  const [openAllergensDialog, setOpenAllergensDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  const categoryIcons = {
    Cervezas: <LocalBarIcon sx={{ mr: 2, fontSize: "2rem" }} />,
    Tapas: <RestaurantIcon sx={{ mr: 2, fontSize: "2rem" }} />,
    Platos: <DinnerDiningIcon sx={{ mr: 2, fontSize: "2rem" }} />,
  };

  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem("auth");
      if (authData) {
        try {
          const parsedData = JSON.parse(authData);
          const { isAuthenticated, user } = parsedData;
          if (isAuthenticated && user && user.tipo === "Jefe") {
            setIsJefe(true);
          } else {
            setIsJefe(false);
          }
        } catch (err) {
          console.error("Error parsing auth data:", err);
          setIsJefe(false);
        }
      } else {
        setIsJefe(false);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [catResponse, prodResponse] = await Promise.all([
        fetch(apiUrl + "/categorias"),
        fetch(apiUrl + "/productos"),
      ]);

      if (!catResponse.ok) throw new Error("Error al obtener categorías");
      if (!prodResponse.ok) throw new Error("Error al obtener productos");

      const [catData, prodData] = await Promise.all([
        catResponse.json(),
        prodResponse.json(),
      ]);

      const categoriasData = Array.isArray(catData)
        ? catData
        : Array.isArray(catData?.datos)
        ? catData.datos
        : [];
      const categoriasOrdenadas = [...categoriasData].sort(
        (a, b) => (a.Orden || 0) - (b.Orden || 0)
      );
      setCategorias(categoriasOrdenadas);

      const productosData = Array.isArray(prodData)
        ? prodData
        : Array.isArray(prodData?.datos)
        ? prodData.datos
        : [];
      setProductos(productosData);
      setFilteredProductos(productosData);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = productos;

    if (searchTerm) {
      filtered = filtered.filter((prod) =>
        prod.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (prod) => prod.ID_Categoria == selectedCategory
      );
    }

    setFilteredProductos(filtered);
  }, [searchTerm, selectedCategory, productos]);

  const getProductosPorCategoria = (idCategoria) => {
    return filteredProductos.filter((prod) => prod.ID_Categoria == idCategoria);
  };

  const handleOpenDeleteDialog = (producto) => {
    setProductToDelete(producto);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`${apiUrl}/${productToDelete.ID_Producto}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.mensaje || "Producto eliminado correctamente");
        setOpenSuccessSnackbar(true);
        setProductos(
          productos.filter(
            (prod) => prod.ID_Producto !== productToDelete.ID_Producto
          )
        );
      } else {
        throw new Error(
          data.mensaje || `Error ${response.status}: ${response.statusText}`
        );
      }
    } catch (err) {
      setErrorMessage(err.message);
      setOpenErrorSnackbar(true);
      console.error("Error al eliminar producto:", err);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenAllergensDialog = (producto) => {
    setSelectedProduct(producto);
    setOpenAllergensDialog(true);
  };

  const handleCloseAllergensDialog = () => {
    setOpenAllergensDialog(false);
    setSelectedProduct(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSuccessSnackbar(false);
    setOpenErrorSnackbar(false);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  const allAlergenos = Array.from(
    new Set(
      productos
        .flatMap((prod) => prod.Alergenos || [])
        .map((alergeno) => alergeno.Nombre)
    )
  ).map((nombre) => {
    const alergeno = productos
      .flatMap((prod) => prod.Alergenos || [])
      .find((a) => a.Nombre === nombre);
    return { Nombre: nombre, Imagen: alergeno?.Imagen };
  });

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#F5F5F5",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#065f46" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          py: 10,
          backgroundColor: "#F5F5F5",
        }}
      >
        <Alert
          severity="error"
          sx={{
            mb: 4,
            borderRadius: "12px",
            bgcolor: "#fef2f2",
            color: "#b91c1c",
          }}
          action={
            <Button
              color="inherit"
              size="large"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      {console.log("Productos:", productos)}
      <Box sx={{ backgroundColor: "#F5F5F5", minHeight: "100vh", pb: 10 }}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #065f46 0%, #047857 100%)",
            py: 4,
            textAlign: "center",
            color: "#ffffff",
            borderBottomLeftRadius: "24px",
            borderBottomRightRadius: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: "1.5rem", md: "2.25rem" },
            }}
          >
            Explora Nuestra Carta
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#e0e0e0",
              maxWidth: "600px",
              mx: "auto",
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            Descubre las mejor cerveza, tapas y platos en Cervecería Boom Bun.
          </Typography>
        </Box>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box
            sx={{
              mb: 4,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Busca tapas, platos o productos..."
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
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#065f46" },
                  "&.Mui-focused fieldset": { borderColor: "#065f46" },
                },
              }}
            />

            <FormControl
              fullWidth
              sx={{
                minWidth: 120,
                backgroundColor: "#ffffff",
                borderRadius: "8px",
              }}
            >
              <InputLabel id="category-select-label" sx={{ color: "#6b7280" }}>
                Selecciona una categoría
              </InputLabel>
              <Select
                labelId="category-select-label"
                value={selectedCategory}
                label="Selecciona una categoría"
                onChange={(e) => setSelectedCategory(e.target.value)}
                sx={{
                  "& .MuiSelect-select": {
                    color: selectedCategory ? "#1a1a1a" : "#6b7280",
                    "&:focus": { backgroundColor: "transparent" },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e5e7eb",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#065f46",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#065f46",
                  },
                }}
              >
                <MenuItem value="">
                  <em>Todas las categorías</em>
                </MenuItem>
                {categorias.map((cat) => (
                  <MenuItem key={cat.ID_Categoria} value={cat.ID_Categoria}>
                    {cat.Nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              sx={{
                color: "#065f46",
                borderColor: "#065f46",
                backgroundColor: "white",
              }}
            >
              Limpiar filtros
            </Button>
          </Box>

          {selectedCategory ? (
            <Fade in timeout={1000}>
              <Box sx={{ mb: 6 }}>
                <CategoryHeader>
                  {categoryIcons[
                    categorias.find((c) => c.ID_Categoria == selectedCategory)
                      ?.Nombre
                  ] || <LocalBarIcon sx={{ mr: 2, fontSize: "2rem" }} />}
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "1.25rem", md: "1.75rem" },
                    }}
                  >
                    {
                      categorias.find((c) => c.ID_Categoria == selectedCategory)
                        ?.Nombre
                    }
                  </Typography>
                </CategoryHeader>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {getProductosPorCategoria(selectedCategory).map(
                    (producto) => (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={4}
                        key={producto.ID_Producto}
                      >
                        <ProductCard>
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "stretch",
                            }}
                          >
                            <Box sx={{ flex: 1, p: 2 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    flexGrow: 1,
                                    color: "#1a1a1a",
                                    fontSize: { xs: "1rem", md: "1.25rem" },
                                  }}
                                >
                                  {producto.Nombre}
                                </Typography>
                                {producto.Precios?.some(
                                  (p) => p.Formato === "Nuevo"
                                ) && (
                                  <Chip
                                    label="Nuevo"
                                    size="small"
                                    sx={{
                                      ml: 1,
                                      fontWeight: 600,
                                      backgroundColor: "#ff6b6b",
                                      color: "#ffffff",
                                      fontSize: { xs: "0.7rem", md: "0.8rem" },
                                    }}
                                  />
                                )}
                              </Box>
                              {producto.Descripcion && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    mb: 2,
                                    color: "#666666",
                                    lineHeight: 1.5,
                                    fontSize: { xs: "0.85rem", md: "0.9rem" },
                                  }}
                                >
                                  {producto.Descripcion}
                                </Typography>
                              )}
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                  mb: 2,
                                }}
                              >
                                {producto.Precios?.map((precio, idx) => (
                                  <PriceTag
                                    key={idx}
                                    label={`${precio.Formato}: ${precio.Precio}€`}
                                    size="small"
                                  />
                                ))}
                              </Box>
                              <Box
                                sx={{ borderTop: "1px solid #e0e0e0", my: 1 }}
                              />
                              <AllergensButton
                                onClick={() =>
                                  handleOpenAllergensDialog(producto)
                                }
                              >
                                Ver Alérgenos
                              </AllergensButton>
                            </Box>
                            <CardMedia
                              component="img"
                              sx={{
                                width: 200,
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                                margin: 0,
                                padding: 0,
                                transition: "transform 0.3s ease",
                                cursor: "pointer",
                                "&:hover": {
                                  transform: "scale(1.03)",
                                },
                              }}
                              image={producto.Foto || sinFoto}
                              alt={producto.Nombre}
                              onClick={() => {
                                setSelectedImage(producto.Foto || sinFoto);
                                setOpenImageModal(true);
                              }}
                            />
                            {isJefe && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  right: 8,
                                  top: 8,
                                  display: "flex",
                                  gap: 1,
                                }}
                              >
                                <IconButton
                                  aria-label="edit"
                                  onClick={() =>
                                    navigate(
                                      `/modificar/${producto.ID_Producto}`
                                    )
                                  }
                                  sx={{
                                    color: "#ffffff",
                                    backgroundColor: "rgba(0,0,0,0.5)",
                                    "&:hover": {
                                      backgroundColor: "rgba(0,0,0,0.7)",
                                    },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  onClick={() =>
                                    handleOpenDeleteDialog(producto)
                                  }
                                  sx={{
                                    color: "#ffffff",
                                    backgroundColor: "rgba(0,0,0,0.5)",
                                    "&:hover": {
                                      backgroundColor: "rgba(0,0,0,0.7)",
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                        </ProductCard>
                      </Grid>
                    )
                  )}
                </Grid>
              </Box>
            </Fade>
          ) : (
            categorias.map((categoria) => {
              const productosCategoria = getProductosPorCategoria(
                categoria.ID_Categoria
              );
              if (productosCategoria.length === 0) return null;

              return (
                <Fade in timeout={1000} key={categoria.ID_Categoria}>
                  <Box sx={{ mb: 6 }}>
                    <CategoryHeader>
                      {categoryIcons[categoria.Nombre] || (
                        <LocalBarIcon sx={{ mr: 2, fontSize: "2rem" }} />
                      )}
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "1.25rem", md: "1.75rem" },
                        }}
                      >
                        {categoria.Nombre}
                      </Typography>
                    </CategoryHeader>
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                      {productosCategoria.map((producto) => (
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={4}
                          key={producto.ID_Producto}
                        >
                          <ProductCard>
                            <Box
                              sx={{
                                position: "relative",
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "stretch",
                              }}
                            >
                              <Box sx={{ flex: 1, p: 2 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 600,
                                      flexGrow: 1,
                                      color: "#1a1a1a",
                                      fontSize: { xs: "1rem", md: "1.25rem" },
                                    }}
                                  >
                                    {producto.Nombre}
                                  </Typography>
                                  {producto.Precios?.some(
                                    (p) => p.Formato === "Nuevo"
                                  ) && (
                                    <Chip
                                      label="Nuevo"
                                      size="small"
                                      sx={{
                                        ml: 1,
                                        fontWeight: 600,
                                        backgroundColor: "#ff6b6b",
                                        color: "#ffffff",
                                        fontSize: {
                                          xs: "0.7rem",
                                          md: "0.8rem",
                                        },
                                      }}
                                    />
                                  )}
                                </Box>
                                {producto.Descripcion && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mb: 2,
                                      color: "#666666",
                                      lineHeight: 1.5,
                                      fontSize: { xs: "0.85rem", md: "0.9rem" },
                                    }}
                                  >
                                    {producto.Descripcion}
                                  </Typography>
                                )}
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    mb: 2,
                                  }}
                                >
                                  {producto.Precios?.map((precio, idx) => (
                                    <PriceTag
                                      key={idx}
                                      label={`${precio.Formato}: ${precio.Precio}€`}
                                      size="small"
                                    />
                                  ))}
                                </Box>
                                <Box
                                  sx={{ borderTop: "1px solid #e0e0e0", my: 1 }}
                                />
                                <AllergensButton
                                  onClick={() =>
                                    handleOpenAllergensDialog(producto)
                                  }
                                >
                                  Ver Alérgenos
                                </AllergensButton>
                              </Box>
                              <CardMedia
                                component="img"
                                sx={{
                                  width: 200,
                                  height: "100%",
                                  objectFit: "cover",
                                  display: "block",
                                  margin: 0,
                                  padding: 0,
                                  transition: "transform 0.3s ease",
                                  cursor: "pointer",
                                  "&:hover": {
                                    transform: "scale(1.03)",
                                  },
                                }}
                                image={
                                  producto.Foto ||
                                  sinFoto // Si producto.Foto es falsy, usa sinFoto
                                }
                                alt={producto.Nombre}
                                onClick={() => {
                                  setSelectedImage(producto.Foto || sinFoto);
                                  setOpenImageModal(true);
                                }}
                              />
                              {isJefe && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    right: 8,
                                    top: 8,
                                    display: "flex",
                                    gap: 1,
                                  }}
                                >
                                  <IconButton
                                    aria-label="edit"
                                    onClick={() =>
                                      navigate(
                                        "/modificar/" + producto.ID_Producto
                                      )
                                    }
                                    sx={{
                                      color: "#ffffff",
                                      backgroundColor: "rgba(0,0,0,0.5)",
                                      "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.7)",
                                      },
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() =>
                                      handleOpenDeleteDialog(producto)
                                    }
                                    sx={{
                                      color: "#ffffff",
                                      backgroundColor: "rgba(0,0,0,0.5)",
                                      "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.7)",
                                      },
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                          </ProductCard>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Fade>
              );
            })
          )}
        </Container>

        <Box
          sx={{
            backgroundColor: "#ffffff",
            padding: 3,
            borderTop: "1px solid #e0e0e0",
            marginTop: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: "#1a1a1a",
              textAlign: "center",
            }}
          >
            Leyenda de Alérgenos
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {allAlergenos.map((alergeno, index) => (
              <Chip
                key={index}
                icon={
                  alergeno.Imagen ? (
                    <img
                      src={alergeno.Imagen}
                      alt={alergeno.Nombre}
                      style={{ width: 20, height: 20 }}
                    />
                  ) : null
                }
                label={alergeno.Nombre}
                size="small"
                sx={{
                  backgroundColor: "#fff3e0",
                  color: "#333",
                  fontSize: { xs: "0.7rem", md: "0.8rem" },
                }}
              />
            ))}
          </Box>
        </Box>

        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          PaperProps={{
            sx: {
              borderRadius: "8px",
              padding: 2,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            Confirmar eliminación
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de eliminar el producto "{productToDelete?.Nombre}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} sx={{ color: "#666666" }}>
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteProduct}
              color="error"
              variant="contained"
              sx={{ backgroundColor: "#d32f2f" }}
              autoFocus
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openAllergensDialog}
          onClose={handleCloseAllergensDialog}
          PaperProps={{
            sx: {
              borderRadius: "8px",
              padding: 2,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            Alérgenos de {selectedProduct?.Nombre}
          </DialogTitle>
          <DialogContent>
            {selectedProduct?.Alergenos && selectedProduct.Alergenos.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedProduct.Alergenos.map((alergeno) => (
                  <Chip
                    key={alergeno.ID_Alergeno}
                    label={alergeno.Nombre}
                    size="small"
                    icon={
                      alergeno.Imagen ? (
                        <img
                          src={alergeno.Imagen}
                          alt={alergeno.Nombre}
                          style={{ width: 20, height: 20 }}
                        />
                      ) : null
                    }
                    sx={{
                      backgroundColor: "#fff3e0",
                      color: "#333",
                      fontSize: { xs: "0.7rem", md: "0.8rem" },
                    }}
                  />
                ))}
              </Box>
            ) : (
              <DialogContentText>
                Este producto no contiene alérgenos.
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAllergensDialog} sx={{ color: "red" }}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openImageModal}
          onClose={() => setOpenImageModal(false)}
          PaperProps={{
            sx: {
              borderRadius: "16px",
              background: "rgba(0,0,0,0.85)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "hidden",
            },
          }}
        >
          <IconButton
            aria-label="cerrar"
            onClick={() => setOpenImageModal(false)}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "#fff",
              background: "rgba(0,0,0,0.4)",
              zIndex: 2,
              "&:hover": { background: "rgba(0,0,0,0.7)" },
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              minWidth: "60vw",
              p: 2,
            }}
          >
            <img
              src={selectedImage}
              alt="Producto ampliado"
              style={{
                maxWidth: "80vw",
                maxHeight: "80vh",
                borderRadius: "12px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                objectFit: "contain",
              }}
            />
          </Box>
        </Dialog>

        <Snackbar
          open={openSuccessSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ bgcolor: "#d1fae5", color: "#065f46" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={openErrorSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ bgcolor: "#fef2f2", color: "#b91c1c" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>

        {isJefe && (
          <AddButton
            variant="contained"
            onClick={() => navigate("/añadirProducto")}
          >
            <AddIcon />
          </AddButton>
        )}
      </Box>
    </>
  );
};

export default CartaCompleta;
