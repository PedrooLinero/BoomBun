import React from "react";
import { Box, Card, CardMedia, CardContent, Typography, Button, Container } from "@mui/material";
import { Link } from 'react-router-dom';

function HomeContent() {
  const bar = {
    name: "Cervecería Boom Bun",
    image: "https://gomgorashop.com/wp-content/uploads/2024/03/Bar-Boom-Bun.jpeg",
    description: "Disfruta de una experiencia única con las mejores cervezas artesanales y un ambiente inigualable."
  };

  return (
    <Box>
      <Box
        className="bg-light text-center py-5"
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-2c6e6e7f8c5f)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          },
        }}
      >
      </Box>
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <Card sx={{ mt: 3 }}>
          <CardMedia component="img" height="300" image={bar.image} alt={bar.name} />
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {bar.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {bar.description}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default HomeContent;