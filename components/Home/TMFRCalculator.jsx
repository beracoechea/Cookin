import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const TMFRCalculator = ({ weight, height, age, sex, disease }) => {
  // Asegurarse de que 'disease' sea un arreglo si no lo es
  const diseases = Array.isArray(disease) ? disease : disease ? [disease] : [];

  // Calcular la TMB (fórmula de Harris-Benedict)
  const tmb =
    sex === 'Masculino'
      ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age // Fórmula para hombres
      : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age; // Fórmula para mujeres

  // Recomendaciones calóricas y de macronutrientes
  let calories = tmb * 1.2; // Factor de actividad ligera
  
  // Ajuste para enfermedades
  if (diseases.includes('Diabetes')) {
    calories = tmb * 1.15; // Ajuste para diabéticos
  }
  if (diseases.includes('Hipertensión')) {
    calories = tmb * 1.1; // Ajuste para hipertensión
  }
  if (diseases.includes('Obesidad')) {
    calories = tmb * 1.3; // Ajuste para obesidad
  }
  if (diseases.includes('Enfermedad renal')) {
    calories = tmb * 1.05; // Ajuste para enfermedad renal
  }
  if (diseases.includes('Colesterol alto')) {
    calories = tmb * 1.1; // Ajuste para colesterol alto
  }

  const protein = (weight * 1.6).toFixed(1); // 1.6g de proteína por kg de peso
  let fat = ((calories * 0.25) / 9).toFixed(1); // 25% de calorías de grasa
  let carbs = ((calories * 0.55) / 4).toFixed(1); // 55% de calorías de carbohidratos
  
  // Ajustar carbohidratos para enfermedades (ejemplo para diabetes)
  if (diseases.includes('Diabetes')) {
    carbs = ((calories * 0.45) / 4).toFixed(1); // Disminuir carbohidratos si es diabético
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recomendaciones Diarias</Text>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Tasa Metabólica Basal (TMB)</Text>
        <Text style={[styles.value, styles.tmbValue]}>{tmb.toFixed(1)} kcal</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Calorías</Text>
        <Text style={styles.value}>{calories.toFixed(1)} kcal</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Proteínas</Text>
        <Text style={styles.value}>{protein} g</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Grasas</Text>
        <Text style={styles.value}>{fat} g</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Carbohidratos</Text>
        <Text style={styles.value}>{carbs} g</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
    color: Colors.Principal,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.FondoSeccion,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    width: '100%',
    shadowColor: Colors.Contraste,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'center',   
    alignItems: 'center',    
  },
  
  subtitle: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: Colors.Contraste,
    marginBottom: 5,
  },
  value: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    color: Colors.Contraste,
    fontWeight: 'bold',
  },
  tmbValue: {
    fontSize: 22,
    color: Colors.Contraste,
  },
});

export default TMFRCalculator;
