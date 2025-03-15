import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '@clerk/clerk-expo';
import { db, collection, doc, getDocs, updateDoc } from '../../config/firebaseConfig';
import { onSnapshot } from "firebase/firestore";

const ListaSuper = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (userId) {
      const userRef = doc(db, 'Users', userId);
      const superCollectionRef = collection(userRef, 'IngredientesSeleccionados');
  
      const unsubscribe = onSnapshot(superCollectionRef, (querySnapshot) => {
        if (querySnapshot.empty) {
          setMensaje('No se ha registrado ningún artículo todavía.');
          setProductos([]);
        } else {
          const data = querySnapshot.docs[0].data();
          const ingredientes = Object.entries(data.seleccionados || {}).flatMap(([categoria, items]) =>
            items.map(item => ({ nombre: item, categoria, comprado: false }))
          );
  
          setProductos(ingredientes);
          setMensaje(ingredientes.length === 0 ? 'No se ha registrado ningún artículo todavía.' : '');
        }
        setCargando(false);
      });
  
      return () => unsubscribe(); // Se desuscribe al desmontar el componente
    }
  }, [userId]);

  const toggleComprado = async (index) => {
    try {
      const ingredienteAEliminar = productos[index];
      const nuevaLista = productos.filter((_, i) => i !== index); // Elimina el ingrediente
      setProductos(nuevaLista); // Actualiza la UI
  
      const userRef = doc(db, 'Users', userId);
      const superCollectionRef = collection(userRef, 'IngredientesSeleccionados');
      const querySnapshot = await getDocs(superCollectionRef);
  
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const docData = querySnapshot.docs[0].data();
  
        // Filtra el ingrediente de la categoría correspondiente
        const nuevosSeleccionados = { ...docData.seleccionados };
        nuevosSeleccionados[ingredienteAEliminar.categoria] = nuevosSeleccionados[ingredienteAEliminar.categoria].filter(
          item => item !== ingredienteAEliminar.nombre
        );
  
        // Si la categoría queda vacía, la eliminamos
        if (nuevosSeleccionados[ingredienteAEliminar.categoria].length === 0) {
          delete nuevosSeleccionados[ingredienteAEliminar.categoria];
        }
  
        await updateDoc(docRef, { seleccionados: nuevosSeleccionados });
  
        console.log(`✅ Ingrediente eliminado: ${ingredienteAEliminar.nombre}`);
      }
    } catch (error) {
      console.error("❌ Error al eliminar el ingrediente:", error);
    }
  };
  

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.item} onPress={() => toggleComprado(index)}>
      <MaterialCommunityIcons
        name={item.comprado ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
        size={24}
        color={item.comprado ? 'green' : 'gray'}
      />
      <Text style={[styles.text, item.comprado && styles.comprado]}>{item.nombre} </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Lista de Compras </Text>

      {cargando ? (
        <Text style={styles.mensaje}>Cargando...</Text>
      ) : mensaje ? (
        <View style={styles.mensajeContainer}>
          <Text style={styles.mensaje}>{mensaje}  </Text>
        </View>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Asegura que ocupe toda la pantalla
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  mensajeContainer: {
    flex: 1, // Hace que el mensaje también ocupe toda la pantalla si no hay elementos
    justifyContent: 'center',
    alignItems: 'center',
  },
  mensaje: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
  comprado: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});

export default ListaSuper;
