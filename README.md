
# 🐕 Lost Pet Poster Generator

A modern web application to create lost pet posters quickly and professionally. Built with React, TypeScript and an intuitive interface.

![Lost Pet Poster Generator Logo](public/logo_gerador_cartaz_1080.png)

## ✨ Features

- 🎨 **Intuitive Visual Editor**: User-friendly interface to create professional posters
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🖼️ **Photo Upload**: Support for multiple pet photos
- 📝 **Customizable Fields**: Add specific information about your pet
- 🎯 **Real-time Preview**: See the final result while editing
- 📤 **Image Export**: Save the poster as an image to share
- 🌍 **Multi-language Support**: Interface available in Portuguese and English

## 🚀 Technologies Used

- **React 18** - Main framework
- **TypeScript** - Static typing for greater reliability
- **Vite** - Fast and modern build tool
- **Tailwind CSS** - Utility CSS framework
- **shadcn/ui** - High-quality UI components
- **React Hook Form** - Form management
- **html2canvas** - Image export
- **Vitest** - Testing framework
- **ESLint** - Code linting

## 📦 Installation and Usage

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation Steps

```bash
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd criador-de-cartaz-procura-se

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

The application will be available at [Lost Pet Poster Generator](https://criador-de-cartaz-procura-se.vercel.app/)

### Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Build preview
npm run lint         # ESLint verification
npm run typecheck    # TypeScript verification
npm run test         # Run tests
npm run test:run     # Run all tests
npm run test:ui      # Visual test interface
```

## 🎯 How to Use

1. **Access the application** in your browser
2. **Fill in the lost pet information**:
  - Pet name
  - Physical description
  - Last seen location
  - Date/time when lost
  - Owner's name and phone
  - Accessories (collar, clothes, etc.)
  - Reward (optional)
3. **Add photos** of the animal (recommended 2-3 photos)
4. **Customize additional fields** if needed
5. **View the preview** in real-time
6. **Export the poster** as an image to share

## 📁 Project Structure


```
src/
├── components/         # Componentes React
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

## 🧪 Testing

The project uses Vitest for unit testing and React Testing Library for component testing.

```bash
# Executar todos os testes
npm run test:run

# Executar testes em modo watch
npm run test

# Interface visual dos testes
npm run test:ui
```

## 🔧 Development

### Code Standards

- **TypeScript Strict**: Code follows TypeScript strict mode
- **ESLint**: Configured with project-specific rules
- **Conventional Commits**: Standard for commit messages
- **Functional Components**: Use of React hooks
- **Responsiveness**: Mobile-first design

### Commit Structure

```
feat: adiciona funcionalidade de exportação
fix: corrige bug no upload de imagens
test: adiciona testes para componente PosterEditor
docs: atualiza documentação
refactor: melhora estrutura dos componentes
```

## 🌐 Deploy

The project is configured for deployment on Vercel with the following settings:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Developed with ❤️ to help find lost pets**
