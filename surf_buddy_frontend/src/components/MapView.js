import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { FiSearch, FiStar, FiMapPin, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getWeatherData } from '../services/stormglassApi';
import { saveFavoriteSpot, getFavoriteSpots, removeFavoriteSpot } from '../services/localStorage';
import SpotCard from './SpotCard';
import WeatherWidget from './WeatherWidget';

// PUBLIC_INTERFACE
const MapView = () => {
  /**
   * Main map view component with Google Maps integration and surf spot search
   * @returns {JSX.Element} Map view with search and spot information
   */
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [favoriteSpots, setFavoriteSpots] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load favorite spots on component mount
  useEffect(() => {
    setFavoriteSpots(getFavoriteSpots());
  }, []);

  const handleMapClick = useCallback(async (latLng, google) => {
    const lat = latLng.lat();
    const lng = latLng.lng();

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new marker
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: googleMapRef.current,
      title: 'Surf Spot',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="15" fill="#1986d9" stroke="white" stroke-width="2"/>
            <path d="M16 8c-4.4 0-8 3.6-8 8 0 4.4 8 12 8 12s8-7.6 8-12c0-4.4-3.6-8-8-8z" fill="white"/>
            <circle cx="16" cy="16" r="3" fill="#1986d9"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32)
      }
    });

    markersRef.current.push(marker);

    // Get location name using reverse geocoding
    const geocoder = new google.maps.Geocoder();
    try {
      const results = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK') {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });

      const locationName = results[0]?.formatted_address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
      const spotData = {
        id: `${lat}-${lng}`,
        name: locationName,
        lat,
        lng,
        createdAt: new Date().toISOString()
      };

      setSelectedSpot(spotData);
      
      // Fetch weather data
      setLoading(true);
      try {
        const weather = await getWeatherData(lat, lng);
        setWeatherData(weather);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
      setLoading(false);

    } catch (error) {
      console.error('Error getting location name:', error);
      const spotData = {
        id: `${lat}-${lng}`,
        name: `Surf Spot (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        lat,
        lng,
        createdAt: new Date().toISOString()
      };
      setSelectedSpot(spotData);
    }
  }, []);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places']
      });

      try {
        const google = await loader.load();
        
        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 33.7701, lng: -118.1937 }, // Default to Huntington Beach
            zoom: 10,
            styles: [
              {
                featureType: 'water',
                elementType: 'all',
                stylers: [{ color: '#0ea5e9' }]
              },
              {
                featureType: 'landscape.natural',
                elementType: 'all',
                stylers: [{ color: '#ffe3b3' }, { lightness: 20 }]
              }
            ]
          });

          googleMapRef.current = map;
          setMapLoaded(true);

          // Add click listener for dropping pins
          map.addListener('click', (event) => {
            handleMapClick(event.latLng, google);
          });
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        toast.error('Failed to load map. Please check your API key.');
      }
    };

    if (process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
      initMap();
    } else {
      toast.error('Google Maps API key not found. Please add it to your environment variables.');
    }
  }, [handleMapClick]);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim() || !mapLoaded) return;

    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places']
    });

    try {
      const google = await loader.load();
      const service = new google.maps.places.PlacesService(googleMapRef.current);

      const request = {
        query: `${searchTerm} surf spot beach`,
        fields: ['name', 'geometry', 'formatted_address', 'rating']
      };

      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
          const place = results[0];
          const location = place.geometry.location;
          
          googleMapRef.current.setCenter(location);
          googleMapRef.current.setZoom(12);
          
          // Simulate a click at this location
          handleMapClick(location, google);
        } else {
          toast.error('No surf spots found for this search term.');
        }
      });
    } catch (error) {
      console.error('Error searching for location:', error);
      toast.error('Error searching for location.');
    }
  }, [searchTerm, mapLoaded, handleMapClick]);

  const handleToggleFavorite = useCallback((spot) => {
    const isFavorite = favoriteSpots.some(fav => fav.id === spot.id);
    
    if (isFavorite) {
      removeFavoriteSpot(spot.id);
      setFavoriteSpots(prev => prev.filter(fav => fav.id !== spot.id));
      toast.success('Removed from favorites');
    } else {
      saveFavoriteSpot(spot);
      setFavoriteSpots(prev => [...prev, spot]);
      toast.success('Added to favorites');
    }
  }, [favoriteSpots]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header with Search */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 mt-16 md:mt-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for surf spots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="btn-primary flex items-center space-x-2"
            >
              <FiSearch className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map and Sidebar */}
      <div className="flex-1 flex">
        {/* Map Container */}
        <div className="flex-1 relative">
          <div 
            ref={mapRef} 
            className="w-full h-full"
            style={{ minHeight: '400px' }}
          />
          
          {!mapLoaded && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <FiActivity className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar for spot info */}
        {selectedSpot && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {selectedSpot.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FiMapPin className="w-4 h-4 mr-1" />
                    {selectedSpot.lat.toFixed(4)}, {selectedSpot.lng.toFixed(4)}
                  </div>
                </div>
                <button
                  onClick={() => handleToggleFavorite(selectedSpot)}
                  className={`p-2 rounded-lg transition-colors ${
                    favoriteSpots.some(fav => fav.id === selectedSpot.id)
                      ? 'text-yellow-500 bg-yellow-50'
                      : 'text-gray-400 bg-gray-50'
                  }`}
                >
                  <FiStar className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Weather Widget */}
            {weatherData && (
              <WeatherWidget 
                data={weatherData} 
                loading={loading}
              />
            )}

            {/* Spot Card */}
            <SpotCard spot={selectedSpot} />
          </div>
        )}
      </div>

      {/* Mobile Spot Info Overlay */}
      {selectedSpot && (
        <div className="md:hidden fixed bottom-20 left-4 right-4 z-30">
          <div className="bg-white rounded-xl shadow-lg p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {selectedSpot.name}
              </h3>
              <button
                onClick={() => handleToggleFavorite(selectedSpot)}
                className={`p-1 rounded transition-colors ${
                  favoriteSpots.some(fav => fav.id === selectedSpot.id)
                    ? 'text-yellow-500'
                    : 'text-gray-400'
                }`}
              >
                <FiStar className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FiMapPin className="w-4 h-4 mr-1" />
              {selectedSpot.lat.toFixed(4)}, {selectedSpot.lng.toFixed(4)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
