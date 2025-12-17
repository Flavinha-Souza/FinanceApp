import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, Animated } from "react-native";
import { PieChart, LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTransactions } from "../context/TransactionContext";
import { useTheme } from "../context/ThemeContext";

const screenWidth = Dimensions.get('window').width;

export default function GraficosScreen() {
  const { transacoes, categorias } = useTransactions();
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Dados para gráfico de pizza (categorias)
  const dadosPizza = categorias
    .filter(cat => cat.total > 0)
    .map((cat, index) => ({
      name: cat.nome,
      population: cat.total,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][index % 6],
      legendFontColor: theme.text,
      legendFontSize: 12,
    }));

  // Dados para gráfico de linha (últimos 6 meses)
  const getDadosLinha = () => {
    const hoje = new Date();
    const labels = [];
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const dataAtual = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesNome = dataAtual.toLocaleDateString('pt-BR', { month: 'short' });
      const mesNum = dataAtual.getMonth() + 1;
      const anoNum = dataAtual.getFullYear();
      
      const transacoesMes = transacoes.filter(t => {
        if (!t.data) return false;
        const [ano, mes] = t.data.split('-').map(Number);
        return mes === mesNum && ano === anoNum;
      });
      
      const saldo = transacoesMes.reduce((sum, t) => sum + t.valor, 0);
      
      labels.push(mesNome.charAt(0).toUpperCase() + mesNome.slice(1, 3));
      data.push(Math.abs(saldo));
    }
    
    return { labels, datasets: [{ data }] };
  };

  const dadosLinha = getDadosLinha();
  
  const chartConfig = {
    backgroundColor: theme.card,
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.primary + Math.round(opacity * 255).toString(16).padStart(2, '0'),
    labelColor: (opacity = 1) => theme.text + Math.round(opacity * 255).toString(16).padStart(2, '0'),
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: theme.primary
    }
  };

  // Estatísticas gerais
  const totalEntradas = transacoes.filter(t => t.valor > 0).reduce((sum, t) => sum + t.valor, 0);
  const totalSaidas = Math.abs(transacoes.filter(t => t.valor < 0).reduce((sum, t) => sum + t.valor, 0));
  const saldoTotal = totalEntradas - totalSaidas;

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.titleContainer}>
          <Ionicons name="analytics-outline" size={24} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text, marginLeft: 8 }]}>Análise Financeira</Text>
        </View>

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

      {/* Gráfico de Linha */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="trending-up-outline" size={20} color={theme.primary} />
          <Text style={[styles.cardTitle, { color: theme.text, marginLeft: 8 }]}>Evolução (6 meses)</Text>
        </View>
        {dadosLinha.datasets[0].data.some(val => val > 0) ? (
          <LineChart
            data={dadosLinha}
            width={screenWidth - 80}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        ) : (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Sem dados para exibir
          </Text>
        )}
      </View>

      {/* Gráfico de Pizza */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="pie-chart-outline" size={20} color={theme.primary} />
          <Text style={[styles.cardTitle, { color: theme.text, marginLeft: 8 }]}>Gastos por Categoria</Text>
        </View>
        {dadosPizza.length > 0 ? (
          <PieChart
            data={dadosPizza}
            width={screenWidth - 80}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 50]}
            absolute
          />
        ) : (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Sem dados para exibir
          </Text>
        )}
      </View>
      </ScrollView>
    </Animated.View>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
