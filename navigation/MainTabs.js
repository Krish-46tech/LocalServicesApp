import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { ServiceListScreen } from '../screens/ServiceListScreen';
import { MapScreen } from '../screens/MapScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { THEME } from '../constants/theme';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: THEME.colors.textMuted,
        tabBarStyle: {
          height: 72,
          borderTopWidth: 0,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: THEME.colors.surface,
          ...THEME.shadow
        },
        tabBarLabelStyle: {
          fontFamily: THEME.font.medium,
          fontSize: 12
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            Home: 'home',
            Services: 'grid',
            Map: 'map',
            Profile: 'person-circle'
          };

          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={ServiceListScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
