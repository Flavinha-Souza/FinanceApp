// ConfiguracoesScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ConfiguracoesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      
      <TouchableOpacity style={styles.optionCard}>
        <Text style={styles.optionText}>Perfil do Usuário</Text>
        <Text style={styles.optionSubText}>Editar informações pessoais</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.optionCard}>
        <Text style={styles.optionText}>Backup de Dados</Text>
        <Text style={styles.optionSubText}>Exportar suas transações</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.optionCard}>
        <Text style={styles.optionText}>Categorias</Text>
        <Text style={styles.optionSubText}>Gerenciar categorias personalizadas</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.optionCard}>
        <Text style={styles.optionText}>Sobre o App</Text>
        <Text style={styles.optionSubText}>Versão e informações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 25, color: "#000" },
  optionCard: {
    padding: 18,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  optionText: { 
    fontSize: 16, 
    color: "#000", 
    fontWeight: "500" 
  },
  optionSubText: { 
    fontSize: 13, 
    color: "#666", 
    marginTop: 4 
  },
});
