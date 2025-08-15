import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FiCamera, FiX, FiMapPin, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';

// PUBLIC_INTERFACE
const SessionForm = ({ onSubmit, loading, initialData }) => {
  /**
   * Form component for adding or editing surf sessions
   * @param {function} onSubmit - Function to call when form is submitted
   * @param {boolean} loading - Loading state
   * @param {Object} initialData - Initial data for editing
   * @returns {JSX.Element} Session form with all required fields
   */
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
      location: initialData?.location || '',
      waveHeight: initialData?.waveHeight || '',
      board: initialData?.board || '',
      duration: initialData?.duration || '',
      rating: initialData?.rating || 3,
      notes: initialData?.notes || '',
      conditions: initialData?.conditions || 'fair',
      crowd: initialData?.crowd || 'moderate'
    }
  });

  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState(initialData?.photos || []);
  const fileInputRef = useRef(null);

  const rating = watch('rating');

  const handlePhotoSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + selectedPhotos.length > 5) {
      alert('Maximum 5 photos allowed');
      return;
    }

    setSelectedPhotos(prev => [...prev, ...files]);

    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrls(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    const isExistingPhoto = index < (initialData?.photos?.length || 0);
    
    if (isExistingPhoto) {
      // Remove from preview URLs only
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove from both selected photos and preview URLs
      const photoIndex = index - (initialData?.photos?.length || 0);
      setSelectedPhotos(prev => prev.filter((_, i) => i !== photoIndex));
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      photos: selectedPhotos,
      existingPhotos: initialData?.photos || []
    });
  };

  const boards = [
    'Shortboard', 'Longboard', 'Fish', 'Funboard', 'Gun', 'SUP', 'Bodyboard', 'Other'
  ];

  const conditions = [
    { value: 'poor', label: 'Poor', color: 'text-red-600' },
    { value: 'fair', label: 'Fair', color: 'text-yellow-600' },
    { value: 'good', label: 'Good', color: 'text-green-600' },
    { value: 'excellent', label: 'Excellent', color: 'text-blue-600' }
  ];

  const crowdLevels = [
    { value: 'empty', label: 'Empty' },
    { value: 'light', label: 'Light' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'crowded', label: 'Crowded' },
    { value: 'packed', label: 'Packed' }
  ];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Date and Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiCalendar className="inline w-4 h-4 mr-1" />
            Date
          </label>
          <input
            type="date"
            {...register('date', { required: 'Date is required' })}
            className="input-field"
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMapPin className="inline w-4 h-4 mr-1" />
            Location
          </label>
          <input
            type="text"
            placeholder="e.g., Huntington Beach"
            {...register('location', { required: 'Location is required' })}
            className="input-field"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>
      </div>

      {/* Wave Height and Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wave Height (ft)
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            max="50"
            placeholder="2.5"
            {...register('waveHeight', { 
              required: 'Wave height is required',
              min: { value: 0, message: 'Must be positive' }
            })}
            className="input-field"
          />
          {errors.waveHeight && (
            <p className="text-red-500 text-sm mt-1">{errors.waveHeight.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (hours)
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            max="12"
            placeholder="2"
            {...register('duration', { 
              required: 'Duration is required',
              min: { value: 0.5, message: 'Minimum 0.5 hours' }
            })}
            className="input-field"
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
          )}
        </div>
      </div>

      {/* Board and Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Board Type
          </label>
          <select {...register('board', { required: 'Board type is required' })} className="input-field">
            <option value="">Select board type</option>
            {boards.map(board => (
              <option key={board} value={board}>{board}</option>
            ))}
          </select>
          {errors.board && (
            <p className="text-red-500 text-sm mt-1">{errors.board.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conditions
          </label>
          <select {...register('conditions')} className="input-field">
            {conditions.map(condition => (
              <option key={condition.value} value={condition.value}>
                {condition.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Crowd Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Crowd Level
        </label>
        <select {...register('crowd')} className="input-field">
          {crowdLevels.map(level => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session Rating
        </label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setValue('rating', star)}
              className={`text-2xl transition-colors ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </button>
          ))}
          <span className="text-sm text-gray-600 ml-2">
            ({rating}/5)
          </span>
        </div>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FiCamera className="inline w-4 h-4 mr-1" />
          Photos (Max 5)
        </label>
        
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {previewUrls.length < 5 && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors"
            >
              <FiCamera className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <span className="text-sm text-gray-600">
                Click to add photos ({previewUrls.length}/5)
              </span>
            </button>
          </>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          {...register('notes')}
          rows={4}
          placeholder="How was the session? Any memorable moments..."
          className="input-field resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (initialData ? 'Update Session' : 'Log Session')}
        </button>
      </div>
    </form>
  );
};

export default SessionForm;
