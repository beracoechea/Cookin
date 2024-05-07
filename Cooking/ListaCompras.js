import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from './credenciales';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; 

class ListaCompras extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredientesSeleccionados: [],
      ingredientesCompletados: {},
    };
  }

  componentDidMount() {
    // Actualiza la lista de compras al montar el componente por primera vez
    this.obtenerIngredientesSeleccionados();
    // Escucha el evento de navegación para actualizar la lista cuando se regrese de la edición
    this.props.navigation.addListener('focus', this.obtenerIngredientesSeleccionados);
  }

  componentWillUnmount() {
    // Elimina el listener para evitar problemas de memoria
    this.props.navigation.removeListener('focus', this.obtenerIngredientesSeleccionados);
  }

  obtenerIngredientesSeleccionados = async () => {
    const { email } = this.props;
    try {
      const ingredRef = collection(FIREBASE_DB, 'Usuarios', email, 'Ingredientes');
      const querySnapshot = await getDocs(ingredRef);
      let ingredientes = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const ingredientesArrays = Object.values(data.seleccionados);
        ingredientes = ingredientes.concat(...ingredientesArrays);
      });
      const ingredientesCompletados = {};
      ingredientes.forEach(ingrediente => {
        ingredientesCompletados[ingrediente] = false;
      });
      this.setState({ ingredientesSeleccionados: ingredientes, ingredientesCompletados });
    } catch (error) {
      console.error('Error al obtener los ingredientes seleccionados:', error);
    }
  };

  toggleCompletado = (ingrediente) => {
    this.setState(prevState => ({
      ingredientesCompletados: {
        ...prevState.ingredientesCompletados,
        [ingrediente]: !prevState.ingredientesCompletados[ingrediente],
      }
    }));
  };

  handleEditar = () => {
    // Navega a la pantalla de edición
    this.props.navigation.navigate('Alergias', { email: this.props.email });
  };

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#422c1c', '#68442c']}
          style={styles.gradient}>
          <View style={styles.header}>
            <Text style={styles.title}>Lista de Compras</Text>
            <TouchableOpacity onPress={this.handleEditar}>
              <FontAwesome5 name="edit" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <FlatList
          data={this.state.ingredientesSeleccionados}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => this.toggleCompletado(item)}
            >
              <View style={[styles.checkBox, { backgroundColor: this.state.ingredientesCompletados[item] ? '#a17248' : '#ffffff' }]}>
                {this.state.ingredientesCompletados[item] && <Text style={styles.checkIcon}>✓</Text>}
              </View>
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  gradient: {
      paddingHorizontal: 20,
      paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#5c4a3c',
  },
  checkBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#a17248',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginLeft:15,
  },
  checkIcon: {
    fontSize: 20,
    color: '#fff',
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
});

export default ListaCompras;
