import React, { Component } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Inicio from './Inicio';
import MisRecetas from './MisRecetas';
import ListaCompras from './ListaCompras';
import ListaRecetas from './ListaRecetas';



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
            } else if (route.name === 'ListaRecetas') {
              iconName = focused ? 'book-open-page-variant' : 'book-open-page-variant-outline';
            } else if (route.name === 'ListaCompras') {
              iconName = focused ? 'cart-variant' : 'cart-arrow-right';
            } else if (route.name === 'MisRecetas') {
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
			
      <Tab.Screen
        name="MisRecetas"
        initialParams={{ email}}
        options={{
          tabBarLabel: 'MisRecetas',
          headerShown: false,
        }}
      >
        {(props) => <MisRecetas {...props} email={email} />}
      </Tab.Screen>
			
      <Tab.Screen
        name="ListaCompras"
        initialParams={{ email}}
        options={{
          tabBarLabel: 'Super',
          headerShown: false,
        }}
      >
        {(props) => <ListaCompras {...props} email={email} />}
      </Tab.Screen>

      <Tab.Screen
        name="ListaRecetas"
        component={ListaRecetas}
        options={{
          tabBarLabel: 'Recetario',
          headerShown: false,
        }}
        initialParams={{ email }} 
			/>
			
			
      </Tab.Navigator>
    );
  }
}
