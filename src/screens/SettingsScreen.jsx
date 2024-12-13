import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTemperature } from '../context/TemperatureContext';
import { useAuth } from '../context/AuthContext';

const SettingItem = ({ icon, title, hasArrow = true, onPress }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingLeft}>
      <MaterialIcons name={icon} size={24} color="white" />
      <Text style={styles.settingText}>{title}</Text>
    </View>
    {hasArrow && (
      <MaterialIcons name="chevron-right" size={24} color="white" />
    )}
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const { temperatureUnit, setTemperatureUnit } = useTemperature();
  const { user, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const showModal = (title, content) => {
    setModalContent({ title, content });
    setModalVisible(true);
  };

  const handleNotifications = () => {
    showModal('Notifications', 
      'Weather Alert Settings:\n\n' +
      '• Severe Weather Alerts\n' +
      '  - Storms, heavy rain, extreme temperatures\n' +
      '  - Emergency weather warnings\n\n' +
      '• Daily Forecasts\n' +
      '  - Morning weather summary\n' +
      '  - Evening forecast updates\n\n' +
      '• Custom Alerts\n' +
      '  - Temperature thresholds\n' +
      '  - Precipitation alerts\n' +
      '  - Wind speed notifications'
    );
  };

  const handleAbout = () => {
    showModal('About Observatory',
      'Observatory Weather App\n' +
      'Version 1.0.0\n\n' +
      'Features:\n' +
      '• Real-time weather updates\n' +
      '• Multiple location tracking\n' +
      '• Detailed weather forecasts\n' +
      '• Customizable alerts\n\n' +
      'Created by:\n' +
      'Observatory Development Team\n\n' +
      'Contact:\n' +
      'support@observatory.com\n' +
      'www.observatory.com'
    );
  };

  const handleHelp = () => {
    showModal('Help & Support',
      'Need assistance? Here is how to get help:\n\n' +
      'Common Issues:\n' +
      '• Weather not updating?\n' +
      '  - Check your internet connection\n' +
      '  - Refresh the app\n' +
      '  - Verify location services\n\n' +
      '• Location problems?\n' +
      '  - Enable GPS\n' +
      '  - Grant location permissions\n\n' +
      'Contact Support:\n' +
      '• Email: support@observatory.com\n' +
      '• Visit: observatory.com/help\n' +
      '• Call: 1-800-WEATHER'
    );
  };

  const handlePrivacyPolicy = () => {
    showModal('Privacy Policy',
      'Privacy Policy\n\n' +
      'Data Collection:\n' +
      '• Location data\n' +
      '  - Current location\n' +
      '  - Saved locations\n\n' +
      '• User preferences\n' +
      '  - Temperature units\n' +
      '  - Notification settings\n\n' +
      'Data Usage:\n' +
      '• Weather forecasting\n' +
      '• Service improvements\n' +
      '• Anonymous analytics\n\n' +
      'Your Rights:\n' +
      '• Access your data\n' +
      '• Delete your data\n' +
      '• Opt out of analytics'
    );
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={['rgb(74,144,226)', 'rgb(40,79,124)']}
      locations={[0.62, 1]}
    >
      {/* Account Section */}
      <View style={styles.accountSection}>
        <MaterialIcons name="account-circle" size={49} color="white" />
        <View style={styles.accountInfo}>
          <Text style={styles.accountTitle}>Account</Text>
          <Text style={styles.accountName}>@{user?.username || 'Guest'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Content */}
      <View style={styles.settingsContent}>
        {/* Temperature Unit Toggle */}
        <View style={styles.unitToggleContainer}>
          <View style={styles.unitToggle}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                temperatureUnit === 'celsius' && styles.unitButtonActive,
              ]}
              onPress={() => setTemperatureUnit('celsius')}
            >
              <Text style={[
                styles.unitText,
                temperatureUnit === 'celsius' && styles.unitTextActive,
              ]}>°C</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                temperatureUnit === 'fahrenheit' && styles.unitButtonActive,
              ]}
              onPress={() => setTemperatureUnit('fahrenheit')}
            >
              <Text style={[
                styles.unitText,
                temperatureUnit === 'fahrenheit' && styles.unitTextActive,
              ]}>°F</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.settingsList}>
          <SettingItem icon="notifications" title="Notifications" onPress={handleNotifications} />
          <SettingItem icon="grid-on" title="Install Widgets" onPress={() => {}} />
          <SettingItem icon="help-outline" title="Help Centre" onPress={handleHelp} />
          <SettingItem icon="lock" title="Privacy Policy" onPress={handlePrivacyPolicy} />
          <SettingItem icon="info" title="About" onPress={handleAbout} />
        </View>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalText}>{modalContent.content}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  accountInfo: {
    marginLeft: 15,
  },
  accountTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  accountName: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    right: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  settingsContent: {
    flex: 1,
    paddingHorizontal: 15,
  },
  unitToggleContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 25,
    padding: 4,
  },
  unitButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  unitButtonActive: {
    backgroundColor: 'white',
  },
  unitText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  unitTextActive: {
    color: 'rgb(74,144,226)',
  },
  settingsList: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 15,
    marginTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  settingText: {
    fontSize: 16,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: '70%',
  },
  modalText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
