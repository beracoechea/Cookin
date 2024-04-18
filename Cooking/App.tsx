import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Inicio from './Inicio';
import Carga from './Carga';
import SeleccionInicio from './SeleccionInicio';

import CrearCuenta from './CrearCuenta';
import IniciarSesion from './IniciarSesion';



const Stack = createStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Carga">
      <Stack.Screen name="Carga" component={Carga} options={{ headerShown: false }}/>
      <Stack.Screen name="SeleccionInicio" component={SeleccionInicio} options={{ headerShown:false }}/>

        
        <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }}/>
        <Stack.Screen name="CrearCuenta" component={CrearCuenta} options={{ headerShown: false }}/>
        <Stack.Screen name="IniciarSesion" component={IniciarSesion} options={{ headerShown: true }}/>




      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;