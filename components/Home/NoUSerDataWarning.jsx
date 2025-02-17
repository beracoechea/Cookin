import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';

const NoUserDataWarning = () => {
    const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Para ver tus estadísticas, por favor regístrate primero desde tu perfil.</Text>
      <Button 
        title="Ir a perfil" 
        onPress={() => router.push('/form-user')} // Aquí debes asegurarte de que la ruta sea correcta
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.Contraste,
  },
});

export default NoUserDataWarning;
