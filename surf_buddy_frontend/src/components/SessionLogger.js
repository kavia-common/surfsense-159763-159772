import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiCamera, FiTrash2, FiEdit, FiStar, FiMapPin } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { saveSession, getSessions, deleteSession, updateSession } from '../services/localStorage';
import { uploadPhoto, compressImage } from '../services/photoUpload';
import SessionForm from './SessionForm';
import SessionCard from './SessionCard';

// PUBLIC_INTERFACE
const SessionLogger = () => {
  /**
   * Main component for logging and viewing surf sessions
   * @returns {JSX.Element} Session logger with form and session list
   */
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, recent, favorites

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const savedSessions = getSessions();
    setSessions(savedSessions.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const handleAddSession = async (data) => {
    setLoading(true);
    try {
      // Handle photo uploads
      const uploadedPhotos = [];
      if (data.photos && data.photos.length > 0) {
        for (const photo of data.photos) {
          try {
            const compressedPhoto = await compressImage(photo);
            const photoUrl = await uploadPhoto(compressedPhoto, `session_${Date.now()}`);
            uploadedPhotos.push(photoUrl);
          } catch (error) {
            console.error('Error uploading photo:', error);
            toast.error('Failed to upload one or more photos');
          }
        }
      }

      const sessionData = {
        ...data,
        photos: uploadedPhotos,
        rating: Number(data.rating),
        waveHeight: Number(data.waveHeight)
      };

      if (editingSession) {
        updateSession(editingSession.id, sessionData);
        toast.success('Session updated successfully');
        setEditingSession(null);
      } else {
        saveSession(sessionData);
        toast.success('Session logged successfully');
      }

      loadSessions();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Failed to save session');
    }
    setLoading(false);
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setShowForm(true);
  };

  const handleDeleteSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      deleteSession(sessionId);
      loadSessions();
      toast.success('Session deleted');
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(session.date) >= oneWeekAgo;
    }
    if (filter === 'favorites') {
      return session.rating >= 4;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-0">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 md:top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Surf Sessions</h1>
              <p className="text-gray-600">Log and track your surf sessions</p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingSession(null);
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <FiPlus className="w-5 h-5" />
              <span>New Session</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-4 mt-4">
            {[
              { id: 'all', label: 'All Sessions', count: sessions.length },
              { id: 'recent', label: 'Recent', count: sessions.filter(s => new Date(s.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length },
              { id: 'favorites', label: 'Best Sessions', count: sessions.filter(s => s.rating >= 4).length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Session Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingSession ? 'Edit Session' : 'Log New Session'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingSession(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <SessionForm
                  onSubmit={handleAddSession}
                  loading={loading}
                  initialData={editingSession}
                />
              </div>
            </div>
          </div>
        )}

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <FiCamera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No sessions logged yet' : `No ${filter} sessions`}
            </h3>
            <p className="text-gray-600 mb-6">
              Start tracking your surf sessions to analyze your progress
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Log Your First Session
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                onEdit={() => handleEditSession(session)}
                onDelete={() => handleDeleteSession(session.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionLogger;
