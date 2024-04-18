import React, { useState, useEffect } from 'react';
import { View, ImageBackground, ActivityIndicator, StyleSheet } from 'react-native';

const Carga = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargaSimulada = setTimeout(() => {
      setLoading(false);
      navigation.navigate('SeleccionInicio');
    }, 5000);

    return () => clearTimeout(cargaSimulada);
  }, [navigation]);

  return (
    <ImageBackground source={require('./Images/fondo.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ajustar la imagen al tamaño del contenedor
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Carga;