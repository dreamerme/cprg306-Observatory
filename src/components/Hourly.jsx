import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { weatherService } from '../services/weatherService';
import { useTemperature } from '../context/TemperatureContext';
import { useCity } from '../context/CityContext';

const HourlyItem = ({ time, temp, feelsLike, rainChance, weather }) => {
  const { formatTemperature } = useTemperature();
  return (
    <View style={styles.hourlyItem}>
      <Text style={styles.timeText}>{time}</Text>
      <MaterialIcons 
        name={weather?.toLowerCase().includes('clear') ? 'wb-sunny' : 'cloud'} 
        size={32} 
        color="white" 
      />
      <Text style={styles.tempText}>{formatTemperature(parseFloat(temp))}</Text>
      <Text style={styles.feelsLikeText}>
        {`Feels ${formatTemperature(parseFloat(feelsLike))}`}
      </Text>
      <View style={styles.rainContainer}>
        <MaterialIcons name="grain" size={15} color="white" />
        <Text style={styles.rainText}>{rainChance}</Text>
      </View>
    </View>
  );
};

const Hourly = () => {
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatTemperature } = useTemperature();
  const { selectedCity } = useCity();

  useEffect(() => {
    fetchHourlyData();
  }, [selectedCity]); // 当选中的城市改变时重新获取数据

  const fetchHourlyData = async () => {
    try {
      if (!selectedCity || !selectedCity.city) {
        console.error('No city selected');
        return;
      }

      const data = await weatherService.getForecast(selectedCity.city);
      
      // 生成从现在开始每2小时的时间点
      const now = new Date();
      const hours = Array.from({ length: 6 }, (_, i) => {
        const time = new Date(now);
        time.setHours(time.getHours() + (i * 2));
        return {
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: time.getTime(),
        };
      });

      // 将API数据转换为时间戳映射
      const forecastMap = data.reduce((acc, forecast) => {
        acc[forecast.dt * 1000] = forecast;
        return acc;
      }, {});

      // 获取所有可用的预报时间戳
      const availableTimestamps = Object.keys(forecastMap).map(Number);

      // 将每个目标时间点匹配到最近的可用预报
      const processedData = hours.map(hour => {
        // 找到最接近的可用预报时间戳
        const closestTimestamp = availableTimestamps.reduce((closest, current) => {
          const currentDiff = Math.abs(current - hour.timestamp);
          const closestDiff = Math.abs(closest - hour.timestamp);
          return currentDiff < closestDiff ? current : closest;
        });

        const forecast = forecastMap[closestTimestamp];

        if (!forecast) {
          console.warn(`No forecast found for time: ${hour.time}`);
          return null;
        }

        return {
          time: hour.time,
          temp: forecast.main.temp,
          feelsLike: forecast.main.feels_like,
          rainChance: forecast.pop ? `${Math.round(forecast.pop * 100)}%` : '0%',
          weather: forecast.weather[0]?.main || 'Clear'
        };
      }).filter(Boolean);

      console.log('Processed forecast data:', processedData);
      setHourlyData(processedData);
    } catch (error) {
      console.error('Error fetching hourly data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hourly</Text>
        <Text style={styles.loadingText}>Loading forecast data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hourly</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.hourlyContainer}>
          {hourlyData.map((item, index) => (
            <HourlyItem
              key={index}
              time={item.time}
              temp={item.temp}
              feelsLike={item.feelsLike}
              rainChance={item.rainChance}
              weather={item.weather}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 80,  // 添加底部边距
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    opacity: 0.7,
  },
  hourlyContainer: {
    flexDirection: 'row',
    paddingRight: 15,
  },
  hourlyItem: {
    alignItems: 'center',
    marginRight: 25,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
  },
  timeText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    opacity: 0.7,
  },
  tempText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  feelsLikeText: {
    color: 'white',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 5,
  },
  rainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  rainText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
    opacity: 0.7,
  },
});

export default Hourly;
