import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecetaHeader = ({ receta }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.recipeTitle}>{receta.nombre}</Text>
      <Text style={styles.categoryText}>Categoría: {receta.categoria || 'No disponible'}</Text>
      <Text style={styles.categoryText}>Calorías: {receta.calorias || 'No disponible'}</Text>
      <Text style={styles.timeText}>Tiempo de Preparación: {receta.tiempo_preparacion_num} min</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
  },
  recipeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  categoryText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
  },
  timeText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
  },
});

export default RecetaHeader;