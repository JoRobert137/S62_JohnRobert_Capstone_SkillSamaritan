import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, Tags } from 'lucide-react';

const SignupForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    skills: '',
  });
  
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({type: "", text: ""});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await axios.post('http://localhost:8080/api/auth/signup', {
      ...form,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setMessage({ type: "success", text: "Account created! Redirecting..." });

    setTimeout(() => navigate("/dashboard"), 1200);

    setForm({ name: "", email: "", password: "" });

  } catch (err) {
    const errMsg = err.response?.data?.message || "Signup Failed. Please Try Again.";
    setMessage({ type: "error", text: errMsg });
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-teal-50 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-green-100">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Join SkillSamaritan</h2>
          <p className="text-green-100">Start your skill-sharing journey today</p>
        </div>

        <div className="p-8">
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              message.type === "success" 
                ? "bg-green-100 text-green-700 border border-green-200" 
                : "bg-red-100 text-red-700 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Your Account'
              )}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Already a member?{' '}
              <a 
                href="/login" 
                className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
              >
                Log in to your account
              </a>
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignupForm;