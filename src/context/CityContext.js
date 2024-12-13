import React, { createContext, useContext, useState } from 'react';

const CityContext = createContext();

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState({
    city: 'Calgary',
    region: 'Alberta',
  });

  const value = {
    selectedCity,
    setSelectedCity,
  };

  return (
    <CityContext.Provider value={value}>
      {children}
    </CityContext.Provider>
  );
};
