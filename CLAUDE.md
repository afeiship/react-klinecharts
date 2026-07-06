# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 协作规则

1. **包管理器**: 安装包时使用 `yarn`
2. **沟通语言**: AI 与用户沟通时使用中文
3. 下载有问题可以使用 `http_proxy=http://127.0.0.1:9090 https_proxy=http://127.0.0.1:9090 `
4. 如果有计划执行，使用 `子代理驱动（推荐）` 来执行
5. 组件目录们于这里: `./packages/lib`
6. 组件的 example 目录在这里: `./packages/example`
7. 组件开发完成之后，帮我写一份专门给 AI 使用的 llms.txt，放到根目录下
8. 文件命名统一使用 abc-xx 的 kebab-case 方式

## Project Overview

This is a React component library for klinecharts (K-line/candlestick charts). The project uses a monorepo structure with Lerna and Yarn workspaces.

## Architecture

**Monorepo Structure:**
- `packages/lib` - The main component library (`@jswork/react-klinecharts`)
- `packages/example` - Vite-based demo/example application for development and testing

**Key Dependencies:**
- `klinecharts` v10.0.0-beta3 - Core charting library (peer dependency)
- React 18+ (peer dependency)
- Built with TypeScript

**Build System:**
- Library: `tsup` for building ESM/CJS bundles with TypeScript declarations
- Example: Vite with React plugin

## Development Commands

```bash
# Install dependencies (from root)
yarn install

# Development - run example app with hot reload
yarn dev

# Build library
yarn ln:build

# Test library
yarn ln:test

# Test library in watch mode
cd packages/lib && yarn test:watch

# Build docs/example for production
yarn docs
```

## Component Development

- Main component source: `packages/lib/src/index.tsx`
- Entry point: `packages/lib/src/main.tsx`
- Styles: `packages/lib/src/style.scss` (compiled to `dist/style.css`)

The library exports a class component pattern with:
- `displayName` and `version` static properties
- Default props pattern
- `data-component` attribute for styling hooks

## Testing

Tests are located in `packages/lib/__tests__/` using Vitest with React Testing Library.

## Release

```bash
yarn ln:publish  # Runs release-it from packages/lib
```
