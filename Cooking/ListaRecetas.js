import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import appFirebase from './credenciales';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import imagenesRecetas from './imagenesRecetas.js';

const firestore = getFirestore(appFirebase);

export default class ListaRecetas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recetas: [],
      desayunos: [],
      comidas: [],
      cenas: [],
    };
  }

  componentDidMount() {
    // Obtener las recetas inicialmente
    this.obtenerRecetas();
  }

  obtenerRecetas = () => {
    const recetasRef = collection(firestore, 'Recetas');
    getDocs(recetasRef)
      .then((snapshot) => {
        const recetas = snapshot.docs.map(doc => doc.data());
        const desayunos = recetas.filter(receta => receta.Tipo === 'desayuno');
        const comidas = recetas.filter(receta => receta.Tipo === 'comida');
        const cenas = recetas.filter(receta => receta.Tipo === 'cena');
        this.setState({ desayunos, comidas, cenas });
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      });
  }

  componentWillUnmount() {
    // No hay necesidad de limpiar el intervalo ya que no se está utilizando
  }

  renderReceta = (item) => {
    const imagenReceta = imagenesRecetas[item.Imagen];
    const estrellas = [];
    for (let i = 0; i < item.Estrellas; i++) {
      estrellas.push(<Icon key={i} name="star" size={24} color="gold" />);
    }
  
    return (
      <TouchableOpacity onPress={() => this.verReceta(item)}>
        <View style={styles.itemContainer}>
          <Image
            source={imagenReceta}
            style={styles.image}
          />
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
        <LinearGradient
          colors={['#007A8C', '#456B6B']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Recetario</Text>
        </LinearGradient>
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Desayuno</Text>
          <FlatList
            horizontal={true}
            data={this.state.desayunos}
            renderItem={({ item }) => this.renderReceta(item)}
            keyExtractor={(item, index) => index.toString()}
          />

          <Text style={styles.sectionTitle}>Comida</Text>
          <FlatList
            horizontal={true}
            data={this.state.comidas}
            renderItem={({ item }) => this.renderReceta(item)}
            keyExtractor={(item, index) => index.toString()}
          />

          <Text style={styles.sectionTitle}>Cena</Text>
          <FlatList
            horizontal={true}
            data={this.state.cenas}
            renderItem={({ item }) => this.renderReceta(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
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
    marginVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#005959',
    flexDirection: 'row',
    alignItems: 'center',
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
