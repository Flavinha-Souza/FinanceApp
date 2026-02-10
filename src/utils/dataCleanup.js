import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para limpar todos os dados do app (use com cuidado!)
export async function limparTodosDados() {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    return false;
  }
}

// Função para limpar apenas dados de autenticação
export async function limparDadosAuth() {
  try {
    await AsyncStorage.removeItem('@MeuApp:users');
    await AsyncStorage.removeItem('@MeuApp:currentUser');
    return true;
  } catch (error) {
    return false;
  }
}

// Função para verificar se há dados antigos (senhas sem hash)
export async function verificarDadosAntigos() {
  try {
    const usersData = await AsyncStorage.getItem('@MeuApp:users');
    if (!usersData) return false;
    
    const users = JSON.parse(usersData);
    // Se algum usuário tem senha muito curta ou sem hash, são dados antigos
    return users.some(u => u.senha && u.senha.length < 10);
  } catch {
    return false;
  }
}
