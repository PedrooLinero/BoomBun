import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
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
  Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

// Componentes estilizados
const ProductCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  position: 'relative',
  background: '#ffffff'
}));

const CategoryHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  background: '#2e7d32', // Verde oscuro
  color: '#ffffff',
  borderRadius: '8px'
}));

const PriceTag = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  margin: theme.spacing(0.5),
  background: '#f5f5f5',
  border: '1px solid #e0e0e0'
}));

const AddButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  width: 56,
  height: 56,
  borderRadius: '50%',
  fontSize: '1.5rem',
  backgroundColor: '#2e7d32',
  color: '#ffffff',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  '&:hover': {
    backgroundColor: '#1b5e20',
    transform: 'scale(1.1)'
  }
}));

const CartaCompleta = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Estados para los diálogos
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener categorías
      const [catResponse, prodResponse] = await Promise.all([
        fetch("http://localhost:3000/api/categorias"),
        fetch("http://localhost:3000/api/productos")
      ]);

      if (!catResponse.ok) throw new Error("Error al obtener categorías");
      if (!prodResponse.ok) throw new Error("Error al obtener productos");

      const [catData, prodData] = await Promise.all([
        catResponse.json(),
        prodResponse.json()
      ]);

      // Procesar categorías
      const categoriasData = Array.isArray(catData) ? catData : 
                          Array.isArray(catData?.datos) ? catData.datos : [];
      
      const categoriasOrdenadas = [...categoriasData].sort((a, b) => (a.Orden || 0) - (b.Orden || 0));
      setCategorias(categoriasOrdenadas);

      // Procesar productos
      const productosData = Array.isArray(prodData) ? prodData : 
                         Array.isArray(prodData?.datos) ? prodData.datos : [];
      setProductos(productosData);

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

  const getProductosPorCategoria = (idCategoria) => {
    return productos.filter((prod) => prod.ID_Categoria == idCategoria);
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
        setProductos(productos.filter(prod => prod.ID_Producto !== productToDelete.ID_Producto));
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

  const handleCloseSnackbar = () => {
    setOpenSuccessSnackbar(false);
    setOpenErrorSnackbar(false);
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, backgroundColor: '#ffffff' }}>
        <Alert 
          severity="error"
          sx={{ mb: 4 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
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
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: '#ffffff' }}>
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            fontWeight: 700,
            color: '#2e7d32',
            mb: 1
          }}
        >
          Nuestra Carta
        </Typography>
        <Divider sx={{ width: '100px', height: '3px', backgroundColor: '#2e7d32', mx: 'auto' }} />
      </Box>

      {categorias.map((categoria) => {
        const productosCategoria = getProductosPorCategoria(categoria.ID_Categoria);
        if (productosCategoria.length === 0) return null;

        return (
          <Box key={categoria.ID_Categoria} sx={{ mb: 6 }}>
            <CategoryHeader elevation={0}>
              <Typography 
                variant="h5" 
                component="h2"
                sx={{ 
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}
              >
                {categoria.Nombre}
              </Typography>
            </CategoryHeader>

            <Grid container spacing={3}>
              {productosCategoria.map((producto) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={producto.ID_Producto}>
                  <ProductCard>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleOpenDeleteDialog(producto)}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: '#000000',
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>

                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography
                          variant="subtitle1"
                          component="h3"
                          sx={{
                            fontWeight: 600,
                            flexGrow: 1,
                            color: '#333333'
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
                              backgroundColor: '#ff9800',
                              color: '#ffffff'
                            }}
                          />
                        )}
                      </Box>

                      {producto.Descripcion && (
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 2,
                            color: '#666666',
                            fontSize: '0.875rem'
                          }}
                        >
                          {producto.Descripcion}
                        </Typography>
                      )}

                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap',
                        gap: 1
                      }}>
                        {producto.Precios?.map((precio, idx) => (
                          <PriceTag
                            key={idx}
                            label={`${precio.Formato}: ${precio.Precio}€`}
                            size="small"
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </ProductCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}

      {/* Diálogo de confirmación */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            padding: 2
          }
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
          <Button 
            onClick={handleCloseDeleteDialog}
            sx={{ color: '#666666' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteProduct}
            color="error"
            variant="contained"
            sx={{ backgroundColor: '#d32f2f' }}
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificaciones */}
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      <AddButton
        variant="contained"
        onClick={() => navigate("/añadirProducto")}
      >
        +
      </AddButton>
    </Container>
  );
};

export default CartaCompleta;