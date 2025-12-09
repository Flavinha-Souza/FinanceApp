import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
};

export const lightTheme = {
  background: '#FFFFFF',
  backgroundSecondary: '#F5F7FA',
  card: '#FFFFFF',
  cardSecondary: '#f7f7f7',
  text: '#1C1C1E',
  textSecondary: '#6E6E73',
  border: '#E1E5EB',
  primary: '#007AFF',
  success: '#2ecc71',
  danger: '#e74c3c',
  inputBg: '#f5f5f5',
  placeholder: '#999',
};

export const darkTheme = {
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  card: '#1C1C1E',
  cardSecondary: '#2C2C2E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  primary: '#0A84FF',
  success: '#30D158',
  danger: '#FF453A',
  inputBg: '#2C2C2E',
  placeholder: '#8E8E93',
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    carregarTema();
  }, []);

  const carregarTema = async () => {
    try {
      const tema = await AsyncStorage.getItem('@tema');
      if (tema !== null) {
        setIsDark(tema === 'dark');
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const novoTema = !isDark;
      setIsDark(novoTema);
      await AsyncStorage.setItem('@tema', novoTema ? 'dark' : 'light');
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
