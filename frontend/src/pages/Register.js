import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Grid, Typography, Link, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '', 
    password: '',
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, termsAccepted: e.target.checked });
  };
  const navigate = useNavigate(); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert('Please accept the terms and conditions.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/auth/register', formData);
      alert(response.data.message);
      navigate('/login'); 
    } catch (error) {
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid item xs={12} md={6} sx={{ bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ width: '80%', textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>Sign up</Typography>
          <Typography variant="body2" gutterBottom>
            Already have an account? <Link href="/login">Sign in</Link>
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="First name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
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
              label="Phone number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <MenuItem value="Student">Student</MenuItem>
                <MenuItem value="Teacher">Teacher</MenuItem>
                <MenuItem value="Institute">Institute</MenuItem>
              </Select>
            </FormControl>
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.termsAccepted}
                  onChange={handleCheckboxChange}
                  name="termsAccepted"
                />
              }
              label="I have read the terms and conditions"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Sign up
            </Button>
          </form>
        </Box>
      </Grid>
      <Grid item xs={12} md={6} sx={{ bgcolor: '#001e3c', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
        <Box sx={{ textAlign: 'center', maxWidth: '400px' }}>
          <Typography variant="h4" gutterBottom>Welcome to Chatbot</Typography>
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

export default Register;
