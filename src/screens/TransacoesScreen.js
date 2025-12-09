// TransacoesScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "../context/TransactionContext";
import { useTheme } from "../context/ThemeContext";
import EditTransactionModal from "../components/EditTransactionModal";

export default function TransacoesScreen() {
  const { transacoes, loading, editarTransacao, deletarTransacao } = useTransactions();
  const { theme } = useTheme();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("data");
  
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Carregando...</Text>
      </View>
    );
  }

  // Filtrar e ordenar transações
  const transacoesFiltradas = (transacoes || [])
    .filter(t => 
      t.nome.toLowerCase().includes(busca.toLowerCase()) ||
      t.categoria.toLowerCase().includes(busca.toLowerCase())
    )
    .sort((a, b) => {
      if (ordenacao === "data") {
        return (b.data || '').localeCompare(a.data || '');
      } else {
        return Math.abs(b.valor) - Math.abs(a.valor);
      }
    });

  if (transacoesFiltradas.length === 0 && busca === "") {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Nenhuma transação encontrada</Text>
        <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>Use o botão + para adicionar sua primeira transação</Text>
      </View>
    );
  }

  const handleEdit = (transacao) => {
    setTransacaoSelecionada(transacao);
    setEditModalVisible(true);
  };

  const handleDelete = (transacao) => {
    Alert.alert(
      "Excluir Transação",
      `Deseja excluir "${transacao.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: () => deletarTransacao(transacao.id)
        }
      ]
    );
  };

  const handleEditSave = (transacaoEditada) => {
    editarTransacao(transacaoEditada);
    Alert.alert("Sucesso", "Transação editada!");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Busca */}
      <View style={[styles.buscaContainer, { backgroundColor: theme.inputBg }]}>
        <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.buscaIcon} />
        <TextInput
          style={[styles.buscaInput, { color: theme.text }]}
          placeholder="Buscar transações..."
          placeholderTextColor={theme.placeholder}
          value={busca}
          onChangeText={setBusca}
        />
        {busca !== "" && (
          <TouchableOpacity onPress={() => setBusca("")}>
            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Ordenação */}
      <View style={styles.ordenacaoContainer}>
        <TouchableOpacity
          style={[styles.ordenacaoBtn, { backgroundColor: ordenacao === "data" ? theme.primary : theme.inputBg }]}
          onPress={() => setOrdenacao("data")}
        >
          <Text style={[styles.ordenacaoText, { color: ordenacao === "data" ? '#fff' : theme.textSecondary }]}>
            Data
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ordenacaoBtn, { backgroundColor: ordenacao === "valor" ? theme.primary : theme.inputBg }]}
          onPress={() => setOrdenacao("valor")}
        >
          <Text style={[styles.ordenacaoText, { color: ordenacao === "valor" ? '#fff' : theme.textSecondary }]}>
            Valor
          </Text>
        </TouchableOpacity>
      </View>

      {transacoesFiltradas.length === 0 && busca !== "" ? (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Nenhuma transação encontrada</Text>
        </View>
      ) : (
        <FlatList
          data={transacoesFiltradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.item, { borderBottomColor: theme.border }]}>
              <View style={styles.itemLeft}>
                <Text style={[styles.nome, { color: theme.text }]}>{item.nome}</Text>
                <Text style={[styles.categoria, { color: theme.textSecondary }]}>{item.categoria}</Text>
                {item.data && <Text style={[styles.data, { color: theme.textSecondary }]}>{item.data.split('-').reverse().join('/')}</Text>}
              </View>
              <View style={styles.itemRight}>
                <Text style={[styles.valor, { color: item.valor > 0 ? theme.success : theme.danger }]}>
                  {item.valor > 0 ? "+ " : "- "}R$ {Math.abs(item.valor).toFixed(2)}
                </Text>
                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={[styles.editBtn, { backgroundColor: theme.primary }]}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.editBtnText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.deleteBtn, { backgroundColor: theme.danger }]}
                    onPress={() => handleDelete(item)}
                  >
                    <Text style={styles.deleteBtnText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
      
      <EditTransactionModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onEdit={handleEditSave}
        transacao={transacaoSelecionada}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  buscaContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    margin: 15,
    marginBottom: 10,
  },
  buscaIcon: {
    marginRight: 8,
  },
  buscaInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  ordenacaoContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 10,
    gap: 10,
  },
  ordenacaoBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  ordenacaoText: {
    fontSize: 14,
    fontWeight: "500",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flex: 1,
  },
  itemRight: {
    alignItems: "flex-end",
  },
  actions: {
    flexDirection: "row",
    marginTop: 8,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  editBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  nome: { fontSize: 16, fontWeight: "500" },
  categoria: { fontSize: 13, marginTop: 2 },
  data: { fontSize: 12, marginTop: 2 },
  valor: { fontSize: 16, fontWeight: "600" },
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
