import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const IMCCalculator = ({ weight, height }) => {
  // Calcular el IMC
  const heightInMeters = height / 100; // Convertir estatura de cm a metros
  const imc = (weight / (heightInMeters * heightInMeters)).toFixed(2);

  // Determinar la categoría del IMC
  let category = '';
  let categoryColor = Colors.Contraste;
  let categoryIcon = 'account-check';  // Icono por defecto

  if (imc < 18.5) {
    category = 'Bajo peso';
    categoryColor = Colors.Principal;
    categoryIcon = 'account-alert'; 
   } else if (imc >= 18.5 && imc < 24.9) {
     category = 'Peso normal';
    categoryColor = Colors.Secundario;
     categoryIcon = 'check-circle'; 
   } else if (imc >= 25 && imc < 29.9) {
     category = 'Sobrepeso';
     categoryColor = Colors.Contraste; 
     categoryIcon = 'weight'; 
   } else {
    category = 'Obesidad';
    categoryColor = Colors.TextoImportante; 
    categoryIcon = 'alert-circle'; 
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Índice de Masa Corporal (IMC)</Text>
      <View style={[styles.imcBox, { borderColor: categoryColor }]}>
        <Text style={styles.value}>{imc}</Text>
      </View>
      <View style={[styles.categoryBox, { backgroundColor: categoryColor }]}>
        <MaterialCommunityIcons name={categoryIcon} size={30} color="white" />
        <Text style={styles.category}>{category}</Text>
      </View>
      <TouchableOpacity style={styles.infoButton} onPress={() => alert('El índice de masa corporal (IMC) sirve para medir la relación entre el peso y la talla, lo que  permite identificar el sobrepeso y la obesidad en adultos.')}>
        <Text style={styles.infoText}>¿Qué significa el IMC? </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    color: Colors.Contraste,
    marginBottom: 10,
  },
  imcBox: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  value: {
    fontFamily: 'outfit-bold',
    fontSize: 32,
    color: Colors.Primary,
  },
  categoryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  category: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    color: 'white',
    marginLeft: 10,
  },
  infoButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
  },
  infoText: {
    color: Colors.Contraste,
    fontFamily: 'outfit-medium',
    fontSize: 14,
  },
});

export default IMCCalculator;
