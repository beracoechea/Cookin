import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../../config/firebaseConfig';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

const MisRecetas = () => {
  const { user } = useUser(); // Obtener el usuario autenticado
  const router = useRouter(); // Hook para la navegación
  const [recetasFavoritas, setRecetasFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const favoritosRef = collection(db, 'Users', user.id, 'Favoritos');
    
    // Escuchar cambios en la colección de favoritos en tiempo real
    const unsubscribe = onSnapshot(favoritosRef, async (querySnapshot) => {
      const recetasFavoritas = [];

      for (const favoritoDoc of querySnapshot.docs) {
        const recetaId = favoritoDoc.data().recetaId; // Obtener el ID de la receta
        const recetaRef = doc(db, 'Recetas', recetaId);
        const recetaDoc = await getDoc(recetaRef);

        if (recetaDoc.exists()) {
          recetasFavoritas.push({ id: recetaId, ...recetaDoc.data() });
        }
      }

      setRecetasFavoritas(recetasFavoritas);
      setLoading(false);
    });

    return () => unsubscribe(); // Limpiar el listener cuando el componente se desmonte
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando... </Text>
      </View>
    );
  }

  if (recetasFavoritas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tienes recetas favoritas. </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recetasFavoritas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeButton}
            onPress={() => router.push(`/receta?id=${item.id}`)}
          >
            <Text style={styles.recipeTitle}>{item.nombre || 'Receta sin nombre'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
  },
  recipeButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MisRecetas;
