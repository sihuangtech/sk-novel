# Deployment Guide

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [System Requirements](#system-requirements)
- [Environment Variables](#environment-variables)
- [Deployment Steps](#deployment-steps)
- [Deployment Options](#deployment-options)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)
- [Performance Optimization](#performance-optimization)
- [Support](#support)

---

## Overview

SK Novel is a modern novel reading and writing platform built with React 19, TypeScript, Vite, Prisma ORM, PostgreSQL, and Redis. This guide will help you deploy the application to production.

## Prerequisites

Before deploying SK Novel, ensure you have the following:

- **Node.js**: v18 or higher
- **PostgreSQL**: Database server (v12 or higher recommended)
- **Redis**: Cache server (v6 or higher recommended)
- **Google Gemini API Key**: For AI-powered writing assistance features
- **Domain Name**: For production deployment
- **SSL Certificate**: For HTTPS (recommended)

## System Requirements

- **Minimum RAM**: 2GB
- **Recommended RAM**: 4GB or more
- **Storage**: 20GB or more
- **Operating System**: Linux (Ubuntu 20.04/22.04 recommended), Windows, or macOS

## Environment Variables

Create a `.env` file in the project root directory with the following variables:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@host:5432/database_name?schema=public"

# Redis Connection
REDIS_URL="redis://host:6379"

# Google Gemini API Key
GEMINI_API_KEY="your_gemini_api_key_here"
```

## Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/sihuangtech/sk-novel.git
cd sk-novel
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the example environment file and update it with your actual values:

```bash
cp .env.example .env
```

Edit the `.env` file and replace the placeholder values with your actual database credentials, Redis URL, and Gemini API key.

### 4. Database Setup

**Initialize Prisma:**

```bash
npx prisma generate
```

**Run Database Migrations:**

```bash
npx prisma migrate deploy
```

**Seed the Database (Optional):**

If you have seed scripts, run:

```bash
npx prisma db seed
```

### 5. Build the Application

```bash
npm run build
```

This will:
- Generate Prisma Client
- Build the Next.js/Vite application
- Optimize assets for production

### 6. Start the Application

**For Development:**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

**For Production:**

```bash
npm start
```

Or use a process manager like PM2:

```bash
npm install -g pm2
pm2 start npm --name "sk-novel" -- start
pm2 save
pm2 startup
```

## Deployment Options

### Option 1: Traditional VPS Deployment

#### Step 1: Set up a VPS

- Choose a VPS provider (DigitalOcean, Linode, AWS EC2, etc.)
- Install Ubuntu 20.04/22.04
- Update system packages:
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```

#### Step 2: Install Dependencies

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Nginx (for reverse proxy)
sudo apt install -y nginx
```

#### Step 3: Configure PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE sk_novel_db;
CREATE USER sk_novel_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE sk_novel_db TO sk_novel_user;
\q
```

#### Step 4: Configure Redis

```bash
# Edit Redis configuration
sudo nano /etc/redis/redis.conf

# Uncomment and set password (optional)
# requirepass your_redis_password

# Restart Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

#### Step 5: Deploy the Application

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/sihuangtech/sk-novel.git
sudo chown -R $USER:$USER sk-novel
cd sk-novel

# Install dependencies
npm install

# Configure environment
nano .env

# Build application
npm run build

# Start with PM2
pm2 start npm --name "sk-novel" -- start
pm2 save
pm2 startup
```

#### Step 6: Configure Nginx

The project includes a pre-configured Nginx configuration file at `nginx/sk-novel.conf`. Copy it to the Nginx sites directory:

```bash
sudo cp nginx/sk-novel.conf /etc/nginx/sites-available/sk-novel
```

Edit the configuration to update your domain name:

```bash
sudo nano /etc/nginx/sites-available/sk-novel
```

Replace `your-domain.com` with your actual domain name.

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/sk-novel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 7: Set up SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 2: Docker Deployment

The project includes pre-configured Docker files in the root directory:
- `Dockerfile` - Multi-stage Docker build configuration
- `docker-compose.yml` - Docker Compose orchestration with PostgreSQL and Redis
- `.dockerignore` - Files to exclude from Docker build

#### Deploy with Docker:

```bash
# Build and start containers
docker-compose up -d

# Run database migrations
docker-compose exec app npx prisma migrate deploy

# View logs
docker-compose logs -f app
```

**Note:** Before running docker-compose, make sure to:
1. Update environment variables in `docker-compose.yml` or use a `.env` file
2. Ensure Docker and Docker Compose are installed on your system
3. Modify the database password and Redis configuration for production use

### Option 3: Cloud Platform Deployment

#### Vercel Deployment:

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

**Note:** You'll need to use a managed PostgreSQL and Redis service (e.g., Supabase, Neon, Upstash) when deploying to Vercel.

#### AWS/Google Cloud/Azure:

1. Set up managed PostgreSQL and Redis instances
2. Deploy application to EC2/Compute Engine/VM
3. Configure load balancer and SSL
4. Set up auto-scaling if needed

## Monitoring and Maintenance

### View Application Logs

```bash
# With PM2
pm2 logs sk-novel

# With Docker
docker-compose logs -f app
```

### Restart Application

```bash
# With PM2
pm2 restart sk-novel

# With Docker
docker-compose restart app
```

### Database Backup

```bash
# Backup PostgreSQL
pg_dump -U username -h localhost -d sk_novel_db > backup.sql

# Restore PostgreSQL
psql -U username -h localhost -d sk_novel_db < backup.sql
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Rebuild application
npm run build

# Restart application
pm2 restart sk-novel
```

## Troubleshooting

### Database Connection Issues

- Verify DATABASE_URL is correct
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Check firewall settings

### Redis Connection Issues

- Verify REDIS_URL is correct
- Check Redis is running: `sudo systemctl status redis-server`
- Test connection: `redis-cli ping`

### Build Errors

- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Prisma cache: `rm -rf node_modules/.prisma && npx prisma generate`
- Check Node.js version: `node --version`

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env` file to version control
2. **Database**: Use strong passwords and restrict access
3. **SSL/TLS**: Always use HTTPS in production
4. **Updates**: Keep dependencies and system packages updated
5. **Firewall**: Configure firewall to only allow necessary ports
6. **Backups**: Implement regular database backups
7. **Monitoring**: Set up application and server monitoring

## Performance Optimization

1. **Enable Redis Caching**: Configure Redis for session storage and caching
2. **Database Indexing**: Ensure proper indexes on frequently queried columns
3. **CDN**: Use CDN for static assets
4. **Compression**: Enable gzip compression in Nginx
5. **Load Balancing**: Use load balancer for high-traffic deployments

## Support

For issues and questions:
- GitHub Issues: https://github.com/sihuangtech/sk-novel/issues
- Documentation: https://github.com/sihuangtech/sk-novel/wiki

---

## Appendix: Database Schema

### Table Structures

#### User Table
- `id`: Unique user identifier
- `username`: Username
- `email`: Email address
- `password`: Hashed password
- `role`: User role (READER/AUTHOR)
- `tier`: Membership tier (FREE/MEMBER/SUPPORTER)
- `coins`: Coin balance
- `isSubscribedToEmail`: Email subscription status
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

#### Novel Table
- `id`: Unique novel identifier
- `title`: Novel title
- `description`: Novel description
- `coverUrl`: Cover image URL
- `tags`: Array of tags
- `status`: Status (ONGOING/COMPLETED)
- `views`: View count
- `rating`: Rating score
- `authorId`: Author ID (foreign key)
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

#### Chapter Table
- `id`: Unique chapter identifier
- `title`: Chapter title
- `content`: Chapter content
- `wordCount`: Word count
- `access`: Access level (PUBLIC/MEMBERS/SUPPORTERS)
- `price`: Price in coins
- `order`: Chapter order
- `publishedAt`: Publication timestamp
- `isDraft`: Draft status
- `novelId`: Novel ID (foreign key)
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

#### Bookmark Table
- `id`: Unique bookmark identifier
- `userId`: User ID (foreign key)
- `novelId`: Novel ID (foreign key)
- `createdAt`: Creation timestamp

#### UnlockedChapter Table
- `id`: Unique unlock record identifier
- `userId`: User ID (foreign key)
- `chapterId`: Chapter ID (foreign key)
- `createdAt`: Creation timestamp

#### Comment Table
- `id`: Unique comment identifier
- `content`: Comment content
- `createdAt`: Creation timestamp
- `userId`: User ID (foreign key)
- `chapterId`: Chapter ID (foreign key)

#### NewsletterCampaign Table
- `id`: Unique campaign identifier
- `chapterId`: Chapter ID (foreign key)
- `chapterTitle`: Chapter title
- `sentAt`: Sent timestamp
- `recipients`: Number of recipients
- `openRate`: Open rate percentage
- `clickRate`: Click rate percentage
- `subject`: Email subject

---

## Appendix: Tech Stack

### Frontend Technologies
- **React 19**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool
- **Tailwind CSS**: CSS framework
- **React Router DOM**: Routing
- **Lucide React**: Icon library
- **Recharts**: Data visualization

### Backend Technologies
- **Prisma ORM**: Database ORM
- **PostgreSQL**: Relational database
- **Redis**: Caching and session storage
- **bcryptjs**: Password encryption

### AI Services
- **Google Gemini AI**: AI-powered writing assistance

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **PM2**: Process manager (production)
- **Nginx**: Reverse proxy and load balancing

---

## License

MIT License

---

**Last Updated**: 2026-01-09
