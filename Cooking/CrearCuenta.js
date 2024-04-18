import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class CrearCuenta extends Component {
  state = {
    nombre: '',
    edad: '',
    paswoord: '',
    correo: ''
  };


  render() {
    return (
      <LinearGradient
        colors={['#00FF00', '#000000', '#FFA500', '#FF0000']}
        style={styles.container}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            onChangeText={(nombre) => this.setState({ nombre })}
            value={this.state.nombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Edad"
            onChangeText={(edad) => this.setState({ edad })}
            value={this.state.edad}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            onChangeText={(paswoord) => this.setState({ paswoord })}
            value={this.state.paswoord}
            secureTextEntry={true}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            onChangeText={(correo) => this.setState({ correo })}
            value={this.state.correo}
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.button} onPress={this.addUsuario}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
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
});