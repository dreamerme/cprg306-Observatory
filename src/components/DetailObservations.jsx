import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import WeatherCard from './WeatherCard';

const DetailObservations = ({ weather }) => {
  if (!weather || !weather.main || !weather.sys || !weather.wind) {
    return null;
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return { time: '--:--', period: '--' };
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    
    return {
      time: `${formattedHours}:${minutes}`,
      period: period
    };
  };

  const sunrise = formatTime(weather.sys.sunrise);
  const sunset = formatTime(weather.sys.sunset);
  const windSpeed = Math.round(weather.wind.speed);
  const humidity = weather.main.humidity;
  const dewPoint = Math.round(weather.main.temp - (100 - weather.main.humidity) / 5);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detailed Observations</Text>
      <View style={styles.cardsContainer}>
        <View style={styles.row}>
          <WeatherCard 
            icon="wb-sunny" 
            title="Sunrise" 
            value={sunrise.time}
            subValue={sunrise.period}
          />
          <WeatherCard 
            icon="wb-twilight" 
            title="Sunset" 
            value={sunset.time}
            subValue={sunset.period}
          />
        </View>
        <View style={styles.row}>
          <WeatherCard 
            icon="air" 
            title="Wind" 
            value={`${windSpeed} m/s`}
          />
          <WeatherCard 
            icon="water-drop" 
            title="Humidity" 
            value={`${humidity}%`}
          />
        </View>
        <View style={styles.row}>
          <WeatherCard 
            icon="thermostat" 
            title="Dew Point" 
            value={`${dewPoint}°`}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cardsContainer: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default DetailObservations;
