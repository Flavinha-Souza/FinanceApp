import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BottomTabs({ selectedTab, onTabChange }) {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => onTabChange("dashboard")} style={styles.tab}>
          <Text style={selectedTab === "dashboard" ? styles.active : styles.inactive}>📊</Text>
          <Text style={styles.label}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onTabChange("transacoes")} style={styles.tab}>
          <Text style={selectedTab === "transacoes" ? styles.active : styles.inactive}>💸</Text>
          <Text style={styles.label}>Transações</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onTabChange("categorias")} style={styles.tab}>
          <Text style={selectedTab === "categorias" ? styles.active : styles.inactive}>📂</Text>
          <Text style={styles.label}>Categorias</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onTabChange("profile")} style={styles.tab}>
          <Text style={selectedTab === "profile" ? styles.active : styles.inactive}>👤</Text>
          <Text style={styles.label}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    justifyContent: "space-around",
  },
  tab: {
    alignItems: "center",
  },
  inactive: {
    fontSize: 22,
    opacity: 0.5,
  },
  active: {
    fontSize: 24,
    opacity: 1,
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
