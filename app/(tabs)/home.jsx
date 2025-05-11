import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import Header from '../../components/Home/Header';
import UserData from '../../components/Home/UserData';
import IMCCalculator from '../../components/Home/IMCCalculator';
import IdealWeightCalculator from '../../components/Home/IdealWeightCalculator';
import TMFRCalculator from '../../components/Home/TMFRCalculator';
import Colors from '../../constants/Colors';
import { db } from '../../config/firebaseConfig';
import { collection, getDocs,getDoc,doc } from 'firebase/firestore';
import NoUserDataWarning from '../../components/Home/NoUSerDataWarning';
import { useRouter } from 'expo-router';

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [randomReceta, setRandomReceta] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "Users", user.id);
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

    const fetchRandomReceta = async () => {
      try {
        const recetasSnapshot = await getDocs(collection(db, 'Recetas'));
        const recetasArray = recetasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (recetasArray.length > 0) {
          const randomIndex = Math.floor(Math.random() * recetasArray.length);
          setRandomReceta(recetasArray[randomIndex]);
        }
      } catch (error) {
        console.error('Error al obtener una receta aleatoria:', error);
      }
    };

    if (user) {
      fetchUserData();
      fetchRandomReceta();
    }
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.Contraste} />
      </View>
    );
  }

  const isUserDataComplete = userData && 
    userData.edad && 
    userData.peso && 
    userData.sexo && 
    userData.estatura && 
    userData.proposito;

  if (!isUserDataComplete) {
    return <NoUserDataWarning />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.Base }}>
      <Header />
      <View style={{ padding: 30 }}>
        <UserData weight={userData.peso} age={userData.edad} cm={userData.estatura} />
        <IMCCalculator weight={userData.peso} height={userData.estatura} />
        {randomReceta && (
          <View style={styles.recetaContainer}>
            <Text style={styles.recetaTitle}>Receta Aleatoria</Text>
            <Text style={styles.recetaName}>{randomReceta.nombre}</Text>
            <Text>Tiempo de preparación: {randomReceta.tiempo_preparacion_num} min</Text>
            <Text>Categoría: {randomReceta.categorias || 'Sin categoría'}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push(`/receta?id=${randomReceta.id}`)}
            >
              <Text style={styles.buttonText}>Ver Detalles</Text>
            </TouchableOpacity>
          </View>
        )}
        <IdealWeightCalculator 
          height={userData.estatura} 
          sex={userData.sexo} 
          peso={userData.peso} 
          age={userData.edad} 
          purpose={userData.proposito} 
          enfermedad={userData.enfermedades}
        />
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

const styles = StyleSheet.create({
  recetaContainer: {
    marginTop: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  recetaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recetaName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.Contraste,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});