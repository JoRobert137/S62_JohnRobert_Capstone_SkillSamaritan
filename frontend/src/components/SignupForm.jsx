/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';

const SignupForm = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', skills: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const skillsArray = form.skills.split(',').map(skill => skill.trim());
      const res = await axios.post('http://localhost:8080/api/auth/signup', {
        ...form,
        skills: skillsArray,
      });
      alert('Signup successful!');
    } catch (err) {
      alert('Signup failed!');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
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
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Skills (comma separated)"
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
