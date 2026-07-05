import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ maxWidth: 'lg', width: '100%', mx: 'auto', px: { xs: 1, sm: 2 } }}>
        <ChatOutlinedIcon sx={{ mr: 1, color: 'primary.main', fontSize: 26 }} />
        <Typography
          variant="h6"
          component={Link}
          to="/feed"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            fontWeight: 800,
            background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
            fontSize: '1.4rem'
          }}
        >
          PostSocial
        </Typography>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                bgcolor: 'action.hover', 
                px: 1.5, 
                py: 0.5, 
                borderRadius: 4 
              }}
            >
              <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', fontSize: '0.9rem' }}>
                {user.username[0].toUpperCase()}
              </Avatar>
              <Typography variant="body2" fontWeight="600" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user.username}
              </Typography>
            </Box>
            <Button 
              color="error" 
              variant="text" 
              size="small" 
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ fontWeight: 'bold', borderRadius: 2 }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button component={Link} to="/login" variant="outlined" size="small" sx={{ borderRadius: 2 }}>Login</Button>
            <Button component={Link} to="/signup" variant="contained" size="small" disableElevation sx={{ borderRadius: 2 }}>Sign Up</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
