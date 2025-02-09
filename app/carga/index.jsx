import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import Colors from '../../constants/Colors';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};


WebBrowser.maybeCompleteAuthSession();

export default function CargaScreen() {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const AuthUser = useCallback(async () => {
    try {
      const { createdSessionId } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(tabs)/home', { schema: 'myapp' }),
      });

      // Validamos si se ha creado una sesión y solo redirigimos si el createdSessionId es válido
      if (createdSessionId) {
        setLoading(false); // Ya se ha creado la sesión, cambiamos el estado
      } else {
        // Error al crear sesión o no se ha recibido createdSessionId
        setLoading(true);
      }
    } catch (err) {
      console.error('OAuth error:', err);
      setLoading(true);
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
        <TouchableOpacity style={styles.button} onPress={AuthUser}>
          <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

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
