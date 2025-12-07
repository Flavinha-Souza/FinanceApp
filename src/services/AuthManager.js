import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@MeuApp:users';
const CURRENT_USER_KEY = '@MeuApp:currentUser';

export async function register(username, senha) {
  try {
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    const users = usersData ? JSON.parse(usersData) : [];

    if (users.find(u => u.username === username)) {
      return null;
    }

    const newUser = { id: Date.now().toString(), username, senha };
    users.push(newUser);

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id: newUser.id, username: newUser.username }));

    return { id: newUser.id, username: newUser.username };
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    return null;
  }
}

export async function login(username, senha) {
  try {
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    const users = usersData ? JSON.parse(usersData) : [];

    const user = users.find(u => u.username === username && u.senha === senha);
    if (!user) {
      return null;
    }

    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id: user.id, username: user.username }));
    return { id: user.id, username: user.username };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return null;
  }
}

export async function logout() {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
}

export async function checkAuth() {
  try {
    const userData = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return null;
  }
}

export async function changePassword(userId, senhaAtual, novaSenha) {
  try {
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    const users = usersData ? JSON.parse(usersData) : [];

    const userIndex = users.findIndex(u => u.id === userId && u.senha === senhaAtual);
    if (userIndex === -1) {
      return false;
    }

    users[userIndex].senha = novaSenha;
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return false;
  }
}
