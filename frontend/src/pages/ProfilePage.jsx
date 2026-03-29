import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, ClipboardList, Mail, MapPin, MessageSquare, PencilLine, Save, Sparkles, Tag, Trophy, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { taskAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';

const normalizeId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value._id || value.id || '';
};

const formatDate = (value) => {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'N/A';
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getInitials = (name) => {
  if (!name) return 'SS';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const getStatusClasses = (status) => {
  if (status === 'completed') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 'accepted' || status === 'pending_verification') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  return 'bg-green-50 text-green-700 border-green-200';
};

const getStatusLabel = (status) => {
  if (status === 'pending_verification') return 'Pending Verification';
  if (!status) return 'Open';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getBadgeFromEarnedPoints = (earnedPoints = 0) => {
  if (earnedPoints >= 500) return { name: 'Samaritan Pro', emoji: '🏆' };
  if (earnedPoints >= 100) return { name: 'Contributor', emoji: '🤝' };
  return { name: 'Beginner', emoji: '🌱' };
};

const SectionCard = ({ title, subtitle, icon: Icon, children }) => (
  <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {Icon && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 text-white flex items-center justify-center shadow-sm shrink-0">
          <Icon className="w-4 h-4" />
        </div>
      )}
    </div>
    {children}
  </section>
);

const StatBlock = ({ label, value, accent = 'text-gray-900' }) => (
  <div className="rounded-xl border border-gray-100 bg-gradient-to-b from-white to-green-50/30 p-4 text-center hover:shadow-sm transition-shadow duration-200">
    <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
  </div>
);

const AchievementBadge = ({ title, emoji, unlocked }) => (
  <div
    className={`rounded-xl border p-4 transition-all duration-200 ${
      unlocked
        ? 'border-yellow-200 bg-gradient-to-b from-yellow-50 to-yellow-100/50 text-yellow-800 shadow-sm'
        : 'border-gray-200 bg-gray-50 text-gray-400'
    }`}
  >
    <div className="text-xl mb-1">{emoji}</div>
    <p className="text-sm font-semibold">{title}</p>
    <p className={`text-xs mt-1 ${unlocked ? 'text-yellow-600' : 'text-gray-400'}`}>
      {unlocked ? '✓ Unlocked' : 'In progress'}
    </p>
  </div>
);

const TaskItem = ({ task, dateLabel, dateValue, onNavigate }) => (
  <li
    className="border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
    onClick={onNavigate}
  >
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div className="min-w-0 flex-1">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{task.title || 'Untitled Task'}</h3>
        <p className="text-sm text-gray-600 mt-1">
          Skill: {task.skillsRequired?.[0] || 'General'}
        </p>
      </div>
      <span className={`inline-flex items-center self-start px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${getStatusClasses(task.status)}`}>
        {getStatusLabel(task.status)}
      </span>
    </div>
    <div className="flex items-center justify-between mt-3">
      <p className="text-xs text-gray-500">
        {dateLabel}: {formatDate(dateValue)}
      </p>
      <p className="text-xs font-semibold text-yellow-700">⭐ {task.points || 0} pts</p>
    </div>
  </li>
);

const ProfilePage = () => {
  const { user, updateUser, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [activityTab, setActivityTab] = useState('created');
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [skills, setSkills] = useState(Array.isArray(user?.skills) ? user.skills.join(', ') : '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setSkills(Array.isArray(user?.skills) ? user.skills.join(', ') : '');
    setBio(user?.bio || '');
    setLocation(user?.location || '');
  }, [user]);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const response = await taskAPI.getAllTasks();
        setTasks(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setTasks([]);
        toast.error(error?.response?.data?.message || 'Unable to load profile activity.');
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, []);

  const currentUserId = normalizeId(user?._id || user?.id);

  const createdTasks = useMemo(
    () => tasks.filter((task) => normalizeId(task.createdBy) === currentUserId),
    [tasks, currentUserId]
  );

  const completedTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          normalizeId(task.acceptedBy) === currentUserId && task.status === 'completed'
      ),
    [tasks, currentUserId]
  );

  const totalPoints = user?.points ?? 0;
  const earnedPoints = user?.earnedPoints ?? 0;
  const currentBadge = getBadgeFromEarnedPoints(earnedPoints);
  const skillsOffered = Array.isArray(user?.skills) ? user.skills : [];

  const contributionStats = useMemo(
    () => [
      { label: 'Tasks Created', value: user?.tasksPosted ?? createdTasks.length, accent: 'text-green-700' },
      { label: 'Tasks Completed', value: user?.tasksCompleted ?? completedTasks.length, accent: 'text-teal-700' },
      { label: 'Points Balance', value: totalPoints, accent: 'text-green-700' },
      { label: 'Points Earned', value: earnedPoints, accent: 'text-yellow-700' },
    ],
    [user?.tasksPosted, user?.tasksCompleted, createdTasks.length, completedTasks.length, totalPoints, earnedPoints]
  );

  const visibleTasks = activityTab === 'created' ? createdTasks : completedTasks;

  const recentActivity = useMemo(() => {
    const createdEvents = createdTasks.map((task) => ({
      id: `created-${task._id}`,
      text: `Created a task: ${task.title || 'Untitled Task'}`,
      date: task.createdAt,
    }));

    const helpedEvents = completedTasks.map((task) => ({
      id: `helped-${task._id}`,
      text: `Completed: ${task.title || 'Untitled Task'}`,
      date: task.completedAt || task.updatedAt,
    }));

    const allEvents = [...createdEvents, ...helpedEvents]
      .filter((event) => event.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);

    return allEvents;
  }, [createdTasks, completedTasks]);

  const achievements = useMemo(
    () => [
      {
        title: 'Beginner (0-99 earned)',
        emoji: '🌱',
        unlocked: earnedPoints >= 0,
      },
      {
        title: 'Contributor (100-499 earned)',
        emoji: '🤝',
        unlocked: earnedPoints >= 100,
      },
      {
        title: 'Samaritan Pro (500+ earned)',
        emoji: '🏆',
        unlocked: earnedPoints >= 500,
      },
    ],
    [earnedPoints]
  );

  const memberSince = user?.createdAt ? formatDate(user.createdAt) : null;
  const displayBio = user?.bio || 'Passionate about helping the community through shared skills and meaningful tasks.';
  const displayLocation = user?.location || '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user?._id && !user?.id) {
      toast.error('Unable to find user profile id.');
      return;
    }

    setIsSaving(true);

    try {
      const userId = user._id || user.id;
      const payload = {
        name,
        email,
        bio,
        location,
        skills: skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const response = await userAPI.updateUser(userId, payload);
      const updatedUser = response.data;

      updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <section className="min-h-screen bg-gradient-to-b from-green-50 via-white to-teal-50 py-8 sm:py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-7 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Track your impact, manage your details, and showcase your skills.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7">
            <aside className="lg:col-span-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow duration-200 sticky top-24">
                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-green-100">
                  {getInitials(user?.name)}
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-gray-900">{user?.name || 'Community Member'}</h2>
                <p className="text-sm text-gray-500 mt-1">{user?.email || 'No email available'}</p>

                {displayLocation && (
                  <p className="text-sm text-gray-500 mt-2 inline-flex items-center justify-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    {displayLocation}
                  </p>
                )}

                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200">
                  <span className="text-sm">{currentBadge.emoji}</span>
                  <span className="text-sm font-semibold text-yellow-700">{currentBadge.name}</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-green-700 font-semibold">Balance</p>
                    <p className="text-xl font-bold text-green-700 mt-0.5">{totalPoints}</p>
                  </div>
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-yellow-700 font-semibold">Earned</p>
                    <p className="text-xl font-bold text-yellow-700 mt-0.5">{earnedPoints}</p>
                  </div>
                </div>

                {memberSince && (
                  <p className="text-sm text-gray-500 mt-4 inline-flex items-center justify-center gap-2">
                    <CalendarDays className="w-4 h-4 text-green-600" />
                    Member since {memberSince}
                  </p>
                )}

                <p className="text-sm text-gray-600 mt-4 leading-relaxed">{displayBio}</p>

                <button
                  type="button"
                  onClick={() => setIsEditing((prev) => !prev)}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <PencilLine className="w-4 h-4" />
                  {isEditing ? 'Close Edit' : 'Edit Profile'}
                </button>

                {isEditing && (
                  <form onSubmit={handleSubmit} className="mt-5 text-left space-y-4 border-t border-gray-100 pt-5">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <div className="relative mt-2">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <div className="relative mt-2">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-teal-600" />
                        Location
                      </label>
                      <input
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        className="w-full mt-2 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., San Francisco, CA"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                        rows={3}
                        maxLength={500}
                        className="w-full mt-2 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        placeholder="Tell others about yourself..."
                      />
                      <p className="text-xs text-gray-500 mt-1 text-right">{bio.length}/500</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        Skills (comma-separated)
                      </label>
                      <textarea
                        value={skills}
                        onChange={(event) => setSkills(event.target.value)}
                        rows={2}
                        className="w-full mt-2 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        placeholder="Cooking, Gardening, JavaScript"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold px-4 py-2.5 rounded-lg disabled:opacity-60 transition-all duration-200 shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                )}
              </div>
            </aside>

            <main className="lg:col-span-8 space-y-6">
              <SectionCard
                title="My Contributions"
                subtitle="A quick view of your community impact"
                icon={Trophy}
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {contributionStats.map((stat) => (
                    <StatBlock key={stat.label} label={stat.label} value={stat.value} accent={stat.accent} />
                  ))}
                </div>
              </SectionCard>

              <SectionCard
                title="Skills Offered"
                subtitle="The strengths you bring to the community"
                icon={Sparkles}
              >
                {skillsOffered.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {skillsOffered.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No skills added yet. Edit your profile to add some!</p>
                )}
              </SectionCard>

              <SectionCard
                title="Contribution History"
                subtitle="A timeline of tasks you created and completed"
                icon={ClipboardList}
              >
                <div className="flex items-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setActivityTab('created')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activityTab === 'created'
                        ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tasks Created ({createdTasks.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivityTab('completed')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activityTab === 'completed'
                        ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tasks Completed ({completedTasks.length})
                  </button>
                </div>

                {loadingTasks ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={`skeleton-${i}`} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : visibleTasks.length > 0 ? (
                  <ul className="space-y-3">
                    {visibleTasks.map((task) => (
                      <TaskItem
                        key={task._id}
                        task={task}
                        dateLabel={activityTab === 'created' ? 'Created' : 'Completed'}
                        dateValue={activityTab === 'created' ? task.createdAt : task.completedAt || task.updatedAt}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    {activityTab === 'created' ? 'No tasks created yet.' : 'No tasks completed yet.'}
                  </p>
                )}
              </SectionCard>

              <SectionCard
                title="Achievements"
                subtitle="Badges earned through your contributions"
                icon={Trophy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {achievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.title}
                      title={achievement.title}
                      emoji={achievement.emoji}
                      unlocked={achievement.unlocked}
                    />
                  ))}
                </div>
              </SectionCard>

              <SectionCard
                title="Recent Activity"
                subtitle="Latest actions from your SkillSamaritan journey"
                icon={CheckCircle2}
              >
                {loadingTasks ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={`act-skeleton-${i}`} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : recentActivity.length > 0 ? (
                  <ul className="space-y-3">
                    {recentActivity.map((event) => (
                      <li key={event.id} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-b-0">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-800">{event.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(event.date)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 py-4 text-center">No recent activity yet.</p>
                )}
              </SectionCard>
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
