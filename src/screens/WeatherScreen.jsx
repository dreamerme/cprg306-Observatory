import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import DetailObservations from '../components/DetailObservations';
import Outdoor from '../components/Outdoor';
import Hourly from '../components/Hourly';
import { weatherService } from '../services/weatherService';
import { useTemperature } from '../context/TemperatureContext';
import { useCity } from '../context/CityContext';

const WeatherScreen = () => {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const { formatTemperature } = useTemperature();
  const { selectedCity } = useCity();

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [currentWeather, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(selectedCity?.city),
        weatherService.getForecast(selectedCity?.city)
      ]);

      setWeather(currentWeather);
      setForecast(forecastData);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCity) {
      fetchWeatherData();
    }
  }, [selectedCity]);

  const getWeatherIcon = () => {
    if (!weather?.weather?.[0]?.main) return 'help-outline';
    const condition = weather.weather[0].main.toLowerCase();
    switch (condition) {
      case 'clear': return 'wb-sunny';
      case 'clouds': return 'cloud';
      case 'rain': return 'grain';
      case 'snow': return 'ac-unit';
      case 'thunderstorm': return 'flash-on';
      case 'drizzle': return 'water-drop';
      case 'mist':
      case 'smoke':
      case 'haze':
      case 'fog':
        return 'water';
      default: return 'help-outline';
    }
  };

  if (!selectedCity) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.message}>Please select a city first</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#4a90e2', '#285f7c']}
      style={styles.gradient}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.cityName}>{selectedCity.city}</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        <View style={styles.currentWeather}>
          <MaterialIcons name={getWeatherIcon()} size={64} color="white" />
          <Text style={styles.temperature}>
            {weather ? formatTemperature(weather.main.temp) : '--'}
          </Text>
          <Text style={styles.description}>
            {weather?.weather[0]?.description || '--'}
          </Text>
        </View>

        {weather && (
          <>
            <DetailObservations weather={weather} />
            <Outdoor weather={weather} />
            {forecast && <Hourly forecast={forecast} />}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  message: {
    color: 'white',
    fontSize: 18,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 18,
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  cityName: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  currentWeather: {
    alignItems: 'center',
    marginBottom: 30,
  },
  temperature: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    color: 'white',
    fontSize: 20,
    textTransform: 'capitalize',
  },
});

export default WeatherScreen;
