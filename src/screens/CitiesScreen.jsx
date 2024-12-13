import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { weatherService } from '../services/weatherService';
import { useTemperature } from '../context/TemperatureContext';
import { useCity } from '../context/CityContext';
import { useNavigation } from '@react-navigation/native';

const CityCard = ({ city, region, temp, icon, onSelect, isSelected }) => {
  const { formatTemperature } = useTemperature();
  return (
    <TouchableOpacity 
      style={[styles.cityCard, isSelected && styles.selectedCard]} 
      onPress={onSelect}
    >
      <View style={styles.cityInfo}>
        <View style={styles.cityHeader}>
          <MaterialIcons 
            name={isSelected ? "location-on" : "location-city"} 
            size={20} 
            color="white" 
          />
          <Text style={styles.cityName}>{city}</Text>
        </View>
        <Text style={styles.regionName}>{region}</Text>
      </View>
      <View style={styles.tempInfo}>
        <MaterialIcons name={icon} size={24} color="white" />
        <Text style={styles.tempText}>{temp}</Text>
      </View>
    </TouchableOpacity>
  );
};

const CitiesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatTemperature } = useTemperature();
  const { selectedCity, setSelectedCity } = useCity();
  const navigation = useNavigation();

  const fetchCitiesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const citiesData = await weatherService.getAllCitiesWeather();
      const processedData = citiesData.map(city => ({
        ...city,
        temp: formatTemperature(parseFloat(city.temp?.replace(/[°CF]/g, ''))) || '0°'
      }));
      setCities(processedData);
    } catch (err) {
      console.error('Error fetching cities data:', err);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitiesData();
    const refreshInterval = setInterval(fetchCitiesData, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [formatTemperature]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    navigation.navigate('Weather');
  };

  const filteredCities = cities.filter(city => 
    city.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient
      colors={['rgb(74,144,226)', 'rgb(40,79,124)']}
      style={styles.container}
      locations={[0.62, 1]}
    >
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search city or region"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={fetchCitiesData}
          >
            <MaterialIcons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.citiesList}>
        {error ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          filteredCities.map((city) => (
            <CityCard
              key={city.city}
              {...city}
              onSelect={() => handleCitySelect(city)}
              isSelected={selectedCity?.city === city.city}
            />
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    padding: 5,
  },
  citiesList: {
    paddingHorizontal: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
  cityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  selectedCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cityInfo: {
    flex: 1,
  },
  cityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  regionName: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 30,
  },
  tempInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tempText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default CitiesScreen;
