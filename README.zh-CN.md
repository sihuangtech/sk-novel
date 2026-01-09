# SK Novel

SK Novel 是一个专注于美学和用户体验的现代化小说阅读与写作的高级平台。它无缝连接了作者与读者，为创作者提供强大的 AI 辅助工具，同时为读者带来沉浸式的阅读享受。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.0-646cff.svg?style=flat&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38b2ac.svg?style=flat&logo=tailwind-css)

## ✨ 功能特性

### 读者端 (For Readers)
*   **沉浸式阅读体验**：专为小说阅读优化的简洁界面，无干扰，让读者专注于故事本身。
*   **书架管理**：轻松追踪阅读进度，管理个人书架，收藏喜爱的小说。
*   **探索发现**：浏览排行榜，探索新分类，发现潜在的佳作。
*   **会员等级**：通过不同的会员等级（免费、注册会员、付费支持者）解锁独家内容。

### 作者端 (For Authors)
*   **创作者工作室**：功能强大的仪表盘，用于管理手稿、查看核心数据和会员信息。
*   **章节编辑器**：专用的写作与章节打磨工具，提供流畅的写作体验。
*   **数据分析**：追踪邮件推送效果、打开率以及读者参与度。

### 🤖 AI 智能助手
SK Novel 集成了 Google Gemini AI (`gemini-3-flash-preview`) 为创作过程增效：
*   **故事续写**：卡文了吗？让 AI 根据当前上下文为您提供后续段落的灵感。
*   **章节摘要**：自动生成引人入胜的章节摘要，吸引读者点击阅读。

### 🛠️ 技术亮点
*   **现代技术栈**：基于 React 19, TypeScript 和 Vite 构建，带来极致的加载速度和性能。
*   **样式设计**：使用 Tailwind CSS 和 Lucide 图标打造由于、响应式的 UI 界面。
*   **数据可视化**：集成 Recharts 展示作者统计数据。
*   **导出功能**：内置工具支持将小说和章节导出为 TXT 格式。

## 🚀 快速开始

按照以下步骤在本地运行项目。

### 前置要求
*   Node.js (建议 v18 或更高版本)
*   npm 或 yarn

### 安装步骤

1.  **克隆仓库**
    ```bash
    git clone https://github.com/sihuangtech/sk-novel.git
    cd sk-novel
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **环境配置**
    在项目根目录创建一个 `.env.local` 文件，并填入您的 Google Gemini API Key。这是使用 AI 功能所必需的。
    
    ```properties
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **启动应用**
    ```bash
    npm run dev
    ```

    打开浏览器访问 http://localhost:3000 即可查看效果。

## 📁 项目结构

```
sk-novels/
├── src/
│   ├── components/     # 可复用的 UI 组件 (布局等)
│   ├── pages/          # 应用页面 (公共页面 & 管理后台)
│   ├── services/       # API 和逻辑服务 (Gemini AI, 导出功能)
│   ├── types.ts        # TypeScript 类型定义
│   ├── store.tsx       # 状态管理 (Context)
│   ├── App.tsx         # 主路由和应用入口
│   └── main.tsx        # 程序入口点
├── .env.local          # 环境变量 (API Keys)
├── package.json        # 项目依赖和脚本
└── vite.config.ts      # Vite 配置文件
```

## 🤝 参与贡献

欢迎提交 Pull Request 来完善这个项目！

## 📄 开源协议

本项目采用 MIT 协议。
