import React, { useState, useEffect } from 'react';
import { Text, View, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { getFirestore, doc, addDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import appFirebase from './credenciales';
import Share from 'react-native-share';
import Comentarios from './Comentarios';

import files from './filesBase64';

const firestore = getFirestore(appFirebase);

const Receta = ({ route }) => {
  const { receta, imagenesRecetas } = route.params;
  const { email } = route.params; // Extraer el email de las propiedades del enrutador

  const [isPressed, setIsPressed] = useState(false);
  const [isArrowPressed, setIsArrowPressed] = useState(false); ///boton share
  const [isFavorited, setIsFavorited] = useState(false);

  const handleArrowPress = async () => {
    setIsArrowPressed(!isArrowPressed);
    const shareOptions = {
      title: receta.Nombre,
      message: `${receta.Nombre} Tiempo ${receta.Tiempo} minutos\n\nIngredientes: ${receta.Ingredientes.join(', ')}\n\nProceso: ${receta.Proceso.join('. ')} `, // Detalles de la receta
      url: files.fondo,
    };

    try {
      const shareResponse = await Share.open(shareOptions);
    } catch (error) {
      console.log('Error sharing:', error)
    }
  };

  useEffect(() => {
    checkIfFavorited();
  }, []);

  const checkIfFavorited = async () => {
    try {
      // Obtener la referencia a la colección de favoritos del usuario
      const userRef = doc(firestore, 'Usuarios', email);
      const favoritesRef = collection(userRef, 'Favoritas');

      // Realizar una consulta para verificar si la receta ya está en favoritos
      const querySnapshot = await getDocs(favoritesRef);
      const favoritedRecipes = querySnapshot.docs.map(doc => doc.data());

      // Verificar si la receta está en la lista de recetas favoritas
      const isAlreadyFavorited = favoritedRecipes.some(recipe => recipe.Nombre === receta.Nombre);
      setIsFavorited(isAlreadyFavorited);
      setIsPressed(isAlreadyFavorited); // Si ya está en favoritos, el ícono debe estar iluminado
    } catch (error) {
      console.error('Error checking if recipe is favorited:', error);
    }
  };

  const addToFavorites = async () => {
    try {
      if (!isFavorited) {
        // Si la receta no está en favoritos, agrégala
        const userRef = doc(firestore, 'Usuarios', email);
        const favoritesRef = collection(userRef, 'Favoritas');
        await addDoc(favoritesRef, receta);
        setIsFavorited(true);
        setIsPressed(true);
        console.log('Recipe added to favorites');
      } else {
        // Si la receta ya está en favoritos, mostrar confirmación antes de eliminar
        Alert.alert(
          'Eliminar receta',
          '¿Estás seguro de que quieres eliminar esta receta de tus favoritos?',
          [
            {
              text: 'Cancelar',
              onPress: () => console.log('Cancelado'),
              style: 'cancel',
            },
            {
              text: 'Eliminar',
              onPress: async () => {
                const userRef = doc(firestore, 'Usuarios', email);
                const favoritesRef = collection(userRef, 'Favoritas');
                const querySnapshot = await getDocs(favoritesRef);
                const favoritedRecipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const favoritedRecipe = favoritedRecipes.find(recipe => recipe.Nombre === receta.Nombre);
                if (favoritedRecipe && favoritedRecipe.id) {
                  await deleteDoc(doc(favoritesRef, favoritedRecipe.id)); // Eliminar la receta de favoritos
                  setIsFavorited(false);
                  setIsPressed(false);
                  console.log('Recipe removed from favorites');
                } else {
                  console.error('Error: favorited recipe not found or ID is empty');
                }
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Error adding or removing recipe from favorites:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={imagenesRecetas[receta.Imagen]}
          style={styles.imagen}
        />
        <TouchableOpacity onPress={addToFavorites} style={styles.favoriteIconContainer}>
          <MaterialCommunityIcons name={isPressed ? 'bookmark' : 'bookmark-outline'} size={30} color={isPressed ? '#422c1c' : '#333333'} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.headerContainer}>
        <Text style={styles.titulo}>{receta.Nombre}</Text>
        <TouchableOpacity onPress={handleArrowPress} style={styles.shareIconContainer}>
          <EvilIcons name={isArrowPressed ? 'share-google' : 'share-google'} size={35} color={isArrowPressed ? '#422c1c' : '#333333'}  />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitulo}>Tiempo de preparación:</Text>

      <Text style={styles.texto}>{receta.Tiempo} minutos</Text>

      <Text style={styles.subtitulo}>Ingredientes:</Text>
      {receta.Ingredientes.map((ingrediente, index) => (
        <Text key={index} style={styles.texto}>
          {ingrediente}
        </Text>
      ))}

      <Text style={styles.subtitulo}>Proceso:</Text>
      {receta.Proceso.map((paso, index) => (
        <Text key={index} style={styles.texto}>
          {paso}
        </Text>
      ))}

      <Comentarios receta={receta}  />
      <View style={styles.divider}></View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  imagen: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  favoriteIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titulo: {
    flex: 1, // Para que el título ocupe todo el espacio disponible
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  shareIconContainer: {
    marginLeft: 10, // Espacio entre el título y el botón de compartir
    padding: 10,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#422c1c',
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
