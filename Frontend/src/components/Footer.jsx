import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper', 
        py: 4, 
        mt: 'auto', 
        borderTop: '1px solid', 
        borderColor: 'divider',
        width: '100%'
      }}
    >
      <Container maxWidth="md">
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="/" sx={{ textDecoration: 'none', fontWeight: 600 }}>
            PostSocial
          </Link>{' '}
          {new Date().getFullYear()}
          {'. All rights reserved.'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          Share your thoughts and connect with the world.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
