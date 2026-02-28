# Smart Mall Assistant

Welcome to the **Smart Mall Assistant** repository! This project is a comprehensive and modern solution designed to enhance the physical shopping experience. It provides intelligent guidance, intuitive navigation, real-time updates, and an array of convenient features tailored for mall visitors.

## 🌟 Features

- **Smart Chatbot**: An AI-powered interactive assistant capable of answering mall-related queries, providing directions, and helping with store information.
- **Interactive Mall Map**: A dynamic and responsive map interface for store locators and seamless indoor navigation.
- **Live Parking Booking & Management**: Real-time tracking of parking availability with features to reserve parking spots in advance.
- **Emergency Broadcasts & Alerts**: Instant safety announcements and critical alerts ensuring visitor well-being.
- **Special Offers & Promotions**: Dynamic display of ongoing sales, exclusive discounts, and store promotions.
- **Integrated Checkout System**: A seamless shopping cart and checkout experience right within the assistant profile.
- **User Personas & Role-Based Access**: Specialized dashboards for visitors, store owners, and mall administrators.

## 📁 Project Structure

The project is structured into two main directories, decoupling the client UI from the server APIs:

```text
Smart-Mall-Assistant/
│
├── frontend/               # React (Vite) User Interface
│   ├── public/             # Static assets
│   ├── src/                # Front-end source code (Components, Pages, Assets)
│   ├── package.json        # Frontend Node dependencies
│   ├── tailwind.config.js  # UI Styling configurations
│   └── README.md           # Frontend-specific documentation
│
├── backend/                # Django REST API Server
│   ├── backend/            # Main Django project settings 
│   ├── chat_app/           # Chatbot and core APIs application
│   ├── db.sqlite3          # Local development database
│   ├── manage.py           # Django execution script
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Backend-specific documentation
│
└── README.md               # This overall project documentation file
```

## 📖 Deep Dives & Documentation

For detailed information on setting up, developing, and running each part of the stack, please refer to their respective README files:

- 💻 **[Frontend Documentation](./frontend/README.md)**: Explore the modern React-based UI, complete with glassmorphism design, vibrant components, and state management.
- ⚙️ **[Backend Documentation](./backend/README.md)**: Explore the robust Django-driven API, database models, and integrated ML/Chatbot services.

## 🚀 Getting Started Quick Links

To get the full application up and running locally, you will need to start both servers. Be sure to check out the links above for detailed environment setups. 

1. Install backend dependencies: `pip install -r backend/requirements.txt`
2. Run Django server: `cd backend && python manage.py runserver`
3. Install frontend dependencies: `cd frontend && npm install`
4. Run Vite dev server: `npm run dev`

---
*Empowering your mall experience through intelligent technology.*
