import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Share } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useTransactions } from "../context/TransactionContext";
import ChangePasswordModal from "../components/ChangePasswordModal";

export default function ConfiguracoesScreen() {
  const { usuario, fazerLogout, alterarSenha } = useContext(AuthContext);
  const { transacoes } = useTransactions();
  const [modalSenhaVisible, setModalSenhaVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: fazerLogout, style: 'destructive' }
      ]
    );
  };

  const handleChangePassword = () => {
    setModalSenhaVisible(true);
  };

  const handlePasswordChange = async (senhaAtual, novaSenha) => {
    const sucesso = await alterarSenha(senhaAtual, novaSenha);
    if (sucesso) {
      setModalSenhaVisible(false);
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
    } else {
      Alert.alert('Erro', 'Senha atual incorreta');
    }
  };

  const handleExportData = async () => {
    if (!transacoes || transacoes.length === 0) {
      Alert.alert('Aviso', 'Não há transações para exportar');
      return;
    }

    try {
      const dataStr = JSON.stringify(transacoes, null, 2);
      const fileName = `financas_${new Date().toISOString().split('T')[0]}.json`;
      
      await Share.share({
        message: dataStr,
        title: 'Exportar Transações',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível exportar os dados');
    }
  };

  const handleAbout = () => {
    Alert.alert(
      'FinanceApp',
      'Versão 1.0.0\n\nGestão Financeira Inteligente\n\nDesenvolvido por Flávia Souza\n\n© 2025',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      
      {usuario && (
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{usuario.username[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>@{usuario.username}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Conta</Text>
      <TouchableOpacity style={styles.optionCard} onPress={handleChangePassword}>
        <Text style={styles.optionText}>Alterar Senha</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
      
      <Text style={styles.sectionTitle}>Dados</Text>
      <TouchableOpacity style={styles.optionCard} onPress={handleExportData}>
        <Text style={styles.optionText}>Exportar Transações</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
      
      <Text style={styles.sectionTitle}>Sobre</Text>
      <TouchableOpacity style={styles.optionCard} onPress={handleAbout}>
        <Text style={styles.optionText}>Informações do App</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>FinanceApp v1.0.0</Text>
      </View>

      <ChangePasswordModal
        visible={modalSenhaVisible}
        onClose={() => setModalSenhaVisible(false)}
        onChangePassword={handlePasswordChange}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa", 
    padding: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "700", 
    marginBottom: 20, 
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1a73e8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6c757d",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  optionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  optionText: { 
    fontSize: 16, 
    color: "#1a1a1a", 
    fontWeight: "500" 
  },
  arrow: {
    fontSize: 24,
    color: "#adb5bd",
    fontWeight: "300",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#adb5bd",
  },
});
