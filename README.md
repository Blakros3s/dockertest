# Full-Stack Application - Django + Next.js

A modern, production-ready full-stack web application featuring Django REST backend, Next.js frontend, JWT authentication, and Docker deployment.

## 🚀 Features

- **Backend**: Django REST Framework with JWT authentication
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Database**: PostgreSQL 15
- **Reverse Proxy**: Nginx
- **Containerization**: Docker & Docker Compose
- **Authentication**: JWT tokens with HTTP-only cookies
- **UI/UX**: Modern glassmorphism design with animations

## 📋 Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine + Docker Compose (Linux)
- Git

## 🛠️ Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "Docker Web"
```

### 2. Environment Setup

The `.env` file is already created with default values. For production, update these values:

```env
# Database
POSTGRES_DB=appdb
POSTGRES_USER=appuser
POSTGRES_PASSWORD=<your-secure-password>

# Django
SECRET_KEY=<your-secret-key>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### 3. Build and Run

```bash
# Build and start all services
docker compose up --build

# Or run in detached mode
docker compose up --build -d
```

### 4. Access the Application

- **Frontend**: http://localhost
- **Django Admin**: http://localhost/admin
- **API**: http://localhost/api

### Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change these credentials in production!

## 📁 Project Structure

```
Docker Web/
├── backend/                 # Django REST API
│   ├── config/             # Django settings
│   ├── core/               # Authentication app
│   ├── Dockerfile
│   ├── requirements.txt
│   └── manage.py
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   └── lib/           # Utilities (API client)
│   ├── Dockerfile
│   ├── package.json
│   └── next.config.js
├── nginx/                  # Nginx configuration
│   └── nginx.conf
├── docker-compose.yml      # Docker orchestration
├── .env                    # Environment variables
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/user/` - Get current user
- `POST /api/auth/token/refresh/` - Refresh JWT token

## 🎨 Pages

- `/` - Welcome/Landing page
- `/login` - Login page
- `/dashboard` - Protected dashboard (requires authentication)

## 🐳 Docker Commands

```bash
# Start services
docker compose up

# Start in background
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Rebuild containers
docker compose up --build

# Remove all containers and volumes
docker compose down -v
```

## 🔧 Development

### Backend Development

```bash
# Access Django shell
docker compose exec backend python manage.py shell

# Create migrations
docker compose exec backend python manage.py makemigrations

# Apply migrations
docker compose exec backend python manage.py migrate

# Create superuser
docker compose exec backend python manage.py createsuperuser
```

### Frontend Development

```bash
# Access frontend container
docker compose exec frontend sh

# Install new package
docker compose exec frontend npm install <package-name>
```

## 🚢 Production Deployment

### 1. Update Environment Variables

Update `.env` with production values:
- Strong `SECRET_KEY`
- Secure database password
- Production domain in `ALLOWED_HOSTS`
- HTTPS URLs in `CORS_ALLOWED_ORIGINS`

### 2. SSL/TLS Configuration

Update `nginx/nginx.conf` to include SSL certificates:

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    # ... rest of configuration
}
```

### 3. Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong `SECRET_KEY`
- [ ] Set `DEBUG=False`
- [ ] Configure proper `ALLOWED_HOSTS`
- [ ] Use HTTPS in production
- [ ] Set secure database password
- [ ] Enable CSRF protection
- [ ] Configure firewall rules

## 🧪 Testing

### Test Backend API

```bash
# Register a new user
curl -X POST http://localhost/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password2": "testpass123"
  }'

# Login
curl -X POST http://localhost/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }' \
  -c cookies.txt

# Get user info (requires authentication)
curl http://localhost/api/auth/user/ -b cookies.txt
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check database logs
docker compose logs db

# Restart database
docker compose restart db
```

### Frontend Build Errors

```bash
# Clear Next.js cache
docker compose exec frontend rm -rf .next
docker compose restart frontend
```

### Port Already in Use

```bash
# Stop all containers
docker compose down

# Check what's using port 80
netstat -ano | findstr :80  # Windows
lsof -i :80                 # Linux/Mac
```

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Django, Next.js, and Docker
