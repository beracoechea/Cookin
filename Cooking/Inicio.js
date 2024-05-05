import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc} from 'firebase/firestore';
import appFirebase from './credenciales';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

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
  };

  componentDidMount() {
    this.props.navigation.setOptions({
      title: 'Perfil del Usuario',
    });
  }

  getUserData = async () => {
    const { email } = this.props.route.params;
    try {
      const userDoc = await getDoc(doc(firestore, 'Usuarios', email));
      if (userDoc.exists()) {
        const data = userDoc.data();
        this.setState({ usuario: data });
        this.calcularNecesidadesNutricionales(data);
      } else {
        console.log('El documento de usuario no existe');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  calcularNecesidadesNutricionales = (usuario) => {
    const { edad, estatura, peso } = usuario;
    const FAF = 1.55;
    const CT = Math.round((10 * peso + 6.25 * estatura - 5 * edad + 5) * FAF);
    const P = Math.round(1.2 * peso);
    const C = Math.round(6 * peso);
    const G = Math.round(0.35 * CT / 9);
  
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
      this.setState({ modalVisible: false });
      await this.getUserData();
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
    }
  };

  handleMealConsumed = async (tipoComida) => {
    const { email } = this.props.route.params;

    if (this.state[`${tipoComida}Comio`]) {
      return;
    }

    try {
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

      const updates = {
        [tipoComida]: true,
      };

      await updateDoc(doc(firestore, 'Usuarios', email), updates);
      await updateDoc(doc(firestore, 'Usuarios', email), {
        [nextComida]: false
      });

      await this.getUserData();
      this.setState({ ...nextState });
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
    }
  };

  render() {
    const { desayuno, almuerzo, cena, colacion, postre } = this.state.usuario;
    const { necesidadesNutricionales } = this.state;

    const { usuario, modalVisible, editedParam, editedValue} = this.state;

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#007A8C', '#456B6B']}
          style={styles.gradient}
        >
          <View style={styles.infoContainer}>
            <TouchableOpacity>
              {usuario.sexo === 'Hombre' ? (
                <MaterialCommunityIcons name="gender-male" size={30} color="blue" style={styles.genderIcon} />
              ) : (
                <MaterialCommunityIcons name="gender-female" size={30} color="red" style={styles.genderIcon} />
              )}
            </TouchableOpacity>
            <View style={styles.infoRow}>
              <TouchableOpacity style={[styles.editableField, styles.infoField]} onPress={() => this.handleEditParam('nombre')}>
                <Text style={styles.infoTextName}>{usuario.nombre}</Text>
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
            </View>
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.scroll}>
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

          {/* Resto de botones de comidas aquí */}

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
					<TouchableOpacity>
					<View style={styles.containerText}>
						<Text style={styles.buttonText}>Agregar Recetas</Text>
					</View>
				</TouchableOpacity>
        </ScrollView>

				{/*
					 <View style={styles.containerButton}>
					<TouchableOpacity style={styles.addButtonRecipes}>
						<MaterialCommunityIcons name="plus" size={32} color="white" />
					</TouchableOpacity>
				</View>
				 */}

				
				
				</View>
    );
  }
}

const styles = StyleSheet.create({
	containerText: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    paddingBottom: 5, // Adjust this value to control the space between text and underline
  },
  buttonText: {
    fontSize: 16,
    color: '#008080',
    textDecorationLine: 'underline',
  },
	containerButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addButtonRecipes: {
    backgroundColor: '#008080',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  genderIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
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
})
