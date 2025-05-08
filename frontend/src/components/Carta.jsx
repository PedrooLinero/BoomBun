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
} from "@mui/material";

const CartaCompleta = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener categorías
        const catResponse = await fetch("http://localhost:3000/api/categorias");
        if (!catResponse.ok) throw new Error("Error al obtener categorías");

        const catData = await catResponse.json();
        console.log("Respuesta categorías:", catData); // Para depuración

        // Manejo seguro de la respuesta
        let categoriasData = [];
        if (Array.isArray(catData)) {
          categoriasData = catData;
        } else if (catData && Array.isArray(catData.datos)) {
          categoriasData = catData.datos;
        } else {
          throw new Error("Formato de categorías no válido");
        }

        // Ordenar solo si tenemos datos
        const categoriasOrdenadas =
          categoriasData.length > 0
            ? [...categoriasData].sort(
                (a, b) => (a.Orden || 0) - (b.Orden || 0)
              )
            : [];

        setCategorias(categoriasOrdenadas);

        // Obtener productos
        const prodResponse = await fetch("http://localhost:3000/api/productos");
        if (!prodResponse.ok) throw new Error("Error al obtener productos");

        const prodData = await prodResponse.json();
        console.log("Respuesta productos:", prodData); // Para depuración

        // Manejo seguro de la respuesta de productos
        let productosData = [];
        if (Array.isArray(prodData)) {
          productosData = prodData;
        } else if (prodData && Array.isArray(prodData.datos)) { // Cambio aquí también
          productosData = prodData.datos;
        }

        setProductos(productosData);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductosPorCategoria = (idCategoria) => {
    return productos.filter((prod) => prod.ID_Categoria == idCategoria);
  };

  if (loading) {
    return (
      <Box className="d-flex justify-content-center align-items-center vh-100">
        <CircularProgress size={60} />
        <Typography variant="h6" className="ms-3">
          Cargando carta...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="d-flex justify-content-center align-items-center vh-100 flex-column">
        <Alert severity="error" className="mb-4">
          Error: {error}
        </Alert>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </Box>
    );
  }

  return (
    <div className="container py-5">
      <Typography
        variant="h2"
        component="h1"
        className="text-center mb-5 fw-bold"
        sx={{ color: "primary.main" }}
      >
        Nuestra Carta
      </Typography>

      {categorias.map((categoria) => {
        const productosCategoria = getProductosPorCategoria(
          categoria.ID_Categoria
        );

        return (
          <Box key={categoria.ID_Categoria} className="mb-5">
            <Divider className="mb-4">
              <Typography
                variant="h3"
                component="h2"
                className="text-center fw-bold"
                sx={{
                  color: "secondary.main",
                  textTransform: "uppercase",
                }}
              >
                {categoria.Nombre}
              </Typography>
            </Divider>

            <div className="row">
              {productosCategoria.map((producto) => (
                <div
                  key={producto.ID_Producto}
                  className="col-md-6 col-lg-4 mb-4"
                >
                  <Card elevation={3} sx={{ height: "100%" }}>
                    <CardContent>
                      <Box className="d-flex justify-content-between align-items-start">
                        <Typography variant="h5" component="h3">
                          {producto.Nombre}
                        </Typography>
                        {producto.Precios?.some(
                          (p) => p.Formato === "Nuevo"
                        ) && (
                          <Chip
                            label="Nuevo"
                            color="primary"
                            size="small"
                            className="ms-2"
                          />
                        )}
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="my-2"
                      >
                        {producto.Descripcion}
                      </Typography>

                      <Box className="mt-3">
                        {producto.Precios?.map((precio, idx) => (
                          <Typography
                            key={idx}
                            variant="body1"
                            className={idx === 0 ? "fw-bold" : ""}
                          >
                            {precio.Formato}: {precio.Precio}€
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </Box>
        );
      })}
    </div>
  );
};

export default CartaCompleta;