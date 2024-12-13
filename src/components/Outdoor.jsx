import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTemperature } from '../context/TemperatureContext';

const OutdoorItem = ({ icon, title, value, indicator }) => (
  <View style={styles.item}>
    <View style={styles.itemHeader}>
      <MaterialCommunityIcons name={icon} size={24} color="white" />
      <Text style={styles.itemTitle}>{title}</Text>
    </View>
    <View style={styles.itemContent}>
      <Text style={styles.itemValue}>{value}</Text>
      <View style={[styles.indicator, { backgroundColor: indicator }]} />
    </View>
  </View>
);

const getAirQualityInfo = (weather) => {
  // 基于温度和湿度简单估算空气质量
  if (!weather) return { value: 'Unknown', color: '#FFA500' };
  
  const temp = weather.main?.temp || 0;
  const humidity = weather.main?.humidity || 0;
  
  if (temp > 30 || humidity > 80) {
    return { value: 'High Risk', color: '#F44336' };
  } else if (temp > 25 || humidity > 70) {
    return { value: 'Medium Risk', color: '#FFA500' };
  } else {
    return { value: 'Low Risk', color: '#4CAF50' };
  }
};

const getUVInfo = (weather) => {
  // 基于天气状况简单估算UV指数
  if (!weather) return { value: 'Unknown', color: '#FFA500' };
  
  const condition = weather.weather?.[0]?.main?.toLowerCase();
  
  if (condition === 'clear') {
    return { value: 'High', color: '#F44336' };
  } else if (condition === 'clouds') {
    return { value: 'Medium', color: '#FFA500' };
  } else {
    return { value: 'Low', color: '#4CAF50' };
  }
};

const getHealthInfo = (weather) => {
  // 基于温度和天气状况估算健康风险
  if (!weather) return { value: 'Unknown', color: '#FFA500' };
  
  const temp = weather.main?.temp || 0;
  const condition = weather.weather?.[0]?.main?.toLowerCase();
  
  if (temp > 35 || temp < -10 || condition === 'storm') {
    return { value: 'High Risk', color: '#F44336' };
  } else if (temp > 30 || temp < 0 || condition === 'rain') {
    return { value: 'Medium Risk', color: '#FFA500' };
  } else {
    return { value: 'Low Risk', color: '#4CAF50' };
  }
};

const Outdoor = ({ weather }) => {
  if (!weather || !weather.main) {
    return null;
  }

  const airQuality = getAirQualityInfo(weather);
  const uvInfo = getUVInfo(weather);
  const healthInfo = getHealthInfo(weather);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Outdoor</Text>
      <View style={styles.itemsContainer}>
        <OutdoorItem
          icon="air-purifier"
          title="Air Quality"
          value={airQuality.value}
          indicator={airQuality.color}
        />
        <OutdoorItem
          icon="white-balance-sunny"
          title="UV"
          value={uvInfo.value}
          indicator={uvInfo.color}
        />
        <OutdoorItem
          icon="heart-pulse"
          title="Health"
          value={healthInfo.value}
          indicator={healthInfo.color}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
  },
  itemsContainer: {
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemTitle: {
    fontSize: 15,
    color: 'white',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemValue: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
  },
  indicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1,
    borderColor: 'white',
  },
});

export default Outdoor;
