import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const Recetario = () => {
  const [recetas, setRecetas] = useState([]);
  const router = useRouter(); // Hook para la navegación en Expo Router

  useEffect(() => {
    fetchRecetas();
  }, []);

  const fetchRecetas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Recetas'));
      const recetasArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Si no tiene categoría, asignar "Categoría abierta"
      const recetasConCategoria = recetasArray.map(receta => ({
        ...receta,
        categorias: receta.categorias || 'Categoría abierta'  // Verificamos si tiene categoría
      }));

      setRecetas(recetasConCategoria);  // Guardamos las recetas en el estado
    } catch (error) {
      console.error('Error obteniendo recetas:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={recetas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 15,
              borderWidth: 1,
              borderColor: '#ccc',
              marginVertical: 5,
              borderRadius: 10
            }}
            onPress={() => {
              if (item.id) {
                console.log('ID de la receta seleccionada:', item.id); // Log del ID
                router.push(`/receta?id=${item.id}`);
              } else {
                console.log('Receta sin ID');
              }
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.nombre}</Text>
            <Text>Tiempo: {item.tiempo_preparacion_num} min</Text>
            <Text>Categoria: {item.categorias}</Text>  
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Recetario;
