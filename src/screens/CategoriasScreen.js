// CategoriasScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTransactions } from "../context/TransactionContext";
import { useTheme } from "../context/ThemeContext";

export default function CategoriasScreen() {
  const { categorias, loading } = useTransactions();
  const { theme } = useTheme();
  
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Carregando...</Text>
      </View>
    );
  }
  
  if (categorias.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Nenhuma categoria ainda</Text>
        <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>As categorias aparecerão quando você adicionar gastos</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {categorias.map((cat) => (
        <View key={cat.id} style={[styles.card, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}>
          <Text style={[styles.nome, { color: theme.text }]}>{cat.nome}</Text>
          <Text style={[styles.percent, { color: theme.text }]}>{cat.percentual}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  nome: { fontSize: 16 },
  percent: { fontSize: 16, fontWeight: "600" },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: "center",
  },
});
