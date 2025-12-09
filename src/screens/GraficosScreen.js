import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTransactions } from "../context/TransactionContext";
import { useTheme } from "../context/ThemeContext";
import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";

export default function GraficosScreen() {
  const { transacoes, categorias } = useTransactions();
  const { theme } = useTheme();

  // Dados para gráfico de pizza (categorias)
  const dadosPizza = categorias
    .filter(cat => cat.total > 0)
    .map(cat => ({
      label: cat.nome,
      value: cat.total,
    }));

  // Dados para gráfico de barras (últimos 6 meses)
  const getDadosBarras = () => {
    const hoje = new Date();
    const meses = [];
    
    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesNome = data.toLocaleDateString('pt-BR', { month: 'short' });
      const mesNum = data.getMonth() + 1;
      const anoNum = data.getFullYear();
      
      const transacoesMes = transacoes.filter(t => {
        if (!t.data) return false;
        const [ano, mes] = t.data.split('-').map(Number);
        return mes === mesNum && ano === anoNum;
      });
      
      const saldo = transacoesMes.reduce((sum, t) => sum + t.valor, 0);
      
      meses.push({
        label: mesNome.charAt(0).toUpperCase() + mesNome.slice(1, 3),
        value: saldo,
      });
    }
    
    return meses;
  };

  const dadosBarras = getDadosBarras();

  // Estatísticas gerais
  const totalEntradas = transacoes.filter(t => t.valor > 0).reduce((sum, t) => sum + t.valor, 0);
  const totalSaidas = Math.abs(transacoes.filter(t => t.valor < 0).reduce((sum, t) => sum + t.valor, 0));
  const saldoTotal = totalEntradas - totalSaidas;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>Análise Financeira</Text>

      {/* Resumo */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Resumo Geral</Text>
        <View style={styles.resumoRow}>
          <View style={styles.resumoItem}>
            <Text style={[styles.resumoLabel, { color: theme.textSecondary }]}>Entradas</Text>
            <Text style={[styles.resumoValor, { color: theme.success }]}>
              R$ {totalEntradas.toFixed(2)}
            </Text>
          </View>
          <View style={styles.resumoItem}>
            <Text style={[styles.resumoLabel, { color: theme.textSecondary }]}>Saídas</Text>
            <Text style={[styles.resumoValor, { color: theme.danger }]}>
              R$ {totalSaidas.toFixed(2)}
            </Text>
          </View>
          <View style={styles.resumoItem}>
            <Text style={[styles.resumoLabel, { color: theme.textSecondary }]}>Saldo</Text>
            <Text style={[styles.resumoValor, { color: saldoTotal >= 0 ? theme.success : theme.danger }]}>
              R$ {saldoTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Gráfico de Barras */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Evolução (6 meses)</Text>
        {dadosBarras.length > 0 ? (
          <BarChart data={dadosBarras} theme={theme} />
        ) : (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Sem dados para exibir
          </Text>
        )}
      </View>

      {/* Gráfico de Pizza */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Gastos por Categoria</Text>
        {dadosPizza.length > 0 ? (
          <PieChart data={dadosPizza} size={200} theme={theme} />
        ) : (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Sem dados para exibir
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 140,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  resumoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resumoItem: {
    flex: 1,
    alignItems: "center",
  },
  resumoLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  resumoValor: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 14,
    paddingVertical: 20,
  },
});
