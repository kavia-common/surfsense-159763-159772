import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiMap, 
  FiBookOpen, 
  FiBarChart, 
  FiUser,
  FiActivity
} from 'react-icons/fi';

// PUBLIC_INTERFACE
const Navigation = ({ activeTab, setActiveTab }) => {
  /**
   * Bottom navigation component for mobile-first design
   * @param {string} activeTab - Currently active tab
   * @param {function} setActiveTab - Function to set active tab
   * @returns {JSX.Element} Navigation component
   */
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'map', label: 'Map', icon: FiMap, path: '/map' },
    { id: 'sessions', label: 'Sessions', icon: FiBookOpen, path: '/sessions' },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart, path: '/analytics' },
    { id: 'profile', label: 'Profile', icon: FiUser, path: '/profile' }
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  const currentPath = location.pathname;

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPath === tab.path;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`flex-1 py-3 px-2 text-center transition-colors duration-200 ${
                  isActive
                    ? 'text-primary border-t-2 border-primary bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Header Navigation */}
      <header className="hidden md:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <FiActivity className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold text-primary">SurfBuddy</h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentPath === tab.path;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-primary bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navigation;
