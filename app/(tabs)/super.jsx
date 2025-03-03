import { View, StyleSheet } from 'react-native';
import React from 'react';
import Header from '../../components/Super/Header';
import ListaSuper from '../../components/Super/ListaSuper';

export default function SuperScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <ListaSuper />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Permite que ListaSuper ocupe el espacio restante después del Header
    backgroundColor: '#f5f5f5',
  },
});
