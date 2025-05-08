import { Box, Typography, Button, Container } from "@mui/material";

function PaginaError() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <img src={Error} height="250" alt="Error" />
        </Box>

        <Container
          maxWidth="md"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            opacity: 0.8, 
            borderRadius: 2,
            boxShadow: 3,
            padding: 4,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            color="red" 
            sx={{ marginBottom: 2 }}
          >
            ¡Oops! Página no encontrada
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ marginBottom: 4 }}
          >
            La ruta que estás buscando no existe. Puede que haya sido movida,
            eliminada o nunca existió.
          </Typography>

          <Box textAlign={"center"} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              href="/"
              sx={{
                mt: 2,
                bgcolor: "#c98c26", // Color dorado
                "&:hover": { bgcolor: "#a76f1f" }, // Color dorado más oscuro al pasar el mouse
                borderRadius: 2,
                fontWeight: "bold",
              }}
            >
              Ir a la página principal
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default PaginaError;
