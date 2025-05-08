import * as React from 'react';
import { Box, TextField, Button, Alert, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


function Login() {
  const [correo, setCorreo] = React.useState('');
  const [contraseña, setContraseña] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Correo: correo, Contraseña: contraseña }),
        credentials: 'include', // Necesario para enviar y recibir cookies
      });

      const data = await response.json();
      if (data.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
      } else {
        setError(data.mensaje || 'Credenciales inválidas');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3, boxShadow: 1, borderRadius: 2 }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Iniciar Sesión
      </Typography>
      <TextField
        label="Correo"
        variant="outlined"
        fullWidth
        margin="normal"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
      <TextField
        label="Contraseña"
        variant="outlined"
        type="password"
        fullWidth
        margin="normal"
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
        required
      />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2, py: 1.5 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
      </Button>
    </Box>
  );
}

export default Login;