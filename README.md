# 🧠 Neural Terminal

A cyberpunk-themed developer portfolio with immersive 3D animations, interactive terminal, and cinematic audio experience. Built with Next.js 14, Three.js, and React Three Fiber.

![Neural Terminal](https://img.shields.io/badge/version-1.0.0-FF4500?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Three.js](https://img.shields.io/badge/Three.js-r158-black?style=flat-square&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)

## ✨ Features

### 🎬 Immersive Boot Sequence
- Terminal-style loading animation with typed messages
- Neural network canvas background with connected nodes
- Progress bar with glitch effects

### 🌐 3D Neural Core
- Dynamic particle system with 1200+ points
- Explosion animation on load, concentration on scroll
- Interactive tech stack orbit display
- Energy rings and glow effects

### 🖱️ Custom Cursor
- Physics-based trailing cursor
- Context-aware states (links, buttons, inputs)
- Magnetic attraction effects
- Mobile-optimized (hidden on touch devices)

### 💻 Floating Terminal
- Interactive command-line interface
- Keyboard shortcut: `Ctrl+Shift+\``
- Easter egg commands (`matrix`, `sudo`, `whoami`)
- Minimizable window with macOS-style controls

### 🎵 Background Audio
- Ambient soundtrack (Hans Zimmer - Cornfield Chase)
- Auto-plays when hero section loads
- Smooth fade-in/fade-out transitions
- Toggle control in navigation

### 📱 Fully Responsive
- Mobile-first design approach
- Hamburger menu for mobile navigation
- Adaptive 3D rendering for performance
- Touch-optimized interactions

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **3D Graphics** | Three.js, React Three Fiber, Drei |
| **Styling** | Tailwind CSS |
| **Animations** | GSAP, Framer Motion |
| **State** | Zustand |
| **Post-processing** | @react-three/postprocessing |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/KD-3030/neural-terminal.git

# Navigate to project
cd neural-terminal

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles & animations
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page component
├── components/
│   ├── 3d/
│   │   ├── NeuralCore.tsx    # Main 3D particle system
│   │   └── Scene.tsx         # Three.js canvas setup
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── SkillsSection.tsx
│   │   └── ContactSection.tsx
│   ├── ui/
│   │   ├── BootSequence.tsx      # Loading screen
│   │   ├── CustomCursor.tsx      # Animated cursor
│   │   ├── FloatingTerminal.tsx  # Interactive terminal
│   │   ├── BackgroundAudio.tsx   # Audio controller
│   │   ├── Navigation.tsx        # Navbar
│   │   └── GlitchText.tsx        # Text effects
│   └── providers/
│       └── SmoothScrollProvider.tsx
└── stores/
    └── useStore.ts      # Zustand state management
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+\`` | Toggle floating terminal |
| `Esc` | Close terminal |

## 🎨 Customization

### Colors
The primary accent color is `#FF4500` (Orange Red). Modify in:
- `tailwind.config.ts` for Tailwind classes
- Component files for inline styles

### Audio
Replace `/public/Cornfield Chase - Hans Zimmer.mp3` with your preferred track.

### Content
- Update project data in `ProjectsSection.tsx`
- Modify skills in `SkillsSection.tsx`
- Edit contact links in `ContactSection.tsx`

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KD-3030/neural-terminal)

## 🙏 Credits

- **Audio**: Hans Zimmer - Cornfield Chase (Interstellar OST)
- **Fonts**: Space Grotesk, JetBrains Mono
- **3D Library**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)

## 📄 License

MIT License - feel free to use this for your own portfolio!

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/KD-3030">Kinjal Dutta</a>
</p>
