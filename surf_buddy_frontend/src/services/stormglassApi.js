import axios from 'axios';

const STORMGLASS_API_KEY = process.env.REACT_APP_STORMGLASS_API_KEY;
const BASE_URL = 'https://api.stormglass.io/v2';

const stormglassApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': STORMGLASS_API_KEY
  }
});

// PUBLIC_INTERFACE
export const getWeatherData = async (lat, lng) => {
  /**
   * Fetches weather and wave data for a specific location
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise} Weather data including wave height, wind, etc.
   */
  try {
    const params = [
      'waveHeight',
      'wavePeriod',
      'waveDirection',
      'windSpeed',
      'windDirection',
      'airTemperature',
      'waterTemperature'
    ].join(',');

    const response = await stormglassApi.get('/weather/point', {
      params: {
        lat,
        lng,
        params,
        start: Math.floor(Date.now() / 1000),
        end: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days ahead
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return mock data if API fails
    return {
      hours: Array.from({ length: 24 }, (_, i) => ({
        time: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
        waveHeight: { sg: Math.random() * 3 + 0.5 },
        wavePeriod: { sg: Math.random() * 5 + 8 },
        waveDirection: { sg: Math.random() * 360 },
        windSpeed: { sg: Math.random() * 20 + 5 },
        windDirection: { sg: Math.random() * 360 },
        airTemperature: { sg: Math.random() * 10 + 20 },
        waterTemperature: { sg: Math.random() * 5 + 18 }
      }))
    };
  }
};

// PUBLIC_INTERFACE
export const getTideData = async (lat, lng) => {
  /**
   * Fetches tide data for a specific location
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise} Tide data
   */
  try {
    const response = await stormglassApi.get('/tide/extremes/point', {
      params: {
        lat,
        lng,
        start: Math.floor(Date.now() / 1000),
        end: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching tide data:', error);
    return { data: [] };
  }
};
