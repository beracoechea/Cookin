import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView, Keyboard } from 'react-native';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import appFirebase from './credenciales';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Zocial from 'react-native-vector-icons/Zocial';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import crear from "./Images/crear.jpg";
import fondo from "./Images/fondo.jpg";

const avatarMap = {
    "crear.jpg": crear,
    "fondo.jpg": fondo,
};

// Inicializa Firestore (asegúrate de inicializar Firebase correctamente)
const firestore = getFirestore(appFirebase);

export default function CreacionPerfil({ route }) {
    const navigation = useNavigation();
    const { email } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleAvatar, setModalVisibleAvatar] = useState(false);

    const [avatar, setAvatar] = useState(require('./Images/crear.jpg'));
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState('');
    const [verificacion, setVerificacion] = useState('');
    const [alergias, setAlergias] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [instagramLink, setInstagramLink] = useState('');
    const [facebookLink, setFacebookLink] = useState('');

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (nombre && edad && verificacion) {
            setSaveButtonDisabled(false);
        } else {
            setSaveButtonDisabled(true);
        }
    }, [nombre, edad, verificacion]);

    const handleAvatarPress = (avatarName) => {
        setAvatar(avatarMap[avatarName]);
        setModalVisibleAvatar(false);
    };

    const handleSaveButtonPress = async () => {
        try {
            if (!nombre || !edad) {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }

            await setDoc(doc(firestore, 'Usuarios', email), {
                nombre,
                edad,
                verificacion,
                alergias,
                avatar: avatarMap[avatar],
                redesSociales: {
                    instagram: instagramLink,
                    facebook: facebookLink
                }
            });

            console.log('Datos del usuario guardados correctamente.');

            navigation.navigate('Menu', { email });

        } catch (error) {
            console.error('Error al guardar los datos del usuario:', error);
            alert('Error al guardar los datos del usuario. Por favor, inténtalo de nuevo más tarde.');
        }
    };

    const handleSaveSocialLinks = async () => {
        try {
            await setDoc(doc(firestore, 'Usuarios', email), {
                nombre,
                edad,
                verificacion,
                alergias,
                avatar: avatarMap[avatar],
                redesSociales: {
                    instagram: instagramLink,
                    facebook: facebookLink
                }
            });
    
            console.log('Enlaces de redes sociales guardados correctamente.');
    
            navigation.navigate('Menu', { email });
    
        } catch (error) {
            console.error('Error al guardar los enlaces de redes sociales:', error);
            alert('Error al guardar los enlaces de redes sociales. Por favor, inténtalo de nuevo más tarde.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.backgroundImageContainer}>
                <Image source={crear} style={styles.backgroundImage} />
                <View style={styles.overlay}>
                    <View style={styles.infoContainer}>
                        <View style={styles.avatarContainer}>
                            <Image source={avatar} style={styles.avatar} />
                            <TouchableOpacity
                                style={styles.changeAvatarButton}
                                onPress={() => {
                                    setModalVisibleAvatar(true);
                                }}
                            >
                                <FontAwesome5 name="user-edit" color="#000" size={20} style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={[styles.input, keyboardVisible && styles.inputFocused]}
                            placeholder="Nombre"
                            value={nombre}
                            onChangeText={setNombre}
                        />
                        <TextInput
                            style={[styles.input, keyboardVisible && styles.inputFocused]}
                            placeholder="Edad"
                            value={edad}
                            keyboardType="numeric"
                            onChangeText={setEdad}
                        />
                        <TextInput
                            style={[styles.input, keyboardVisible && styles.inputFocused]}
                            placeholder="Verificación"
                            value={verificacion}
                            onChangeText={setVerificacion}
                        />
                        <TextInput
                            style={[styles.input, keyboardVisible && styles.inputFocused]}
                            placeholder="Alergias"
                            value={alergias}
                            onChangeText={setAlergias}
                        />
                        <View style={styles.socialMediaContainer}>
                            <TouchableOpacity style={[styles.facebookButton, styles.button]} onPress={() => setModalVisible(true)}>
                                 <Zocial name="facebook" color="#1877F2" size={40} style={styles.icon} />
                             </TouchableOpacity>
                            <TouchableOpacity style={[styles.instagramButton, styles.button]} onPress={() => setModalVisible(true)}>
                                 <FontAwesome name="instagram" color="#833AB4" size={50} style={styles.icon} />
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
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleAvatar}
                onRequestClose={() => {
                    setModalVisibleAvatar(false);
                }}
            >
                <View style={styles.modalBackgroundAvatar}>
                    <View style={styles.modalContainer}>
                        <ScrollView horizontal>
                            {Object.entries(avatarMap).map(([avatarName, avatarImage]) => (
                                <TouchableOpacity
                                    key={avatarName}
                                    style={styles.avatarOptionContainer}
                                    onPress={() => handleAvatarPress(avatarName)}
                                >
                                    <Image source={avatarImage} style={styles.avatarOption} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalBackground}>
                    {/* Contenido del modal para ingresar los enlaces de redes sociales */}
                    <View style={styles.modalContainer}>
                        <View style={styles.inputContainer}>
                            <FontAwesome name="facebook" color="#1877F2" size={30} style={styles.socialIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Ingresa el enlace de Facebook"
                                value={facebookLink}
                                onChangeText={setFacebookLink}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <FontAwesome name="instagram" color="#833AB4" size={30} style={styles.socialIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Ingresa el enlace de Instagram"
                                value={instagramLink}
                                onChangeText={setInstagramLink}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <MaterialCommunityIcons name="cancel" color="#FF6347" size={50} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={handleSaveSocialLinks}
                            >
                                <FontAwesome5 name="save" color="#32CD32" size={50} style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    // Estilos para el contenedor principal del componente
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Estilos para el contenedor de la imagen de fondo
    backgroundImageContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Estilos para la imagen de fondo
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        position: 'absolute',
    },

    // Estilos para el overlay oscuro sobre la imagen
    overlay: {
        width: '85%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
        borderRadius: 10,
    },

    // Estilos para el contenedor del avatar
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center', // Alineación vertical centrada
        marginBottom: 20,
    },
    // Estilos para la imagen del avatar
    avatar: {
        width: 100,
        height: 125,
        borderRadius: 70,
    },

    // Estilos para el contenedor de la información del usuario
    infoContainer: {
        width: '100%',
    },

    // Estilos para los inputs de texto
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        color: '#fff',
    },
    // Estilos para los inputs de texto cuando están enfocados
    inputFocused: {
        borderColor: 'silver',
    },

    // Estilos para el botón de cambio de avatar
    changeAvatarButton: {
        position: 'absolute',
        bottom: 3,
        right: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 15,
    },

    // Estilos para el boton guardar
    saveButtonText: {
        color: '#fff', // Color blanco
        fontSize: 16, // Tamaño de fuente 16 puntos
        fontWeight: 'bold', // Negrita
        textAlign: 'center', // Alineación centrada
    },
    // Estilos para los iconos
    icon: {
        paddingHorizontal: 5,
       
    },
   // Estilos para el contenedor de los botones de redes sociales
socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
},
facebookButton: {
    width: 70, 
    height:100,
},
instagramButton: {
    width: 70, 
    height:100,
},
    // Estilos para los iconos de redes sociales
    socialMediaIcon: {
        marginHorizontal: 30, // Espaciado horizontal entre los iconos
    },

    // Estilos para el modal de redes sociales
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    // Estilos para el contenedor del modal
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center', // Alineación vertical centrada
        paddingHorizontal: 20,
    },
    // Estilos para el contenedor de cada input de redes sociales
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    // Estilos para los inputs de redes sociales
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        color: '#fff',
        flex: 1,
        marginRight: 20,

    },
    // Estilos para los iconos de redes sociales dentro de los inputs
    socialIcon: {
        marginRight: 10,
        marginLeft:20,
    },
    // Estilos para el contenedor de los botones
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginTop: 20,
    },
    // Estilos para los botones
    button: {
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 5,
    },
    // Estilos para el botón de cancelar
    cancelButton: {
        marginRight: 10,
    },

    // Estilos para el fondo oscuro del modal de avatars
    modalBackgroundAvatar:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    // Estilos para el contenedor de cada opción de avatar en el modal
    avatarOptionContainer: {
        alignItems: 'center',
        justifyContent: 'center', // Alineación vertical centrada
    },
    // Estilos para las opciones de avatar en el modal
    avatarOption: {
        marginHorizontal: 10, // Espaciado horizontal entre los iconos
        width: 60,
        height: 60,
        borderRadius: 30,
    },
});