import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

export default class CrearCuenta extends Component {
  state = {
    correo: '',
    contraseña: '',
    isCamposVacios: true,
    isContraseñaCorta: true,
  };

  onPressRegistrar = () => {
    this.props.navigation.navigate('CreacionPerfil', { correo: this.state.correo });
  };

  componentDidUpdate() {
    const { correo, contraseña } = this.state;
    const isCamposVacios = correo.trim() === '' || contraseña.trim() === '';
    const isContraseñaCorta = contraseña.length < 8;

    // Actualizar el estado para reflejar si los campos están vacíos o si la contraseña es corta
    if (isCamposVacios !== this.state.isCamposVacios || isContraseñaCorta !== this.state.isContraseñaCorta) {
      this.setState({ isCamposVacios, isContraseñaCorta });
    }
  }

  render() {
    const { isCamposVacios, isContraseñaCorta } = this.state;

    return (
      <ImageBackground
        source={require('./Images/crear.jpg')} // Ruta de tu imagen de fondo
        style={styles.container}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            onChangeText={(correo) => this.setState({ correo })}
            value={this.state.correo}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            onChangeText={(contraseña) => this.setState({ contraseña })}
            value={this.state.contraseña}
            secureTextEntry={true}
          />
          <TouchableOpacity
            style={[styles.button, (isCamposVacios || isContraseñaCorta) && styles.buttonDisabled]}
            onPress={this.onPressRegistrar}
            disabled={isCamposVacios || isContraseñaCorta}
          >
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  overlay: {
    width: '85%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Cambia el color del botón cuando está deshabilitado
  },
});