import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFirestore, collection, addDoc, getDocs, doc, query, where } from 'firebase/firestore';
import appFirebase from './credenciales';

const db = getFirestore(appFirebase);

const Comentarios = ({ receta, email }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');

  useEffect(() => {
    obtenerComentarios();
  }, []);

  const obtenerComentarios = async () => {
    try {
      // Buscar la receta por su nombre
      const recetaQuery = query(collection(db, 'Recetas'), where('Nombre', '==', receta.Nombre));
      const recetaSnapshot = await getDocs(recetaQuery);
      const recetaDoc = recetaSnapshot.docs[0];
      
      if (recetaDoc) {
        // Obtener la referencia a la colección de comentarios de la receta encontrada
        const comentariosRef = collection(db, `Recetas/${recetaDoc.id}/Comentarios`);
        const comentariosSnapshot = await getDocs(comentariosRef);
        const comentariosData = comentariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComentarios(comentariosData);
      }
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

      // Buscar la receta por su nombre
      const recetaQuery = query(collection(db, 'Recetas'), where('Nombre', '==', receta.Nombre));
      const recetaSnapshot = await getDocs(recetaQuery);
      const recetaDoc = recetaSnapshot.docs[0];
      
      if (recetaDoc) {
        // Obtener la referencia a la colección de comentarios de la receta encontrada
        const comentariosRef = collection(db, `Recetas/${recetaDoc.id}/Comentarios`);
        
        // Agregar un nuevo documento con el comentario
        await addDoc(comentariosRef, { texto: nuevoComentario, autor: email, fecha: new Date() });
        
        // Limpiar el campo de texto después de agregar el comentario
        setNuevoComentario('');

        // Actualizar la lista de comentarios
        obtenerComentarios();
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.titulo}>Comentarios de la receta: {receta.Nombre}</Text>
        <View style={styles.agregarComentarioContainer}>
          <TextInput
            style={styles.inputComentario}
            placeholder="Agrega un comentario"
            placeholderTextColor="#CCCCCC"
            value={nuevoComentario}
            onChangeText={setNuevoComentario}
          />
          <TouchableOpacity onPress={agregarComentario} style={styles.botonAgregar}>
            <MaterialCommunityIcons name="comment-plus-outline" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        {comentarios.map((comentario, index) => (
          <View key={index} style={styles.comentarioContainer}>
            <Text style={styles.autorComentario}>{comentario.autor}</Text>
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
    backgroundColor: '#D2B48C',
    borderRadius: 10,
    elevation: 3,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
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
    borderColor: '#8B4513',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F5DEB3',
    color: '#333333',
  },
  botonAgregar: {
    backgroundColor: '#8B4513',
    padding: 5,
    borderRadius: 5,
  },
  comentarioContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#8B4513',
    borderRadius: 5,
    backgroundColor: '#F5DEB3',
  },
  autorComentario: {
    fontWeight: 'bold',
    color: '#333333',
  },
  textoComentario: {
    color: '#333333',
  },
});

export default Comentarios;
