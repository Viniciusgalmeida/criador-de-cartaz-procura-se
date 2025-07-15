# 🐕 Gerador de Cartaz Procura-se

Uma aplicação web moderna para criar cartazes de animais perdidos de forma rápida e profissional. Desenvolvida com React, TypeScript e uma interface intuitiva.

![Logo do Gerador de Cartaz](public/logo_gerador_cartaz_1080.png)

## ✨ Características

- 🎨 **Editor Visual Intuitivo**: Interface amigável para criar cartazes profissionais
- 📱 **Design Responsivo**: Funciona perfeitamente em desktop e mobile
- 🖼️ **Upload de Fotos**: Suporte para múltiplas fotos do animal
- 📝 **Campos Personalizáveis**: Adicione informações específicas do seu pet
- 🎯 **Preview em Tempo Real**: Veja o resultado final enquanto edita
- 📤 **Exportação de Imagem**: Salve o cartaz como imagem para compartilhar
- 🌍 **Suporte Multi-idioma**: Interface disponível em português e inglês

## 🚀 Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática para maior confiabilidade
- **Vite** - Build tool rápida e moderna
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI de alta qualidade
- **React Hook Form** - Gerenciamento de formulários
- **html2canvas** - Exportação de imagens
- **Vitest** - Framework de testes
- **ESLint** - Linting de código

## 📦 Instalação e Uso

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Passos para Instalação

```bash
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd criador-de-cartaz-procura-se

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificação ESLint
npm run typecheck    # Verificação TypeScript
npm run test         # Executar testes
npm run test:run     # Executar todos os testes
npm run test:ui      # Interface visual dos testes
```

## 🎯 Como Usar

1. **Acesse a aplicação** no seu navegador
2. **Preencha as informações** do animal perdido:
   - Nome do pet
   - Descrição física
   - Último local visto
   - Data/hora que se perdeu
   - Nome e telefone do proprietário
   - Acessórios (coleira, roupinha, etc.)
   - Recompensa (opcional)
3. **Adicione fotos** do animal (recomendado 2-3 fotos)
4. **Personalize campos adicionais** se necessário
5. **Visualize o preview** em tempo real
6. **Exporte o cartaz** como imagem para compartilhar

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes UI base (shadcn/ui)
│   ├── PosterEditor/   # Editor de cartaz
│   ├── PosterPreview/  # Preview do cartaz
│   └── WelcomePopup/   # Popup de boas-vindas
├── contexts/           # Contextos React
├── hooks/              # Hooks customizados
├── lib/                # Utilitários e configurações
├── pages/              # Páginas da aplicação
├── types/              # Definições de tipos TypeScript
└── test/               # Configurações de teste
```

## 🧪 Testes

O projeto utiliza Vitest para testes unitários e React Testing Library para testes de componentes.

```bash
# Executar todos os testes
npm run test:run

# Executar testes em modo watch
npm run test

# Interface visual dos testes
npm run test:ui
```

## 🔧 Desenvolvimento

### Padrões de Código

- **TypeScript Strict**: Código segue TypeScript strict mode
- **ESLint**: Configurado com regras específicas do projeto
- **Conventional Commits**: Padrão para mensagens de commit
- **Componentes Funcionais**: Uso de hooks React
- **Responsividade**: Design mobile-first

### Estrutura de Commits

```
feat: adiciona funcionalidade de exportação
fix: corrige bug no upload de imagens
test: adiciona testes para componente PosterEditor
docs: atualiza documentação
refactor: melhora estrutura dos componentes
```

## 🌐 Deploy

O projeto está configurado para deploy na Vercel com as seguintes configurações:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Se você encontrar algum problema ou tiver sugestões, por favor:

- Abra uma [issue](https://github.com/seu-usuario/criador-de-cartaz-procura-se/issues)
- Entre em contato através do email: [seu-email@exemplo.com]

---

**Desenvolvido com ❤️ para ajudar a encontrar pets perdidos**
