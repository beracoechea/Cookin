import React, { useState } from 'react';
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
        { nombre: 'Tofu', icono: 'cube-outline', color: '#8B4513', colorSeleccionado: '#994c00' }
      ],
      frutas: [
        { nombre: 'Manzana', icono: 'apple', color: '#7CFC00', colorSeleccionado: '#228B22' },
        { nombre: 'Naranja', icono: 'fruit-citrus', color: '#FFA500', colorSeleccionado: '#FF8C00' },
        { nombre: 'Uva', icono: 'fruit-grapes', color: '#800080', colorSeleccionado: '#4B0082' },
        { nombre: 'Piña', icono: 'fruit-pineapple', color: '#FFFF00', colorSeleccionado: '#FFD700' },
        { nombre: 'Sandía', icono: 'fruit-watermelon', color: '#FF0000', colorSeleccionado: '#8B0000' },
        { nombre: 'Plátano', icono: 'fruit-grapes-outline', color: '#FFFF00', colorSeleccionado: '#FFD700' },
        { nombre: 'Fresa', icono: 'fruit-cherries', color: '#FF69B4', colorSeleccionado: '#FF1493' },
        { nombre: 'Kiwi', icono: 'fruit-citrus', color: '#7CFC00', colorSeleccionado: '#228B22' },
        { nombre: 'Mango', icono: 'fruit-pineapple', color: '#FFA500', colorSeleccionado: '#FF8C00' },
        { nombre: 'Cereza', icono: 'fruit-cherries', color: '#FF69B4', colorSeleccionado: '#FF1493' },
      ],
      verduras: [
        { nombre: 'Lechuga', icono: 'spa', color: '#228B22', colorSeleccionado: '#00cc00' },
       
        { nombre: 'Cebolla', icono: 'adjust', color: '#FFD700', colorSeleccionado: '#ffcc00' },
        { nombre: 'Ajo', icono: 'grain', color: '#008000', colorSeleccionado: '#00b300' },
        { nombre: 'Calabacín', icono: 'baguette', color: '#228B22', colorSeleccionado: '#00cc00' },
        { nombre: 'Pepino', icono: 'chili-mild-outline', color: '#228B22', colorSeleccionado: '#00cc00' },
        { nombre: 'Tomate', icono: 'bomb', color: '#FF4500', colorSeleccionado: '#ff3300' },

        { nombre: 'Zanahoria', icono: 'carrot', color: '#FFD700', colorSeleccionado: '#ffcc00' },
        { nombre: 'Brócoli', icono: 'tree', color: '#008000', colorSeleccionado: '#00b300' },
        { nombre: 'Espinacas', icono: 'leaf', color: '#228B22', colorSeleccionado: '#00cc00' },
        { nombre: 'Pimiento', icono: 'bell', color: '#FF4500', colorSeleccionado: '#ff3300' },
      ],

      lacteos: [
        { nombre: 'Leche', icono: 'cow', color: '#FFB6C1', colorSeleccionado: '#ff8080' },
        { nombre: 'Queso', icono: 'cheese', color: '#FFD700', colorSeleccionado: '#ff9933' },
        { nombre: 'Yogurt', icono: 'cupcake', color: '#FFE4B5', colorSeleccionado: '#ffcc99' },
        { nombre: 'Mantequilla', icono: 'butterfly', color: '#FFA07A', colorSeleccionado: '#ff9966' },
        { nombre: 'Crema', icono: 'pot-mix', color: '#FFB6C1', colorSeleccionado: '#ff8080' },
        { nombre: 'Helado', icono: 'ice-cream', color: '#FFD700', colorSeleccionado: '#ff9933' },
      ],
      cereales: [
        { nombre: 'Arroz', icono: 'rice', color: '#8B4513', colorSeleccionado: '#994c00' },
        { nombre: 'Maíz', icono: 'corn', color: '#FFD700', colorSeleccionado: '#ffcc00' },
        { nombre: 'Quinoa', icono: 'grain', color: '#8B4513', colorSeleccionado: '#994c00' },
        { nombre: 'Cebada', icono: 'barley', color: '#F5DEB3', colorSeleccionado: '#ffcc99' },

        { nombre: 'Avena', icono: 'bowl-mix-outline', color: '#F5DEB3', colorSeleccionado: '#ffcc99' },
        { nombre: 'Trigo', icono: 'spa', color: '#D2B48C', colorSeleccionado: '#cc9966' },
       
      ],
      leguminosas: [
        { nombre: 'Frijoles', icono: 'bowl-mix', color: '#800000', colorSeleccionado: '#990000' },
        { nombre: 'Lentejas', icono: 'blur', color: '#A52A2A', colorSeleccionado: '#cc3333' },
        { nombre: 'Garbanzos', icono: 'blur-radial', color: '#D2691E', colorSeleccionado: '#ff6600' },
        { nombre: 'Soya', icono: 'grain', color: '#FFFF00', colorSeleccionado: '#ffcc00' },
        { nombre: 'Cacahuetes', icono: 'peanut', color: '#A52A2A', colorSeleccionado: '#cc3333' },
        { nombre: 'Habas', icono: 'chart-bubble', color: '#FFFF00', colorSeleccionado: '#ffcc00' },
      ],
    };

    const Alergias = ({ route }) => {
      const { email } = route.params;
      const navigation = useNavigation();
    
      const [seleccionados, setSeleccionados] = useState({});
      const [guardarDisabled, setGuardarDisabled] = useState(true);
    
      const handleSeleccionAlimento = (categoria, alimento) => {
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
        setSeleccionados(nuevaSeleccion);
        setGuardarDisabled(false);
      };
    
      const handleGuardarSeleccion = async () => {
        try {
          await setDoc(doc(firestore, 'SeleccionAlimentos', email), {
            seleccionados,
          });
          console.log('Selección de alimentos guardada correctamente.');
          // Navegar al menú y pasar el valor de email como parámetro
          navigation.navigate('Menu', { email });
        } catch (error) {
          console.error('Error al guardar la selección de alimentos:', error);
        }
      };
    
      const renderAlimentosPorCategoria = () => {
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
                      backgroundColor: seleccionados[categoria] &&
                        seleccionados[categoria].includes(alimento.nombre) ? alimento.colorSeleccionado : '#f0f0f0',
                    },
                  ]}
                  onPress={() => handleSeleccionAlimento(categoria, alimento.nombre)}
                >
                  <MaterialCommunityIcons name={alimento.icono} size={24} color="#000" />
                  <Text
                    style={[
                      styles.alimentoText,
                      {
                        color: seleccionados[categoria] &&
                          seleccionados[categoria].includes(alimento.nombre) ? '#fff' : '#808080',
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
    
      const algunAlimentoSeleccionado = Object.values(seleccionados).some(alimentos => alimentos.length > 0);
    
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>{renderAlimentosPorCategoria()}</ScrollView>
          <TouchableOpacity
            style={[styles.guardarButton, { backgroundColor: guardarDisabled ? '#ccc' : '#007BFF' }]}
            onPress={handleGuardarSeleccion}
            disabled={!algunAlimentoSeleccionado}
          >
            <MaterialCommunityIcons name="content-save" size={24} color="#fff" />
            <Text style={styles.guardarButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      );
    };
    
    
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

    export default Alergias;