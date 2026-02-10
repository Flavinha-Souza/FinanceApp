import AsyncStorage from '@react-native-async-storage/async-storage';


export async function limparTodosDados() {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    return false;
  }
}


export async function limparDadosAuth() {
  try {
    await AsyncStorage.removeItem('@MeuApp:users');
    await AsyncStorage.removeItem('@MeuApp:currentUser');
    return true;
  } catch (error) {
    return false;
  }
}

export async function verificarDadosAntigos() {
  try {
    const usersData = await AsyncStorage.getItem('@MeuApp:users');
    if (!usersData) return false;
    
    const users = JSON.parse(usersData);

    return users.some(u => u.senha && u.senha.length < 10);
  } catch {
    return false;
  }
}
