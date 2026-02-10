/**
 * ⚠️ UTILITÁRIO EDUCACIONAL
 * Este código NÃO deve ser usado em produção.
 * Criado apenas para fins de demonstração em projetos pessoais.
 */

export function pseudoHashPassword(password) {
  let hash = 0;
  const combined = password + '_demo_salt';
  
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
    hash |= 0;
  }
  
  return Math.abs(hash).toString(36);
}
