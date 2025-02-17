import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const UserData = ({ weight, age, cm }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Peso: {weight} kg</Text>
      <Text style={styles.text}>Edad: {age} años</Text>
      <Text style={styles.text}>Estatura: {cm} cm</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Alinea los elementos en una fila
    justifyContent: 'space-between', // Espacio uniforme entre los elementos
    marginBottom: 20,
  },
  text: {
    fontFamily: 'outfit-medium',
    fontSize: 16, // Puedes ajustar el tamaño de la fuente si es necesario
    color: Colors.Contraste,
  },
});

export default UserData;