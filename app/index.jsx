import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text,Image } from "react-native";
import Colors from "../constants/Colors";

export default function Index() {
  const { user, isLoaded } = useUser();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

   const colors = [
      Colors.Principal,
      Colors.Secundario,
      Colors.TextoImportante,
      Colors.FondoSeccion,
    ];

  useEffect(() => {
    setIsNavigationReady(true);
  }, []);

  if (!isLoaded || !isNavigationReady) {
    return (
      <View style={styles.container}>
         <View style={styles.textContainer}>
             {['C', 'O', 'O', 'K', 'I', 'N','G'].map((letter, index) => (
               <Text
                 key={index}
                 style={[styles.text, { color: colors[index % colors.length] }]}
               >
                 {letter}
               </Text>
             ))}
           </View>
        <Image
          source={require("../assets/images/Seleccion.jpg")}
          autoPlay
          loop
          style={styles.animation}
        />
        <View style={styles.textContainer}>
           {['C', 'O', 'O', 'K', 'I', 'N','G'].map((letter, index) => (
             <Text
               key={index}
               style={[styles.text, { color: colors[index % colors.length] }]}
             >
               {letter}
             </Text>
           ))}
         </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <Redirect href={"./(tabs)/home"} />
      ) : (
        <Redirect href={"./carga"} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: Colors.Base,
   },
   textContainer: {
     flexDirection: 'row',
     marginBottom: 20,
   },
   text: {
     fontSize: 55,
     fontWeight: 'bold',
     marginHorizontal: 2,
     fontFamily: 'outfit-bold',
   },
   animation: {
     width: 200,
     height: 200,
     backgroundColor: 'transparent',
   },
});
