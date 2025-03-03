import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const IngredienteItem = ({ ingrediente, seleccionado, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.card,
          { backgroundColor: seleccionado ? ingrediente.colorSeleccionado : ingrediente.color },
        ]}
      >
        <Icon name={ingrediente.icono} size={24} color="#000" />
        <Text style={styles.nombre}>{ingrediente.nombre}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  nombre: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IngredienteItem;