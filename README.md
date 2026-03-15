# Racha-Conta App 💸

O **Racha-Conta** é uma aplicação mobile moderna desenvolvida para simplificar a divisão de despesas em restaurantes, bares e eventos sociais. Com foco em rapidez e facilidade de uso, a aplicação permite que grupos gerenciem seus consumos em tempo real, garantindo que ninguém pague a mais (ou a menos) do que deve.

## 🚀 Funcionalidades

- **Criação de Salas:** Gere um ID único e um código de 6 dígitos para o seu grupo.
- **Entrada Facilitada:** Entre em salas via código numérico.
- **Gestão de Itens em Tempo Real:** Adicione produtos com nome, preço e defina quem consumiu cada item.
- **Divisão Inteligente:** Suporte para divisão igualitária, por consumo individual ou proporcional (ex: uma pizza dividida por 3).
- **Cálculo de Gorjeta:** Configure a divisão dos 10% (ou outra porcentagem) de forma igualitária ou proporcional ao consumo.
- **Sincronização em Tempo Real:** Atualizações instantâneas para todos os participantes da sala.
- **Offline First:** Adicione itens mesmo sem internet; os dados são sincronizados automaticamente assim que a conexão for restabelecida.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Backend/Banco de Dados:** [Supabase](https://supabase.com/) (Real-time database & Auth)
- **Navegação:** React Navigation

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) (no seu dispositivo móvel para testes)

## 🔧 Instalação e Configuração

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Cerne17/racha-conta-app.git
   cd racha-conta-app
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=sua-url-do-supabase
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-do-supabase
   ```

## 🏃 Como Rodar

Existem diversas formas de iniciar o projeto com o Expo:

- **Interface do Expo (Menu):**
  ```bash
  npm start
  ```

- **Android:**
  ```bash
  npm run android
  ```

- **iOS:**
  ```bash
  npm run ios
  ```

- **Web:**
  ```bash
  npm run web
  ```

Após iniciar, escaneie o QR Code exibido no terminal com o app **Expo Go** no seu celular.

## 📱 Utilizando o Expo Go

Para testar a aplicação diretamente no seu celular físico, siga estes passos:

1. **Instale o App:** Baixe o **Expo Go** na [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS) ou [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android).
2. **Conexão:** Certifique-se de que seu celular e seu computador estejam conectados na **mesma rede Wi-Fi**.
3. **Inicie o Servidor:** No terminal, execute `npm start`.
4. **Escaneie o QR Code:**
   - No **Android**: Abra o app Expo Go e use a opção "Scan QR Code".
   - No **iOS**: Use a câmera padrão do sistema para escanear o QR Code e toque na notificação para abrir no Expo Go.
5. **Desenvolvimento:** O app será carregado instantaneamente. Qualquer alteração no código será refletida automaticamente no seu celular (Fast Refresh).

> [!TIP]
> Se o QR Code não funcionar devido a restrições de rede (firewall), tente iniciar com `npx expo start --tunnel`.

## 📂 Estrutura do Projeto

```text
src/
├── hooks/       # Hooks personalizados para lógica de estado
├── navigation/  # Configuração de rotas e menus
├── screens/     # Telas da aplicação (Home, SalaAtiva, etc.)
└── services/    # Integração com Supabase e APIs externas
```

## ⚖️ Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Desenvolvido por [Miguel Cerne](https://github.com/Cerne17) como parte de projeto acadêmico.
