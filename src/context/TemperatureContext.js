import React, { createContext, useContext, useState } from 'react';

const TemperatureContext = createContext();

export const useTemperature = () => {
  const context = useContext(TemperatureContext);
  if (!context) {
    throw new Error('useTemperature must be used within a TemperatureProvider');
  }
  return context;
};

export const TemperatureProvider = ({ children }) => {
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');

  const formatTemperature = (temp) => {
    if (typeof temp !== 'number') return '-';
    const roundedTemp = Math.round(temp);
    return temperatureUnit === 'celsius' 
      ? `${roundedTemp}°C`
      : `${Math.round((roundedTemp * 9/5) + 32)}°F`;
  };

  const value = {
    temperatureUnit,
    setTemperatureUnit,
    formatTemperature,
  };

  return (
    <TemperatureContext.Provider value={value}>
      {children}
    </TemperatureContext.Provider>
  );
};
