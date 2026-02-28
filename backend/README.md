# Smart Mall Assistant - Backend

Welcome to the **Backend** repository of the Smart Mall Assistant project! This service provides a robust REST API powered by Django and Django REST Framework, integrating core features like the conversational AI chatbot, user authentication, parking reservations, and mall data management.

## 🛠 Tech Stack

- **Framework:** Django (Python) 
- **Database:** SQLite3 (development) / PostgreSQL (production-ready)
- **APIs:** Django REST Framework for clean, stateless API endpoints.
- **AI Integration:** Machine Learning model integration for intelligent interactions.
- **Authentication:** Secure session and token management for visitors and admins.

## 🚀 Setup & Installation

Follow these steps to get the Django development server running on your local machine:

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a Virtual Environment (Recommended):**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   ```

3. **Install Dependencies:**
   Ensure you have Python installed, then install the required pip packages.
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply Database Migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Start the Development Server:**
   ```bash
   python manage.py runserver
   ```
   The API will be accessible at `http://127.0.0.1:8000/`.

## 📁 Key File Structure

```text
backend/
├── backend/                # Primary Django Project configurations (settings.py, urls.py)
├── chat_app/               # Core application logic 
│   ├── migrations/         # Database schema migrations
│   ├── models.py           # Database entities (User, Parking, Store, Alert)
│   ├── views.py            # API View Controllers and Business Logic
│   ├── urls.py             # Route definitions
│   └── serializers.py      # Data conversion (Model <-> JSON)
├── media/                  # Uploaded media assets files (store icons, profiles)
├── product_recomentation/  # Machine Learning recommendation engine logic
├── prod_rec/               # ML Models and weights
├── .env_example            # Template for environment variables (Secrets, DB URIs)
├── db.sqlite3              # Local SQLite database file
├── manage.py               # Django command-line utility script
└── requirements.txt        # Python dependency manifest
```

## 🔐 Environment Variables

Before running the server, ensure you copy the `.env_example` to a new `.env` file and fill in the necessary secrets (like `SECRET_KEY`, `DEBUG`, or database credentials).

```bash
cp .env_example .env
```

## 📜 Development Guidelines

- **Models:** Whenever creating a new model in `chat_app/models.py`, ensure you run `python manage.py makemigrations` followed by `migrate`.
- **Views:** Keep business logic encapsulated within services or views, relying on serializers for data validation.
- **Security:** Never commit the `.env` file or sensitive keys into the version control system. 

---
*For details on the interactive UI, please head back to the [Overall Documentation](../README.md).*
