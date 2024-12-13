import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import WeatherScreen from './src/screens/WeatherScreen';
import CitiesScreen from './src/screens/CitiesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';
import { TemperatureProvider } from './src/context/TemperatureContext';
import { CityProvider } from './src/context/CityContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,  
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Weather') {
          iconName = 'wb-sunny';
        } else if (route.name === 'Cities') {
          iconName = 'location-city';
        } else if (route.name === 'Settings') {
          iconName = 'settings';
        }

        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4a90e2',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: '#1e1e1e',
        borderTopColor: '#333',
        height: 60,
        paddingBottom: 5,
      },
    })}
  >
    <Tab.Screen name="Weather" component={WeatherScreen} />
    <Tab.Screen name="Cities" component={CitiesScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="MainApp" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <AuthProvider>
            <TemperatureProvider>
              <CityProvider>
                <AppNavigator />
              </CityProvider>
            </TemperatureProvider>
          </AuthProvider>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
