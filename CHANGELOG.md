# Changelog

All notable changes to this project will be documented in this file.

## [2026-06-27]

### 🔧 Miscellaneous (Chore)

- **Major Dependency Upgrades**: Bumped project version to `0.1.1` and upgraded core dependencies across major versions:
  - `@google/genai`: `^1.40.0` → `^2.10.0`
  - `lucide-react`: `^0.563.0` → `^1.21.0`
  - `cookie`: `^1.1.1` → `^2.0.0`
  - `typescript`: `~5.9.3` → `~6.0.3`
  - `vite`: `^7.3.1` → `^8.1.0`
  - `@vitejs/plugin-react`: `^5.1.3` → `^6.0.3`
  - `@types/node`: `^25.2.2` → `^26.0.1`
  - `prisma` / `@prisma/client` / `@prisma/adapter-pg`: `^7.3.0` → `^7.8.0`
  - `next`: `^16.1.6` → `^16.2.9`, `react` / `react-dom`: `^19.2.4` → `^19.2.7`
  - `react-router-dom`: `^7.13.0` → `^7.18.0`, `recharts`: `^3.7.0` → `^3.9.0`
  - `ioredis`: `^5.9.2` → `^5.11.1`, `pg`: `^8.18.0` → `^8.22.0`, `@types/pg`: `^8.16.0` → `^8.20.0`
  - `@playwright/test`: `^1.58.2` → `^1.61.1`
- **allowScripts Configuration**: Added `allowScripts` block in `package.json` to explicitly approve install scripts for trusted packages (`@google/genai`, `prisma`, `@prisma/engines`, `protobufjs`, `fsevents`).

### 📝 Documentation

- **Markdownlint Config**: Added `.markdownlint.json` to disable the `MD024/no-duplicate-heading` rule for changelog files.
- **README Formatting**: Unified list item indentation, added `text` language hint to code blocks, and adjusted link formatting in both `README.md` and `README.zh-CN.md`.

---

## [2026-02-08]

### 🔧 Miscellaneous (Chore)

- **Dependency Updates**: Routine version bumps for dependencies. (1ab240c)
  - `@google/genai`: `^1.35.0` → `^1.40.0`
  - `prisma` / `@prisma/client` / `@prisma/adapter-pg`: `^7.2.0` → `^7.3.0`
  - `next`: `^16.1.1` → `^16.1.6`, `react` / `react-dom`: `^19.2.3` → `^19.2.4`
  - `react-router-dom`: `^7.12.0` → `^7.13.0`, `recharts`: `^3.6.0` → `^3.7.0`
  - `lucide-react`: `^0.562.0` → `^0.563.0`, `ioredis`: `^5.9.1` → `^5.9.2`, `pg`: `^8.16.3` → `^8.18.0`
  - `@playwright/test`: `^1.57.0` → `^1.58.2`, `@types/node`: `^25.0.5` → `^25.2.2`, `@vitejs/plugin-react`: `^5.1.2` → `^5.1.3`

---

## [2026-01-10]

### ✨ Features

- **User & Admin System**: Implemented full user authentication, payment flows, and administrative management functions. (2d1586d)

---

## [2026-01-09]

### ✨ Features

- **Deployment Optimization**: Added Docker deployment configuration files and related documentation. (308c5c8)
- **Project Initialization**: Completed the initial project infrastructure and core functionality implementation. (cc1eb8d)

### 📝 Documentation

- **License**: Officially introduced the MIT open-source license. (d8bf790)
- **README Adjustments**: Removed the banner image from the README file for a cleaner look. (c9b5cd6)

### 🔧 Miscellaneous (Chore)

- **Git Ignore Config**: Added `package-lock.json` to `.gitignore` and stopped tracking it. (07ef535, 56c28c8)
