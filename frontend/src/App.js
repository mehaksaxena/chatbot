import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Messaging from './pages/Messaging';
import Navbar from './components/navbar';
import ProtectedRoute from './components/ProtectedRoute'; 


function App() {
  return (
    <Router>
    <Routes>

      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />


      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/messages"
          element={
            <>
              <Navbar /> 
              <Messaging />
            </>
          }
        />
      </Route>
    </Routes>
  </Router>
  );
}

export default App;
