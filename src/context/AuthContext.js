import React, { createContext, useState, useEffect } from 'react';
import { login, register, logout, checkAuth, changePassword } from '../services/AuthManager';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verificarAuth();
  }, []);

  const verificarAuth = async () => {
    const user = await checkAuth();
    setUsuario(user);
    setLoading(false);
  };

  const fazerLogin = async (username, senha) => {
    const user = await login(username, senha);
    if (user) {
      setUsuario(user);
      return true;
    }
    return false;
  };

  const fazerCadastro = async (username, senha) => {
    const user = await register(username, senha);
    if (user) {
      setUsuario(user);
      return true;
    }
    return false;
  };

  const fazerLogout = async () => {
    await logout();
    setUsuario(null);
  };

  const alterarSenha = async (senhaAtual, novaSenha) => {
    if (!usuario) return false;
    return await changePassword(usuario.id, senhaAtual, novaSenha);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, fazerLogin, fazerCadastro, fazerLogout, alterarSenha }}>
      {children}
    </AuthContext.Provider>
  );
}
