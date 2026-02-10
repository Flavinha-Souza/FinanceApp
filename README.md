# FinanceApp - Gestão Financeira Pessoal

Aplicativo mobile de gestão financeira desenvolvido com React Native e Expo. Permite controlar receitas, despesas e visualizar relatórios financeiros.

## 📱 Funcionalidades

- ✅ Autenticação local de usuários (login/registro)
- ✅ Adicionar, editar e excluir transações
- ✅ Categorização de gastos
- ✅ Dashboard com resumo financeiro
- ✅ Gráficos de receitas e despesas
- ✅ Tema claro/escuro
- ✅ Alteração de senha
- ✅ Dados armazenados localmente

## 🚀 Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **AsyncStorage** - Armazenamento local
- **Context API** - Gerenciamento de estado
- **React Native SVG** - Gráficos e ícones
- **React Native Chart Kit** - Visualização de dados

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- Expo CLI
- Expo Go (app no celular) ou emulador

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Flavinha-Souza/FinanceApp.git
cd FinanceApp
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o projeto:
```bash
npm start
```

4. Escaneie o QR code com o Expo Go ou pressione:
   - `a` para Android
   - `i` para iOS
   - `w` para Web

## 📁 Estrutura do Projeto

```
MeuApp/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── context/         # Context API (Auth, Theme, Transaction)
│   ├── screens/         # Telas do app
│   ├── services/        # Lógica de negócio
│   └── utils/           # Utilitários e helpers
├── assets/              # Imagens e ícones
├── App.js              # Componente raiz
└── package.json        # Dependências
```

## 🔒 Segurança

- Validação básica de inputs
- Dados armazenados localmente no dispositivo
- Nenhuma informação sensível exposta em logs

⚠️ **Nota**: Este é um projeto de demonstração. Não indicado para uso em produção sem reforço de segurança.


## 📝 Scripts Disponíveis

```bash
npm start          # Inicia o Expo
npm run android    # Abre no Android
npm run ios        # Abre no iOS
npm run web        # Abre no navegador
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abrir um Pull Request

## 📦 Build do aplicativo

- APK gerado para testes
- Aplicação rodando fora do ambiente de desenvolvimento
- Simulação de ciclo real de app mobile

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido por [Flávia Souza] - Desenvolvedora Web e Mobile Júnior


⭐ Se este projeto te ajudou, considere dar uma estrela!
