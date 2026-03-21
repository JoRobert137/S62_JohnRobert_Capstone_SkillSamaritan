import React, { useState } from 'react';
import { Bell, Lock, Save, Settings as SettingsIcon, UserRound } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    displayName: user?.name || '',
    email: user?.email || '',
    emailNotifications: true,
    profileVisibility: 'public',
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    toast.success('Settings UI placeholder ready. Connect this form to backend settings API next.');
  };

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-green-50 via-white to-teal-50 py-8 sm:py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-7 sm:mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold mb-3">
              <SettingsIcon className="w-3.5 h-3.5" />
              Account Preferences
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your profile and notification preferences.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <UserRound className="w-4.5 h-4.5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Display Name</label>
                  <input
                    name="displayName"
                    value={form.displayName}
                    onChange={handleChange}
                    className="w-full mt-2 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Your display name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full mt-2 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-4.5 h-4.5 text-teal-600" />
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              </div>

              <label className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email notifications</p>
                  <p className="text-xs text-gray-500">Get updates for tasks and community activity.</p>
                </div>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={form.emailNotifications}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
              </label>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-4.5 h-4.5 text-yellow-600" />
                <h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
              </div>

              <label className="text-sm font-medium text-gray-700">Profile visibility</label>
              <select
                name="profileVisibility"
                value={form.profileVisibility}
                onChange={handleChange}
                className="w-full mt-2 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="public">Public</option>
                <option value="friends">Friends only</option>
                <option value="private">Private</option>
              </select>
            </section>

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold px-5 py-3 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SettingsPage;