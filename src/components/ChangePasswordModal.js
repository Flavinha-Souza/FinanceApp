import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';

export default function ChangePasswordModal({ visible, onClose, onChangePassword }) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleSubmit = () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    if (novaSenha.length < 4) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 4 caracteres');
      return;
    }
    onChangePassword(senhaAtual, novaSenha);
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Alterar Senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Senha atual"
            placeholderTextColor="#999"
            value={senhaAtual}
            onChangeText={setSenhaAtual}
            secureTextEntry
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            placeholderTextColor="#999"
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar nova senha"
            placeholderTextColor="#999"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
            autoCapitalize="none"
          />

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  saveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#1a73e8',
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
