import React, { useContext, useState, useEffect } from "react";
import { SafeAreaView, StatusBar, ActivityIndicator, View, Alert } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import { TransactionProvider } from "./src/context/TransactionContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import MainAppScreen from "./src/screens/MainAppScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { usuario, loading, fazerLogin, fazerCadastro } = useContext(AuthContext);
  const { theme, isDark } = useTheme();
  const [tela, setTela] = useState('login');
  
  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return null; // Splash screen será mostrada
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
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <MainAppScreen />
      </SafeAreaView>
    </TransactionProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

