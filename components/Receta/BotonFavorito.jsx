import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { db } from '../../config/firebaseConfig';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';

const BotonFavoritos = ({ recetaId }) => {
  const { user } = useUser();
  const [isFavorito, setIsFavorito] = useState(false);

  useEffect(() => {
    const checkFavorito = async () => {
      if (!user || !recetaId) return;

      try {
        const favoritoRef = doc(db, 'Users', user.id, 'Favoritos', recetaId);
        const favoritoDoc = await getDoc(favoritoRef);
        setIsFavorito(favoritoDoc.exists());
      } catch (error) {
        console.error('Error al verificar si la receta está en favoritos:', error);
      }
    };

    checkFavorito();
  }, [user, recetaId]);

  const handleAgregarFavorito = async () => {
    if (!user || !recetaId) return;

    try {
      const favoritoRef = doc(db, 'Users', user.id, 'Favoritos', recetaId);
      await setDoc(favoritoRef, { recetaId });
      setIsFavorito(true);
      console.log('Receta añadida a favoritos');
    } catch (error) {
      console.error('Error al añadir a favoritos:', error);
    }
  };

  const handleEliminarFavorito = async () => {
    if (!user || !recetaId) return;

    try {
      const favoritoRef = doc(db, 'Users', user.id, 'Favoritos', recetaId);
      await deleteDoc(favoritoRef);
      setIsFavorito(false);
      console.log('Receta eliminada de favoritos');
    } catch (error) {
      console.error('Error al eliminar de favoritos:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, isFavorito ? styles.buttonEliminar : styles.buttonAgregar]}
      onPress={isFavorito ? handleEliminarFavorito : handleAgregarFavorito}
    >
      <Text style={styles.buttonText}>
        {isFavorito ? 'Eliminar de Favoritos' : 'Agregar a Favoritos'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonAgregar: {
    backgroundColor: '#007BFF',
  },
  buttonEliminar: {
    backgroundColor: '#FF6347',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BotonFavoritos;