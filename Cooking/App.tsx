import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Inicio from './Inicio';
import Carga from './Carga';
import SeleccionInicio from './SeleccionInicio';

import CrearCuenta from './CrearCuenta';
import CreacionPerfil from './CreacionPerfil';
import IniciarSesion from './IniciarSesion';
import Alergias from './Alergias';


import Menu from './Menu';


const Stack = createStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Carga">
      <Stack.Screen name="Carga" component={Carga} options={{ headerShown: false }}/>
      <Stack.Screen name="SeleccionInicio" component={SeleccionInicio} options={{ headerShown:false }}/>

        
        <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }}/>

        <Stack.Screen name="CrearCuenta" component={CrearCuenta} options={{ headerShown: false }}/>
        <Stack.Screen name="IniciarSesion" component={IniciarSesion} options={{ headerShown: false }}/>
        <Stack.Screen name="CreacionPerfil" component={CreacionPerfil} options={{headerShown:false}}/>
        <Stack.Screen name="Alergias" component={Alergias} options={{ headerShown: false }}/>




        <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }}/>




      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;