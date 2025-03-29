import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet,Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { db } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from 'expo-router';
import RecetaHeader from '../../components/Receta/RecetarioHeader';
import RecetaDetalles from '../../components/Receta/RecetaDetalle';
import BotonFavoritos from '../../components/Receta/BotonFavorito';

const DetalleReceta = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { id } = params; // Obtenemos el parámetro 'id' desde la URL
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: false, // Hace el header transparente
      headerTitle: '', // Oculta el título
      headerTintColor: 'black', // Color de los botones y título
    });
  }, [navigation]);

  useEffect(() => {

    const fetchReceta = async () => {
      if (!id) return; // Si el id no está disponible, no hacer nada

      setLoading(true); // Indicamos que está cargando

      try {
        const recetaRef = doc(db, 'Recetas', id); // Obtener el documento de la receta desde Firebase
        const recetaDoc = await getDoc(recetaRef);

        if (recetaDoc.exists()) {
          setReceta(recetaDoc.data()); // Guardamos la receta en el estado
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error al obtener la receta:', error);
      } finally {
        setLoading(false); // Cambiar el estado de carga
      }
    };

    fetchReceta();
  }, [id]); // Ejecutamos el efecto cada vez que cambie el 'id'

  if (loading) {
    return <View style={styles.loadingContainer}><Text style={styles.loadingText}>Cargando...</Text></View>;
  }

  if (!receta) {
    return <View style={styles.errorContainer}><Text style={styles.errorText}>No se encontró la receta.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <RecetaHeader receta={receta} /> 
        <RecetaDetalles receta={receta} />
        <BotonFavoritos recetaId={id} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default DetalleReceta;