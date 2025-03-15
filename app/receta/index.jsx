import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { db } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const DetalleReceta = () => {
  const params = useLocalSearchParams();
  const { id } = params;  // Obtenemos el parámetro 'id' desde la URL
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);  // Para manejar el estado de carga

  useEffect(() => {
    const fetchReceta = async () => {
      if (!id) return;  // Si el id no está disponible, no hacer nada

      setLoading(true);  // Indicamos que está cargando

      try {
        const recetaRef = doc(db, 'Recetas', id);  // Obtener el documento de la receta desde Firebase
        const recetaDoc = await getDoc(recetaRef);

        if (recetaDoc.exists()) {
          setReceta(recetaDoc.data());  // Guardamos la receta en el estado
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error al obtener la receta:', error);
      } finally {
        setLoading(false);  // Cambiar el estado de carga
      }
    };

    if (id) {
      fetchReceta();  // Intentamos cargar la receta solo si el id está disponible
    }
  }, [id]);  // Ejecutamos el efecto cada vez que cambie el 'id'

  if (loading) {
    return <Text style={styles.loadingText}>Cargando...</Text>;  // Muestra un mensaje de carga si aún no se ha obtenido la receta
  }

  if (!receta) {
    return <Text style={styles.errorText}>No se encontró la receta.</Text>;  // Mensaje si no se encuentra la receta
  }

  // Verificar si los ingredientes y la preparación son arrays y unirlos con saltos de línea
  const ingredientesTexto = Array.isArray(receta.ingredientes)
    ? receta.ingredientes.join('\n')
    : receta.ingredientes || 'No disponibles';

  const preparacionTexto = Array.isArray(receta.preparacion)
    ? receta.preparacion.join('\n')
    : receta.preparacion || 'No disponibles';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.recipeTitle}>{receta.nombre}</Text>
        <Text style={styles.categoryText}>Categoría: {receta.categoria || 'No disponible'}</Text>
        <Text style={styles.categoryText}>Calorías: {receta.calorias || 'No disponible'}</Text>

        <Text style={styles.timeText}>Tiempo de Preparación: {receta.tiempo_preparacion_num} min</Text>

        <Text style={styles.sectionTitle}>Ingredientes:</Text>
        <Text style={styles.contentText}>{ingredientesTexto}</Text>

        <Text style={styles.sectionTitle}>Instrucciones:</Text>
        <Text style={styles.contentText}>{preparacionTexto}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
    marginTop: 50,
  },
  recipeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  categoryText: {
    fontSize: 18,
    marginVertical: 5,
    textAlign: 'center',
    color: '#555',
  },
  timeText: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
    color: '#777',
  },
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

export default DetalleReceta;