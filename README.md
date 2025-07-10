# GamePortal - 游戏门户网站

这是一个使用Next.js和TypeScript构建的游戏门户网站，支持静态站点生成(SSG)，可以部署到Vercel。

## 项目特点

- 使用Next.js和TypeScript构建
- 支持静态站点生成(SSG)，改善SEO和性能
- 提供游戏嵌入式iFrame集成
- 博客文章支持Markdown内容
- 包含丰富的SEO功能
- 支持响应式设计

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npx next dev
```

### 构建生产版本

```bash
npx next build
```

### 启动生产版本

```bash
npx next start
```

## 部署到Vercel

项目已经配置好vercel.json，可以直接部署到Vercel。部署步骤：

1. 在Vercel创建新项目
2. 连接到你的Git仓库
3. 设置以下环境变量（如需要）：
   - `NEXT_PUBLIC_API_BASE_URL`: API基础URL

## 项目结构

- `/src/pages`: 页面组件
- `/src/components`: UI组件
- `/src/data`: 数据模型和操作
- `/src/lib`: 通用工具函数
- `/public`: 静态资源