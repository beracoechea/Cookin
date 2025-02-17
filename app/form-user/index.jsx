import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { db } from '../../config/firebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";
import InputField from '../../components/Form/InputField';
import SelectField from '../../components/Form/SelectField';
import CheckboxGroup from '../../components/Form/CheckboxGroup';
import SubmitButton from '../../components/Form/SubmitButton';

export default function FormUser() {
  const navigation = useNavigation();
  const { user } = useUser();
  const userId = user?.id;

  const [formData, setFormData] = useState({
    peso: '',
    edad: '',
    sexo: '',
    proposito: '',
    estatura: '',
    enfermedades: [],
  });

  const propositoOpciones = ['', 'Subir de peso', 'Bajar de peso', 'Ganar músculo', 'Perder grasa'];
  const enfermedadesOpciones = ['Diabetes', 'Hipertensión', 'Obesidad', 'Enfermedad renal', 'Colesterol alto'];

  // Cargar datos del usuario desde Firebase al iniciar el formulario
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;

      const userDoc = await getDoc(doc(db, 'Users', userId));
      if (userDoc.exists()) {
        setFormData(prev => ({
          ...prev,
          ...userDoc.data(),
        }));
      }
    };

    loadUserData();
    navigation.setOptions({
      headerTransparent: false,
      headerTitle: '',
    });
  }, [userId, navigation]);

  const handleChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const toggleEnfermedad = (enfermedad) => {
    setFormData(prev => {
      const enfermedades = [...prev.enfermedades];
      if (enfermedades.includes(enfermedad)) {
        return { ...prev, enfermedades: enfermedades.filter(e => e !== enfermedad) };
      } else {
        enfermedades.push(enfermedad);
        return { ...prev, enfermedades };
      }
    });
    console.log(formData.enfermedades); // Verifica el estado después de actualizar
  };
  

  const handleSubmit = async () => {
    if (!userId) return alert('Usuario no identificado');

    // Verifica si al menos un campo tiene valor
    if (Object.values(formData).every(value => value === '' || (Array.isArray(value) && value.length === 0))) {
      return alert('Debe llenar al menos un campo');
    }

    // Filtra los campos vacíos y solo actualiza los no vacíos
    const dataToUpdate = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== '' && !(Array.isArray(formData[key]) && formData[key].length === 0)) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    try {
      await setDoc(doc(db, 'Users', userId), dataToUpdate, { merge: true });
      alert('Datos guardados correctamente');
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar');
    }
  };

  const removeEnfermedad = (enfermedad) => {
    setFormData(prev => ({
      ...prev,
      enfermedades: prev.enfermedades.filter(e => e !== enfermedad),
    }));
  };
  
  return (
    <ScrollView style={styles.container}>
      <InputField label="Peso (kg)" value={formData.peso} onChangeText={(value) => handleChange('peso', value)} keyboardType="numeric" />
      <InputField label="Estatura (cm)" value={formData.estatura} onChangeText={(value) => handleChange('estatura', value)} keyboardType="numeric" />
      <InputField label="Edad" value={formData.edad} onChangeText={(value) => handleChange('edad', value)} keyboardType="numeric" />
      <SelectField label="Sexo" selectedValue={formData.sexo} onValueChange={(value) => handleChange('sexo', value)} options={[' ', 'Masculino', 'Femenino']} />
      <SelectField label="Propósito calórico" selectedValue={formData.proposito} onValueChange={(value) => handleChange('proposito', value)} options={propositoOpciones} />
      <CheckboxGroup 
        label="¿Sufre alguna enfermedad?" 
        options={enfermedadesOpciones} 
        selectedOptions={formData.enfermedades} 
        toggleOption={toggleEnfermedad}
        removeOption={removeEnfermedad}  // Aquí pasamos la función de eliminación
      />
      <SubmitButton title="Guardar Datos" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { padding: 20, backgroundColor: '#F5F5F5' } });
