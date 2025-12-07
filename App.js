import React, { useContext, useState } from "react";
import { SafeAreaView, StatusBar, ActivityIndicator, View, Alert } from "react-native";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import { TransactionProvider } from "./src/context/TransactionContext";
import MainAppScreen from "./src/screens/MainAppScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

function AppContent() {
  const { usuario, loading, fazerLogin, fazerCadastro } = useContext(AuthContext);
  const [tela, setTela] = useState('login');

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  if (!usuario) {
    if (tela === 'register') {
      return (
        <RegisterScreen
          onRegister={async (username, senha) => {
            const sucesso = await fazerCadastro(username, senha);
            if (sucesso) {
              Alert.alert('Sucesso', 'Conta criada com sucesso!');
            } else {
              Alert.alert('Erro', 'Nome de usuário já existe');
            }
          }}
          onNavigateToLogin={() => setTela('login')}
        />
      );
    }

    return (
      <LoginScreen
        onLogin={async (username, senha) => {
          const sucesso = await fazerLogin(username, senha);
          if (!sucesso) {
            Alert.alert('Erro', 'Usuário ou senha incorretos');
          }
        }}
        onNavigateToRegister={() => setTela('register')}
      />
    );
  }

  return (
    <TransactionProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar barStyle="dark-content" />
        <MainAppScreen />
      </SafeAreaView>
    </TransactionProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

