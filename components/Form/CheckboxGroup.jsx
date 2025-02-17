import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const CheckboxGroup = ({ label, options, selectedOptions, toggleOption, removeOption }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {options.map((option) => (
        <View key={option} style={styles.checkboxContainer}>
           {selectedOptions.includes(option) && (
            <MaterialCommunityIcons 
              name="trash-can-outline"  // Ícono del bote de basura
              size={24} 
              color="#D32F2F"  // Color rojo para el ícono
              onPress={() => removeOption(option)}  // Llama la función para eliminar la enfermedad
              style={styles.icon} 
            />
          )}
          <Checkbox
            status={selectedOptions.includes(option) ? 'checked' : 'unchecked'}
            onPress={() => toggleOption(option)}
            color="#4CAF50"
          />
          <Text style={styles.optionText}>{option}</Text>
          
         
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    marginBottom: 8,
    color: '#6D4C41',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: '#757575',
  },
  icon: {
    marginLeft: 10,
  },
});

export default CheckboxGroup;
