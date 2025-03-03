import { View, StyleSheet } from 'react-native';
import React from 'react';
import MisRecetas from '../../components/MisRecetas/MisRecetas'

export default function misRecetas() {
  return (
    <View style={styles.container}>
      <MisRecetas/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1, // Permite que ListaSuper ocupe el espacio restante después del Header
    backgroundColor: '#f5f5f5',
  },
});
