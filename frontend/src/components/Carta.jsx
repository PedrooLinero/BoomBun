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
import SearchIcon from "@mui/icons-material/Search";
import ShareIcon from "@mui/icons-material/Share";
import AddIcon from "@mui/icons-material/Add";
import LocalBarIcon from "@mui/icons-material/LocalBar"; // Para Cervezas
import RestaurantIcon from "@mui/icons-material/Restaurant"; // Para Tapas
import DinnerDiningIcon from "@mui/icons-material/DinnerDining"; // Para Platos
import IcecreamIcon from "@mui/icons-material/Icecream"; // Para Postres
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },
  background: "#ffffff",
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(2),
  },
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

const CartaCompleta = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isJefe, setIsJefe] = useState(false); // State to track if user is Jefe
  const navigate = useNavigate();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Mapa de íconos por categoría (ajusta según tus categorías reales)
  const categoryIcons = {
    "Cervezas": <LocalBarIcon sx={{ mr: 2, fontSize: "2rem" }} />,
    "Tapas": <RestaurantIcon sx={{ mr: 2, fontSize: "2rem" }} />,
    "Platos": <DinnerDiningIcon sx={{ mr: 2, fontSize: "2rem" }} />,
    "Postres": <IcecreamIcon sx={{ mr: 2, fontSize: "2rem" }} />,
  };

  // Check if user is logged in and has the role "Jefe"
useEffect(() => {
  const checkAuth = () => {
    const authData = localStorage.getItem("auth");
    console.log("authData:", authData);
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        console.log("parsedData:", parsedData);
        const { isAuthenticated, user } = parsedData;
        console.log("isAuthenticated:", isAuthenticated);
        console.log("user:", user);
        if (user) {
          console.log("user.tipo:", user.tipo); // Log the correct field
        }
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

  checkAuth(); // Initial check
  window.addEventListener("storage", checkAuth); // Listen for storage changes

  return () => {
    window.removeEventListener("storage", checkAuth); // Cleanup
  };
}, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [catResponse, prodResponse] = await Promise.all([
        fetch("http://localhost:3000/api/categorias"),
        fetch("http://localhost:3000/api/productos"),
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
      filtered = filtered.filter((prod) => prod.ID_Categoria == selectedCategory);
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
      const response = await fetch(
        `http://localhost:3000/api/productos/${productToDelete.ID_Producto}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.mensaje);
        setOpenSuccessSnackbar(true);
        setProductos(
          productos.filter((prod) => prod.ID_Producto !== productToDelete.ID_Producto)
        );
      } else {
        throw new Error(data.mensaje || "Error al eliminar el producto");
      }
    } catch (err) {
      setErrorMessage(err.message);
      setOpenErrorSnackbar(true);
      console.error("Error al eliminar producto:", err);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const handleShare = (producto) => {
    const shareText = `¡Mira este producto en Cervecería Boom Bun! ${producto.Nombre} - ${producto.Precios?.[0]?.Precio}€`;
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: producto.Nombre,
        text: shareText,
        url: shareUrl,
      });
    } else {
      alert("Comparte este producto: " + shareText + " " + shareUrl);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSuccessSnackbar(false);
    setOpenErrorSnackbar(false);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

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
    <Box sx={{ backgroundColor: "#F5F5F5", minHeight: "100vh", pb: 10 }}>
      {/* Banner promocional */}
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
          Descubre las mejores cervezas artesanales, tapas y platos en Cervecería Boom Bun.
        </Typography>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Barra de búsqueda y filtros */}
        <Box sx={{ mb: 4, display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
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
            sx={{ color: "#065f46", borderColor: "#065f46", backgroundColor: "white" }}
          >
            Limpiar filtros
          </Button>
        </Box>

        {selectedCategory ? (
          <Fade in timeout={1000}>
            <Box sx={{ mb: 6 }}>
              <CategoryHeader>
                {categoryIcons[categorias.find((c) => c.ID_Categoria == selectedCategory)?.Nombre] || <LocalBarIcon sx={{ mr: 2, fontSize: "2rem" }} />}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "1.25rem", md: "1.75rem" },
                  }}
                >
                  {categorias.find((c) => c.ID_Categoria == selectedCategory)?.Nombre}
                </Typography>
              </CategoryHeader>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {getProductosPorCategoria(selectedCategory).map((producto) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={producto.ID_Producto}>
                    <ProductCard>
                      <CardMedia
                        component="img"
                        height={{ xs: "180", md: "220" }}
                        image={
                          producto.ImagenURL ||
                          "https://via.placeholder.com/400x260?text=Sin+Imagen"
                        }
                        alt={producto.Nombre}
                        sx={{
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.03)",
                          },
                        }}
                      />
                      {isJefe && (
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleOpenDeleteDialog(producto)}
                          sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: "#ffffff",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            "&:hover": {
                              backgroundColor: "rgba(0,0,0,0.7)",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
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
                          {producto.Precios?.some((p) => p.Formato === "Nuevo") && (
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
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                          {producto.Precios?.map((precio, idx) => (
                            <PriceTag
                              key={idx}
                              label={`${precio.Formato}: ${precio.Precio}€`}
                              size="small"
                            />
                          ))}
                        </Box>
                        <IconButton
                          onClick={() => handleShare(producto)}
                          sx={{
                            color: "#065f46",
                            "&:hover": { color: "#047857" },
                          }}
                        >
                          <ShareIcon fontSize="small" />
                        </IconButton>
                      </CardContent>
                    </ProductCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        ) : (
          categorias.map((categoria) => {
            const productosCategoria = getProductosPorCategoria(categoria.ID_Categoria);
            if (productosCategoria.length === 0) return null;

            return (
              <Fade in timeout={1000} key={categoria.ID_Categoria}>
                <Box sx={{ mb: 6 }}>
                  <CategoryHeader>
                    {categoryIcons[categoria.Nombre] || <LocalBarIcon sx={{ mr: 2, fontSize: "2rem" }} />}
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
                      <Grid item xs={12} sm={6} md={4} lg={3} key={producto.ID_Producto}>
                        <ProductCard>
                          <CardMedia
                            component="img"
                            height={{ xs: "180", md: "220" }}
                            image={
                              producto.ImagenURL ||
                              "https://via.placeholder.com/400x260?text=Sin+Imagen"
                            }
                            alt={producto.Nombre}
                            sx={{
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.03)",
                              },
                            }}
                          />
                          {isJefe && (
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleOpenDeleteDialog(producto)}
                              sx={{
                                position: "absolute",
                                right: 8,
                                top: 8,
                                color: "#ffffff",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                "&:hover": {
                                  backgroundColor: "rgba(0,0,0,0.7)",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                          <CardContent sx={{ flexGrow: 1, p: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
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
                              {producto.Precios?.some((p) => p.Formato === "Nuevo") && (
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
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                              {producto.Precios?.map((precio, idx) => (
                                <PriceTag
                                  key={idx}
                                  label={`${precio.Formato}: ${precio.Precio}€`}
                                  size="small"
                                />
                              ))}
                            </Box>
                            <IconButton
                              onClick={() => handleShare(producto)}
                              sx={{
                                color: "#065f46",
                                "&:hover": { color: "#047857" },
                              }}
                            >
                              <ShareIcon fontSize="small" />
                            </IconButton>
                          </CardContent>
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
        <DialogTitle sx={{ fontWeight: 600 }}>Confirmar eliminación</DialogTitle>
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
        <AddButton variant="contained" onClick={() => navigate("/añadirProducto")}>
          <AddIcon />
        </AddButton>
      )}
    </Box>
  );
};

export default CartaCompleta;