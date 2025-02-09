import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig.js'; // Asegúrate de importar db
import { Text, View, TouchableOpacity, Image, FlatList, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import imagenesRecetas from '../../assets/images/imagenesRecetas.js';
import { useRouter } from 'expo-router'; 
import Colors from '../../constants/Colors.ts';

const { width, height } = Dimensions.get('window'); // Obtenemos las dimensiones de la pantalla

export default function ListaRecetas() {
  const router = useRouter();  // Usamos useRouter para la navegación
  const [recetas, setRecetas] = useState([]);
  const [desayunos, setDesayunos] = useState([]);
  const [comidas, setComidas] = useState([]);
  const [cenas, setCenas] = useState([]);

  useEffect(() => {
    const cargarRecetas = async () => {
      try {
        const recetas = await obtenerRecetas(); // Obtenemos todas las recetas
        setRecetas(recetas);
        setDesayunos(filtrarPorTipo(recetas, 'desayuno'));
        setComidas(filtrarPorTipo(recetas, 'comida'));
        setCenas(filtrarPorTipo(recetas, 'cena'));
        console.log('Recetas cargadas:', recetas);  // Verifica que las recetas se están cargando
      } catch (error) {
        console.error("Error al cargar las recetas:", error);
      }
    };
  
    cargarRecetas();
  }, []);
  

  // Cambié firestore por db aquí
  const obtenerRecetas = async () => {
    const recetasRef = collection(db, 'Recetas'); // Usa db en lugar de firestore
    try {
      const snapshot = await getDocs(recetasRef);
      const recetas = snapshot.docs.map(doc => doc.data());
      return recetas;
    } catch (error) {
      console.error("Error getting documents: ", error);
      throw new Error("Error al obtener las recetas");
    }
  };

  // Función para filtrar las recetas por tipo
  const filtrarPorTipo = (recetas, tipo) => {
    return recetas.filter(receta => receta.Tipo === tipo);
  };

  const renderReceta = (item) => {
    const imagenReceta = imagenesRecetas[item.Imagen];
    const estrellas = [];
    for (let i = 0; i < item.Estrellas; i++) {
      estrellas.push(<Icon key={i} name="star" size={24} color="#ffd700" />);
    }

    return (
      <TouchableOpacity onPress={() => verReceta(item)}>
        <View style={styles.itemContainer}>
          <Image source={imagenReceta} style={styles.image} />
          <View style={styles.detalleReceta}>
            <Text style={styles.nombre}>{item.Nombre}</Text>
            <View style={styles.detalle}>{estrellas}</View>
            <View style={styles.detalle}>
              <Text style={styles.etiqueta}>Tiempo:</Text>
              <Text>{item.Tiempo}min</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const verReceta = (item) => {
    // Función de navegación, puedes agregar la lógica aquí
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recetario</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Desayuno</Text>
        <FlatList
          horizontal={true}
          data={desayunos}
          renderItem={({ item }) => renderReceta(item)}
          keyExtractor={(item, index) => index.toString()}
        />

        <Text style={styles.sectionTitle}>Comida</Text>
        <FlatList
          horizontal={true}
          data={comidas}
          renderItem={({ item }) => renderReceta(item)}
          keyExtractor={(item, index) => index.toString()}
        />

        <Text style={styles.sectionTitle}>Cena</Text>
        <FlatList
          horizontal={true}
          data={cenas}
          renderItem={({ item }) => renderReceta(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'black',
  },
  headerTitle: {
    color: Colors.Base,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,  // Para evitar que el contenido quede pegado a la parte inferior
  },
  itemContainer: {
    marginVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.Contraste,
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.6, // Para que cada item ocupe un 60% del ancho de la pantalla
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  detalleReceta: {
    flex: 1,
  },
  nombre: {
    color: Colors.Base,
    fontSize: 16,
    fontWeight: 'bold',
  },
  detalle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  etiqueta: {
    color: Colors.Base,
    marginRight: 5,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: Colors.TextoImportante,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
