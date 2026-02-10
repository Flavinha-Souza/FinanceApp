import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

function LogoIcon({ color }) {
  return (
    <Svg width="80" height="80" viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="45" fill={color} />
      <Path d="M35 45 L45 55 L65 35" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Rect x="30" y="60" width="40" height="4" fill="#fff" rx="2" />
    </Svg>
  );
}

export default function LoginScreen({ onLogin, onNavigateToRegister }) {
  const { theme } = useTheme();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    if (!usuario.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    if (usuario.length < 3) {
      Alert.alert('Erro', 'Usuário deve ter no mínimo 3 caracteres');
      return;
    }
    if (senha.length < 4) {
      Alert.alert('Erro', 'Senha deve ter no mínimo 4 caracteres');
      return;
    }
    onLogin(usuario.trim(), senha);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.backgroundSecondary }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <LogoIcon color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>FinanceApp</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Gestão Financeira Inteligente</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
            placeholder="Nome de usuário"
            placeholderTextColor={theme.placeholder}
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
            placeholder="Senha"
            placeholderTextColor={theme.placeholder}
            value={senha}    
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onNavigateToRegister}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>
              Não tem conta? <Text style={[styles.linkBold, { color: theme.primary }]}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
  },
  form: {
    width: '100%',
  },
  input: {
    borderRadius: 10,
    padding: 15,
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 1.5,
  },
  button: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  linkText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
  },
  linkBold: {
    fontWeight: '600',
  },
});
