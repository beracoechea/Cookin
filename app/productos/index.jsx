import { View } from 'react-native';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import ListaProductos from '../../components/Productos/ListaProductos';

export default function Index() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: false, // Hace el header transparente
      headerTitle: '', // Oculta el título
      headerTintColor: 'black', // Color de los botones y título
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <ListaProductos  />
    </View>
  );
}
