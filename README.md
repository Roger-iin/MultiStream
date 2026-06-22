# MultiStream Viewer 📺

**MultiStream Viewer** é uma plataforma web moderna, de alta performance e responsiva, projetada para permitir que os usuários assistam a três transmissões ao vivo simultaneamente: **YouTube**, **Twitch** e **Kick**.

A aplicação reorganiza dinamicamente o layout (foco 70/30) e gerencia de forma inteligente o áudio de cada player: a transmissão principal ativa mantém 100% do áudio, enquanto as transmissões secundárias entram automaticamente em modo silencioso (1% / mudo).

---

## 🛠️ Tecnologias Utilizadas

- **Core**: React 19 (Hooks, refs e otimizações de renderização)
- **Linguagem**: TypeScript (Strict-mode e tipagem estática ponta a ponta)
- **Build & Dev Server**: Vite
- **Estilização**: Tailwind CSS v4 (Glassmorfismo, animações suaves e design responsivo)
- **Gerenciamento de Estado**: Zustand (Assinatura baseada em seletores para alta performance)
- **Qualidade de Código**: ESLint & Prettier

---

## 📁 Arquitetura do Projeto

A estrutura de diretórios segue padrões de projetos escaláveis de grande porte, respeitando a separação de responsabilidades e os princípios SOLID:

```
src/
├── app/
│   ├── layouts/      # AppLayout.tsx (Landmarks HTML5, containers de tela)
│   └── routes/       # Estrutura preparada para roteamento futuro
├── components/
│   ├── forms/        # StreamSettings.tsx (Modal de configuração de canais)
│   ├── stream/       # StreamGrid.tsx, StreamPlayer.tsx, MainStreamSelector.tsx
│   └── ui/           # Header.tsx (Elementos de navegação e botões utilitários)
├── hooks/
│   └── useStreamStore.ts # Estado global do Zustand (Config, Volume, MainStream)
├── services/
│   ├── playerRegistry.ts # Registro e coordenação de áudio dos players (Design Pattern: Registry)
│   └── storage.ts        # StorageService (Persistência no LocalStorage)
├── types/
│   └── stream.ts         # Contratos de tipos, enums e interfaces do Player
├── utils/
│   ├── scriptLoader.ts   # Utilitário para carga assíncrona e segura dos SDKs de players
│   └── youtube.ts        # Parser inteligente de links e IDs do YouTube
├── pages/
│   └── Home.tsx          # Orchestrator da página principal
├── assets/               # Imagens e estilos estáticos
├── index.css             # Importação do Tailwind e variáveis de design (glassmorfismo)
├── main.tsx              # Ponto de entrada do React 19
└── App.tsx               # Wrapper de inicialização global
```

---

## ⚡ Instalação e Execução

### Pré-requisitos

Certifique-se de ter o **Node.js** (versão 18 ou superior) instalado em sua máquina.

### Passos para Rodar

1. **Instalar Dependências**:

   ```bash
   npm install
   ```

2. **Rodar em Modo de Desenvolvimento**:

   ```bash
   npm run dev
   ```

   _Acesse o endereço fornecido no terminal (geralmente `http://localhost:5173`)._

3. **Gerar Versão de Produção (Build)**:

   ```bash
   npm run build
   ```

4. **Verificar Linting e Formatação**:

   ```bash
   npm run lint
   npm run format
   ```

5. **Verificar Tipagens TypeScript**:
   ```bash
   npm run type-check
   ```

---

## 💡 Decisões Técnicas & Padrões

1. **Estado com Zustand**:
   - **Performance**: Ao contrário de `useReducer` + `useContext`, o Zustand se comunica de forma pontual com os componentes assinados, evitando renderizações em cascata desnecessárias (por exemplo, atualizar o formulário não recarrega os players ativos).
   - **Simplificação**: Reduz a complexidade de criar reducers, ações de dispatch e contexts.
2. **Design Pattern Registry (`PlayerRegistry`)**:
   - Criamos uma camada de abstração centralizada onde cada player (`StreamPlayer`) registra seu próprio controlador (`StreamPlayerController`) contendo as implementações específicas de controle de som (`setVolume`, `mute`, `unmute`).
   - Quando a live ativa muda, o Zustand notifica o Registry, que ajusta dinamicamente os volumes sem forçar a remontagem de componentes saudáveis do React.
3. **Parsing de YouTube Inteligente**:
   - O YouTube possui limitações de incorporação direta de canais ao vivo baseadas em apelidos (`@gaules`). A única forma confiável é utilizar o **Channel ID** (UC...) ou o **Video ID** direto. Nosso utilitário analisa as URLs inseridas pelo usuário e orienta sobre o formato mais estável.

---

## ⚠️ Limitações de Iframes & Estratégias

As plataformas de streaming aplicam políticas rígidas de segurança em ambientes incorporados (iframes). Abaixo, detalhamos como tratamos cada limitação técnica:

- **Controle de Volume no YouTube**:
  - **Estratégia**: Suportado nativamente através do _YouTube Iframe Player API_. Carregamos o SDK de forma assíncrona e interagimos com o player (`setVolume` e `mute/unmute`).
- **Controle de Volume na Twitch**:
  - **Limitação**: O SDK de incorporação interativa da Twitch (`https://embed.twitch.tv/embed/v1.js`) fornece controle de mudo (`setMuted`), mas **não expõe APIs para volume fracionado (como 1%)**.
  - **Estratégia**: Mapeamos volumes de 1% como silencioso (chama `setMuted(true)`) e volumes principais como ativo (chama `setMuted(false)`). O parâmetro `parent` é definido dinamicamente usando `window.location.hostname` para evitar erros de renderização.
- **Controle de Volume na Kick**:
  - **Limitação**: A Kick não disponibiliza um SDK JavaScript ou canal de comunicação `postMessage` público para interações em tempo real com seu iframe.
  - **Estratégia**: Para alternar entre mudo e ativo, a URL do iframe da Kick é recriada anexando `?muted=true` ou `?muted=false`. Embora cause um recarregamento pontual apenas no iframe da Kick (e não na aplicação inteira), esta é a única abordagem tecnicamente viável. Documentamos e adicionamos indicadores visuais de som no player.
- **Autoplay e Políticas de Navegadores**:
  - A maioria dos navegadores modernos (Chrome, Firefox, Safari) bloqueia a reprodução automática de vídeos com áudio ativado. Para garantir o carregamento fluido, todos os players são iniciados em modo **silenciado**, ativando o som da live principal após a primeira interação do usuário na página.

---

## 🚀 Futuras Melhorias

- **Integração com API do YouTube**: Buscar o ID do vídeo ao vivo de um canal de forma automatizada apenas fornecendo o apelido (`@handle`).
- **Suporte a Chats Integrados**: Adicionar abas colapsáveis nas laterais ou abaixo dos streams para renderizar os respectivos chats ao vivo da Twitch e do YouTube.
- **Modo Teatro Estendido**: Permitir customização das proporções do grid (ex: arrastar a barra divisora para mudar a proporção de 70% para 50%).
- **Preservação de Estado entre Abas**: Sincronização em tempo real das preferências caso o usuário use a aplicação em múltiplas janelas.
