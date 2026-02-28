# Smart Mall Assistant - Frontend

Welcome to the **Frontend** repository of the Smart Mall Assistant project! This user-facing application delivers a premium, robust, and modern experience built primarily using React, Vite, and Tailwind CSS. The design leverages a "Glassmorphism" aesthetic with vibrant gradients and smooth micro-animations, providing a highly responsive layout across all device types.

## 🎨 UI/UX Philosophy

The frontend is dedicated to user engagement, heavily relying on modern website standards:
- **Glassmorphism Design:** Frosty transparent components built over dynamic, colorful backgrounds.
- **Micro-animations & Transitions:** Enhances the interactive feel of buttons, cards, and navigation.
- **Fully Responsive:** Tailored layouts ensuring flawless experiences on mobile, tablet, and desktop viewports.
- **Dynamic Content:** A lively interface displaying live parking, real-time mall offers, and instant emergency alerts.

## 🛠 Tech Stack

- **Framework:** React.js powered by Vite for blazing fast Hot Module Replacement (HMR).
- **Styling:** Tailwind CSS (Vanilla utilities) optimized for a premium look without heavy frameworks. 
- **Routing:** React Router (used for seamless navigation between Home, Dashboard, etc.).
- **Icons & Assets:** Modern SVG icons integrated flawlessly for optimal visual cues.

## 🚀 Setup & Installation

Follow these steps to get the Vite development server running on your local machine:

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
    Ensure you have Node.js and npm installed on your system.
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Navigate to the URL provided in the terminal (typically `http://localhost:5173/`).

## 📁 Key File Structure

```text
frontend/
├── public/                 # Static public assets (Favicon, images without processing)
├── src/                    # Primary source code
│   ├── assets/             # Internal assets (logos, specific icons)
│   ├── components/         # Reusable UI components (NavBar, Chatbot Widget, GlassCard, Map)
│   ├── pages/              # Top-level Page Components (Home, Profile, Dashboard, Checkout)
│   ├── App.jsx             # Root React component managing routes/theme
│   ├── main.jsx            # Application entry point mounting App to DOM
│   └── index.css           # Global modern CSS configurations (Tailwind imports, custom fonts)
├── .gitignore              # Files to ignore in git 
├── eslint.config.js        # Linter configurations for consistent UI code
├── index.html              # Core HTML template file
├── tailwind.config.js      # Tailwind configurations, custom color palettes, and themes
└── vite.config.js          # Vite build configurations
```

## 📜 Development Guidelines 

- **Components:** Create modular, self-contained components in the `src/components/` directory.
- **Styling:** Adhere strictly to Tailwind utility classes instead of creating large external CSS files. Any custom complex animations should be placed cleanly in `index.css`.
- **Aesthetics First:** Make sure newly added features reflect the established premium visual identity.

---
*For details on the backend APIs and server logic, please head back to the [Overall Documentation](../README.md).*
