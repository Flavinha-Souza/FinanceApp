import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_PREFIX = '@FinanceApp:transacoes';
const LEGACY_STORAGE_KEY = '@FinanceApp:transacoes';

function getStorageKey(userId) {
  return `${STORAGE_KEY_PREFIX}:${userId}`;
}

export const DataManager = {
  async migrarTransacoesLegadas(userId) {
    if (!userId) return [];

    try {
      const userKey = getStorageKey(userId);
      const userData = await AsyncStorage.getItem(userKey);
      if (userData) {
        return JSON.parse(userData);
      }

      const legacyData = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
      if (!legacyData) {
        return [];
      }

      const parsedLegacy = JSON.parse(legacyData);
      if (!Array.isArray(parsedLegacy)) {
        return [];
      }

      await AsyncStorage.setItem(userKey, JSON.stringify(parsedLegacy));
      return parsedLegacy;
    } catch (error) {
      return [];
    }
  },

  
  async carregarTransacoes(userId) {
    if (!userId) return [];

    try {
      const dados = await AsyncStorage.getItem(getStorageKey(userId));
      if (dados) {
        return JSON.parse(dados);
      } else {
        return await this.migrarTransacoesLegadas(userId);
      }
    } catch (error) {
      return [];
    }
  },

  
  async salvarTransacoes(userId, transacoes) {
    if (!userId) return false;

    try {
      await AsyncStorage.setItem(getStorageKey(userId), JSON.stringify(transacoes));
      return true;
    } catch (error) {
      return false;
    }
  },

  
  async adicionarTransacao(userId, novaTransacao) {
    try {
      const transacoes = await this.carregarTransacoes(userId);
      const transacoesAtualizadas = [...transacoes, novaTransacao];
      await this.salvarTransacoes(userId, transacoesAtualizadas);
      return transacoesAtualizadas;
    } catch (error) {
      return null;
    }
  },

  
  async editarTransacao(userId, transacaoEditada) {
    try {
      const transacoes = await this.carregarTransacoes(userId);
      const transacoesAtualizadas = transacoes.map(t => 
        t.id === transacaoEditada.id ? transacaoEditada : t
      );
      await this.salvarTransacoes(userId, transacoesAtualizadas);
      return transacoesAtualizadas;
    } catch (error) {
      return null;
    }
  },

 
  async deletarTransacao(userId, id) {
    try {
      const transacoes = await this.carregarTransacoes(userId);
      const transacoesAtualizadas = transacoes.filter(t => t.id !== id);
      await this.salvarTransacoes(userId, transacoesAtualizadas);
      return transacoesAtualizadas;
    } catch (error) {
      return null;
    }
  },



   
  calcularResumo(transacoes) {
    const entradas = transacoes
      .filter(t => t.valor > 0)
      .reduce((sum, t) => sum + t.valor, 0);
    
    const gastos = Math.abs(transacoes
      .filter(t => t.valor < 0)
      .reduce((sum, t) => sum + t.valor, 0));
    
    const saldoTotal = entradas - gastos;
    const previsto = saldoTotal; 
    
    return {
      entradas,
      gastos,
      saldoTotal,
      previsto
    };
  },

 
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
