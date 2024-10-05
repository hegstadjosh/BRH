// src/pages/LoginPage.js

import React from 'react';
import LoginForm from '../components/LoginForm';

function LoginPage({ setAuth }) {
  return (
    <div className="container">
      <h1>Login</h1>
      <LoginForm setAuth={setAuth} />
    </div>
  );
}

export default LoginPage;
