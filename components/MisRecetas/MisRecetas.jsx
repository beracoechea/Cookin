import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';

export default function MisRecetas() {
  const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const [diaSeleccionado, setDiaSeleccionado] = useState(dias[0]);

  const recetasPorDia = {
    domingo: ["Ensalada César", "Pollo al horno"],
    lunes: ["Avena con frutas", "Sándwich integral"],
    martes: ["Pasta con tomate", "Sopa de verduras"],
    miércoles: ["Pescado a la plancha", "Arroz con lentejas"],
    jueves: ["Batido de proteínas", "Tostadas con aguacate"],
    viernes: ["Pizza casera", "Ensalada mixta"],
    sábado: ["Tacos de pollo", "Frutas con yogur"]
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Recetas</Text>

      <View style={styles.tabsWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabsContainer}
        >
          {dias.map((dia) => (
            <TouchableOpacity
              key={dia}
              style={[styles.tab, dia === diaSeleccionado && styles.tabActive]}
              onPress={() => setDiaSeleccionado(dia)}
            >
              <Text style={[styles.tabText, dia === diaSeleccionado && styles.tabTextActive]}>
                {dia.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <Text style={styles.diaTitle}>{diaSeleccionado.toUpperCase()}</Text>
        {recetasPorDia[diaSeleccionado].map((receta, index) => (
          <Text key={index} style={styles.recetaItem}>{`🍽️ ${receta}`}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, alignItems: "center", backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },

  tabsWrapper: { maxHeight: 50, width: "100%" },
  tabsContainer: { flexDirection: "row", paddingHorizontal: 10 },

  tab: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 6, 
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    backgroundColor: "#FF9800",
    borderBottomColor: "#D84315",
  },
  tabText: { fontSize: 13, fontWeight: "bold", color: "#333" },
  tabTextActive: { color: "#FFF" },

  content: {
    flex: 1, 
    backgroundColor: "#FFF",
    padding: 15,
    width: "90%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  diaTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  recetaItem: { fontSize: 16, paddingVertical: 5, textAlign: "center" },
});
