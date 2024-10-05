// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotesPage from './pages/NotesPage';

function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    // Check for token
    const token = localStorage.getItem('token');
    if (token) {
      setAuth(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={auth ? <Navigate to="/notes" /> : <LoginPage setAuth={setAuth} />} />
        <Route path="/register" element={auth ? <Navigate to="/notes" /> : <RegisterPage setAuth={setAuth} />} />
        <Route path="/notes" element={auth ? <NotesPage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={auth ? "/notes" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
