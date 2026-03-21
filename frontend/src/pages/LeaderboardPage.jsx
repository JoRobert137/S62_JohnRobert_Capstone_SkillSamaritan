import React, { useEffect, useState } from 'react';
import { Crown, Medal, Trophy, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

const rankStyle = (index) => {
  if (index === 0) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
  if (index === 1) return 'bg-gray-50 border-gray-200 text-gray-700';
  if (index === 2) return 'bg-amber-50 border-amber-200 text-amber-700';
  return 'bg-white border-gray-100 text-gray-700';
};

const LeaderboardPage = () => {
  const [leaderboardUsers, setLeaderboardUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await userAPI.getLeaderboard();
        const data = Array.isArray(response.data) ? response.data : [];
        setLeaderboardUsers(data);
      } catch (error) {
        setLeaderboardUsers([]);
        toast.error(error?.response?.data?.message || 'Unable to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-green-50 via-white to-teal-50 py-8 sm:py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-7 sm:mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 text-xs font-semibold mb-3">
              <Crown className="w-3.5 h-3.5" />
              Community Rankings
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Leaderboard</h1>
            <p className="text-gray-600 mt-2">Top contributors ranked by earned points.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-teal-50 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Rankings</p>
              <p className="text-sm text-gray-500 inline-flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {leaderboardUsers.length} users
              </p>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`leaderboard-skeleton-${index}`} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : leaderboardUsers.length === 0 ? (
              <div className="p-10 text-center">
                <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No users found yet.</p>
              </div>
            ) : (
              <ul className="p-4 sm:p-5 space-y-3">
                {leaderboardUsers.map((user, index) => (
                  <li
                    key={user._id || user.id || `${user.name}-${index}`}
                    className={`rounded-xl border p-4 sm:p-5 transition-shadow hover:shadow-sm ${rankStyle(index)}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-white/80 border border-current/20 flex items-center justify-center text-sm font-bold shrink-0">
                          #{index + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                            {user?.name || 'Community Member'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Points</p>
                        <p className="text-xl font-bold text-yellow-700 inline-flex items-center gap-1.5">
                          <Medal className="w-4 h-4" />
                          {user?.points || 0}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default LeaderboardPage;