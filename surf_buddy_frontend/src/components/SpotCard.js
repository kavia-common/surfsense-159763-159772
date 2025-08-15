import React, { useState } from 'react';
import { FiMapPin, FiCamera, FiBookOpen, FiStar } from 'react-icons/fi';
import { format } from 'date-fns';

// PUBLIC_INTERFACE
const SpotCard = ({ spot }) => {
  /**
   * Card component to display surf spot details and actions
   * @param {Object} spot - Surf spot data
   * @returns {JSX.Element} Spot card with details and action buttons
   */
  const [imageError, setImageError] = useState(false);
  
  // Mock spot image (in a real app, this would come from the spot data)
  const spotImage = !imageError ? 
    `https://source.unsplash.com/400x200/?beach,surf,ocean&sig=${spot.id}` : 
    null;

  return (
    <div className="p-4">
      {/* Spot Image */}
      {spotImage && (
        <div className="relative mb-4 rounded-lg overflow-hidden">
          <img 
            src={spotImage}
            alt={spot.name}
            className="w-full h-40 object-cover"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2 left-2 text-white">
            <div className="flex items-center space-x-1 text-sm">
              <FiMapPin className="w-4 h-4" />
              <span>Surf Spot</span>
            </div>
          </div>
        </div>
      )}

      {/* Spot Info */}
      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Location Details</h4>
          <p className="text-sm text-gray-600">
            Coordinates: {spot.lat.toFixed(6)}, {spot.lng.toFixed(6)}
          </p>
          <p className="text-sm text-gray-600">
            Added: {format(new Date(spot.createdAt), 'MMM dd, yyyy')}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h5 className="font-medium text-gray-900 mb-2">Quick Info</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-1 font-medium">Beach Break</span>
            </div>
            <div>
              <span className="text-gray-600">Best:</span>
              <span className="ml-1 font-medium">2-4ft</span>
            </div>
            <div>
              <span className="text-gray-600">Bottom:</span>
              <span className="ml-1 font-medium">Sand</span>
            </div>
            <div>
              <span className="text-gray-600">Crowd:</span>
              <span className="ml-1 font-medium">Moderate</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 bg-primary text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
            <FiBookOpen className="w-4 h-4" />
            <span>Log Session</span>
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1">
            <FiCamera className="w-4 h-4" />
            <span>Photos</span>
          </button>
        </div>

        {/* Forecast Preview */}
        <div className="border-t pt-3">
          <h5 className="font-medium text-gray-900 mb-2">7-Day Forecast</h5>
          <div className="grid grid-cols-7 gap-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-xs text-gray-600 mb-1">{day}</div>
                <div className="w-full h-8 bg-gradient-to-t from-ocean-200 to-ocean-400 rounded flex items-end justify-center">
                  <div 
                    className="w-1 bg-primary rounded-t"
                    style={{ height: `${Math.random() * 24 + 8}px` }}
                  />
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  {(Math.random() * 3 + 0.5).toFixed(1)}m
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotCard;
