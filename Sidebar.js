import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Sidebar({ onSelect, closeSidebar }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "transacoes", label: "Transações", icon: "💸" },
    { id: "categorias", label: "Categorias", icon: "📂" },
    { id: "profile", label: "Perfil", icon: "👤" },
    { id: "settings", label: "Configurações", icon: "⚙️" },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.item}
          onPress={() => {
            onSelect(item.id);
            closeSidebar();
          }}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    backgroundColor: "#fff",
    height: "100%",
    paddingTop: 50,
    paddingLeft: 20,
    elevation: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
  },
});
