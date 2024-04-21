import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import appFirebase from './credenciales';

// Inicializa Firestore
const firestore = getFirestore(appFirebase);

// Lista de alimentos dividida por categorías
const alimentosPorCategoria = {
    carnes: [
        { nombre: 'Pollo', icono: 'food-drumstick', color: '#FFA07A', colorSeleccionado: '#ff6666' },
        { nombre: 'Res', icono: 'cow', color: '#FF6347', colorSeleccionado: '#ff3333' },
        { nombre: 'Pescado', icono: 'fish', color: '#00BFFF', colorSeleccionado: '#3399ff' },
        { nombre: 'Cerdo', icono: 'pig', color: '#CD5C5C', colorSeleccionado: '#cc3333' },
        { nombre: 'Ternera', icono: 'cow', color: '#8B4513', colorSeleccionado: '#994c00' },
        { nombre: 'Cordero', icono: 'sheep', color: '#8B4513', colorSeleccionado: '#994c00' },
        { nombre: 'Conejo', icono: 'rabbit', color: '#8B4513', colorSeleccionado: '#994c00' },
        { nombre: 'Pato', icono: 'duck', color: '#8B4513', colorSeleccionado: '#994c00' },
        { nombre: 'Tofu', icono: 'food-tofu', color: '#8B4513', colorSeleccionado: '#994c00' },
      ],
      frutas: [
        { nombre: 'Manzana', icono: 'apple', color: '#32CD32', colorSeleccionado: '#00cc00' },
        { nombre: 'Plátano', icono: 'banana', color: '#FFFF00', colorSeleccionado: '#ffcc00' },
        { nombre: 'Naranja', icono: 'orange', color: '#FFA500', colorSeleccionado: '#ff9900' },
        { nombre: 'Fresa', icono: 'strawberry', color: '#FF69B4', colorSeleccionado: '#ff3399' },
        { nombre: 'Uva', icono: 'grapes', color: '#8B4513', colorSeleccionado: '#994c00' },
        { nombre: 'Piña', icono: 'pineapple', color: '#8B4513', colorSeleccionado: '#994c00' },
        { nombre: 'Kiwi', icono: 'kiwi', color: '#8B4513', colorSeleccionado: '#994c00' },
        { nombre: 'Mango', icono: 'mango', color: '#8B4513', colorSeleccionado: '#994c00' },
        { nombre: 'Sandía', icono: 'watermelon', color: '#8B4513', colorSeleccionado: '#994c00' },
      ],
      verduras: [
        { nombre: 'Lechuga', icono: 'food-variant', color: '#228B22', colorSeleccionado: '#00cc00' },
        { nombre: 'Tomate', icono: 'tomato', color: '#FF4500', colorSeleccionado: '#ff3300' },
        { nombre: 'Zanahoria', icono: 'carrot', color: '#FFD700', colorSeleccionado: '#ffcc00' },
        { nombre: 'Brócoli', icono: 'food-apple', color: '#008000', colorSeleccionado: '#00b300' },
        { nombre: 'Espinacas', icono: 'food-variant', color: '#228B22', colorSeleccionado: '#00cc00' },
        { nombre: 'Pimiento', icono: 'bell-pepper', color: '#FF4500', colorSeleccionado: '#ff3300' },
        { nombre: 'Cebolla', icono: 'food-variant', color: '#FFD700', colorSeleccionado: '#ffcc00' },
        { nombre: 'Ajo', icono: 'garlic', color: '#008000', colorSeleccionado: '#00b300' },
        { nombre: 'Pepino', icono: 'cucumber', color: '#228B22', colorSeleccionado: '#00cc00' },
        { nombre: 'Calabacín', icono: 'zucchini', color: '#FF4500', colorSeleccionado: '#ff3300' },
      ],
      lacteos: [
        { nombre: 'Leche', icono: 'cow', color: '#FFB6C1', colorSeleccionado: '#ff8080' },
        { nombre: 'Queso', icono: 'cheese', color: '#FFD700', colorSeleccionado: '#ff9933' },
        { nombre: 'Yogurt', icono: 'yogurt', color: '#FFE4B5', colorSeleccionado: '#ffcc99' },
        { nombre: 'Mantequilla', icono: 'food-butter', color: '#FFA07A', colorSeleccionado: '#ff9966' },
        { nombre: 'Crema', icono: 'cream', color: '#FFB6C1', colorSeleccionado: '#ff8080' },
        { nombre: 'Helado', icono: 'ice-cream', color: '#FFD700', colorSeleccionado: '#ff9933' },
        { nombre: 'Leche de almendras', icono: 'almond', color: '#FFE4B5', colorSeleccionado: '#ffcc99' },
        { nombre: 'Leche de coco', icono: 'coconut', color: '#FFA07A', colorSeleccionado: '#ff9966' },
      ],
      cereales: [
        { nombre: 'Arroz', icono: 'rice', color: '#8B4513', colorSeleccionado: '#994c00' },
        { nombre: 'Avena', icono: 'oat', color: '#F5DEB3', colorSeleccionado: '#ffcc99' },
        { nombre: 'Trigo', icono: 'wheat', color: '#D2B48C', colorSeleccionado: '#cc9966' },
        { nombre: 'Maíz', icono: 'corn', color: '#FFD700', colorSeleccionado: '#ffcc00' },
        { nombre: 'Quinoa', icono: 'quinoa', color: '#8B4513', colorSeleccionado: '#994c00' },
        { nombre: 'Cebada', icono: 'barley', color: '#F5DEB3', colorSeleccionado: '#ffcc99' },
        { nombre: 'Centeno', icono: 'rye', color: '#D2B48C', colorSeleccionado: '#cc9966' },
        { nombre: 'Mijo', icono: 'millet', color: '#FFD700', colorSeleccionado: '#ffcc00' },
      ],
      leguminosas: [
        { nombre: 'Frijoles', icono: 'food-croissant', color: '#800000', colorSeleccionado: '#990000' },
        { nombre: 'Lentejas', icono: 'food-drumstick', color: '#A52A2A', colorSeleccionado: '#cc3333' },
        { nombre: 'Garbanzos', icono: 'chickpea', color: '#D2691E', colorSeleccionado: '#ff6600' },
        { nombre: 'Soya', icono: 'soy', color: '#FFFF00', colorSeleccionado: '#ffcc00' },
        { nombre: 'Alubias', icono: 'beans', color: '#800000', colorSeleccionado: '#990000' },
        { nombre: 'Cacahuetes', icono: 'peanut', color: '#A52A2A', colorSeleccionado: '#cc3333' },
        { nombre: 'Judías verdes', icono: 'green-bean', color: '#D2691E', colorSeleccionado: '#ff6600' },
        { nombre: 'Habas', icono: 'fava-bean', color: '#FFFF00', colorSeleccionado: '#ffcc00' },
      ],
    };

export default class Alergias extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seleccionados: {}, // Alimentos seleccionados por el usuario
      guardarDisabled: true, // Estado para habilitar/deshabilitar el botón de guardar
    };
  }

  handleSeleccionAlimento = (categoria, alimento) => {
    const { seleccionados } = this.state;
    const nuevaSeleccion = { ...seleccionados };
    if (nuevaSeleccion[categoria]) {
      if (nuevaSeleccion[categoria].includes(alimento)) {
        nuevaSeleccion[categoria] = nuevaSeleccion[categoria].filter(item => item !== alimento);
      } else {
        nuevaSeleccion[categoria].push(alimento);
      }
    } else {
      nuevaSeleccion[categoria] = [alimento];
    }
    // Actualizar el estado de los alimentos seleccionados y el estado del botón de guardar
    this.setState({ seleccionados: nuevaSeleccion, guardarDisabled: false });
  };

  handleGuardarSeleccion = async () => {
    const { email } = this.props.route.params;
    const { seleccionados } = this.state;
    try {
      await setDoc(doc(firestore, 'SeleccionAlimentos', email), {
        seleccionados,
      });
      console.log('Selección de alimentos guardada correctamente.');
      // Navegar a la siguiente ventana
      this.navigation.navigate('SiguienteVentana');
    } catch (error) {
      console.error('Error al guardar la selección de alimentos:', error);
    }
  };

  renderAlimentosPorCategoria = () => {
    return Object.keys(alimentosPorCategoria).map(categoria => (
      <View key={categoria} style={styles.categoriaContainer}>
        <Text style={styles.categoriaTitle}>{categoria.toUpperCase()}</Text>
        <View style={styles.alimentosContainer}>
          {alimentosPorCategoria[categoria].map(alimento => (
            <TouchableOpacity
              key={alimento.nombre}
              style={[
                styles.alimentoContainer,
                {
                  backgroundColor: this.state.seleccionados[categoria] &&
                    this.state.seleccionados[categoria].includes(alimento.nombre) ? alimento.colorSeleccionado : '#f0f0f0',
                },
              ]}
              onPress={() => this.handleSeleccionAlimento(categoria, alimento.nombre)}
            >
              <MaterialCommunityIcons name={alimento.icono} size={24} color="#000" />
              <Text
                style={[
                  styles.alimentoText,
                  {
                    color: this.state.seleccionados[categoria] &&
                      this.state.seleccionados[categoria].includes(alimento.nombre) ? '#fff' : '#808080',
                  },
                ]}
              >
                {alimento.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ));
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>{this.renderAlimentosPorCategoria()}</ScrollView>
        <TouchableOpacity
          style={[styles.guardarButton, { backgroundColor: this.state.guardarDisabled ? '#ccc' : '#007BFF' }]}
          onPress={this.handleGuardarSeleccion}
          disabled={this.state.guardarDisabled}
        >
          <MaterialCommunityIcons name="content-save" size={24} color="#fff" />
          <Text style={styles.guardarButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000', // Fondo negro
  },
  scrollView: {
    flex: 1,
  },
  categoriaContainer: {
    marginBottom: 20,
  },
  categoriaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#8B4513', // Título en color café
  },
  alimentosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  alimentoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    marginRight: 10,
    flexDirection: 'row',
  },
  alimentoText: {
    fontSize: 16,
    marginLeft: 10,
  },
  guardarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 20,
  },
  guardarButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});