# 部署指南

## 目录

- [概述](#概述)
- [前置要求](#前置要求)
- [系统要求](#系统要求)
- [环境变量](#环境变量)
- [部署步骤](#部署步骤)
- [部署选项](#部署选项)
- [监控和维护](#监控和维护)
- [故障排除](#故障排除)
- [安全最佳实践](#安全最佳实践)
- [性能优化](#性能优化)
- [技术支持](#技术支持)

---

## 概述

SK Novel 是一个现代化的小说阅读与写作平台，使用 React 19、TypeScript、Vite、Prisma ORM、PostgreSQL 和 Redis 构建。本指南将帮助您将应用程序部署到生产环境。

## 前置要求

在部署 SK Novel 之前，请确保您具备以下条件：

- **Node.js**: v18 或更高版本
- **PostgreSQL**: 数据库服务器（推荐 v12 或更高版本）
- **Redis**: 缓存服务器（推荐 v6 或更高版本）
- **Google Gemini API 密钥**: 用于 AI 辅助写作功能
- **域名**: 用于生产部署
- **SSL 证书**: 用于 HTTPS（推荐）

## 系统要求

- **最低内存**: 2GB
- **推荐内存**: 4GB 或更多
- **存储空间**: 20GB 或更多
- **操作系统**: Linux（推荐 Ubuntu 20.04/22.04）、Windows 或 macOS

## 环境变量

在项目根目录创建 `.env` 文件，包含以下变量：

```env
# Database Connection / 数据库连接
DATABASE_URL="postgresql://用户名:密码@主机:5432/数据库名?schema=public"

# Redis Connection / Redis 连接
REDIS_URL="redis://主机:6379"

# Google Gemini API Key / Google Gemini API 密钥
GEMINI_API_KEY="您的_gemini_api_key"
```

## 部署步骤

### 1. 克隆仓库

```bash
git clone https://github.com/sihuangtech/sk-novel.git
cd sk-novel
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境

复制示例环境文件并更新为实际值：

```bash
cp .env.example .env
```

编辑 `.env` 文件，将占位符值替换为您的实际数据库凭据、Redis URL 和 Gemini API 密钥。

### 4. 数据库设置

**初始化 Prisma:**

```bash
npx prisma generate
```

**运行数据库迁移:**

```bash
npx prisma migrate deploy
```

**填充数据库（可选）:**

如果您有种子脚本，运行：

```bash
npx prisma db seed
```

### 5. 构建应用

```bash
npm run build
```

这将：
- 生成 Prisma Client
- 构建 Next.js/Vite 应用
- 优化生产环境资源

### 6. 启动应用

**开发环境:**

```bash
npm run dev
```

应用将在 `http://localhost:3000` 可用

**生产环境:**

```bash
npm start
```

或使用 PM2 等进程管理器：

```bash
npm install -g pm2
pm2 start npm --name "sk-novel" -- start
pm2 save
pm2 startup
```

## 部署选项

### 选项 1: 传统 VPS 部署

#### 步骤 1: 设置 VPS

- 选择 VPS 提供商（DigitalOcean、Linode、AWS EC2 等）
- 安装 Ubuntu 20.04/22.04
- 更新系统包：
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```

#### 步骤 2: 安装依赖

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 安装 Redis
sudo apt install -y redis-server

# 安装 Nginx（用于反向代理）
sudo apt install -y nginx
```

#### 步骤 3: 配置 PostgreSQL

```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 创建数据库和用户
CREATE DATABASE sk_novel_db;
CREATE USER sk_novel_user WITH PASSWORD '您的安全密码';
GRANT ALL PRIVILEGES ON DATABASE sk_novel_db TO sk_novel_user;
\q
```

#### 步骤 4: 配置 Redis

```bash
# 编辑 Redis 配置
sudo nano /etc/redis/redis.conf

# 取消注释并设置密码（可选）
# requirepass 您的_redis_密码

# 重启 Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

#### 步骤 5: 部署应用

```bash
# 克隆仓库
cd /var/www
sudo git clone https://github.com/sihuangtech/sk-novel.git
sudo chown -R $USER:$USER sk-novel
cd sk-novel

# 安装依赖
npm install

# 配置环境
nano .env

# 构建应用
npm run build

# 使用 PM2 启动
pm2 start npm --name "sk-novel" -- start
pm2 save
pm2 startup
```

#### 步骤 6: 配置 Nginx

项目包含预配置的 Nginx 配置文件，位于 `nginx/sk-novel.conf`。将其复制到 Nginx 站点目录：

```bash
sudo cp nginx/sk-novel.conf /etc/nginx/sites-available/sk-novel
```

编辑配置文件以更新您的域名：

```bash
sudo nano /etc/nginx/sites-available/sk-novel
```

将 `您的域名.com` 替换为您的实际域名。

启用站点：

```bash
sudo ln -s /etc/nginx/sites-available/sk-novel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 步骤 7: 使用 Let's Encrypt 设置 SSL

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d 您的域名.com
```

### 选项 2: Docker 部署

项目根目录包含预配置的 Docker 文件：
- `Dockerfile` - 多阶段 Docker 构建配置
- `docker-compose.yml` - 包含 PostgreSQL 和 Redis 的 Docker Compose 编排
- `.dockerignore` - 从 Docker 构建中排除的文件

#### 使用 Docker 部署:

```bash
# 构建并启动容器
docker-compose up -d

# 运行数据库迁移
docker-compose exec app npx prisma migrate deploy

# 查看日志
docker-compose logs -f app
```

**注意:** 运行 docker-compose 之前，请确保：
1. 在 `docker-compose.yml` 中更新环境变量或使用 `.env` 文件
2. 系统已安装 Docker 和 Docker Compose
3. 为生产环境修改数据库密码和 Redis 配置

### 选项 3: 云平台部署

#### Vercel 部署:

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 在 Vercel 仪表板中配置环境变量
4. 部署

**注意:** 在 Vercel 部署时，您需要使用托管的 PostgreSQL 和 Redis 服务（例如 Supabase、Neon、Upstash）。

#### AWS/Google Cloud/Azure:

1. 设置托管的 PostgreSQL 和 Redis 实例
2. 将应用部署到 EC2/Compute Engine/VM
3. 配置负载均衡器和 SSL
4. 如需要，设置自动扩展

## 监控和维护

### 查看应用日志

```bash
# 使用 PM2
pm2 logs sk-novel

# 使用 Docker
docker-compose logs -f app
```

### 重启应用

```bash
# 使用 PM2
pm2 restart sk-novel

# 使用 Docker
docker-compose restart app
```

### 数据库备份

```bash
# 备份 PostgreSQL
pg_dump -U 用户名 -h localhost -d sk_novel_db > backup.sql

# 恢复 PostgreSQL
psql -U 用户名 -h localhost -d sk_novel_db < backup.sql
```

### 更新应用

```bash
# 拉取最新更改
git pull origin main

# 安装依赖
npm install

# 运行迁移
npx prisma migrate deploy

# 重新构建应用
npm run build

# 重启应用
pm2 restart sk-novel
```

## 故障排除

### 数据库连接问题

- 验证 DATABASE_URL 是否正确
- 检查 PostgreSQL 是否运行：`sudo systemctl status postgresql`
- 检查防火墙设置

### Redis 连接问题

- 验证 REDIS_URL 是否正确
- 检查 Redis 是否运行：`sudo systemctl status redis-server`
- 测试连接：`redis-cli ping`

### 构建错误

- 清除 node_modules：`rm -rf node_modules && npm install`
- 清除 Prisma 缓存：`rm -rf node_modules/.prisma && npx prisma generate`
- 检查 Node.js 版本：`node --version`

### 端口已被占用

```bash
# 查找使用端口 3000 的进程
lsof -i :3000

# 终止进程
kill -9 <PID>
```

## 安全最佳实践

1. **环境变量**: 永远不要将 `.env` 文件提交到版本控制
2. **数据库**: 使用强密码并限制访问
3. **SSL/TLS**: 生产环境始终使用 HTTPS
4. **更新**: 保持依赖项和系统包更新
5. **防火墙**: 配置防火墙仅允许必要的端口
6. **备份**: 实施定期数据库备份
7. **监控**: 设置应用和服务器监控

## 性能优化

1. **启用 Redis 缓存**: 配置 Redis 用于会话存储和缓存
2. **数据库索引**: 确保在频繁查询的列上有适当的索引
3. **CDN**: 为静态资源使用 CDN
4. **压缩**: 在 Nginx 中启用 gzip 压缩
5. **负载均衡**: 为高流量部署使用负载均衡器

## 技术支持

如有问题和疑问：
- GitHub Issues: https://github.com/sihuangtech/sk-novel/issues
- 文档: https://github.com/sihuangtech/sk-novel/wiki

---

## 附录：数据库架构

### 数据表结构

#### User（用户表）
- `id`: 用户唯一标识
- `username`: 用户名
- `email`: 邮箱
- `password`: 密码（哈希后）
- `role`: 用户角色（READER/AUTHOR）
- `tier`: 会员等级（FREE/MEMBER/SUPPORTER）
- `coins`: 金币数
- `isSubscribedToEmail`: 是否订阅邮件
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

#### Novel（小说表）
- `id`: 小说唯一标识
- `title`: 标题
- `description`: 描述
- `coverUrl`: 封面URL
- `tags`: 标签数组
- `status`: 状态（ONGOING/COMPLETED）
- `views`: 浏览量
- `rating`: 评分
- `authorId`: 作者ID（外键）
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

#### Chapter（章节表）
- `id`: 章节唯一标识
- `title`: 标题
- `content`: 内容
- `wordCount`: 字数
- `access`: 访问权限（PUBLIC/MEMBERS/SUPPORTERS）
- `price`: 价格
- `order`: 排序
- `publishedAt`: 发布时间
- `isDraft`: 是否草稿
- `novelId`: 小说ID（外键）
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

#### Bookmark（书签表）
- `id`: 书签唯一标识
- `userId`: 用户ID（外键）
- `novelId`: 小说ID（外键）
- `createdAt`: 创建时间

#### UnlockedChapter（解锁章节表）
- `id`: 解锁记录唯一标识
- `userId`: 用户ID（外键）
- `chapterId`: 章节ID（外键）
- `createdAt`: 创建时间

#### Comment（评论表）
- `id`: 评论唯一标识
- `content`: 内容
- `createdAt`: 创建时间
- `userId`: 用户ID（外键）
- `chapterId`: 章节ID（外键）

#### NewsletterCampaign（邮件活动表）
- `id`: 活动唯一标识
- `chapterId`: 章节ID（外键）
- `chapterTitle`: 章节标题
- `sentAt`: 发送时间
- `recipients`: 收件人数
- `openRate`: 打开率
- `clickRate`: 点击率
- `subject`: 邮件主题

---

## 附录：技术栈

### 前端技术
- **React 19**: UI 框架
- **TypeScript**: 类型安全的 JavaScript
- **Vite**: 构建工具
- **Tailwind CSS**: CSS 框架
- **React Router DOM**: 路由管理
- **Lucide React**: 图标库
- **Recharts**: 数据可视化

### 后端技术
- **Prisma ORM**: 数据库 ORM
- **PostgreSQL**: 关系型数据库
- **Redis**: 缓存和会话存储
- **bcryptjs**: 密码加密

### AI 服务
- **Google Gemini AI**: AI 辅助写作

### 开发工具
- **ESLint**: 代码检查
- **TypeScript**: 类型检查
- **PM2**: 进程管理器（生产环境）
- **Nginx**: 反向代理和负载均衡

---

## 许可证

MIT License

---

**最后更新**: 2026-01-09
