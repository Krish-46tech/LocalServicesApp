import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import { ServiceDetailScreen } from '../screens/ServiceDetailScreen';
import { THEME } from '../constants/theme';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: { fontFamily: THEME.font.bold, color: THEME.colors.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: THEME.colors.background },
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{ title: 'Service Details', presentation: 'card' }}
      />
    </Stack.Navigator>
  );
}
