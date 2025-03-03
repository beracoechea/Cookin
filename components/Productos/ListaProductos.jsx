import { Text, View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '@clerk/clerk-expo';
import { db, collection, addDoc, setDoc, doc, getDocs } from '../../config/firebaseConfig';
import alimentosPorCategoria from './IngredientesData';
import { router } from 'expo-router';

const ListaProductos = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [seleccionados, setSeleccionados] = useState({});
  const [guardarDisabled, setGuardarDisabled] = useState(true);

  const handleSeleccionAlimento = (categoria, alimento) => {
    const nuevaSeleccion = { ...seleccionados };

    if (nuevaSeleccion[categoria]?.includes(alimento)) {
      nuevaSeleccion[categoria] = nuevaSeleccion[categoria].filter(item => item !== alimento);
      if (nuevaSeleccion[categoria].length === 0) delete nuevaSeleccion[categoria];
    } else {
      nuevaSeleccion[categoria] = [...(nuevaSeleccion[categoria] || []), alimento];
    }

    setSeleccionados(nuevaSeleccion);
    setGuardarDisabled(Object.keys(nuevaSeleccion).length === 0);
  };

  const handleGuardarSeleccion = async () => {
    if (!userId) return;
    try {
      const userRef = doc(db, 'Users', userId);
      const ingredientesCollectionRef = collection(userRef, 'IngredientesSeleccionados');
      const ingredientesSnapshot = await getDocs(ingredientesCollectionRef);

      if (!ingredientesSnapshot.empty) {
        const ingredientesDocRef = ingredientesSnapshot.docs[0].ref;
        await setDoc(ingredientesDocRef, { seleccionados });
      } else {
        await addDoc(ingredientesCollectionRef, { seleccionados });
      }

      router.back();
    } catch (error) {
      console.error("Error al guardar selección:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 120 }}>
        {Object.keys(alimentosPorCategoria).map(categoria => (
          <View key={categoria} style={styles.categoriaContainer}>
            <Text style={styles.categoriaTitle}>{categoria.toUpperCase()}</Text>
            <View style={styles.alimentosContainer}>
              {alimentosPorCategoria[categoria].map(alimento => (
                <TouchableOpacity
                  key={alimento.nombre.trim()}
                  style={[
                    styles.alimentoContainer,
                    {
                      backgroundColor: seleccionados[categoria]?.includes(alimento.nombre.trim())
                        ? alimento.colorSeleccionado
                        : '#f0f0f0',
                    },
                  ]}
                  onPress={() => handleSeleccionAlimento(categoria, alimento.nombre.trim())}
                >
                  <MaterialCommunityIcons name={alimento.icono} size={24} color="#333" />
                  <Text style={styles.alimentoText}>{alimento.nombre.trim()} </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Contenedor sólido para el botón */}
      <View style={styles.botonGuardarContainer}>
        <TouchableOpacity
          style={[styles.botonGuardar, { opacity: guardarDisabled ? 0.5 : 1 }]}
          onPress={handleGuardarSeleccion}
          disabled={guardarDisabled}
        >
          <Text style={styles.botonGuardarTexto}>Guardar Selección</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1, paddingHorizontal: 20 }, 
  categoriaContainer: { marginBottom: 20 },
  categoriaTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  alimentosContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  alimentoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  alimentoText: { marginLeft: 10, fontSize: 16 },
  
  // Contenedor del botón con fondo sólido
  botonGuardarContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  botonGuardar: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonGuardarTexto: { color: 'black', fontSize: 16, fontWeight: 'bold' },
});

export default ListaProductos;
