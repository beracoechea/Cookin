import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'; // Importa el ícono de FontAwesome


export default class SeleccionInicio extends Component {
 

  handleInternalRegister = () => {
    this.props.navigation.navigate('CrearCuenta');
  };
  handleInternalIniciar = () =>{
    this.props.navigation.navigate('IniciarSesion');
  }

  render() {
    return (
      <ImageBackground source={require('./Images/Seleccion.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <Text style={styles.title}>¡Bienvenido a Cooking!</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonGoogle} onPress={this.handleInternalIniciar}>
              <AntDesign name="login" color="#FFF" size={25} style={styles.icon} />
              <Text style={styles.buttonText}>Iniciar sesion</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSignup} onPress={this.handleInternalRegister}>
              <AntDesign name="user" color="#FFF" size={25} style={styles.icon} />
              <Text style={styles.buttonText}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      alignItems: 'center',

    },
    overlay: {
      flex: .70, // Hacer que el contenedor ocupe todo el espacio disponible
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro con opacidad
      padding: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#FFF', // Texto blanco
    },
    buttonContainer: {
      width: '70%',
      flex: .70, // Ajuste para que ocupe todo el espacio vertical disponible
      justifyContent: 'center', // Alinea los botones en el centro vertical
    },
    buttonGoogle: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'green', 
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginBottom: 30,
      borderRadius: 5,
      elevation: 2, // Sombra
    },
    buttonFacebook: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#3b5998',
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginBottom: 30,
      borderRadius: 5,
      elevation: 2, // Sombra
    },
    buttonSignup: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#333', // Gris oscuro
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginBottom: 30,
      borderRadius: 5,
      elevation: 2, // Sombra
    },
    buttonText: {
      color: '#FFF',
      marginLeft: 10,
    },
    icon: {
      marginRight: 10,
    },
  });