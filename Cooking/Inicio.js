import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import appFirebase from './credenciales';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

// Inicializa Firestore
const firestore = getFirestore(appFirebase);

export default class Inicio extends Component {
  state = {
    desayunoComio: false,
    almuerzoComio: false,
    cenaComio: false,
    postreComio: false,
    colacionComio: false,
    modalVisible: false,
    usuario: {
      nombre: '',
      edad: '',
      estatura: '',
      peso: '',
    },
    editedParam: '',
    editedValue: '',
    necesidadesNutricionales: {
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
      caloriasTotales: 0,
    },
    modalVisibleInsta: false,
    instagramLink: '',
  };

  componentDidMount() {
    // Configurar opciones de navegación
    this.props.navigation.setOptions({
      title: 'Perfil del Usuario',
    });

    // Actualizar los datos cada 5 segundos
    this.updateInterval = setInterval(this.getUserData, 5000);
  }

  componentWillUnmount() {
    // Limpiar el intervalo al desmontar el componente
    clearInterval(this.updateInterval);
  }

  getUserData = async () => {
    const { email } = this.props.route.params;
    try {
      const userDoc = await getDoc(doc(firestore, 'Usuarios', email));
      if (userDoc.exists()) {
        const data = userDoc.data();
        this.setState({ usuario: data }); // Actualizar el estado del usuario
        this.calcularNecesidadesNutricionales(data); // Calcular necesidades nutricionales
      } else {
        console.log('El documento de usuario no existe');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  calcularNecesidadesNutricionales = (usuario) => {
    const { edad, estatura, peso } = usuario;

    // Calcular las necesidades nutricionales aquí
    // Utilizando las fórmulas proporcionadas anteriormente
  
    // Factor de actividad física (FAF)
    const FAF = 1.55; // Factor para actividad física moderada
  
    // Calorías totales requeridas por día (CT)
    const CT = Math.round((10 * peso + 6.25 * estatura - 5 * edad + 5) * FAF);
  
    // Proteínas requeridas por día (P)
    const P = Math.round(1.2 * peso);
  
    // Carbohidratos requeridos por día (C)
    const C = Math.round(6 * peso);
  
    // Grasas requeridas por día (G)
    const G = Math.round(0.35 * CT / 9); // El 35% de las calorías totales provienen de las grasas
  
    this.setState({
      necesidadesNutricionales: {
        caloriasTotales: CT,
        proteinas: P,
        carbohidratos: C,
        grasas: G,
      }
    });
  };

  handleEditParam = (param) => {
    this.setState({ editedParam: param, editedValue: this.state.usuario[param], modalVisible: true });
  };

  handleChange = (value) => {
    this.setState({ editedValue: value });
  };

  saveChanges = async () => {
    const { email } = this.props.route.params;
    const { editedParam, editedValue } = this.state;
    try {
      await updateDoc(doc(firestore, 'Usuarios', email), { [editedParam]: editedValue });
      await this.getUserData(); // Llamar a getUserData después de guardar los cambios
      this.setState({ modalVisible: false });
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
    }
  };

  handleMealConsumed = async (tipoComida) => {
    // Lógica para actualizar la base de datos
    const { email } = this.props.route.params;

    // Verificar si el botón ya está en estado true
    if (this.state[`${tipoComida}Comio`]) {
      // El botón ya está marcado como consumido, no hacer nada
      return;
    }

    try {
      // Inicializar variables para determinar cuál es el próximo tipo de comida
      let nextComida = '';
      let nextState = {};

      switch (tipoComida) {
        case 'desayuno':
          nextComida = 'colacion';
          nextState = { desayunoComio: true, almuerzoComio: false, cenaComio: false, colacionComio: false, postreComio: false };
          break;

        case 'colacion':
          nextComida = 'almuerzo';
          nextState = { desayunoComio: false, almuerzoComio: false, cenaComio: false, colacionComio: true, postreComio: false };
          break;

        case 'almuerzo':
          nextComida = 'postre';
          nextState = { desayunoComio: false, almuerzoComio: true, cenaComio: false, colacionComio: false, postreComio: false };
          break;

        case 'postre':
          nextComida = 'cena';
          nextState = { desayunoComio: false, almuerzoComio: false, cenaComio: false, colacionComio: false, postreComio: true };
          break;

        case 'cena':
          nextComida = 'desayuno';
          nextState = { desayunoComio: false, almuerzoComio: false, cenaComio: true, colacionComio: false, postreComio: false };
          break;
        default:
          break;
      }

      // Crear el objeto con las actualizaciones
      const updates = {
        [tipoComida]: true,
      };

      // Actualizar el documento del perro en la base de datos
      await updateDoc(doc(firestore, 'Usuarios', email), updates);

      // Marca como falso el estado de la próxima comida
      await updateDoc(doc(firestore, 'Usuarios', email), {
        [nextComida]: false
      });

      await this.getUserData(); // Actualiza los datos del perro después de guardar los cambios

      // Actualiza el estado correspondiente al botón presionado y al siguiente botón
      this.setState({ ...nextState });
    } catch (error) {
      console.error('Error al actualizar los datos del perro:', error);
    }
  };

  handleInstagramLinkChange = (value) => {
    this.setState({ instagramLink: value });
  };

  saveInstagramLink = async () => {
    const { email } = this.props.route.params;
    const { instagramLink } = this.state;
    try {
      await updateDoc(doc(firestore, 'Usuarios', email), { instagramLink });
      this.setState({ modalVisibleInsta: false });
    } catch (error) {
      console.error('Error al guardar el enlace de Instagram:', error);
    }
  };
  render() {
    const { desayuno, almuerzo, cena, colacion, postre } = this.state.usuario;
    const { necesidadesNutricionales } = this.state;

    const { usuario, modalVisible, editedParam, editedValue, instagramLink, modalVisibleInsta } = this.state;

    return (
      <View style={styles.container}>
        {/*Perfil del usuario */}
        <LinearGradient
  colors={['#007A8C', '#456B6B']} 
  style={styles.gradient} // Aplica el estilo del gradiente al contenedor de información del usuario
>
  <View style={styles.infoContainer}>
    <View style={styles.infoRow}>
      <TouchableOpacity style={[styles.editableField, styles.infoField]} onPress={() => this.handleEditParam('nombre')}>
        <Text style={styles.infoTextName}>{usuario.nombre}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.editableField, styles.infoField]} onPress={() => this.setState({ modalVisibleInsta: true })}>
        <FontAwesome name="instagram" size={30} color="#fff" style={styles.genderIcon} />
      </TouchableOpacity>
      
    </View>

    <View style={styles.infoRow}>
      <TouchableOpacity style={[styles.editableField, styles.infoField]} onPress={() => this.handleEditParam('edad')}>
        <Text style={styles.editableFieldText}>{usuario.edad} años</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.editableField, styles.infoField]} onPress={() => this.handleEditParam('peso')}>
        <Text style={styles.editableFieldText}>{usuario.peso} {usuario.pesoUnit}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.editableField, styles.infoField]} onPress={() => this.handleEditParam('estatura')}>
        <Text style={styles.editableFieldText}>{usuario.estatura} {usuario.estaturaUnit}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.editableField, styles.infoField]}>
        {usuario.sexo === 'Hombre' ? (
          <MaterialCommunityIcons name="gender-male" size={30} color="blue" style={styles.genderIcon} />
        ) : (
          <MaterialCommunityIcons name="gender-female" size={30} color="red" style={styles.genderIcon} />
        )}
      </TouchableOpacity>
    </View>
  </View>
</LinearGradient>

        <ScrollView contentContainerStyle={styles.scroll}>

       {/* Indica las calorías a consumir del usuario */}
       <View style={styles.header}>
  <View style={styles.caloriesContainer}>
    <LinearGradient
      colors={['#007f7f', '#005959']} // Colores más oscuros para el gradiente
      style={styles.circle} // Aplica el estilo del gradiente al contenedor del círculo
    >
      <Text style={styles.circleText}>{necesidadesNutricionales.caloriasTotales.toFixed(2)}</Text>
      <Text style={styles.circleLabel}>Kcal</Text>
    </LinearGradient>
    <View style={styles.caloriesInfo}>
      <Text style={styles.buttonText}>Proteínas: {necesidadesNutricionales.proteinas.toFixed(2)} g</Text>
      <Text style={styles.buttonText}>Carbs: {necesidadesNutricionales.carbohidratos.toFixed(2)} g</Text>
      <Text style={styles.buttonText}>Grasas: {necesidadesNutricionales.grasas.toFixed(2)} g</Text>
    </View>
  </View>
</View>
          {/* Botones para indicar que el usuario ha comido */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Horas de comida</Text>
          </View>

          <TouchableOpacity style={styles.infoField} onPress={() => this.handleMealConsumed('desayuno')} disabled={desayuno}>
              <View style={styles.buttonRow}>
                <View style={styles.dot} />
                <Text style={styles.buttonText}>Desayuno 7:00 / 9:00 am</Text>
                {desayuno ? (
                  <MaterialCommunityIcons name="check" size={20} color="#abcabc" disabled={true} />
                ) : (
                  <FontAwesome5 name="check" size={20} color="#333" />
                )}
              </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoField} onPress={() => this.handleMealConsumed('colacion')} disabled={colacion}>
            <View style={styles.buttonRow}>
              <View style={styles.dot} />
              <Text style={styles.buttonText}>Colacion 10:00 am</Text>
              {colacion ? (
                <MaterialCommunityIcons name="check" size={20} color="#abcabc" disabled={true} />
              ) : (
                <FontAwesome5 name="check" size={20} color="#333" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoField} onPress={() => this.handleMealConsumed('almuerzo')} disabled={almuerzo}>
            <View style={styles.buttonRow}>
              <View style={styles.dot} />
              <Text style={styles.buttonText}>Almuerzo 12:00 / 14:00 pm</Text>
              {almuerzo ? (
                <MaterialCommunityIcons name="check" size={20} color="#abcabc" disabled={true} />
              ) : (
                <FontAwesome5 name="check" size={20} color="#000" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoField} onPress={() => this.handleMealConsumed('postre')} disabled={postre}>
            <View style={styles.buttonRow}>
              <View style={styles.dot} />
              <Text style={styles.buttonText}>Colacion 16:00 pm</Text>
              {postre ? (
                <MaterialCommunityIcons name="check" size={20} color="#abcabc" disabled={true} />
              ) : (
                <FontAwesome5 name="check" size={20} color="#333" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoField} onPress={() => this.handleMealConsumed('cena')} disabled={cena}>
            <View style={styles.buttonRow}>
              <View style={styles.dot} />
              <Text style={styles.buttonText}>Cena 18:00 / 20:00 pm</Text>
              {cena ? (
                <MaterialCommunityIcons name="check" size={20} color="#abcabc" disabled={true} />
              ) : (
                <FontAwesome5 name="check" size={20} color="#000" />
              )}
            </View>
          </TouchableOpacity>

          {/* Modal para editar el perfil*/}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => this.setState({ modalVisible: false })}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.input}
                  placeholder={editedParam}
                  onChangeText={this.handleChange}
                  value={editedValue}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}>
                    <MaterialCommunityIcons name="archive-cancel" size={40} color="#FF0000" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.saveChanges}>
                    <FontAwesome5 name="save" size={40} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleInsta}
            onRequestClose={() => this.setState({ modalVisibleInsta: false })}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Inserta el enlace de tu perfil de Instagram</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enlace de Instagram"
                  onChangeText={this.handleInstagramLinkChange}
                  value={instagramLink}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => this.setState({ modalVisibleInsta: false })}>
                    <MaterialCommunityIcons name="archive-cancel" size={40} color="#FF0000" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.saveInstagramLink}>
                    <FontAwesome5 name="save" size={40} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  infoContainer: {

    marginLeft: 20,
    paddingVertical: 20,
  },
  editableField: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 3,
  },
  editableFieldText: {
    fontSize: 12,
    color: '#333',
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
    marginRight: 5,
    flex: 1,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoTextName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  infoField: {
    flex: 1,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 7,
    paddingHorizontal: 10,
    backgroundColor: '#00bcd4',
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  scroll: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft:"20%",
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#D2B48C',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonComido: {
    backgroundColor: '#D2B48C',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D2B48C',
    marginRight: 10,
  },
  header: {
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D2B48C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  circleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  circleLabel: {
    fontSize: 12,
    color: '#FFF',
  },
  caloriesInfo: {
    flex: 1,
  },
});
