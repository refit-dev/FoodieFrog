'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const GoogleMapsContext = createContext();

export function GoogleMapsProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, setIsLoaded }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within GoogleMapsProvider');
  }
  return context;
};