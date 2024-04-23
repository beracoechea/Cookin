import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, TextInput, StyleSheet, Alert, ImageBackground } from 'react-native'; // Importa ImageBackground
import appFirebase from './credenciales';
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const firebaseAuth = getAuth(appFirebase, {
  persistence: 'local',
  dataConverter: null
});

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    setIsButtonDisabled(!(email && password && password.length >= 6));
  }, [email, password]);

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Por favor ingrese un correo electrónico y una contraseña válidos.');
      return;
    }

    try {
      const signInMethods = await fetchSignInMethodsForEmail(firebaseAuth, email);
      if (signInMethods.length > 0) {
        Alert.alert('Este correo electrónico ya está registrado. Por favor, inicie sesión o utilice otro correo electrónico.');
        return;
      }

      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      navigation.navigate('CreacionPerfil', { email: email });
    } catch (error) {
      Alert.alert('Error al registrar el usuario: ');
    }
  };

  return (
    <ImageBackground source={require('./Images/crear.jpg')} style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Registro</Text>
        <Text style={styles.passwordRequirement}>Por motivos de seguridad, la contraseña debe contener al menos 6 caracteres.</Text>
        <View style={styles.userIconContainer}>
          <View style={styles.circle}>
            {/* Cambia el icono aquí */}
            <MaterialCommunityIcons name="chef-hat" color="#fff" size={50} style={styles.icon} />
          </View>
        </View>
        <View style={styles.inputContainer}>
          {/* Cambia el icono aquí */}
          <FontAwesome name="user" size={20} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          {/* Cambia el icono aquí */}
          <FontAwesome name="unlock-alt" size={20} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={handleTogglePasswordVisibility} style={styles.passwordVisibilityButton}>
            <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={20} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.button, isButtonDisabled && styles.disabledButton]} onPress={handleSignup} disabled={isButtonDisabled}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    height: '80%',
    width: '95%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  userIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 70,
    backgroundColor: '#008080',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 20,
    color: '#fff',
  },
  passwordVisibilityButton: {
    position: 'absolute',
    right: 0,
    paddingRight: 20,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#008080',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

  passwordRequirement: {
    color: '#fff',
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});