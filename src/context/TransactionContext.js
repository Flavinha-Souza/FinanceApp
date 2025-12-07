import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataManager } from '../services/DataManager';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions deve ser usado dentro de TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados ao iniciar o app
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const dados = await DataManager.carregarTransacoes();
      setTransacoes(dados);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarTransacao = async (novaTransacao) => {
    try {
      const transacoesAtualizadas = await DataManager.adicionarTransacao(novaTransacao);
      if (transacoesAtualizadas) {
        setTransacoes(transacoesAtualizadas);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      return false;
    }
  };

  const editarTransacao = async (transacaoEditada) => {
    try {
      const transacoesAtualizadas = await DataManager.editarTransacao(transacaoEditada);
      if (transacoesAtualizadas) {
        setTransacoes(transacoesAtualizadas);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao editar transação:', error);
      return false;
    }
  };

  const deletarTransacao = async (id) => {
    try {
      const transacoesAtualizadas = await DataManager.deletarTransacao(id);
      if (transacoesAtualizadas) {
        setTransacoes(transacoesAtualizadas);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      return false;
    }
  };

  // Calcular dados derivados
  const resumo = DataManager.calcularResumo(transacoes);
  const categorias = DataManager.calcularCategorias(transacoes);

  const value = {
    transacoes,
    resumo,
    categorias,
    loading,
    adicionarTransacao,
    editarTransacao,
    deletarTransacao,
    carregarDados,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};