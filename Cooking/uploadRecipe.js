import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, StyleSheet, ScrollView, TouchableOpacity,
				 ImageBackground, Image, Button } from 'react-native';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import appFirebase from './credenciales';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker'; // Import Picker component
import * as ImagePicker from 'react-native-image-picker';


import { useNavigation } from '@react-navigation/native';

const firestore = getFirestore(appFirebase);

export default function UploadRecipe(props) {
	const { email } = props.route.params;
	const navigation = useNavigation();
  const [Nombre, setNombreReceta] = useState('');
  const [Ingredientes, setIngredientes] = useState('');
  const [Proceso, setInstrucciones] = useState('');
  const [Tiempo, setTiempoCoccion] = useState('');
  const [Tipo, setTipoComida] = useState(''); // State for meal type
	const [Imagen, setImagen] = useState(null); // State for image

  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  useEffect(() => {
    // Habilitar o deshabilitar el botón de guardar según el completado del formulario
    if (Nombre && Ingredientes && Proceso && Tiempo && Tipo) {
      setSaveButtonDisabled(false);
    } else {
      setSaveButtonDisabled(true);
    }
  }, [Nombre, Ingredientes, Proceso, Tiempo, Tipo]);

  const handleSaveButtonPress = async () => {
    try {
      // Guardar los datos de la receta en Firestore
      await setDoc(doc(firestore, 'Recetas', Nombre), {
        Nombre,
        Ingredientes,
        Proceso,
        Tiempo,
        Tipo,
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
                placeholder="Ingrediente1, Ingrediente2, ..."
                placeholderTextColor="#CDCDCD"
                value={Ingredientes}
                onChangeText={setIngredientes}
              />
            </View>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="knife" size={24} color="#fff" style={styles.icon} />
              <TextInput
                style={styles.textarea}
                placeholder="Instruccion1, Instruccion2"
                placeholderTextColor="#CDCDCD"
                value={Proceso}
                onChangeText={setInstrucciones}
                multiline={true}
                numberOfLines={6}
                onKeyPress={(event) => {
                  if (event.nativeEvent.key === 'Enter')
                    event.preventDefault(); // Prevent inserting new line
                }}
              />
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
              <Picker
                selectedValue={Tipo}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) => setTipoComida(itemValue)}
              >
                <Picker.Item label="Tipo de comida (opcional)" value="" />
                <Picker.Item label="Desayuno" value="Desayuno" />
                <Picker.Item label="Comida" value="Comida" />
                <Picker.Item label="Cena" value="Cena" />
              </Picker>
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
    height: '83%',
    width: '95%',
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
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 20,
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
});
