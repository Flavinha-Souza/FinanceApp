// TransacoesScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "../context/TransactionContext";
import EditTransactionModal from "../components/EditTransactionModal";

export default function TransacoesScreen() {
  const { transacoes, loading, editarTransacao, deletarTransacao } = useTransactions();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("data");
  
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Carregando...</Text>
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
        return new Date(b.data || 0) - new Date(a.data || 0);
      } else {
        return Math.abs(b.valor) - Math.abs(a.valor);
      }
    });

  if (transacoesFiltradas.length === 0 && busca === "") {
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
    Alert.alert("Sucesso", "Transação editada!");
  };

  return (
    <View style={styles.container}>
      {/* Busca */}
      <View style={styles.buscaContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.buscaIcon} />
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar transações..."
          value={busca}
          onChangeText={setBusca}
        />
        {busca !== "" && (
          <TouchableOpacity onPress={() => setBusca("")}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Ordenação */}
      <View style={styles.ordenacaoContainer}>
        <TouchableOpacity
          style={[styles.ordenacaoBtn, ordenacao === "data" && styles.ordenacaoBtnActive]}
          onPress={() => setOrdenacao("data")}
        >
          <Text style={[styles.ordenacaoText, ordenacao === "data" && styles.ordenacaoTextActive]}>
            Data
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ordenacaoBtn, ordenacao === "valor" && styles.ordenacaoBtnActive]}
          onPress={() => setOrdenacao("valor")}
        >
          <Text style={[styles.ordenacaoText, ordenacao === "valor" && styles.ordenacaoTextActive]}>
            Valor
          </Text>
        </TouchableOpacity>
      </View>

      {transacoesFiltradas.length === 0 && busca !== "" ? (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
        </View>
      ) : (
        <FlatList
          data={transacoesFiltradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemLeft}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.categoria}>{item.categoria}</Text>
                {item.data && <Text style={styles.data}>{new Date(item.data).toLocaleDateString('pt-BR')}</Text>}
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
  container: { flex: 1, backgroundColor: "#fff" },
  buscaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
  },
  ordenacaoBtnActive: {
    backgroundColor: "#007AFF",
  },
  ordenacaoText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  ordenacaoTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
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
  data: { fontSize: 12, color: "#999", marginTop: 2 },
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
