import React from 'react';
import { FiWind, FiThermometer, FiDroplet } from 'react-icons/fi';

// PUBLIC_INTERFACE
const WeatherWidget = ({ data, loading }) => {
  /**
   * Weather widget component to display current wave and weather conditions
   * @param {Object} data - Weather data from Stormglass API
   * @param {boolean} loading - Loading state
   * @returns {JSX.Element} Weather widget with current conditions
   */
  if (loading) {
    return (
      <div className="p-4 border-b border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.hours || data.hours.length === 0) {
    return null;
  }

  const currentConditions = data.hours[0];
  const waveHeight = currentConditions.waveHeight?.sg || 0;
  const wavePeriod = currentConditions.wavePeriod?.sg || 0;
  const windSpeed = currentConditions.windSpeed?.sg || 0;
  const airTemp = currentConditions.airTemperature?.sg || 0;
  const waterTemp = currentConditions.waterTemperature?.sg || 0;

  const getWaveCondition = (height) => {
    if (height < 1) return { text: 'Flat', color: 'text-gray-500' };
    if (height < 2) return { text: 'Small', color: 'text-blue-500' };
    if (height < 4) return { text: 'Good', color: 'text-green-500' };
    if (height < 6) return { text: 'Great', color: 'text-yellow-500' };
    return { text: 'Epic', color: 'text-red-500' };
  };

  const waveCondition = getWaveCondition(waveHeight);

  return (
    <div className="p-4 border-b border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-3">Current Conditions</h4>
      
      {/* Wave Info */}
      <div className="bg-gradient-to-r from-ocean-50 to-ocean-100 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Wave Height</span>
          <span className={`text-lg font-bold ${waveCondition.color}`}>
            {waveHeight.toFixed(1)}m
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Condition</span>
          <span className={`text-sm font-medium ${waveCondition.color}`}>
            {waveCondition.text}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-gray-600">Period</span>
          <span className="text-sm font-medium text-gray-700">
            {wavePeriod.toFixed(0)}s
          </span>
        </div>
      </div>

      {/* Weather Grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Wind */}
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <FiWind className="w-5 h-5 text-gray-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Wind</div>
          <div className="text-sm font-semibold text-gray-900">
            {windSpeed.toFixed(0)}kt
          </div>
        </div>

        {/* Air Temp */}
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <FiThermometer className="w-5 h-5 text-gray-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Air</div>
          <div className="text-sm font-semibold text-gray-900">
            {airTemp.toFixed(0)}°C
          </div>
        </div>

        {/* Water Temp */}
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <FiDroplet className="w-5 h-5 text-gray-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Water</div>
          <div className="text-sm font-semibold text-gray-900">
            {waterTemp.toFixed(0)}°C
          </div>
        </div>
      </div>

      {/* Wave Animation */}
      <div className="mt-3 h-2 bg-gradient-to-r from-ocean-200 to-ocean-400 rounded-full overflow-hidden">
        <div className="h-full wave-animation"></div>
      </div>
    </div>
  );
};

export default WeatherWidget;
