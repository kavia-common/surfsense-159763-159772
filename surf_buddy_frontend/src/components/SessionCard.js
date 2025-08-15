import React from 'react';
import { FiMapPin, FiClock, FiStar, FiEdit, FiTrash2, FiCamera } from 'react-icons/fi';
import { format } from 'date-fns';

// PUBLIC_INTERFACE
const SessionCard = ({ session, onEdit, onDelete }) => {
  /**
   * Card component to display individual surf session data
   * @param {Object} session - Session data
   * @param {function} onEdit - Function to call when edit is clicked
   * @param {function} onDelete - Function to call when delete is clicked
   * @returns {JSX.Element} Session card with all session details
   */
  const getConditionColor = (condition) => {
    const colors = {
      poor: 'text-red-600 bg-red-50',
      fair: 'text-yellow-600 bg-yellow-50',
      good: 'text-green-600 bg-green-50',
      excellent: 'text-blue-600 bg-blue-50'
    };
    return colors[condition] || 'text-gray-600 bg-gray-50';
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="card hover:shadow-xl transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {session.location}
          </h3>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span className="flex items-center">
              <FiMapPin className="w-4 h-4 mr-1" />
              {format(new Date(session.date), 'MMM dd, yyyy')}
            </span>
            <span className="flex items-center">
              <FiClock className="w-4 h-4 mr-1" />
              {session.duration}h
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Photos */}
      {session.photos && session.photos.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            {session.photos.slice(0, 4).map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo}
                  alt={`Session ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                {index === 3 && session.photos.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <span className="text-white text-sm font-medium">
                      +{session.photos.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-ocean-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Wave Height</div>
          <div className="text-lg font-semibold text-ocean-700">
            {session.waveHeight}ft
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">Board</div>
          <div className="text-lg font-semibold text-gray-700">
            {session.board}
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Rating:</span>
          <div className="flex">{getRatingStars(session.rating)}</div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(session.conditions)}`}>
          {session.conditions.charAt(0).toUpperCase() + session.conditions.slice(1)}
        </div>
      </div>

      {/* Notes */}
      {session.notes && (
        <div className="border-t pt-3">
          <p className="text-sm text-gray-600 line-clamp-3">
            {session.notes}
          </p>
        </div>
      )}

      {/* Additional Info */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-gray-500">
        <span>Crowd: {session.crowd}</span>
        {session.photos && session.photos.length > 0 && (
          <span className="flex items-center">
            <FiCamera className="w-3 h-3 mr-1" />
            {session.photos.length} photo{session.photos.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
