import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { TransactionProvider } from "./src/context/TransactionContext";
import MainAppScreen from "./src/screens/MainAppScreen";

export default function App() {
  return (
    <TransactionProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar barStyle="dark-content" />
        <MainAppScreen />
      </SafeAreaView>
    </TransactionProvider>
  );
}

