// src/pages/RegisterPage.js

import React from 'react';
import RegisterForm from '../components/RegisterForm';

function RegisterPage({ setAuth }) {
  return (
    <div className="container">
      <h1>Register</h1>
      <RegisterForm setAuth={setAuth} />
    </div>
  );
}

export default RegisterPage;
