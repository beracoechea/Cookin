import React, { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, StyleSheet, ImageBackground } from 'react-native';
import appFirebase from './credenciales';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const firebaseAuth = getAuth(appFirebase, {
  persistence: 'local',
  dataConverter: null
});


export default function IniciarSesion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); 
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor ingrese un correo electrónico y una contraseña válidos.');
      return;
    }
  
    try {
      // Intenta iniciar sesión con las credenciales proporcionadas
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      
      // Si la autenticación es exitosa, navega a la pantalla del menu
      navigation.navigate('Menu', { email: email });
    } catch (error) {
      // Si hay algún error durante la autenticación, muestra un mensaje de error
      alert('Error al iniciar sesión, comprueba correo y contraseña');
    }
  };

	function handleBack(event) {
		navigation.navigate('SeleccionInicio');
	}

  return (
    <ImageBackground source={require('./Images/crear.jpg')} style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <View style={styles.userIconContainer}>
          <View style={styles.circle}>
            <MaterialCommunityIcons name="chef-hat" color="#fff" size={50} style={styles.iconHat} />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Correo electrónico"
						placeholderTextColor="#CDCDCD"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={20} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Contraseña"
						placeholderTextColor="#CDCDCD"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={toggleShowPassword} style={styles.passwordVisibilityButton}> 
            <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={20} color="#fff"
													 style={styles.iconPasswordVisibility} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
				
				<TouchableOpacity style={styles.buttonBack} onPress={handleBack}>
          <Text style={styles.buttonText}>Atrás</Text>
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
    backgroundColor: '#fff',
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
    borderRadius: 40,
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
	iconHat: {
			justifyContent: 'center',
  },
	iconPasswordVisibility: {
		marginRight: 5,
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
	buttonBack: {
		marginTop: 20,
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
