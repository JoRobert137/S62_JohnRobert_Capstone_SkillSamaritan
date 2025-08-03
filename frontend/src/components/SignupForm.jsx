/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';

const SignupForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    skills: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = form.skills.split(',').map((skill) => skill.trim());
      await axios.post('http://localhost:8080/api/auth/signup', {
        ...form,
        skills: skillsArray,
      });
      alert('Signup successful!');
    } catch (err) {
      alert('Signup failed!');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Join SkillSamaritan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Skills (comma-separated)"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition-all duration-300 font-semibold"
          >
            Create Account
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Already a member? <a href="/login" className="text-green-600 hover:underline">Log in</a>
        </p>
      </div>
    </section>
  );
};

export default SignupForm;
