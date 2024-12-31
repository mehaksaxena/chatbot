import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Grid, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/auth/login', formData);
      alert(response.data.message);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Grid container sx={{ height: '100vh' }}>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          bgcolor: '#f5f5f5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '80%', textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Sign in
          </Typography>
          <Typography variant="body2" gutterBottom>
            Don’t have an account? <Link href="/register">Sign up</Link>
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Typography variant="body2" align="right" gutterBottom>
              {/* <Link href="#">Forgot password?</Link> */}
            </Typography>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Sign in
            </Button>
          </form>
        </Box>
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          bgcolor: '#001e3c',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
        }}
      >
        <Box sx={{ textAlign: 'center', maxWidth: '400px' }}>
          <Typography variant="h4" gutterBottom>
            Welcome to Chatbot
          </Typography>
          <Typography variant="body2" gutterBottom>
            Chatbot antisocio app
          </Typography>
          <img
            src="/assets/auth-widgets.png" 
            alt="Auth Widgets"
            style={{ width: '100%', maxWidth: '600px', marginTop: '20px' }} 
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default Login;
