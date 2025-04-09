import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar: React.FC = () => {
  const { toggleTheme, isDarkMode } = useThemeContext();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton color="inherit" onClick={toggleTheme} edge="start" sx={{ marginRight: 2 }}>
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Ecosystem OAuth
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/profile-info">
          Profile
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;