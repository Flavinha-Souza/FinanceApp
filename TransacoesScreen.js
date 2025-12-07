// TransacoesScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "./TransactionContext";
import EditTransactionModal from "./EditTransactionModal";

export default function TransacoesScreen() {
  const { transacoes, loading, editarTransacao, deletarTransacao } = useTransactions();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);
  
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (transacoes.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
        <Text style={styles.emptySubText}>Use o botão + para adicionar sua primeira transação</Text>
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
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={transacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemLeft}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.categoria}>{item.categoria}</Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={[styles.valor, { color: item.valor > 0 ? "#2ecc71" : "#e74c3c" }]}>
                {item.valor > 0 ? "+ " : "- "}R$ {Math.abs(item.valor).toFixed(2)}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity 
                  style={styles.editBtn}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={styles.editBtnText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item)}
                >
                  <Text style={styles.deleteBtnText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      
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
  container: { flex: 1, backgroundColor: "#fff" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    backgroundColor: "#007AFF",
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
    backgroundColor: "#e74c3c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  nome: { fontSize: 16, color: "#000", fontWeight: "500" },
  categoria: { fontSize: 13, color: "#777", marginTop: 2 },
  valor: { fontSize: 16, fontWeight: "600" },
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
