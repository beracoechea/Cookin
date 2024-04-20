import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView } from 'react-native';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import appFirebase from './credenciales';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const avatarMap = {
  'Seleccion.jpg': require('./Images/Seleccion.jpg'),
  'crear.jpg': require('./Images/crear.jpg'),
  'fondo.jpg': require('./Images/fondo.jpg'),
};

// Inicializa Firestore
const firestore = getFirestore(appFirebase);

export default function UserProfile({ route }) {
  const navigation = useNavigation();
  const { email } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [avatar, setAvatar] = useState(avatarMap['Seleccion.jpg']);
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [alergias, setAlergias] = useState('');
  const [verificado, setVerificado] = useState(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  useEffect(() => {
    // Lógica para habilitar o deshabilitar el botón de guardar
    if (nombre && edad && sexo && alergias) {
      setSaveButtonDisabled(false);
    } else {
      setSaveButtonDisabled(true);
    }
  }, [nombre, edad, sexo, alergias]);

  const handleAvatarPress = (avatarName) => {
    setAvatar(avatarMap[avatarName]);
    setModalVisible(false);
  };

  const handleSaveButtonPress = async () => {
    try {
      await setDoc(doc(firestore, 'Usuarios', email), {
        nombre,
        edad,
        sexo,
        alergias,
        verificado,
        avatar,
      });

      console.log('Datos del usuario guardados correctamente.');

      navigation.navigate('Inicio', { email: email });
    } catch (error) {
      console.error('Error al guardar los datos del usuario:', error);
      alert('Error al guardar los datos del usuario. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.avatarContainer}>
          <Image source={avatar} style={styles.avatar} />
          <TouchableOpacity
            style={styles.changeAvatarButton}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <FontAwesome5 name="user-edit" color="#000" size={20} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Edad"
            value={edad}
            keyboardType="numeric"
            onChangeText={setEdad}
          />
         
          <TextInput
            style={styles.input}
            placeholder="Alergias"
            value={alergias}
            onChangeText={setAlergias}
          />
          <View style={styles.verificadoContainer}>
            <Text>Usuario Verificado:</Text>
            <TouchableOpacity onPress={() => setVerificado(!verificado)}>
              <MaterialCommunityIcons name={verificado ? "checkbox-marked" : "checkbox-blank-outline"} size={25} />
            </TouchableOpacity>
          </View>
          <View style={styles.sexContainer}>
            <TouchableOpacity onPress={() => setSexo('Hombre')}>
              <MaterialCommunityIcons name="gender-male" size={40} color={sexo === 'Hombre' ? '#007BFF' : '#000'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSexo('Mujer')}>
              <MaterialCommunityIcons name="gender-female" size={40} color={sexo === 'Mujer' ? '#FF69B4' : '#000'} />
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalBackground}>
          <ScrollView contentContainerStyle={styles.modalContainer} horizontal>
            <TouchableOpacity onPress={() => handleAvatarPress('fondo.jpg')}>
              <Image source={avatarMap['fondo.jpg']} style={styles.avatarOption} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAvatarPress('crear.jpg')}>
              <Image source={avatarMap['crear.jpg']} style={styles.avatarOption} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cd966c',
  },
  overlay: {
    height: '75%',
    width: '85%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    position: 'relative',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 125,
    borderRadius: 70,
  },
  infoContainer: {
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 3,
    right: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 15,
  },
  icon: {
    paddingHorizontal: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    alignItems: 'center',
  },
  avatarOption: {
    margin: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginTop: 3,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  verificadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  sexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginTop:20,
  },
});