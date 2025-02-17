import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const IdealWeightCalculator = ({ height, sex, peso, age, purpose, enfermedades }) => {

  // Asegúrate de que enfermedades siempre sea un array
  const enfermedadesArray = Array.isArray(enfermedades) ? enfermedades : [];

  // Fórmulas de Devine
  let idealWeight;
  if (sex === 'Masculino') {
    idealWeight = 50 + (2.3 * (height - 152.4)) / 2.54; // Para hombres
  } else {
    idealWeight = 45.5 + (2.3 * (height - 152.4)) / 2.54; // Para mujeres
  }

  // Ajuste de edad opcional
  if (age > 40) {
    idealWeight *= 0.95; // Ajuste del 5% si tiene más de 40 años
  }

  const currentWeight = peso; // Peso actual del usuario
  const weightPercentage = (currentWeight / idealWeight) * 100;

  // Determinar el mensaje y color según el propósito
  let progressColor = "#3b5998"; // Color por defecto
  let message = "¡Buen progreso! Sigue así. ";

  // Ajustes según el propósito
  if (purpose === "Ganar músculo") {
    message = "¡Estás ganando músculo! El peso extra es parte del proceso. ";
    progressColor = "#FF5733"; // Color de progreso para ganar músculo
  } else if (weightPercentage > 100) {
    message = "¡Estás por encima de tu peso ideal! Considera un plan para reducirlo. ";
    progressColor = "#FF5733"; // Rojo si está por encima
  }

  // Ajustes según las enfermedades
  if (enfermedadesArray.includes("Diabetes") || enfermedadesArray.includes("Hipertensión") || enfermedadesArray.includes("Obesidad")) {
    message += "\nRecuerda que tener control sobre tu peso es crucial para tu salud. Consulta con tu médico.";
    progressColor = "#FF6347"; // Color de advertencia para enfermedades
  }

  return (
    <View style={styles.container}>
      <Text style={styles.idealWeightText}>Peso Ideal: <Text style={styles.bold}>{idealWeight.toFixed(1)} kg</Text></Text>
      <Text style={styles.currentWeightText}>Peso Actual: <Text style={styles.bold}>{currentWeight} kg</Text></Text>

      <AnimatedCircularProgress
        size={120}
        width={15}
        fill={weightPercentage > 100 ? 100 : weightPercentage} // Limitar el progreso al 100%
        tintColor={progressColor}
        backgroundColor="#e0e0e0"
        style={styles.progressCircle}
      />
      
      <Text style={[styles.message, { color: progressColor }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9', // Fondo suave
    borderRadius: 10, // Bordes redondeados
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Sombra en Android
    margin: 10,
    borderWidth: 1,
    borderColor: '#ddd', // Borde suave
  },
  idealWeightText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#555',
    marginBottom: 5,
  },
  currentWeightText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#555',
    marginBottom: 20,
  },
  bold: {
    fontWeight: '700', // Resaltar el peso con un texto más grueso
  },
  progressCircle: {
    marginBottom: 15, // Separar el círculo del texto
  },
  message: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20, // Agregar un poco de relleno horizontal para el mensaje
  },
});

export default IdealWeightCalculator;
