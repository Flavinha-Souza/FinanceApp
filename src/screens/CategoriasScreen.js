// CategoriasScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTransactions } from "../context/TransactionContext";

export default function CategoriasScreen() {
  const { categorias, loading } = useTransactions();
  
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Carregando...</Text>
      </View>
    );
  }
  
  if (categorias.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.emptyText}>Nenhuma categoria ainda</Text>
        <Text style={styles.emptySubText}>As categorias aparecerão quando você adicionar gastos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {categorias.map((cat) => (
        <View key={cat.id} style={styles.card}>
          <Text style={styles.nome}>{cat.nome}</Text>
          <Text style={styles.percent}>{cat.percentual}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  nome: { fontSize: 16, color: "#000" },
  percent: { fontSize: 16, fontWeight: "600" },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
