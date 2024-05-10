import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, StyleSheet, ScrollView, TouchableOpacity,
				 ImageBackground, Image, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import appFirebase from './credenciales';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker'; // Import Picker component
import * as ImagePicker from 'react-native-image-picker';


import { useNavigation } from '@react-navigation/native';

// para generar ids randoms
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';


const firestore = getFirestore(appFirebase);

export default function UploadRecipe(props) {
	const { email } = props.route.params;
	const navigation = useNavigation();
  const [Nombre, setNombreReceta] = useState('');
  const [Ingrediente, setIngrediente] = useState('');
	const [Ingredientes, setIngredientes] = useState([]);
  const [Instruccion, setInstruccion] = useState('');
	const [Instrucciones, setInstrucciones] = useState([]);
  const [Tiempo, setTiempoCoccion] = useState('');
	const [Estrellas, setEstrellas] = useState(0);
  const [Tipo, setTipoComida] = useState(''); // State for meal type
	const [Imagen, setImagen] = useState(null); // State for image

  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  useEffect(() => {
    // Habilitar o deshabilitar el botón de guardar según el completado del formulario
    if (Nombre && Ingredientes.length && Instrucciones.length && Tiempo && Tipo) {
      setSaveButtonDisabled(false);
    } else {
      setSaveButtonDisabled(true);
    }
  }, [Nombre, Ingrediente, Instruccion, Tiempo, Tipo]);

  const handleSaveButtonPress = async () => {
    try {
			// To get a new id
			let randomId = uuidv4();

			console.log(randomId);
			
			const newDoc = doc(firestore, 'Recetas', randomId);

			// Guardar los datos de la receta en Firestore
			await setDoc(newDoc, {
        Nombre,
        Ingredientes,
        Instrucciones,
        Tiempo,
        Tipo,
				Estrellas,
      });

      console.log('Receta subida exitosamente.');

      // Navegar a otra pantalla después de la subida exitosa
      navigation.navigate('Menu', { email: email });
    } catch (error) {
      console.error('Error al subir la receta:', error);
      alert('Error al subir la receta. Por favor, inténtalo de nuevo más tarde.');
    }
  };

	const handleImagePicker = () => {
    // Options for image picker
    const options = {
      title: 'Select Imagen',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    // Launch image picker
		console.log(ImagePicker);
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // Set selected image to state
        setImagen(response.uri);
      }
    });
  };

	function agregarIngrediente(event) {
		const nuevosIngredientes = Ingredientes.concat(Ingrediente);
		setIngredientes(nuevosIngredientes);
		setIngrediente('');

	}
	
	function agregarInstruccion(event) {
		const nuevosInstruccion = Instrucciones.concat(Instruccion);
		setInstrucciones(nuevosInstruccion);
		setInstruccion('');
	}

  let array_estrellas = [];

	function pressStarts(index) {
		if (index === Estrellas - 1) {
			setEstrellas(0);
		} else {
			setEstrellas(index + 1);
		}
	}

	for (let i = 0; i < 5; i++) {
		array_estrellas.push(
			<TouchableOpacity key={i} style={styles.estrella} onPress={() => pressStarts(i)}>
				<Icon name="star" size={24} color={i < Estrellas ? "gold" : "white"} />
			</TouchableOpacity>
		);
	}


  return (
    <ImageBackground source={require('./Images/crear.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.infoContainer}>
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
							{Imagen && <Image source={{ uri: Imagen }} style={{ width: 200, height: 200 }} />}
							<Button title="Subir Imagen" onPress={handleImagePicker} />
						</View>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="food" size={24} color="#fff" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre de la receta"
                placeholderTextColor="#CDCDCD"
                value={Nombre}
                onChangeText={setNombreReceta}
              />
            </View>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#fff" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Ingrediente"
                placeholderTextColor="#CDCDCD"
                value={Ingrediente}
                onChangeText={setIngrediente}
              />

							<TouchableOpacity onPress={agregarIngrediente}>
								<MaterialCommunityIcons name="plus" size={30} color="#fff" style={styles.iconPlus} />
							</TouchableOpacity>
            </View>

						{/* codigo para generar la lista */}
						<View style={styles.containerLista}>
							<Text style={styles.title}>Ingredientes:</Text>
							<ScrollView style={styles.scrollContainer}>
								{Ingredientes.map((textItemList, index) => (
									<Text key={index} style={styles.textItemList}>{index + 1}. {textItemList}</Text>
								))}
							</ScrollView>
						</View>
						
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="knife" size={24} color="#fff" style={styles.icon} />

							{/*<TextInput
                 style={styles.textarea}
                 placeholder="Instruccion1, Instruccion2"
                 placeholderTextColor="#CDCDCD"
                 value={Instruccion}
                 onChangeText={setInstruccion}
                 multiline={true}
                 numberOfLines={6}
                 onKeyPress={(event) => {
                 if (event.nativeEvent.key === 'Enter')
                 event.preventDefault(); // Prevent inserting new line
                 }}
								 /> */}
							<TextInput
                style={styles.input}
                placeholder="Instruccion"
                placeholderTextColor="#CDCDCD"
                value={Instruccion}
                onChangeText={setInstruccion}
              />

							<TouchableOpacity onPress={agregarInstruccion}>
								<MaterialCommunityIcons name="plus" size={30} color="#fff" style={styles.iconPlus} />
							</TouchableOpacity>
            
          </View>

					{/* codigo para generar la lista */}
					<View style={styles.containerLista}>
						<Text style={styles.title}>Instrucciones:</Text>
						<ScrollView style={styles.scrollContainer}>
							{Instrucciones.map((instruccion, index) => (
								<Text key={index} style={styles.textItemList}>{index + 1}. {instruccion}</Text>
							))}
						</ScrollView>
					</View>
					
          <View style={styles.inputRow}>
            <MaterialCommunityIcons name="timer" size={24} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Tiempo de cocción (minutos)"
              placeholderTextColor="#CDCDCD"
              value={Tiempo}
              onChangeText={setTiempoCoccion}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputRow}>
            <MaterialCommunityIcons name="food-variant" size={24} color="#fff" style={styles.icon} />
						<Text style={styles.text}>Tipo:</Text>
            <Picker
              selectedValue={Tipo}
              style={styles.input}
              onValueChange={(itemValue, itemIndex) => setTipoComida(itemValue)}
            >
              <Picker.Item label="Desayuno" value="Desayuno" />
              <Picker.Item label="Comida" value="Comida" />
              <Picker.Item label="Cena" value="Cena" />
            </Picker>
          </View>
					
					<View style={styles.inputRowEstellas}>
						<Text style={styles.text}>Dificultad:</Text>
            {array_estrellas}
          </View>
					
					<TouchableOpacity
            style={[styles.saveButton, saveButtonDisabled && styles.saveButtonDisabled]}
            onPress={handleSaveButtonPress}
            disabled={saveButtonDisabled}
          >
            <Text style={styles.saveButtonText}>Subir Receta</Text>
          </TouchableOpacity>
        </View>
				
      </View>
			
    </ScrollView>
		
    </ImageBackground>
		
  );
}

const styles = StyleSheet.create({
	estrella: {
		marginBottom: 0,
	},
	containerLista: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
		marginLeft: 37,
		marginBottom: 15,
		width: '90%',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 10,
    color: '#fff',
  },
  scrollContainer: {
		minHeight: 25,
    maxHeight: 125,
    paddingHorizontal: 10,
  },
  textItemList: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
	
  text: {
		fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
		marginRight: 30,
	},
	
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

	
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    height: '97%',
    width: '97%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    position: 'relative',
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff',
    flex: 1,
    fontSize: 16,
  },
	textarea: {
    textAlignVertical: 'top',
    height: 150,
		borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff',
    flex: 1,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },

	inputRowEstellas: {
		flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
	},
	
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 0,
    alignItems: 'center',
    alignSelf: 'center',
  },
	
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
	
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
	
  icon: {
    marginRight: 10,
  },
	iconPlus: {
    margin: 10,
  },
});
