// src/components/RegisterForm.js

import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm({ setAuth }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      // Automatically log in the user after registration
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setAuth(true);
    } catch (error) {
      console.error('Registration failed', error.response.data);
      alert('Registration failed: ' + error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input type="text" placeholder="Username" value={username}
        onChange={(e) => setUsername(e.target.value)} required />
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
