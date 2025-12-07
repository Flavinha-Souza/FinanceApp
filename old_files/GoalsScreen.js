import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function GoalsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Metas</Text>
      <Text style={styles.subtitle}>Acompanhe suas metas financeiras</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "600", color: "#000" },
  subtitle: { fontSize: 16, color: "#555", marginTop: 10 },
});
