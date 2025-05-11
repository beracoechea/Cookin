import { Text, View, FlatList, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db, collection, getDocs} from '../../config/firebaseConfig'; 
import { useRouter } from 'expo-router';
import {where,query} from 'firebase/firestore'; 

const Recetario = () => {

  
  const [recetas, setRecetas] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Estado para la búsqueda
  const [filteredRecetas, setFilteredRecetas] = useState([]); // Recetas filtradas por búsqueda
  const router = useRouter(); // Hook para la navegación en Expo Router

  useEffect(() => {
    if (searchQuery === '') {
      fetchRecetas(); // Si no hay búsqueda, obtenemos todas las recetas
    } else {
      fetchFilteredRecetas(searchQuery); // Si hay búsqueda, obtenemos las recetas filtradas
    }
  }, [searchQuery]); // Dependemos del cambio en searchQuery

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

      setRecetas(recetasConCategoria);  // Guardamos todas las recetas en el estado
      setFilteredRecetas(recetasConCategoria); // Inicializamos las recetas filtradas
    } catch (error) {
      console.error('Error obteniendo recetas:', error);
    }
  };

  const fetchFilteredRecetas = async (queryText) => {
    try {
      const q = query(
        collection(db, 'Recetas'),
        where('nombre', '>=', queryText),
        where('nombre', '<=', queryText + '\uf8ff') // Esto permite realizar una búsqueda parcial en Firebase
      );
      const querySnapshot = await getDocs(q);
      const recetasArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Si no tiene categoría, asignar "Categoría abierta"
      const recetasConCategoria = recetasArray.map(receta => ({
        ...receta,
        categorias: receta.categorias || 'Categoría abierta'
      }));

      setFilteredRecetas(recetasConCategoria); // Guardamos las recetas filtradas
    } catch (error) {
      console.error('Error obteniendo recetas filtradas:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {// Buscador
      }
      <TextInput
        style={{
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 20,
          paddingLeft: 10
        }}
        placeholder="Buscar receta..."
        value={searchQuery}
        onChangeText={setSearchQuery} // Actualiza el estado con el texto ingresado
      />

      {// Lista de recetas 
      }
      <FlatList
        data={filteredRecetas}
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
  

  

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  recipeItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5,
    borderRadius: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Recetario;
