import React from 'react';
import { Text, View, Image, ScrollView, StyleSheet } from 'react-native';

const Receta = ({ route }) => {
  const { receta, imagenesRecetas } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>{receta.Nombre}</Text>
      <Image
        source={imagenesRecetas[receta.Imagen]}
        style={styles.imagen}
      />
      <Text style={styles.subtitulo}>Ingredientes:</Text>
      <Text style={styles.texto}>{receta.Ingredientes}</Text>
      <Text style={styles.subtitulo}>Proceso:</Text>
      <Text style={styles.texto}>{receta.Proceso}</Text>
      <Text style={styles.subtitulo}>Tiempo de preparación:</Text>
      <Text style={styles.texto}>{receta.Tiempo} minutos</Text>
      <View style={styles.divider}></View>
      <Text style={styles.creditos}>Cooking App</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
    textAlign: 'center',
  },
  imagen: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007f7f',
  },
  texto: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555555',
  },
  divider: {
    height: 1,
    backgroundColor: '#CCCCCC',
    marginVertical: 20,
  },
  creditos: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});

export default Receta;
