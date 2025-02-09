import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor:Colors.Principal

    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Recetario"
        options={{
          title: 'Recetario',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="MisRecetas"
        options={{
          title: 'MisRecetas',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="book-account" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="super"
        options={{
          title: 'Super',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cart" size={24} color={color} />
          ),
        }}
      />
      
    </Tabs>
  );
}
