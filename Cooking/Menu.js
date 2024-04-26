import React, { Component } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Inicio from './Inicio';


const Tab = createBottomTabNavigator();

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    const { email } = this.props.route.params;

    return (
      <Tab.Navigator
        tabBarOptions={null} // Eliminamos tabBarOptions
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Inicio') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Chatbot') {
              iconName = focused ? 'robot' : 'robot-outline';
            } else if (route.name === 'CaminoAdiestramiento') {
              iconName = focused ? 'tennis-ball' : 'tennis-ball';
            } else if (route.name === 'Mapa') {
              iconName = focused ? 'google-maps' : 'google-maps';
            } else if (route.name === 'Cartilla') {
              iconName = focused ? 'notebook-check' : 'notebook-check';
            }

          return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
          },
          tabBarActiveTintColor: '#456B6B', 
          tabBarInactiveTintColor: '#999999', 
          tabBarStyle: {
            backgroundColor: '#ffffff', 
            borderTopWidth: 1, 
            borderTopColor: '#cccccc', 
            paddingTop: 5, 
            paddingBottom: 5,
          },
        })}
      >
        <Tab.Screen
          name="Inicio"
          initialParams={{ email}}
          options={{
            tabBarLabel: 'Inicio',
            headerShown: false,
          }}>
          {(props) => <Inicio {...props} email={email} />}
        </Tab.Screen>

       
      </Tab.Navigator>
    );
  }
}
