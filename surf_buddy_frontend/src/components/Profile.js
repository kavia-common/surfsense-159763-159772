import React, { useState, useEffect } from 'react';
import { FiUser, FiMapPin, FiStar, FiSettings, FiCamera, FiTrash2 } from 'react-icons/fi';
import { getFavoriteSpots, removeFavoriteSpot, getSessions } from '../services/localStorage';
import { format } from 'date-fns';

// PUBLIC_INTERFACE
const Profile = () => {
  /**
   * Profile component for user preferences, favorites, and statistics
   * @returns {JSX.Element} Profile page with user data and preferences
   */
  const [favoriteSpots, setFavoriteSpots] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [userPreferences, setUserPreferences] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    homeSpot: localStorage.getItem('homeSpot') || '',
    preferredBoard: localStorage.getItem('preferredBoard') || '',
    experience: localStorage.getItem('experience') || 'intermediate'
  });

  useEffect(() => {
    setFavoriteSpots(getFavoriteSpots());
    setSessions(getSessions());
  }, []);

  const handleSavePreferences = () => {
    Object.entries(userPreferences).forEach(([key, value]) => {
      if (key === 'name') localStorage.setItem('userName', value);
      else if (key === 'email') localStorage.setItem('userEmail', value);
      else if (key === 'homeSpot') localStorage.setItem('homeSpot', value);
      else if (key === 'preferredBoard') localStorage.setItem('preferredBoard', value);
      else if (key === 'experience') localStorage.setItem('experience', value);
    });
    alert('Preferences saved!');
  };

  const handleRemoveFavorite = (spotId) => {
    removeFavoriteSpot(spotId);
    setFavoriteSpots(getFavoriteSpots());
  };

  // Calculate user statistics
  const stats = {
    totalSessions: sessions.length,
    totalHours: sessions.reduce((sum, session) => sum + Number(session.duration), 0),
    avgRating: sessions.length > 0 ? 
      sessions.reduce((sum, session) => sum + Number(session.rating), 0) / sessions.length : 0,
    favoriteSpots: favoriteSpots.length,
    bestMonth: (() => {
      const monthCounts = {};
      sessions.forEach(session => {
        const month = format(new Date(session.date), 'MMM yyyy');
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      });
      return Object.entries(monthCounts).reduce((best, [month, count]) => 
        count > (best.count || 0) ? { month, count } : best, {}).month || 'N/A';
    })()
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'favorites', label: 'Favorite Spots', icon: FiStar },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-0">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 md:top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <FiUser className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {userPreferences.name || 'Surf Buddy'}
              </h1>
              <p className="text-gray-600">
                {userPreferences.experience.charAt(0).toUpperCase() + userPreferences.experience.slice(1)} Surfer
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 mt-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stats.totalSessions}</div>
                <div className="text-gray-600">Total Sessions</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-accent mb-2">{stats.totalHours.toFixed(1)}</div>
                <div className="text-gray-600">Hours Surfed</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.avgRating.toFixed(1)}</div>
                <div className="text-gray-600">Avg Rating</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">{stats.favoriteSpots}</div>
                <div className="text-gray-600">Favorite Spots</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              {sessions.slice(0, 5).length > 0 ? (
                <div className="space-y-3">
                  {sessions.slice(0, 5).map(session => (
                    <div key={session.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <div className="font-medium text-gray-900">{session.location}</div>
                        <div className="text-sm text-gray-600">
                          {format(new Date(session.date), 'MMM dd, yyyy')} • {session.waveHeight}ft • {session.duration}h
                        </div>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < session.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No sessions logged yet. Start tracking your surf sessions!</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Surfing Insights</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Month:</span>
                    <span className="font-medium">{stats.bestMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Home Spot:</span>
                    <span className="font-medium">{userPreferences.homeSpot || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preferred Board:</span>
                    <span className="font-medium">{userPreferences.preferredBoard || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience Level:</span>
                    <span className="font-medium capitalize">{userPreferences.experience}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals & Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${sessions.length >= 10 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={sessions.length >= 10 ? 'text-green-700' : 'text-gray-600'}>
                      10 Sessions {sessions.length >= 10 ? '✓' : `(${sessions.length}/10)`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stats.totalHours >= 50 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={stats.totalHours >= 50 ? 'text-green-700' : 'text-gray-600'}>
                      50 Hours {stats.totalHours >= 50 ? '✓' : `(${stats.totalHours.toFixed(1)}/50)`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${favoriteSpots.length >= 5 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={favoriteSpots.length >= 5 ? 'text-green-700' : 'text-gray-600'}>
                      5 Favorite Spots {favoriteSpots.length >= 5 ? '✓' : `(${favoriteSpots.length}/5)`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Favorite Surf Spots</h2>
            {favoriteSpots.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {favoriteSpots.map(spot => (
                  <div key={spot.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{spot.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiMapPin className="w-4 h-4 mr-1" />
                          {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFavorite(spot.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      Added {format(new Date(spot.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite spots yet</h3>
                <p className="text-gray-600">Explore the map and add some favorite surf spots!</p>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
            <div className="card">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={userPreferences.name}
                      onChange={(e) => setUserPreferences(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={userPreferences.email}
                      onChange={(e) => setUserPreferences(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Home Spot</label>
                    <input
                      type="text"
                      value={userPreferences.homeSpot}
                      onChange={(e) => setUserPreferences(prev => ({ ...prev, homeSpot: e.target.value }))}
                      placeholder="e.g., Huntington Beach"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Board</label>
                    <select
                      value={userPreferences.preferredBoard}
                      onChange={(e) => setUserPreferences(prev => ({ ...prev, preferredBoard: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Select board type</option>
                      <option value="Shortboard">Shortboard</option>
                      <option value="Longboard">Longboard</option>
                      <option value="Fish">Fish</option>
                      <option value="Funboard">Funboard</option>
                      <option value="Gun">Gun</option>
                      <option value="SUP">SUP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select
                    value={userPreferences.experience}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, experience: e.target.value }))}
                    className="input-field"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <button
                  onClick={handleSavePreferences}
                  className="btn-primary w-full"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
