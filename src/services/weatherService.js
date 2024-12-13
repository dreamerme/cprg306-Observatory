import { WEATHER_API_CONFIG } from '../config/api.config';

const CITIES = {
    Calgary: { lat: 51.0460954, lon: -114.065465 },
    Vancouver: { lat: 49.2827, lon: -123.1207 },
    'Hong Kong': { lat: 22.3193, lon: 114.1694 },
    Regina: { lat: 50.4452, lon: -104.6189 },
    Toronto: { lat: 43.6532, lon: -79.3832 }
};

export const weatherService = {
    getCurrentWeather: async (city) => {
        try {
            console.log('Fetching current weather for:', city || 'Calgary');
            const coords = city ? CITIES[city] : CITIES.Calgary;
            if (!coords) {
                throw new Error('City not found');
            }
            
            const url = `${WEATHER_API_CONFIG.BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&units=${WEATHER_API_CONFIG.UNITS}&appid=${WEATHER_API_CONFIG.API_KEY}`;
            console.log('Weather API URL:', url);
            
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Response:', errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Weather data received:', data);
            return data;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    },

    getAllCitiesWeather: async () => {
        try {
            const cities = Object.keys(CITIES);
            const weatherPromises = cities.map(city => weatherService.getCurrentWeather(city));
            const weatherData = await Promise.all(weatherPromises);
            
            return weatherData.map((data, index) => ({
                city: cities[index],
                region: data.sys?.country === 'CA' ? 
                    (cities[index] === 'Vancouver' ? 'British Columbia' :
                     cities[index] === 'Calgary' ? 'Alberta' :
                     cities[index] === 'Regina' ? 'Saskatchewan' :
                     cities[index] === 'Toronto' ? 'Ontario' : '') :
                    data.sys?.country === 'HK' ? 'Hong Kong SAR' : data.sys?.country,
                temp: `${Math.round(data.main?.temp)}°C`,
                icon: data.weather?.[0]?.main?.toLowerCase().includes('clear') ? 'wb-sunny' :
                      data.weather?.[0]?.main?.toLowerCase().includes('cloud') ? 'cloud' :
                      data.weather?.[0]?.main?.toLowerCase().includes('rain') ? 'grain' :
                      data.weather?.[0]?.main?.toLowerCase().includes('snow') ? 'ac-unit' :
                      'cloud'
            }));
        } catch (error) {
            console.error('Error fetching all cities weather:', error);
            throw error;
        }
    },

    getForecast: async (city) => {
        try {
            console.log('Fetching forecast for:', city || 'Calgary');
            const coords = city ? CITIES[city] : CITIES.Calgary;
            if (!coords) {
                throw new Error('City not found');
            }

            const url = `${WEATHER_API_CONFIG.BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&units=${WEATHER_API_CONFIG.UNITS}&appid=${WEATHER_API_CONFIG.API_KEY}`;
            console.log('Forecast API URL:', url);

            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Response:', errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Forecast data received:', data);
            return data.list;
        } catch (error) {
            console.error('Error fetching forecast data:', error);
            throw error;
        }
    }
};
