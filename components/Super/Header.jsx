import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router'; // Importa router en lugar de useNavigation

export default function Header() {
  const router = useRouter(); // Usa useRouter en lugar de useNavigation

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Lista de Compras</Text>
      <TouchableOpacity onPress={() => router.push('/productos')}>
        <MaterialIcons name="add-shopping-cart" size={28} color={Colors.Contraste} />
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.Base,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.Contraste,
  },
};
