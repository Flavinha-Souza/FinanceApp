import AsyncStorage from '@react-native-async-storage/async-storage';
import { hashPassword } from '../utils/crypto';

const USERS_KEY = '@FinanceApp:users';
const CURRENT_USER_KEY = '@FinanceApp:currentUser';

export async function register(username, senha) {
  try {
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    const users = usersData ? JSON.parse(usersData) : [];

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return null;
    }

    const senhaHash = hashPassword(senha);
    const newUser = { id: Date.now().toString(), username, senha: senhaHash };
    users.push(newUser);

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id: newUser.id, username: newUser.username }));

    return { id: newUser.id, username: newUser.username };
  } catch (error) {
    return null;
  }
}

export async function login(username, senha) {
  try {
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    const users = usersData ? JSON.parse(usersData) : [];

    const senhaHash = hashPassword(senha);
    
   
    let user = users.find(u => u.username === username && u.senha === senhaHash);
    
    
    if (!user) {
      user = users.find(u => u.username === username && u.senha === senha);
      if (user) {
        
        const userIndex = users.findIndex(u => u.username === username);
        users[userIndex].senha = senhaHash;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    }
    
    if (!user) {
      return null;
    }

    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id: user.id, username: user.username }));
    return { id: user.id, username: user.username };
  } catch (error) {
    return null;
  }
}

export async function logout() {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
   
  }
}

export async function checkAuth() {
  try {
    const userData = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
}

export async function changePassword(userId, senhaAtual, novaSenha) {
  try {
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    const users = usersData ? JSON.parse(usersData) : [];

    const senhaAtualHash = hashPassword(senhaAtual);
    let userIndex = users.findIndex(u => u.id === userId && u.senha === senhaAtualHash);
    if (userIndex === -1) {
      userIndex = users.findIndex(u => u.id === userId && u.senha === senhaAtual);
    }
    if (userIndex === -1) {
      return false;
    }

    users[userIndex].senha = hashPassword(novaSenha);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    return false;
  }
}
