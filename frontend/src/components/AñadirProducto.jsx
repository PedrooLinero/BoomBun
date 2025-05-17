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
      .then((res) => res.ok ? res.json() : Promise.reject("Error al cargar categorías"))
      .then((data) => {
        const cats = Array.isArray(data) ? data : data.datos || [];
        setCategorias(cats);
      })
      .catch((err) => console.error(err));
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
        alert(data.mensaje);
        navigate("/");
      } else {
        alert(`Error: ${data.mensaje || "Error desconocido"}`);
      }
    } catch (error) {
      alert("Error de conexión: " + error.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", py: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, bgcolor: "white" }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: "#333", fontWeight: "bold", mb: 4 }}>
          Añadir Nuevo Producto
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <TextField
              label="Nombre"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{
                "& .MuiInputLabel-root": { color: "#c98c26", fontWeight: "bold" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#c98c26" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#c98c26" },
                },
              }}
            />

            <TextField
              label="Descripción"
              name="descripcion"
              value={datos.descripcion}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={2}
              variant="outlined"
              sx={{
                "& .MuiInputLabel-root": { color: "#c98c26", fontWeight: "bold" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#c98c26" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#c98c26" },
                },
              }}
            />

            <FormControl fullWidth required variant="outlined">
              <InputLabel sx={{ color: "#c98c26", fontWeight: "bold" }}>Categoría</InputLabel>
              <Select
                name="idCategoria"
                value={datos.idCategoria}
                label="Categoría"
                onChange={handleChange}
                sx={{
                  "& .MuiSelect-select": { color: "#333" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c98c26" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#a76f1f" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#c98c26" },
                }}
              >
                <MenuItem value="">Seleccione categoría</MenuItem>
                {categorias.map((cat) => (
                  <MenuItem key={cat.ID_Categoria} value={cat.ID_Categoria}>
                    {cat.Nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "#333", fontWeight: "bold" }}>
              Formatos y Precios
            </Typography>

            <FormGroup row sx={{ gap: 2, px: 1 }}>
              {["tapa", "media", "plato", "unidad"].map((formato) => (
                <FormControlLabel
                  key={formato}
                  control={
                    <Checkbox
                      checked={datos.formatos[formato]}
                      onChange={handleCheckboxChange}
                      name={formato}
                      sx={{
                        color: "#c98c26",
                        "&.Mui-checked": { color: "#c98c26" },
                      }}
                    />
                  }
                  label={formato.charAt(0).toUpperCase() + formato.slice(1)}
                />
              ))}
            </FormGroup>

            <Stack spacing={2}>
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
                      variant="outlined"
                      sx={{
                        "& .MuiInputLabel-root": { color: "#c98c26", fontWeight: "bold" },
                        "& .MuiInputLabel-root.Mui-focused": { color: "#c98c26" },
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": { borderColor: "#c98c26" },
                        },
                      }}
                    />
                  )
              )}
            </Stack>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: "#c98c26",
                "&:hover": {
                  backgroundColor: "#a76f1f",
                },
                fontWeight: "bold",
              }}
            >
              Guardar Producto
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}