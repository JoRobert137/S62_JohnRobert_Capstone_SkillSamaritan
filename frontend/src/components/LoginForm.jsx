/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', form);
      alert('Login successful!');
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      alert('Login failed!');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Log In</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
