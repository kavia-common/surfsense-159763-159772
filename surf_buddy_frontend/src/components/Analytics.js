import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { FiTrendingUp, FiCalendar, FiStar, FiActivity } from 'react-icons/fi';
import { getSessions } from '../services/localStorage';
import { format, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

// PUBLIC_INTERFACE
const Analytics = () => {
  /**
   * Analytics dashboard component showing surf session trends and statistics
   * @returns {JSX.Element} Analytics dashboard with charts and statistics
   */
  const [sessions, setSessions] = useState([]);
  const [timeRange, setTimeRange] = useState('6months'); // 3months, 6months, 1year, all
  const [activeChart, setActiveChart] = useState('sessions');

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  // Filter sessions based on time range
  const getFilteredSessions = () => {
    if (timeRange === 'all') return sessions;
    
    const now = new Date();
    const months = timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12;
    const cutoffDate = subMonths(now, months);
    
    return sessions.filter(session => new Date(session.date) >= cutoffDate);
  };

  const filteredSessions = getFilteredSessions();

  // Generate monthly session data
  const getMonthlyData = () => {
    const months = timeRange === 'all' ? 12 : 
                  timeRange === '3months' ? 3 : 
                  timeRange === '6months' ? 6 : 12;
    
    const endDate = new Date();
    const startDate = subMonths(endDate, months - 1);
    const monthsArray = eachMonthOfInterval({ start: startDate, end: endDate });

    return monthsArray.map(month => {
      const monthSessions = filteredSessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.getMonth() === month.getMonth() && 
               sessionDate.getFullYear() === month.getFullYear();
      });

      const totalHours = monthSessions.reduce((sum, session) => sum + Number(session.duration), 0);
      const avgRating = monthSessions.length > 0 ? 
        monthSessions.reduce((sum, session) => sum + Number(session.rating), 0) / monthSessions.length : 0;

      return {
        month: format(month, 'MMM'),
        sessions: monthSessions.length,
        hours: Number(totalHours.toFixed(1)),
        avgRating: Number(avgRating.toFixed(1)),
        avgWaveHeight: monthSessions.length > 0 ? 
          Number((monthSessions.reduce((sum, session) => sum + Number(session.waveHeight), 0) / monthSessions.length).toFixed(1)) : 0
      };
    });
  };

  // Get board type distribution
  const getBoardData = () => {
    const boardCounts = {};
    filteredSessions.forEach(session => {
      boardCounts[session.board] = (boardCounts[session.board] || 0) + 1;
    });

    return Object.entries(boardCounts).map(([board, count], index) => ({
      name: board,
      value: count,
      color: `hsl(${index * 45}, 70%, 60%)`
    }));
  };

  // Get condition distribution
  const getConditionData = () => {
    const conditionCounts = {};
    filteredSessions.forEach(session => {
      conditionCounts[session.conditions] = (conditionCounts[session.conditions] || 0) + 1;
    });

    const colors = {
      poor: '#ef4444',
      fair: '#f59e0b',
      good: '#10b981',
      excellent: '#3b82f6'
    };

    return Object.entries(conditionCounts).map(([condition, count]) => ({
      name: condition.charAt(0).toUpperCase() + condition.slice(1),
      value: count,
      color: colors[condition] || '#6b7280'
    }));
  };

  // Calculate statistics
  const stats = {
    totalSessions: filteredSessions.length,
    totalHours: filteredSessions.reduce((sum, session) => sum + Number(session.duration), 0),
    avgRating: filteredSessions.length > 0 ? 
      filteredSessions.reduce((sum, session) => sum + Number(session.rating), 0) / filteredSessions.length : 0,
    avgWaveHeight: filteredSessions.length > 0 ? 
      filteredSessions.reduce((sum, session) => sum + Number(session.waveHeight), 0) / filteredSessions.length : 0,
    bestSession: filteredSessions.reduce((best, session) => 
      session.rating > (best?.rating || 0) ? session : best, null)
  };

  const monthlyData = getMonthlyData();
  const boardData = getBoardData();
  const conditionData = getConditionData();

  const chartOptions = [
    { id: 'sessions', label: 'Sessions', icon: FiCalendar },
    { id: 'hours', label: 'Hours', icon: FiActivity },
    { id: 'rating', label: 'Rating', icon: FiStar },
    { id: 'waves', label: 'Wave Height', icon: FiTrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-0">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 md:top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600">Track your surf progress and trends</p>
            </div>
            
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-field max-w-xs"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <FiTrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">Log some surf sessions to see your analytics</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FiCalendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FiActivity className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Hours</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalHours.toFixed(1)}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <FiStar className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FiTrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Avg Wave Height</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.avgWaveHeight.toFixed(1)}ft</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Selection */}
            <div className="card mb-8">
              <div className="flex flex-wrap gap-2 mb-6">
                {chartOptions.map(option => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setActiveChart(option.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        activeChart === option.id
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {activeChart === 'sessions' && (
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="#1986d9" />
                    </BarChart>
                  )}
                  
                  {activeChart === 'hours' && (
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="hours" stroke="#13cfc6" fill="#13cfc6" fillOpacity={0.6} />
                    </AreaChart>
                  )}
                  
                  {activeChart === 'rating' && (
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgRating" stroke="#f59e0b" strokeWidth={3} />
                    </LineChart>
                  )}
                  
                  {activeChart === 'waves' && (
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgWaveHeight" fill="#06b6d4" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Board Distribution */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Board Usage</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={boardData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {boardData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Condition Distribution */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Surf Conditions</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={conditionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {conditionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Best Session */}
            {stats.bestSession && (
              <div className="card mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Session</h3>
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{stats.bestSession.location}</h4>
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < stats.bestSession.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-1 font-medium">{format(new Date(stats.bestSession.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Waves:</span>
                      <span className="ml-1 font-medium">{stats.bestSession.waveHeight}ft</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-1 font-medium">{stats.bestSession.duration}h</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Board:</span>
                      <span className="ml-1 font-medium">{stats.bestSession.board}</span>
                    </div>
                  </div>
                  {stats.bestSession.notes && (
                    <p className="text-sm text-gray-700 mt-2 italic">"{stats.bestSession.notes}"</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
