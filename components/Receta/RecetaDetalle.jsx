import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecetaDetalles = ({ receta }) => {
  const ingredientesTexto = Array.isArray(receta.ingredientes)
    ? receta.ingredientes.join('\n')
    : receta.ingredientes || 'No disponibles';

  const preparacionTexto = Array.isArray(receta.preparacion)
    ? receta.preparacion.join('\n')
    : receta.preparacion || 'No disponibles';

  return (
    <View>
      <Text style={styles.sectionTitle}>Ingredientes:</Text>
      <Text style={styles.contentText}>{ingredientesTexto}</Text>

      <Text style={styles.sectionTitle}>Instrucciones:</Text>
      <Text style={styles.contentText}>{preparacionTexto}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#444',
  },
  contentText: {
    fontSize: 16,
    marginTop: 10,
    color: '#666',
    lineHeight: 24,
  },
});

export default RecetaDetalles;