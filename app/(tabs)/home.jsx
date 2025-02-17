import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import Header from '../../components/Home/Header';
import UserData from '../../components/Home/UserData';
import IMCCalculator from '../../components/Home/IMCCalculator';
import IdealWeightCalculator from '../../components/Home/IdealWeightCalculator';
import TMFRCalculator from '../../components/Home/TMFRCalculator';
import Colors from '../../constants/Colors';
import { db } from '../../config/firebaseConfig'; // Asegúrate de tener configurado Firebase
import { doc, getDoc } from 'firebase/firestore';
import NoUserDataWarning from '../../components/Home/NoUSerDataWarning'; // Importa el nuevo componente

export default function Home() {
  const { user } = useUser(); // Obtiene el usuario desde Clerk
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "Users", user.id); // Usamos el user.id de Clerk para buscar en Firebase
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            setUserData(userDocSnapshot.data());
          } else {
            console.log("No se encontraron datos del usuario en Firebase");
          }
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchUserData(); // Solo se ejecuta si hay un usuario autenticado
    }
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.Contraste} />
      </View>
    );
  }

  // Verifica si los campos clave están vacíos
  const isUserDataComplete = userData && 
    userData.edad && 
    userData.peso && 
    userData.sexo && 
    userData.estatura && 
    userData.proposito;

  // Si algún campo está vacío o no existe, mostramos el componente de advertencia
  if (!isUserDataComplete) {
    return <NoUserDataWarning />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.Base }}>
      <Header />
      <View style={{ padding: 30 }}>
        <UserData weight={userData.peso} age={userData.edad} cm={userData.estatura} />
        <IMCCalculator weight={userData.peso} height={userData.estatura} />
        <IdealWeightCalculator height={userData.estatura} 
        sex={userData.sexo} 
        peso={userData.peso} 
        age={userData.edad} 
        purpose={userData.proposito} 
        enfermedad={userData.enfermedades}/>
        <TMFRCalculator
          weight={userData.peso}
          height={userData.estatura}
          age={userData.edad}
          sex={userData.sexo}
          disease={userData.enfermedades}
        />
      </View>
    </ScrollView>
  );
}
