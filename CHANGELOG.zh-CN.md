# 更新日志 (Changelog)

所有对本项目的显著更改都将记录在此文件中。

## [2026-06-27]

### 🔧 杂项 (Chore)

- **重大依赖升级**: 项目版本升级至 `0.1.1`，核心依赖跨大版本升级：
  - `@google/genai`: `^1.40.0` → `^2.10.0`
  - `lucide-react`: `^0.563.0` → `^1.21.0`
  - `cookie`: `^1.1.1` → `^2.0.0`
  - `typescript`: `~5.9.3` → `~6.0.3`
  - `vite`: `^7.3.1` → `^8.1.0`
  - `@vitejs/plugin-react`: `^5.1.3` → `^6.0.3`
  - `@types/node`: `^25.2.2` → `^26.0.1`
  - `prisma` / `@prisma/client` / `@prisma/adapter-pg`: `^7.3.0` → `^7.8.0`
  - `next`: `^16.1.6` → `^16.2.9`，`react` / `react-dom`: `^19.2.4` → `^19.2.7`
  - `react-router-dom`: `^7.13.0` → `^7.18.0`，`recharts`: `^3.7.0` → `^3.9.0`
  - `ioredis`: `^5.9.2` → `^5.11.1`，`pg`: `^8.18.0` → `^8.22.0`，`@types/pg`: `^8.16.0` → `^8.20.0`
  - `@playwright/test`: `^1.58.2` → `^1.61.1`
- **allowScripts 配置**: 在 `package.json` 中新增 `allowScripts` 配置，显式批准可信包（`@google/genai`、`prisma`、`@prisma/engines`、`protobufjs`、`fsevents`）的安装脚本。

### 📝 文档 (Docs)

- **Markdownlint 配置**: 新增 `.markdownlint.json` 配置文件，禁用 `MD024/no-duplicate-heading` 规则以适配更新日志格式。
- **README 格式优化**: 统一 `README.md` 与 `README.zh-CN.md` 列表项缩进，为代码块添加 `text` 语言标识，调整链接格式。

---

## [2026-02-08]

### 🔧 杂项 (Chore)

- **依赖更新**: 日常依赖版本升级。 (1ab240c)
  - `@google/genai`: `^1.35.0` → `^1.40.0`
  - `prisma` / `@prisma/client` / `@prisma/adapter-pg`: `^7.2.0` → `^7.3.0`
  - `next`: `^16.1.1` → `^16.1.6`，`react` / `react-dom`: `^19.2.3` → `^19.2.4`
  - `react-router-dom`: `^7.12.0` → `^7.13.0`，`recharts`: `^3.6.0` → `^3.7.0`
  - `lucide-react`: `^0.562.0` → `^0.563.0`，`ioredis`: `^5.9.1` → `^5.9.2`，`pg`: `^8.16.3` → `^8.18.0`
  - `@playwright/test`: `^1.57.0` → `^1.58.2`，`@types/node`: `^25.0.5` → `^25.2.2`，`@vitejs/plugin-react`: `^5.1.2` → `^5.1.3`

---

## [2026-01-10]

### ✨ 新功能 (Feat)

- **用户与管理系统**: 实现了完整的用户认证、支付流程以及后台管理功能。 (2d1586d)

---

## [2026-01-09]

### ✨ 新功能 (Feat)

- **部署优化**: 添加了 Docker 部署配置文件及相关说明文档。 (308c5c8)
- **项目初始化**: 完成了项目基础架构的搭建和核心功能的初步实现。 (cc1eb8d)

### 📝 文档 (Docs)

- **许可证**: 项目正式引入 MIT 开源许可证。 (d8bf790)
- **README 调整**: 移除了 README 文件中的横幅图片，使文档更加简洁。 (c9b5cd6)

### 🔧 杂项 (Chore)

- **Git 忽略配置**: 将 `package-lock.json` 添加至 `.gitignore` 并停止对其的版本追踪。 (07ef535, 56c28c8)
