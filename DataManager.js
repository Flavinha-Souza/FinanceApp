import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@MeuApp:transacoes';

export const DataManager = {
  // Carregar transações do AsyncStorage
  async carregarTransacoes() {
    try {
      const dados = await AsyncStorage.getItem(STORAGE_KEY);
      if (dados) {
        return JSON.parse(dados);
      } else {
        // Começar com lista vazia
        return [];
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      return [];
    }
  },

  // Salvar transações no AsyncStorage
  async salvarTransacoes(transacoes) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transacoes));
      return true;
    } catch (error) {
      console.error('Erro ao salvar transações:', error);
      return false;
    }
  },

  // Adicionar nova transação
  async adicionarTransacao(novaTransacao) {
    try {
      const transacoes = await this.carregarTransacoes();
      const transacoesAtualizadas = [...transacoes, novaTransacao];
      await this.salvarTransacoes(transacoesAtualizadas);
      return transacoesAtualizadas;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      return null;
    }
  },

  // Editar transação existente
  async editarTransacao(transacaoEditada) {
    try {
      const transacoes = await this.carregarTransacoes();
      const transacoesAtualizadas = transacoes.map(t => 
        t.id === transacaoEditada.id ? transacaoEditada : t
      );
      await this.salvarTransacoes(transacoesAtualizadas);
      return transacoesAtualizadas;
    } catch (error) {
      console.error('Erro ao editar transação:', error);
      return null;
    }
  },

  // Deletar transação
  async deletarTransacao(id) {
    try {
      const transacoes = await this.carregarTransacoes();
      const transacoesAtualizadas = transacoes.filter(t => t.id !== id);
      await this.salvarTransacoes(transacoesAtualizadas);
      return transacoesAtualizadas;
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      return null;
    }
  },

  // Calcular resumo financeiro
  calcularResumo(transacoes) {
    const entradas = transacoes
      .filter(t => t.valor > 0)
      .reduce((sum, t) => sum + t.valor, 0);
    
    const gastos = Math.abs(transacoes
      .filter(t => t.valor < 0)
      .reduce((sum, t) => sum + t.valor, 0));
    
    const saldoTotal = entradas - gastos;
    const previsto = saldoTotal; // Simplificado por enquanto
    
    return {
      entradas,
      gastos,
      saldoTotal,
      previsto
    };
  },

  // Calcular percentuais por categoria
  calcularCategorias(transacoes) {
    const gastos = transacoes.filter(t => t.valor < 0);
    const totalGastos = Math.abs(gastos.reduce((sum, t) => sum + t.valor, 0));
    
    if (totalGastos === 0) return [];
    
    const categoriaMap = {};
    
    gastos.forEach(transacao => {
      const categoria = transacao.categoria;
      if (!categoriaMap[categoria]) {
        categoriaMap[categoria] = 0;
      }
      categoriaMap[categoria] += Math.abs(transacao.valor);
    });
    
    return Object.entries(categoriaMap).map(([nome, valor], index) => ({
      id: index + 1,
      nome,
      percentual: Math.round((valor / totalGastos) * 100)
    }));
  }
};