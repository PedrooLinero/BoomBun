import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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
    },
    precios: {
      tapa: "",
      media: "",
      plato: "",
      unidad: "",
    },
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/categorias")
      .then((res) => {
        if (!res.ok) throw new Error(`Error al cargar categorías: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        const cats = Array.isArray(data) ? data : Array.isArray(data.datos) ? data.datos : [];
        setCategorias(cats);
      })
      .catch((err) => console.error("Error cargando categorías:", err));
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

    // Transformar datos al formato del backend
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
      Foto: null // Agregar campo Foto si es necesario
    };

    try {
      const response = await fetch(apiUrl + "/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert(responseData.mensaje);
        navigate("/");
      } else {
        alert(`Error: ${responseData.mensaje || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error de conexión: " + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" sx={{ mt: 4, mb: 3 }}>
        Añadir Producto
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Nombre"
            name="nombre"
            value={datos.nombre}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Descripción"
            name="descripcion"
            value={datos.descripcion}
            onChange={handleChange}
            fullWidth
          />

          <FormControl fullWidth required>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={datos.idCategoria}
              onChange={(e) => setDatos({ ...datos, idCategoria: e.target.value })}
              label="Categoría"
            >
              <MenuItem value="">Seleccione categoría</MenuItem>
              {categorias.map((cat) => (
                <MenuItem key={cat.ID_Categoria} value={cat.ID_Categoria}>
                  {cat.Nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormGroup row>
            {["tapa", "media", "plato", "unidad", "copa", "botella"].map((formato) => (
              <FormControlLabel
                key={formato}
                control={
                  <Checkbox
                    checked={datos.formatos[formato]}
                    onChange={handleCheckboxChange}
                    name={formato}
                  />
                }
                label={formato.charAt(0).toUpperCase() + formato.slice(1)}
              />
            ))}
          </FormGroup>

          {Object.entries(datos.formatos).map(
            ([formato, activo]) =>
              activo && (
                <TextField
                  key={formato}
                  label={`Precio ${formato}`}
                  name={formato}
                  type="number"
                  value={datos.precios[formato]}
                  onChange={handlePrecioChange}
                  fullWidth
                  required
                  inputProps={{ step: "0.01" }}
                />
              )
          )}

          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: "#c98c26", "&:hover": { bgcolor: "#a76f1f" } }}
          >
            Guardar Producto
          </Button>
        </Stack>
      </form>
    </Container>
  );
}