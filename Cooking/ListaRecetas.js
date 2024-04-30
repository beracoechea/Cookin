import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import appFirebase from './credenciales';

// Importar los íconos de estrella necesarios
import Icon from 'react-native-vector-icons/FontAwesome';
const firestore = getFirestore(appFirebase);

const imagenesRecetas = {
  'HuevosItalianos.png': require('./Images/Recetas/HuevosItalianos.png'),
  'TingasPollo.png': require('./Images/Recetas/TingasPollo.png'),
  'EnsaladaMaiz.png':require('./Images/Recetas/EnsaladaMaiz.png'),
  'Hotcakes.png':require('./Images/Recetas/Hotcakes.png')
};

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

  renderReceta = (item) => {
    console.log("Datos de la receta:", item);
    const imagenReceta = imagenesRecetas[item.Imagen];
  
    // Crear una matriz de íconos de estrella
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
    this.props.navigation.navigate('Receta', { receta });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Desayunos</Text>
        <FlatList
          horizontal={true} // Configurar la lista como horizontal
          data={this.state.desayunos}
          renderItem={({ item }) => this.renderReceta(item)}
          keyExtractor={(item, index) => index.toString()}
        />

        <Text style={styles.titulo}>Comidas</Text>
        <FlatList
          horizontal={true} // Configurar la lista como horizontal
          data={this.state.comidas}
          renderItem={({ item }) => this.renderReceta(item)}
          keyExtractor={(item, index) => index.toString()}
        />

        <Text style={styles.titulo}>Cenas</Text>
        <FlatList
          horizontal={true} // Configurar la lista como horizontal
          data={this.state.cenas}
          renderItem={({ item }) => this.renderReceta(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007f7f',
    paddingHorizontal: 20, // Ajustar el padding horizontal
  },
  itemContainer: {
    marginVertical: 10, // Ajustar el margen vertical
    marginRight: 10, // Ajustar el margen derecho para separar los elementos
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#005959',
    flexDirection: 'row', // Cambiar la dirección a horizontal
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
  titulo: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10, // Ajustar el margen inferior
  },
});