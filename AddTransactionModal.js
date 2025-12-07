import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddTransactionModal({ visible, onClose, onAdd }) {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("despesa"); // "receita" ou "despesa"

  const categorias = [
    "Alimentação", "Transporte", "Lazer", "Saúde", 
    "Compras", "Renda", "Outros"
  ];

  const handleAdd = () => {
    if (!nome || !valor || !categoria) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico)) {
      Alert.alert("Erro", "Valor deve ser um número");
      return;
    }

    const novaTransacao = {
      id: Date.now(),
      nome,
      categoria,
      valor: tipo === "receita" ? valorNumerico : -valorNumerico,
    };

    onAdd(novaTransacao);
    
    // Limpar campos
    setNome("");
    setValor("");
    setCategoria("");
    setTipo("despesa");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Nova Transação</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.tipoContainer}>
            <TouchableOpacity
              style={[styles.tipoBtn, tipo === "receita" && styles.tipoActive]}
              onPress={() => setTipo("receita")}
            >
              <Text style={[styles.tipoText, tipo === "receita" && styles.tipoTextActive]}>
                Entrada
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tipoBtn, tipo === "despesa" && styles.tipoActive]}
              onPress={() => setTipo("despesa")}
            >
              <Text style={[styles.tipoText, tipo === "despesa" && styles.tipoTextActive]}>
                Despesa
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Nome da transação"
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={styles.input}
            placeholder="Valor (ex: 50.00)"
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
          />

          <View style={styles.categoriaContainer}>
            <Text style={styles.categoriaLabel}>Categoria:</Text>
            <View style={styles.categoriaGrid}>
              {categorias.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoriaBtn,
                    categoria === cat && styles.categoriaBtnActive,
                  ]}
                  onPress={() => setCategoria(cat)}
                >
                  <Text
                    style={[
                      styles.categoriaBtnText,
                      categoria === cat && styles.categoriaBtnTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  tipoContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tipoBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  tipoActive: {
    backgroundColor: "#007AFF",
  },
  tipoText: {
    fontSize: 16,
    color: "#666",
  },
  tipoTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  categoriaContainer: {
    marginBottom: 20,
  },
  categoriaLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#000",
  },
  categoriaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoriaBtn: {
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    margin: 4,
  },
  categoriaBtnActive: {
    backgroundColor: "#007AFF",
  },
  categoriaBtnText: {
    fontSize: 14,
    color: "#666",
  },
  categoriaBtnTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  addBtn: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});