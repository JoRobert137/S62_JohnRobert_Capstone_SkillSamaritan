import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Tag, Save } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, login, token } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [skills, setSkills] = useState(Array.isArray(user?.skills) ? user.skills.join(', ') : '');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user?._id && !user?.id) {
      setMessage({ type: 'error', text: 'Unable to find user profile id.' });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const userId = user._id || user.id;
      const payload = {
        name,
        email,
        skills: skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const response = await userAPI.updateUser(userId, payload);
      const updatedUser = response.data?.user || response.data;

      login(token, updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-10 px-4">
        <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600 mb-8">Manage your account details and skills.</p>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <div className="relative mt-2">
                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-2">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Skills (comma-separated)</label>
              <div className="relative mt-2">
                <Tag className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <textarea
                  value={skills}
                  onChange={(event) => setSkills(event.target.value)}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back to Dashboard
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ProfilePage;
