import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, StyleSheet, Dimensions } from 'react-native'; // Importa Dimensions
import { getFirestore, collection, getDocs, onSnapshot } from 'firebase/firestore'; // Importa onSnapshot
import appFirebase from './credenciales';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import imagenesRecetas from './imagenesRecetas.js';

const firestore = getFirestore(appFirebase);
const { height } = Dimensions.get('window'); // Obtiene la altura de la ventana

export default class ListaRecetas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recetas: [],
      flatListHeight: height, // Establece la altura inicial del FlatList a la altura de la ventana
    };
  }

  componentDidMount() {
    // Obtener las recetas favoritas del usuario al cargar la pantalla por primera vez
    this.obtenerRecetasFavoritas();

    // Suscribirse a cambios en la colección de favoritos para actualizar la lista en tiempo real
    const { email } = this.props.route.params;
    const favoritasRef = collection(firestore, `Usuarios/${email}/Favoritas`);
    this.unsubscribe = onSnapshot(favoritasRef, this.actualizarRecetasFavoritas);
  }

  componentWillUnmount() {
    // Desuscribirse de la suscripción para evitar memory leaks
    this.unsubscribe();
  }

  obtenerRecetasFavoritas = () => {
    const { email } = this.props.route.params;
  
    // Consulta las recetas favoritas del usuario
    const favoritasRef = collection(firestore, `Usuarios/${email}/Favoritas`);
    getDocs(favoritasRef)
      .then((snapshot) => {
        const recetas = snapshot.docs.map(doc => doc.data()); // Obtener todos los datos de la receta
        this.setState({ recetas });
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      });
  };

  actualizarRecetasFavoritas = (snapshot) => {
    const recetas = snapshot.docs.map(doc => doc.data());
    this.setState({ recetas });
  };

  renderReceta = (item) => {
    if (!item) {
      return null;
    }
  
    const imagenReceta = imagenesRecetas[item.Imagen];
    const estrellas = [];
    for (let i = 0; i < item.Estrellas; i++) {
      estrellas.push(<Icon key={i} name="star" size={24} color="gold" />);
    }
  
    return (
      <TouchableOpacity onPress={() => this.verReceta(item)}>
        <View style={styles.itemContainer}>
          <View style={styles.imagenContainer}>
            <Image
              source={imagenReceta}
              style={styles.image}
            />
          </View>
          <View style={styles.detalleReceta}>
            <Text style={styles.nombre}>{item.Nombre}</Text>
            <View style={styles.detalle}>
              {estrellas}
            </View>
            <View style={styles.detalle}>
              <Text style={styles.etiqueta}>Tiempo:</Text>
              <Text>{item.Tiempo}min</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  verReceta = (receta) => {
    const { navigation, route } = this.props;
    navigation.navigate('Receta', { receta, imagenesRecetas, email: route.params.email });
  };
  
  render() {
    return (
      <View>
        {/* Encabezado */}
        <LinearGradient
          colors={['#a17248','#422c1c']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Recetario Favorito</Text>
        </LinearGradient>

        {/* Contenido */}
        <View style={[styles.container, { height: this.state.flatListHeight }]}>
          {/* Lista de recetas favoritas */}
          <FlatList
            data={this.state.recetas}
            renderItem={({ item }) => this.renderReceta(item)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 120 }} // Ajusta el paddingBottom según la altura de tu menú inferior
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              this.setState({ flatListHeight: height });
            }}
          />
        </View>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  imagenContainer: {
    marginRight: 10,
  },
  container: {
    paddingHorizontal: 20, // Ajustar el padding horizontal
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginVertical: 10,
    marginRight: 10,
    marginBottom:20,
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
    backgroundColor: '#5c4a3c',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 35,
  },
  detalleReceta: {
    flex: 1,
  },
  nombre: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detalle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  etiqueta: {
    color: '#ffffff',
    marginRight: 5,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#005959',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
