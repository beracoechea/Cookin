import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import appFirebase from './credenciales';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useNavigation } from '@react-navigation/native';

// Inicializa Firestore
const firestore = getFirestore(appFirebase);

export default function UserProfile({ route }) {
  const navigation = useNavigation();
  const { email } = route.params;
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [estatura, setEstatura] = useState('');
  const [peso, setPeso] = useState('');
  const [estaturaUnit, setEstaturaUnit] = useState('cm');
  const [pesoUnit, setPesoUnit] = useState('kg');
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true); 

  useEffect(() => {
    // Lógica para habilitar o deshabilitar el botón de guardar
    if (nombre && edad && sexo && estatura && peso) {
      setSaveButtonDisabled(false);
    } else {
      setSaveButtonDisabled(true);
    }
  }, [nombre, edad, sexo, estatura, peso]);

  const handleSaveButtonPress = async () => {
    try {
      await setDoc(doc(firestore, 'Usuarios', email), {
        nombre,
        edad,
        sexo,
        estatura,
        estaturaUnit,
        peso,
        pesoUnit,
      });

      console.log('Datos del usuario guardados correctamente.');

      navigation.navigate('Alergias', { email: email });
    } catch (error) {
      console.error('Error al guardar los datos del usuario:', error);
      alert('Error al guardar los datos del usuario. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <ImageBackground source={require('./Images/crear.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.infoContainer}>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="account" size={24} color="#fff" style={styles.icon} />
              <TextInput
                style={styles.input}
								placeholder="Nombre"
								placeholderTextColor="#CDCDCD"
                value={nombre}
								onChangeText={setNombre}
              />
            </View>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="calendar" size={24} color="#fff" style={styles.icon} />
              <TextInput
                style={styles.input}
								placeholder="Edad"
								placeholderTextColor="#CDCDCD"
                value={edad}
                keyboardType="numeric"
                onChangeText={setEdad}
              />
            </View>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="human" size={24} color="#fff" style={styles.icon} />
              <TextInput
                style={styles.input}
								placeholder={"Estatura en " + estaturaUnit}
								placeholderTextColor="#CDCDCD"
                value={estatura}
                keyboardType="numeric"
                onChangeText={setEstatura}
              />
              <View style={styles.unitContainer}>
                <TouchableOpacity
                  style={[styles.unitButton, estaturaUnit === 'cm' && styles.unitButtonSelected]}
                  onPress={() => setEstaturaUnit('cm')}
                >
                  <Text style={styles.unitButtonText}>cm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitButton, estaturaUnit === 'ft/in' && styles.unitButtonSelected]}
                  onPress={() => setEstaturaUnit('ft/in')}
                >
                  <Text style={styles.unitButtonText}>ft/in</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="weight" size={24} color="#fff" style={styles.icon} />
              <TextInput
                style={styles.input}
								placeholder={"Peso en " + pesoUnit}
								placeholderTextColor="#CDCDCD"
                value={peso}
                keyboardType="numeric"
                onChangeText={setPeso}
              />
              <View style={styles.unitContainer}>
                <TouchableOpacity
                  style={[styles.unitButton, pesoUnit === 'kg' && styles.unitButtonSelected]}
                  onPress={() => setPesoUnit('kg')}
                >
                  <Text style={styles.unitButtonText}>kg</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitButton, pesoUnit === 'lbs' && styles.unitButtonSelected]}
                  onPress={() => setPesoUnit('lbs')}
                >
                  <Text style={styles.unitButtonText}>lbs</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.genderIconsContainer}>
              <TouchableOpacity onPress={() => setSexo('Hombre')}>
                <MaterialCommunityIcons name="gender-male" size={40} color={sexo === 'Hombre' ? '#56CCF5' : '#CDCDCD'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSexo('Mujer')}>
                <MaterialCommunityIcons name="gender-female" size={40} color={sexo === 'Mujer' ? '#FF69B4' : '#CDCDCD'} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.saveButton, saveButtonDisabled && styles.saveButtonDisabled]}
              onPress={handleSaveButtonPress}
              disabled={saveButtonDisabled}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
    alignItems: 'center', // Alinea los elementos en el centro horizontalmente
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
    fontSize: 16, // Tamaño mínimo de fuente
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
    paddingHorizontal: 20, // Ajusta el padding para dar más espacio al texto
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
  unitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Alinea los botones de unidad horizontalmente
  },
  unitButton: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 5,
  },
  unitButtonSelected: {
    backgroundColor: '#04D695',
  },
  unitButtonText: {
    color: '#fff',
  },
  genderIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    width: '100%', // Asegura que los iconos de género ocupen todo el ancho del contenedor
  },
  icon: {
    marginRight: 10,
  },
});
