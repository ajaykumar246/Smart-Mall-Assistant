# 🛍️ Smart Mall Assistant — Aura

> An AI-powered digital concierge for modern shopping malls, featuring an intelligent chatbot, visual fashion recommendations, interactive navigation, and real-time notifications.

---

## 📖 Overview

**Smart Mall Assistant (Aura)** is a full-stack web application that transforms the in-mall shopping experience. Shoppers can ask natural language questions about stores, products, and events; receive AI-powered outfit recommendations by uploading a photo; navigate the mall using an interactive pathfinder; and access emergency SOS services — all from a single, seamless interface.

The project is built with a **React + Vite** frontend and a **Django REST Framework** backend, powered by **Google Gemini AI** and **MongoDB Atlas Vector Search**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Chatbot (Aura)** | Ask anything about the mall — stores, products, prices, floors. Powered by Gemini AI + MongoDB vector search. |
| 📸 **Visual Fashion Scan** | Upload your outfit photo to get AI-matched product recommendations using CLIP embeddings + Gemini. |
| 🗺️ **Mall Pathfinder** | Interactive map to find and navigate to any shop in the mall. |
| 🔔 **Real-time Notifications** | Live alerts via Django Channels + Redis WebSockets. |
| 🚨 **SOS Emergency** | Quick-access emergency assistance page for shoppers. |
| 🏪 **Shop Portal** | Shops can register and log in to manage their presence on the platform. |
| 👤 **User Authentication** | Secure token-based registration and login for shoppers. |

---

## 🏗️ Project Structure

```
Smart-Mall-Assistant/
├── backend/                  # Django backend
│   ├── backend/              # Django project settings, URLs, ASGI/WSGI
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── middleware.py
│   ├── chat_app/             # Core Django application
│   │   ├── models.py         # ChatSession, ChatMessage, Shop, UploadedImage
│   │   ├── views.py          # REST API views
│   │   ├── urls.py           # API route definitions
│   │   ├── serializers.py    # DRF serializers
│   │   ├── utils.py          # Chatbot RAG pipeline (Gemini + MongoDB)
│   │   ├── similarity.py     # CLIP-based visual similarity search
│   │   ├── consumers.py      # WebSocket consumer (notifications)
│   │   ├── routing.py        # WebSocket routing
│   │   └── setup.py          # Gemini & MongoDB initialization
│   ├── manage.py
│   ├── db.sqlite3            # SQLite database (user/shop auth)
│   └── .env_example          # Environment variable template
│
└── frontend/                 # React + Vite frontend
    ├── src/
    │   ├── pages/
    │   │   ├── HomePage.jsx        # Landing page
    │   │   ├── ChatPage.jsx        # AI chatbot UI
    │   │   ├── ScanPage.jsx        # Image upload & fashion advisor
    │   │   ├── MallPathFinder.jsx  # Interactive mall map
    │   │   ├── SOS.jsx             # Emergency page
    │   │   ├── LoginPage.jsx       # Shopper login
    │   │   ├── SignupPage.jsx      # Shopper sign up
    │   │   └── RegisterPage.jsx    # Shop registration
    │   ├── components/
    │   │   ├── Navbar.jsx          # Navigation bar
    │   │   └── FloatingAlert.jsx   # Notification alert overlay
    │   ├── App.jsx                 # Root router
    │   └── main.jsx                # Entry point
    ├── package.json
    └── vite.config.js
```

---

## 🧠 AI Architecture

### 💬 Chatbot (RAG Pipeline)
1. User query → **Gemini Embedding API** (`gemini-embedding-001`) generates a vector.
2. Vector is searched against the **MongoDB Atlas `embeddings` collection** using `$vectorSearch` (index: `mall`).
3. Top 5 relevant chunks (shops, products, events) are retrieved and filtered by relevance score (≥ 0.5).
4. A structured prompt is sent to **Gemini Flash** (`gemini-2.5-flash`) with the retrieved context.
5. Gemini responds as **"Aura"** — the mall's friendly digital concierge — with accurate, grounded information.

### 👗 Fashion Visual Search
1. User uploads a clothing/outfit image.
2. Image is encoded using the **CLIP ViT-B/32** model (`sentence-transformers`).
3. The image vector is searched against **MongoDB Atlas `products` collection** (`$vectorSearch` on `image_embedding`).
4. Top matching product details (name, brand, price, image URL) are retrieved.
5. **Gemini Flash** generates a friendly 1-2 line sales recommendation.

---

## 🛠️ Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | Django 4.x + Django REST Framework |
| AI / LLM | Google Gemini AI (`gemini-2.5-flash`, `gemini-embedding-001`) |
| Vector DB | MongoDB Atlas (Vector Search) |
| Visual AI | CLIP ViT-B/32 via `sentence-transformers` |
| Real-time | Django Channels + Redis (WebSockets) |
| Auth | DRF Token Authentication |
| Database | SQLite (dev) |
| Image Handling | Pillow |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| 3D / Animation | Three.js + React Three Fiber + Drei |
| Icons | Lucide React |
| Carousel | React Slick |

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB Atlas account (with Vector Search index configured)
- Google Gemini API key
- Redis server (for WebSocket notifications)

---

### 🔧 Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env_example .env
# Edit .env and fill in your keys (see Environment Variables section)

# 5. Apply database migrations
python manage.py migrate

# 6. Start the development server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

---

### 🎨 Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory based on `.env_example`:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Atlas Connection URI
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# Django Secret Key (generate a strong random key for production)
DJANGO_SECRET_KEY=your_django_secret_key_here

# Redis (for WebSocket notifications)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

---

## 🗄️ MongoDB Atlas Setup

### 1. Collections Required
| Collection | Purpose |
|---|---|
| `embeddings` | Text embeddings for shops, products, and events (used by chatbot RAG) |
| `products` | Product catalog with `image_embedding` field (used by fashion scan) |

### 2. Vector Search Indexes

**Chatbot index** (on `embeddings` collection):
```json
{
  "fields": [{
    "type": "vector",
    "path": "embedding",
    "numDimensions": 768,
    "similarity": "cosine"
  }]
}
```
> Index name: `mall`

**Fashion product index** (on `products` collection):
```json
{
  "fields": [{
    "type": "vector",
    "path": "image_embedding",
    "numDimensions": 512,
    "similarity": "cosine"
  }]
}
```
> Index name: `vector_index`

---

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/register/` | Register a new shopper | Public |
| `POST` | `/api/login/` | Shopper login → returns token | Public |
| `POST` | `/api/logout/` | Logout current user | Token |
| `POST` | `/api/chat/` | Send a message to Aura chatbot | Public |
| `POST` | `/api/upload/` | Upload image for fashion recommendation | Public |
| `POST` | `/api/shop/register/` | Register a new shop | Public |
| `POST` | `/api/shop/login/` | Shop login → returns token | Public |
| `WS` | `ws://localhost:8000/ws/notifications/` | Real-time notification stream | — |

---

## 📱 Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Landing page with mall highlights |
| `/chat` | Chat | AI chatbot interface |
| `/scan` | Scan | Upload image for fashion recommendations |
| `/map` | Mall Pathfinder | Interactive shop navigator |
| `/sos` | SOS | Emergency assistance |
| `/login` | Login | Shopper login |
| `/register` | Register | Shop registration |

---

## 🚀 Production Notes

- Set `DEBUG = False` in `settings.py` and configure `ALLOWED_HOSTS` properly.
- Use a production-grade database (PostgreSQL recommended) instead of SQLite.
- Secure all API keys using environment variables — never commit `.env` to version control.
- Use a production ASGI server like **Daphne** or **Uvicorn** for WebSocket support.
- Serve static/media files via a CDN or **Whitenoise** (already configured).

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



---

<div align="center">
  <p>Built with ❤️ for smarter shopping experiences</p>
  <p><strong>Aura — Your Digital Mall Concierge</strong></p>
</div>
