// PUBLIC_INTERFACE
export const saveSession = (session) => {
  /**
   * Saves a surf session to local storage
   * @param {Object} session - Session data
   */
  const sessions = getSessions();
  const newSession = {
    ...session,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  sessions.push(newSession);
  localStorage.setItem('surfSessions', JSON.stringify(sessions));
  return newSession;
};

// PUBLIC_INTERFACE
export const getSessions = () => {
  /**
   * Retrieves all surf sessions from local storage
   * @returns {Array} Array of surf sessions
   */
  try {
    const sessions = localStorage.getItem('surfSessions');
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error loading sessions:', error);
    return [];
  }
};

// PUBLIC_INTERFACE
export const deleteSession = (sessionId) => {
  /**
   * Deletes a specific surf session
   * @param {string} sessionId - ID of session to delete
   */
  const sessions = getSessions();
  const filtered = sessions.filter(session => session.id !== sessionId);
  localStorage.setItem('surfSessions', JSON.stringify(filtered));
};

// PUBLIC_INTERFACE
export const updateSession = (sessionId, updates) => {
  /**
   * Updates a specific surf session
   * @param {string} sessionId - ID of session to update
   * @param {Object} updates - Updates to apply
   */
  const sessions = getSessions();
  const index = sessions.findIndex(session => session.id === sessionId);
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...updates };
    localStorage.setItem('surfSessions', JSON.stringify(sessions));
  }
};

// PUBLIC_INTERFACE
export const saveFavoriteSpot = (spot) => {
  /**
   * Saves a favorite surf spot
   * @param {Object} spot - Spot data
   */
  const spots = getFavoriteSpots();
  const exists = spots.find(s => s.id === spot.id);
  if (!exists) {
    spots.push(spot);
    localStorage.setItem('favoriteSpots', JSON.stringify(spots));
  }
};

// PUBLIC_INTERFACE
export const getFavoriteSpots = () => {
  /**
   * Retrieves favorite surf spots
   * @returns {Array} Array of favorite spots
   */
  try {
    const spots = localStorage.getItem('favoriteSpots');
    return spots ? JSON.parse(spots) : [];
  } catch (error) {
    console.error('Error loading favorite spots:', error);
    return [];
  }
};

// PUBLIC_INTERFACE
export const removeFavoriteSpot = (spotId) => {
  /**
   * Removes a favorite surf spot
   * @param {string} spotId - ID of spot to remove
   */
  const spots = getFavoriteSpots();
  const filtered = spots.filter(spot => spot.id !== spotId);
  localStorage.setItem('favoriteSpots', JSON.stringify(filtered));
};
