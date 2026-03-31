import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { ServiceListScreen } from '../screens/ServiceListScreen';
import { MapScreen } from '../screens/MapScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useAppTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  const { theme } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          height: 72,
          borderTopWidth: 0,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: theme.colors.surface,
          ...theme.shadow
        },
        tabBarLabelStyle: {
          fontFamily: theme.font.medium,
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
