// src/components/LoginForm.js

import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ setAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setAuth(true);
    } catch (error) {
      console.error('Login failed', error.response.data);
      alert('Login failed: ' + error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
