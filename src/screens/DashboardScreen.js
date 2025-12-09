import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useTransactions } from "../context/TransactionContext";
import { useTheme } from "../context/ThemeContext";

export default function DashboardScreen() {
  const { transacoes, resumo, categorias, loading } = useTransactions();
  const { theme } = useTheme();
  const [filtro, setFiltro] = React.useState('mes'); // 'hoje', 'semana', 'mes', 'ano', 'tudo'

  const filtrarTransacoes = () => {
    const hoje = new Date();
    const hojeDia = hoje.getDate();
    const hojeMes = hoje.getMonth();
    const hojeAno = hoje.getFullYear();

    return transacoes.filter(t => {
      if (!t.data) return true;
      const [ano, mes, dia] = t.data.split('-').map(Number);

      switch(filtro) {
        case 'hoje':
          return dia === hojeDia && mes === hojeMes + 1 && ano === hojeAno;
        case 'semana':
          const dataT = new Date(ano, mes - 1, dia);
          const inicioSemana = new Date(hoje);
          inicioSemana.setDate(hoje.getDate() - hoje.getDay());
          inicioSemana.setHours(0, 0, 0, 0);
          return dataT >= inicioSemana;
        case 'mes':
          return mes === hojeMes + 1 && ano === hojeAno;
        case 'ano':
          return ano === hojeAno;
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
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Carregando...</Text>
      </View>
    );
  }
  
  const transacoesRecentes = transacoesFiltradas.slice(-4);
  const previsao = saldoTotal >= 0 ? "+ R$ " + saldoTotal.toFixed(2) : "R$ " + saldoTotal.toFixed(2);

  return (
    <ScrollView 
      style={[styles.scrollContainer, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.container} 
      showsVerticalScrollIndicator={false}
    >
      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        {['hoje', 'semana', 'mes', 'ano', 'tudo'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filtroBtn, { backgroundColor: filtro === f ? theme.primary : theme.inputBg }]}
            onPress={() => setFiltro(f)}
          >
            <Text style={[styles.filtroText, { color: filtro === f ? '#fff' : theme.textSecondary }]}>
              {f === 'mes' ? 'Mês' : f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={[styles.saldoCard, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}>
        <Text style={[styles.saldoLabel, { color: theme.textSecondary }]}>Saldo Total</Text>
        <Text style={[styles.saldoValor, { color: theme.text }]}>R$ {saldoTotal.toFixed(2)}</Text>
      </View>

   
      <View style={styles.resumoContainer}>
        <View style={[styles.resumoCard, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}>
          <Text style={[styles.resumoLabel, { color: theme.textSecondary }]}>Entradas</Text>
          <Text style={[styles.resumoValor, { color: theme.success }]}>+ R$ {entradas.toFixed(2)}</Text>
        </View>
        <View style={[styles.resumoCard, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}>
          <Text style={[styles.resumoLabel, { color: theme.textSecondary }]}>Gastos</Text>
          <Text style={[styles.resumoValor, { color: theme.danger }]}>- R$ {gastos.toFixed(2)}</Text>
        </View>
        <View style={[styles.resumoCard, { backgroundColor: theme.cardSecondary, borderColor: theme.border }]}>
          <Text style={[styles.resumoLabel, { color: theme.textSecondary }]}>Saldo</Text>
          <Text style={[styles.resumoValor, { color: saldoTotal >= 0 ? theme.success : theme.danger }]}>{previsao}</Text>
        </View>
      </View>

      
      {categorias.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Categorias</Text>
          <View style={styles.categoriasContainer}>
            {categorias.map((cat) => (
              <View key={cat.id} style={[styles.categoriaCard, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Text style={[styles.categoriaNome, { color: theme.textSecondary }]}>{cat.nome}</Text>
                <Text style={[styles.categoriaPercent, { color: theme.text }]}>{cat.percentual}%</Text>
              </View>
            ))}
          </View>
        </>
      )}

    
      {transacoesRecentes.length > 0 ? (
        <>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Transações Recentes</Text>
          {transacoesRecentes.map((item) => (
            <View key={item.id} style={[styles.transacaoItem, { borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.transacaoNome, { color: theme.text }]}>{item.nome}</Text>
                <Text style={[styles.transacaoCategoria, { color: theme.textSecondary }]}>{item.categoria}</Text>
              </View>
              <Text style={[styles.transacaoValor, { color: item.valor > 0 ? theme.success : theme.danger }]}>
                {item.valor > 0 ? "+ " : "- "}R$ {Math.abs(item.valor).toFixed(2)}
              </Text>
            </View>
          ))}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Nenhuma transação ainda</Text>
          <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>Use o botão + para adicionar sua primeira transação</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1 },
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
    borderRadius: 8,
    alignItems: "center",
  },
  filtroText: {
    fontSize: 12,
    fontWeight: "500",
  },
  saldoCard: { padding: 25, borderRadius: 16, marginBottom: 25, borderWidth: 1 },
  saldoLabel: { fontSize: 16 },
  saldoValor: { fontSize: 32, fontWeight: "700", marginTop: 5 },
  resumoContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  resumoCard: { flex: 1, padding: 20, borderRadius: 14, marginHorizontal: 5, borderWidth: 1 },
  resumoLabel: { fontSize: 14 },
  resumoValor: { fontSize: 18, fontWeight: "600", marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 15 },
  categoriasContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  categoriaCard: { width: "48%", padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1 },
  categoriaNome: { fontSize: 14 },
  categoriaPercent: { fontSize: 18, fontWeight: "600", marginTop: 5 },
  transacaoItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1 },
  transacaoNome: { fontSize: 16 },
  transacaoCategoria: { fontSize: 13 },
  transacaoValor: { fontSize: 16, fontWeight: "600" },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
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
