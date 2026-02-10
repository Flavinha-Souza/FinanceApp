import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import * as Haptics from 'expo-haptics';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function AddTransactionModal({ visible, onClose, onAdd }) {
  const { theme } = useTheme();
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("despesa");
  const hoje = new Date();
  const dataInicial = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
  const [data, setData] = useState(dataInicial); 
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

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

    
    const [dia, mes, ano] = data.split('/');
    const dataISO = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

    const novaTransacao = {
      id: Date.now(),
      nome,
      categoria,
      valor: tipo === "receita" ? valorNumerico : -valorNumerico,
      data: dataISO,
    };

    onAdd(novaTransacao);
    
  
    setNome("");
    setValor("");
    setCategoria("");
    setTipo("despesa");
    const novaData = new Date();
    setData(`${String(novaData.getDate()).padStart(2, '0')}/${String(novaData.getMonth() + 1).padStart(2, '0')}/${novaData.getFullYear()}`);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modal, 
            { 
              backgroundColor: theme.card,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Nova Transação</Text>
            <Pressable 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          <View style={styles.tipoContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.tipoBtn, 
                { 
                  backgroundColor: tipo === "receita" ? theme.primary : theme.inputBg,
                  transform: [{ scale: pressed ? 0.98 : 1 }]
                }
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setTipo("receita");
              }}
            >
              <Text style={[styles.tipoText, { color: tipo === "receita" ? "#fff" : theme.textSecondary }]}>
                Entrada
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.tipoBtn, 
                { 
                  backgroundColor: tipo === "despesa" ? theme.primary : theme.inputBg,
                  transform: [{ scale: pressed ? 0.98 : 1 }]
                }
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setTipo("despesa");
              }}
            >
              <Text style={[styles.tipoText, { color: tipo === "despesa" ? "#fff" : theme.textSecondary }]}>
                Despesa
              </Text>
            </Pressable>
          </View>

          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
            placeholder="Nome da transação"
            placeholderTextColor={theme.placeholder}
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
            placeholder="Valor (ex: 50.00)"
            placeholderTextColor={theme.placeholder}
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
            placeholder="Data (DD/MM/AAAA)"
            placeholderTextColor={theme.placeholder}
            value={data}
            onChangeText={setData}
          />

          <View style={styles.categoriaContainer}>
            <Text style={[styles.categoriaLabel, { color: theme.text }]}>Categoria:</Text>
            <View style={styles.categoriaGrid}>
              {categorias.map((cat, index) => (
                <Pressable
                  key={cat}
                  style={({ pressed }) => [
                    styles.categoriaBtn,
                    { 
                      backgroundColor: categoria === cat ? theme.primary : theme.inputBg,
                      transform: [{ scale: pressed ? 0.95 : 1 }]
                    },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setCategoria(cat);
                  }}
                >
                  <Text
                    style={[
                      styles.categoriaBtnText,
                      { color: categoria === cat ? "#fff" : theme.textSecondary },
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable 
            style={({ pressed }) => [
              styles.addBtn, 
              { 
                backgroundColor: theme.primary,
                transform: [{ scale: pressed ? 0.98 : 1 }]
              }
            ]} 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleAdd();
            }}
          >
            <Text style={styles.addBtnText}>Adicionar</Text>
          </Pressable>
        </Animated.View>
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
    color: "#000",
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