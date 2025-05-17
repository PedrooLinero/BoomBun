import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import {
  Person as PersonIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  Login as LoginIcon, // Importar correctamente LoginIcon
  ErrorOutline as ErrorOutlineIcon,
} from "@mui/icons-material";

function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    Nombre: "",
    Correo: "",
    Contraseña: "",
    ConfirmarContraseña: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validaciones básicas
    if (userData.Contraseña.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      setLoading(false);
      return;
    }

    if (userData.Contraseña !== userData.ConfirmarContraseña) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Nombre: userData.Nombre.trim(),
          Correo: userData.Correo.toLowerCase().trim(),
          Contraseña: userData.Contraseña,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || "Error al registrar usuario");
      }

      // Mostrar mensaje de éxito
      setSuccess(true);

      // Redirección tras un breve retraso
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
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
        background: "linear-gradient(to bottom right, #111827, #064e3b)",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Encabezado */}
        <Box sx={{ bgcolor: "#064e3b", p: 3, textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "medium" }}>
            Registro de Usuario
          </Typography>
          <Typography variant="body2" sx={{ color: "#d1fae5", mt: 0.5 }}>
            Crea una cuenta para comenzar
          </Typography>
        </Box>

        {/* Formulario */}
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          {error && (
            <Alert
              severity="error"
              icon={<ErrorOutlineIcon fontSize="small" />}
              sx={{ mb: 2, bgcolor: "#fef2f2", color: "#b91c1c", borderRadius: 1 }}
            >
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nombre completo"
            value={userData.Nombre}
            onChange={(e) =>
              setUserData({ ...userData, Nombre: e.target.value })
            }
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "#6b7280" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#064e3b" },
                "&.Mui-focused fieldset": { borderColor: "#065f46" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Correo electrónico"
            type="email"
            value={userData.Correo}
            onChange={(e) =>
              setUserData({ ...userData, Correo: e.target.value })
            }
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailIcon sx={{ color: "#6b7280" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#064e3b" },
                "&.Mui-focused fieldset": { borderColor: "#065f46" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={userData.Contraseña}
            onChange={(e) =>
              setUserData({ ...userData, Contraseña: e.target.value })
            }
            margin="normal"
            required
            helperText="Mínimo 8 caracteres"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#6b7280" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#064e3b" },
                "&.Mui-focused fieldset": { borderColor: "#065f46" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Confirmar contraseña"
            type="password"
            value={userData.ConfirmarContraseña}
            onChange={(e) =>
              setUserData({
                ...userData,
                ConfirmarContraseña: e.target.value,
              })
            }
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#6b7280" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#064e3b" },
                "&.Mui-focused fieldset": { borderColor: "#065f46" },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={loading ? null : <LoginIcon />} // Cambiado a LoginIcon
            sx={{
              mt: 2,
              py: 1.2,
              bgcolor: "#065f46",
              "&:hover": { bgcolor: "#047857" },
              textTransform: "none",
              fontWeight: "medium",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Registrarse"
            )}
          </Button>

          <Typography
            variant="body2"
            sx={{ mt: 2, textAlign: "center", color: "#6b7280" }}
          >
            ¿Ya tienes cuenta?{" "}
            <Box
              component="span"
              sx={{ color: "#065f46", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </Box>
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          sx={{ bgcolor: "#d1fae5", color: "#065f46" }}
        >
          ¡Registro exitoso! Redirigiendo al login...
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Register;