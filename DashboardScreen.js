import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTransactions } from "./TransactionContext";

export default function DashboardScreen() {
  const { transacoes, resumo, categorias, loading } = useTransactions();
  
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Carregando...</Text>
      </View>
    );
  }
  
  const transacoesRecentes = transacoes.slice(-4); // Últimas 4 transações
  const previsao = resumo.previsto >= 0 ? "+ R$ " + resumo.previsto.toFixed(2) : "R$ " + resumo.previsto.toFixed(2);

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.container} 
      showsVerticalScrollIndicator={false}
    >
      
      <View style={styles.saldoCard}>
        <Text style={styles.saldoLabel}>Saldo Total</Text>
        <Text style={styles.saldoValor}>R$ {resumo.saldoTotal.toFixed(2)}</Text>
      </View>

   
      <View style={styles.resumoContainer}>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>Entradas</Text>
          <Text style={[styles.resumoValor, { color: "#2ecc71" }]}>+ R$ {resumo.entradas.toFixed(2)}</Text>
        </View>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>Gastos</Text>
          <Text style={[styles.resumoValor, { color: "#e74c3c" }]}>- R$ {resumo.gastos.toFixed(2)}</Text>
        </View>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>Previsão</Text>
          <Text style={[styles.resumoValor, { color: resumo.previsto >= 0 ? "#2ecc71" : "#e74c3c" }]}>{previsao}</Text>
        </View>
      </View>

      
      {categorias.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <View style={styles.categoriasContainer}>
            {categorias.map((cat) => (
              <View key={cat.id} style={styles.categoriaCard}>
                <Text style={styles.categoriaNome}>{cat.nome}</Text>
                <Text style={styles.categoriaPercent}>{cat.percentual}%</Text>
              </View>
            ))}
          </View>
        </>
      )}

    
      {transacoesRecentes.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Transações Recentes</Text>
          {transacoesRecentes.map((item) => (
            <View key={item.id} style={styles.transacaoItem}>
              <View>
                <Text style={styles.transacaoNome}>{item.nome}</Text>
                <Text style={styles.transacaoCategoria}>{item.categoria}</Text>
              </View>
              <Text style={[styles.transacaoValor, { color: item.valor > 0 ? "#2ecc71" : "#e74c3c" }]}>
                {item.valor > 0 ? "+ " : "- "}R$ {Math.abs(item.valor).toFixed(2)}
              </Text>
            </View>
          ))}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhuma transação ainda</Text>
          <Text style={styles.emptySubText}>Use o botão + para adicionar sua primeira transação</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, paddingBottom: 140 },
  saldoCard: { padding: 25, backgroundColor: "#f7f7f7", borderRadius: 16, marginBottom: 25, borderWidth: 1, borderColor: "#e5e5e5" },
  saldoLabel: { fontSize: 16, color: "#555" },
  saldoValor: { fontSize: 32, fontWeight: "700", marginTop: 5, color: "#000" },
  resumoContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  resumoCard: { flex: 1, padding: 20, backgroundColor: "#fafafa", borderRadius: 14, marginHorizontal: 5, borderWidth: 1, borderColor: "#eaeaea" },
  resumoLabel: { fontSize: 14, color: "#555" },
  resumoValor: { fontSize: 18, fontWeight: "600", marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#000", marginVertical: 15 },
  categoriasContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  categoriaCard: { width: "48%", padding: 15, backgroundColor: "#f5f5f5", borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "#e5e5e5" },
  categoriaNome: { fontSize: 14, color: "#555" },
  categoriaPercent: { fontSize: 18, fontWeight: "600", marginTop: 5, color: "#000" },
  transacaoItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  transacaoNome: { fontSize: 16, color: "#000" },
  transacaoCategoria: { fontSize: 13, color: "#777" },
  transacaoValor: { fontSize: 16, fontWeight: "600" },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
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
