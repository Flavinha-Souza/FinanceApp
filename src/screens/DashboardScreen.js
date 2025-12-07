import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useTransactions } from "../context/TransactionContext";

export default function DashboardScreen() {
  const { transacoes, resumo, categorias, loading } = useTransactions();
  const [filtro, setFiltro] = React.useState('mes'); // 'hoje', 'semana', 'mes', 'ano', 'tudo'

  const filtrarTransacoes = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return transacoes.filter(t => {
      if (!t.data) return true;
      const dataTransacao = new Date(t.data);
      dataTransacao.setHours(0, 0, 0, 0);

      switch(filtro) {
        case 'hoje':
          return dataTransacao.getTime() === hoje.getTime();
        case 'semana':
          const inicioSemana = new Date(hoje);
          inicioSemana.setDate(hoje.getDate() - hoje.getDay());
          return dataTransacao >= inicioSemana;
        case 'mes':
          return dataTransacao.getMonth() === hoje.getMonth() && 
                 dataTransacao.getFullYear() === hoje.getFullYear();
        case 'ano':
          return dataTransacao.getFullYear() === hoje.getFullYear();
        default:
          return true;
      }
    });
  };

  const transacoesFiltradas = filtrarTransacoes();
  const entradas = transacoesFiltradas.filter(t => t.valor > 0).reduce((sum, t) => sum + t.valor, 0);
  const gastos = Math.abs(transacoesFiltradas.filter(t => t.valor < 0).reduce((sum, t) => sum + t.valor, 0));
  const saldoTotal = entradas - gastos;
  
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Carregando...</Text>
      </View>
    );
  }
  
  const transacoesRecentes = transacoesFiltradas.slice(-4);
  const previsao = saldoTotal >= 0 ? "+ R$ " + saldoTotal.toFixed(2) : "R$ " + saldoTotal.toFixed(2);

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.container} 
      showsVerticalScrollIndicator={false}
    >
      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        {['hoje', 'semana', 'mes', 'ano', 'tudo'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filtroBtn, filtro === f && styles.filtroBtnActive]}
            onPress={() => setFiltro(f)}
          >
            <Text style={[styles.filtroText, filtro === f && styles.filtroTextActive]}>
              {f === 'mes' ? 'Mês' : f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.saldoCard}>
        <Text style={styles.saldoLabel}>Saldo Total</Text>
        <Text style={styles.saldoValor}>R$ {saldoTotal.toFixed(2)}</Text>
      </View>

   
      <View style={styles.resumoContainer}>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>Entradas</Text>
          <Text style={[styles.resumoValor, { color: "#2ecc71" }]}>+ R$ {entradas.toFixed(2)}</Text>
        </View>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>Gastos</Text>
          <Text style={[styles.resumoValor, { color: "#e74c3c" }]}>- R$ {gastos.toFixed(2)}</Text>
        </View>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>Saldo</Text>
          <Text style={[styles.resumoValor, { color: saldoTotal >= 0 ? "#2ecc71" : "#e74c3c" }]}>{previsao}</Text>
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
  filtrosContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
  },
  filtroBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
  },
  filtroBtnActive: {
    backgroundColor: "#007AFF",
  },
  filtroText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  filtroTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
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
