# Deployment Guide

This guide covers deploying the Django + Next.js application to production.

## Prerequisites

- VPS or cloud server (Ubuntu 20.04+ recommended)
- Domain name pointed to your server
- SSH access to the server
- Docker and Docker Compose installed on the server

## Server Setup

### 1. Install Docker

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Clone Repository

```bash
cd /opt
sudo git clone <your-repo-url> app
cd app
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
sudo nano .env
```

Update the following:

```env
# Strong secret key (generate with: openssl rand -base64 32)
SECRET_KEY=<your-generated-secret-key>

# Database credentials
POSTGRES_PASSWORD=<strong-password>

# Production settings
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# CORS (use your domain)
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Frontend API URL
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### 4. SSL/TLS Setup with Let's Encrypt

Install Certbot:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

Get SSL certificate:

```bash
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

Update `nginx/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    upstream backend {
        server backend:8000;
    }

    upstream frontend {
        server frontend:3000;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        client_max_body_size 100M;

        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_redirect off;
        }

        # Django Admin
        location /admin/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_redirect off;
        }

        # Static Files
        location /static/ {
            alias /static/;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_redirect off;
        }
    }
}
```

Update `docker-compose.yml` to mount SSL certificates:

```yaml
nginx:
  image: nginx:alpine
  container_name: fullstack_nginx
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - static_volume:/static:ro
    - /etc/letsencrypt:/etc/letsencrypt:ro  # Add this line
  depends_on:
    - backend
    - frontend
  networks:
    - app-network
```

### 5. Deploy Application

```bash
# Build and start services
sudo docker compose up --build -d

# Check logs
sudo docker compose logs -f

# Verify all services are running
sudo docker compose ps
```

### 6. Create Admin User

```bash
# The admin user is created automatically with:
# Username: admin
# Password: admin123

# IMPORTANT: Change the password immediately!
sudo docker compose exec backend python manage.py changepassword admin
```

## Firewall Configuration

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

## Monitoring and Maintenance

### View Logs

```bash
# All services
sudo docker compose logs -f

# Specific service
sudo docker compose logs -f backend
sudo docker compose logs -f frontend
```

### Update Application

```bash
cd /opt/app
sudo git pull
sudo docker compose up --build -d
```

### Backup Database

```bash
# Create backup
sudo docker compose exec db pg_dump -U appuser appdb > backup_$(date +%Y%m%d).sql

# Restore backup
sudo docker compose exec -T db psql -U appuser appdb < backup_20240101.sql
```

### SSL Certificate Renewal

Certbot auto-renews certificates. To test renewal:

```bash
sudo certbot renew --dry-run
```

## Production Checklist

- [ ] Strong `SECRET_KEY` generated
- [ ] `DEBUG=False` in `.env`
- [ ] Secure database password
- [ ] Domain configured in `ALLOWED_HOSTS`
- [ ] SSL/TLS certificates installed
- [ ] HTTPS enforced
- [ ] Firewall configured
- [ ] Default admin password changed
- [ ] Database backups scheduled
- [ ] Monitoring set up
- [ ] Log rotation configured

## Troubleshooting

### Container Won't Start

```bash
# Check logs
sudo docker compose logs <service-name>

# Restart service
sudo docker compose restart <service-name>
```

### Database Connection Issues

```bash
# Check database is running
sudo docker compose ps db

# Check database logs
sudo docker compose logs db

# Restart database
sudo docker compose restart db
```

### SSL Certificate Issues

```bash
# Check certificate validity
sudo certbot certificates

# Renew certificate
sudo certbot renew
```

## Performance Optimization

### Enable Gzip Compression

Add to `nginx.conf`:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### Database Optimization

```bash
# Access PostgreSQL
sudo docker compose exec db psql -U appuser appdb

# Create indexes (example)
CREATE INDEX idx_user_username ON auth_user(username);
```

## Scaling

For high traffic, consider:

1. **Load Balancer**: Use nginx or cloud load balancer
2. **Multiple Backend Instances**: Scale backend service
3. **CDN**: Use CloudFlare or similar for static assets
4. **Database**: Use managed PostgreSQL (AWS RDS, etc.)
5. **Caching**: Add Redis for session/cache storage

---

For additional support, refer to the main README.md or open an issue.
