import { View, Text, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import { db } from '../../config/firebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Link } from 'expo-router';

export default function Header() {
  const { user } = useUser();
  const [isUserSaved, setIsUserSaved] = useState(false); // Estado para evitar múltiples escrituras
  const [userData, setUserData] = useState(null); // Datos del usuario

  useEffect(() => {
    const saveUserToFirestore = async () => {
      if (user && !isUserSaved) { // Verifica si el usuario existe antes de continuar
        try {
          const userDocRef = doc(db, "Users", user.id);
          const userDocSnapshot = await getDoc(userDocRef);

          if (!userDocSnapshot.exists()) {
            await setDoc(userDocRef, {
              name: user.fullName || "Anonymous",
              email: user.primaryEmailAddress?.emailAddress || "No email",
              createdAt: new Date().toISOString(),
            });
            console.log('Usuario agregado a Firestore');
          } else {
            console.log(user.fullName)
            console.log('Usuario ya existe en Firestore');
          }

          setIsUserSaved(true);
        } catch (error) {
          console.error('Error al guardar el usuario en Firestore:', error);
        }
      }
    };

    if (user) {
      saveUserToFirestore(); // Solo se ejecuta si hay un usuario autenticado
    }

  }, [user, isUserSaved]);


  return (
   
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 15,
        marginTop: 30,
        marginRight: 20,
      }}>
        <MaterialIcons
          name="pets"
          size={40}
          color={Colors.Secundario}
          style={{ transform: [{ rotate: '310deg' }] }} // Rotación del ícono
        />
        <View style={{ alignItems: 'center' }}>
          <Text style={{
            fontFamily: 'outfit',
            fontSize: 18,
            textAlign: 'center',
          }}>Welcome,</Text>
          <Text style={{
            fontFamily: 'outfit-medium',
            fontSize: 25,
            textAlign: 'center',
          }}>{user?.fullName || "Cargando..."}</Text>
        </View>

       <Link href={'/(tabs)/profile'} >
        <Image
          source={{ uri: user?.imageUrl }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 99,
          }}
        />
        </Link>
      </View>
  );
}
