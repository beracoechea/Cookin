import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import appFirebase from './credenciales';

const db = getFirestore(appFirebase);

const Comentarios = ({ recetaId }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  
  useEffect(() => {
    obtenerComentarios();
  }, []);

  const obtenerComentarios = async () => {
    try {
      const comentariosRef = collection(db, `Recetas/${recetaId}/Comentarios`);
      const comentariosSnapshot = await getDocs(comentariosRef);
      const comentariosData = comentariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComentarios(comentariosData);
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
    }
  };

  const agregarComentario = async () => {
    try {
      if (!nuevoComentario.trim()) {
        console.error('El comentario está vacío');
        return;
      }

      const comentariosRef = collection(db, `Recetas/${recetaId}/Comentarios`);
      await addDoc(comentariosRef, { texto: nuevoComentario });
      setNuevoComentario(''); // Limpiar el campo de texto después de agregar el comentario

      // Actualizar la lista de comentarios
      obtenerComentarios();
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };
  
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.titulo}>Comentarios de la receta</Text>
        {/* Agregar un formulario para ingresar un nuevo comentario */}
        <View style={styles.agregarComentarioContainer}>
          <TextInput
            style={styles.inputComentario}
            placeholder="Agrega un comentario"
            value={nuevoComentario}
            onChangeText={setNuevoComentario}
          />
          <TouchableOpacity onPress={agregarComentario}>
            <MaterialCommunityIcons name="comment-plus-outline" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        {/* Mostrar los comentarios existentes */}
        {comentarios.map((comentario, index) => (
          <View key={index} style={styles.comentarioContainer}>
            <Text style={styles.textoComentario}>{comentario.texto}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#D2B48C', // Color de fondo para el contenedor principal
    borderRadius: 10,
    elevation: 3,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF', // Color de texto para el título
  },
  agregarComentarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputComentario: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#8B4513', // Color de borde para el input
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F5DEB3', // Color de fondo para el input
    color: '#FFFFFF', // Color de texto para el input
  },
  comentarioContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#8B4513', // Color de borde para los comentarios
    borderRadius: 5,
    backgroundColor: '#F5DEB3', // Color de fondo para cada comentario
  },
  textoComentario: {
    color: '#FFFFFF', // Color de texto para los comentarios
  },
});

export default Comentarios;
