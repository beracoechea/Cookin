import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import Colors from '../../constants/Colors';
import { useOAuth, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

// Hook para optimizar WebBrowser
const useWarmUpBrowser = () => {
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  useWarmUpBrowser();
  const router = useRouter(); 
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { isSignedIn } = useAuth(); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      router.push('/(tabs)/home');
    }
  }, [isSignedIn, router]);

  const onPress = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Iniciando autenticación con Google...");
      const { createdSessionId, setActive } = await startOAuthFlow({
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        console.log("✅ Sesión iniciada con éxito:", createdSessionId);
      } else {
        console.warn("⚠️ Autenticación cancelada o fallida.");
      }
    } catch (err) {
      console.error("❌ Error en la autenticación:", err);
    } finally {
      setLoading(false);
    }
  }, [startOAuthFlow]);

  const colors = [
    Colors.Principal,
    Colors.Secundario,
    Colors.TextoImportante,
    Colors.FondoSeccion,
  ];

  return (
    <ImageBackground source={require('../../assets/images/Seleccion.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>

        <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
          )}
        </TouchableOpacity>

        
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',  
    alignItems: 'center',      
    padding: 20,
  },
  container: {
    alignItems: 'center',      
    justifyContent: 'center',  
    width: '100%',             
    height: '100%',            
    paddingHorizontal: 20,    
  },
  textContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',  
  },
  text: {
    fontSize: 55,
    fontWeight: 'bold',
    marginHorizontal: 2,
    fontFamily: 'outfit-bold',
  },
  button: {
    backgroundColor: Colors.Principal,
    padding: 15,
    borderRadius: 5,
    marginTop: 30,
    width: '80%',             
    alignItems: 'center',     
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,             
  },
  loader: {
    marginBottom: 30,         
  },
});

export default SignInWithOAuth;

