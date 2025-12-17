import { Linking } from 'react-native';

export class WhatsAppService {
  
  static gerarRelatorioVendas(transacoes) {
    const hoje = new Date().toISOString().split('T')[0];
    const vendasHoje = transacoes.filter(t => 
      t.data === hoje && t.valor > 0
    );
    
    if (vendasHoje.length === 0) {
      return "📊 *Relatório de Vendas*\n\n❌ Nenhuma venda registrada hoje";
    }
    
    // Calcular totais
    const faturamento = vendasHoje.reduce((sum, t) => sum + t.valor, 0);
    const totalItens = vendasHoje.length;
    
    // Agrupar por produto
    const produtosPorCategoria = {};
    vendasHoje.forEach(venda => {
      if (!produtosPorCategoria[venda.categoria]) {
        produtosPorCategoria[venda.categoria] = 0;
      }
      produtosPorCategoria[venda.categoria]++;
    });
    
    // Montar relatório
    let relatorio = `📊 *Relatório de Vendas - ${new Date().toLocaleDateString('pt-BR')}*\n\n`;
    relatorio += `💰 *Faturamento:* R$ ${faturamento.toFixed(2)}\n`;
    relatorio += `📦 *Total de vendas:* ${totalItens}\n`;
    relatorio += `💳 *Ticket médio:* R$ ${(faturamento / totalItens).toFixed(2)}\n\n`;
    
    relatorio += `📋 *Produtos vendidos:*\n`;
    Object.entries(produtosPorCategoria).forEach(([produto, quantidade]) => {
      relatorio += `• ${produto}: ${quantidade}\n`;
    });
    
    relatorio += `\n🤖 _Enviado automaticamente pelo MeuApp Vendas_`;
    
    return relatorio;
  }
  
  static async enviarRelatorio(transacoes, numeroWhatsApp = null) {
    try {
      const relatorio = this.gerarRelatorioVendas(transacoes);
      const mensagem = encodeURIComponent(relatorio);
      
      let url;
      if (numeroWhatsApp) {
        // Enviar para número específico
        url = `whatsapp://send?phone=${numeroWhatsApp}&text=${mensagem}`;
      } else {
        // Abrir WhatsApp para escolher contato
        url = `whatsapp://send?text=${mensagem}`;
      }
      
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        return true;
      } else {
        throw new Error('WhatsApp não está instalado');
      }
    } catch (error) {
      console.error('Erro ao enviar relatório:', error);
      return false;
    }
  }
  
  static gerarRelatorioSemanal(transacoes) {
    const hoje = new Date();
    const semanaAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const vendasSemana = transacoes.filter(t => {
      const dataVenda = new Date(t.data);
      return dataVenda >= semanaAtras && dataVenda <= hoje && t.valor > 0;
    });
    
    const faturamento = vendasSemana.reduce((sum, t) => sum + t.valor, 0);
    const totalVendas = vendasSemana.length;
    
    let relatorio = `📈 *Relatório Semanal*\n\n`;
    relatorio += `💰 *Faturamento:* R$ ${faturamento.toFixed(2)}\n`;
    relatorio += `📦 *Total de vendas:* ${totalVendas}\n`;
    relatorio += `📅 *Período:* ${semanaAtras.toLocaleDateString('pt-BR')} - ${hoje.toLocaleDateString('pt-BR')}\n\n`;
    
    if (totalVendas > 0) {
      relatorio += `💳 *Ticket médio:* R$ ${(faturamento / totalVendas).toFixed(2)}\n`;
      relatorio += `📊 *Média diária:* R$ ${(faturamento / 7).toFixed(2)}`;
    }
    
    return relatorio;
  }
  
  static async enviarBackupCompleto(transacoes) {
    try {
      const backup = {
        data: new Date().toISOString(),
        versao: '1.0',
        transacoes: transacoes
      };
      
      const backupString = JSON.stringify(backup, null, 2);
      const mensagem = encodeURIComponent(
        `🔄 *Backup Completo - MeuApp Vendas*\n\n` +
        `📅 Data: ${new Date().toLocaleDateString('pt-BR')}\n` +
        `📊 Total de registros: ${transacoes.length}\n\n` +
        `💾 *Dados (copie e salve):*\n\`\`\`${backupString}\`\`\``
      );
      
      const url = `whatsapp://send?text=${mensagem}`;
      await Linking.openURL(url);
      return true;
    } catch (error) {
      console.error('Erro ao enviar backup:', error);
      return false;
    }
  }
}