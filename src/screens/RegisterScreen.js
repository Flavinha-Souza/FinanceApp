import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Svg, Path, Circle, Rect } from 'react-native-svg';

function LogoIcon() {
  return (
    <Svg width="80" height="80" viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="45" fill="#1a73e8" />
      <Path d="M35 45 L45 55 L65 35" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Rect x="30" y="60" width="40" height="4" fill="#fff" rx="2" />
    </Svg>
  );
}

export default function RegisterScreen({ onRegister, onNavigateToLogin }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleRegister = () => {
    if (!usuario.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    if (senha.length < 4) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 4 caracteres');
      return;
    }
    onRegister(usuario.trim(), senha);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <LogoIcon />
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Comece sua gestão financeira</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nome de usuário"
              placeholderTextColor="#999"
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Senha (mínimo 4 caracteres)"
              placeholderTextColor="#999"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor="#999"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.linkText}>
                Já tem conta? <Text style={styles.linkBold}>Faça login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6c757d',
    fontWeight: '400',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#dee2e6',
    color: '#212529',
  },
  button: {
    backgroundColor: '#1a73e8',
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
    color: '#6c757d',
  },
  linkBold: {
    color: '#1a73e8',
    fontWeight: '600',
  },
});
