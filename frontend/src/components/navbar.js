import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('token'); 

    try {
      await axios.post(
        'http://localhost:5001/auth/logout',
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      localStorage.removeItem('token');

      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.error || error.message);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#001e3c' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Chat Application
        </Typography>
        <Button color="inherit" component={Link} to="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/messages">
          Chatbot
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
