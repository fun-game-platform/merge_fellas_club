# 使用GitHub Actions自动部署Next.js项目到Vercel

## 概述

本文档介绍如何配置GitHub Actions自动部署Next.js项目到Vercel平台，即使你的GitHub账号和Vercel账号不关联也可以实现自动部署。

## 前提条件

- GitHub仓库中的Next.js项目
- Vercel账号和已创建的项目
- 项目根目录下有`vercel.json`配置文件

## 步骤1：创建GitHub Actions工作流文件

在项目根目录创建`.github/workflows/vercel-deploy.yml`文件，内容如下：

```yaml
name: 自动部署到Vercel

on:
  push:
    branches:
      - main  # 主分支推送时触发
  workflow_dispatch:  # 允许手动触发

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: 检出代码
        uses: actions/checkout@v3
        
      - name: 设置Node.js环境
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: 安装依赖
        run: npm ci
        
      - name: 部署到Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
          vercel-args: '--prod'
```

## 步骤2：获取Vercel必要信息

### 获取Vercel Token

1. 访问 [Vercel Tokens设置页面](https://vercel.com/account/tokens)
2. 点击"Create"创建新的访问令牌
3. 输入名称（如"GitHub Actions"）
4. 复制生成的令牌（注意：令牌只会显示一次）

### 获取项目ID和组织ID

**方法一：通过Vercel CLI**  

1. 在项目目录中运行：
   ```bash
   npx vercel link
   ```
2. 按提示操作，将项目关联到Vercel
3. 完成后，查看`.vercel/project.json`文件，获取`projectId`和`orgId`

**方法二：通过Vercel网页界面**

1. 进入你的Vercel项目
2. 在"Settings"选项卡中找到"Project ID"
3. 在同一页面或组织设置中找到"Organization ID"

## 步骤3：配置GitHub Secrets

1. 访问GitHub仓库页面
2. 点击"Settings" → "Secrets and variables" → "Actions"
3. 点击"New repository secret"添加以下三个密钥：
   - `VERCEL_TOKEN`：你的Vercel令牌
   - `VERCEL_PROJECT_ID`：项目ID
   - `VERCEL_ORG_ID`：组织ID

## 步骤4：提交并推送工作流文件

```bash
git add .github/workflows/vercel-deploy.yml
git commit -m "ci: 添加自动部署到Vercel的GitHub Actions配置"
git push
```

## 测试自动部署

有两种方式可以测试部署：

1. **自动触发**：向主分支推送代码更改
2. **手动触发**：
   - 在GitHub仓库页面点击"Actions"选项卡
   - 选择"自动部署到Vercel"工作流
   - 点击"Run workflow"按钮

## 部署完成后

部署成功后，你可以：
- 在GitHub Actions页面查看部署日志
- 在Vercel控制台查看项目部署状态和预览URL

## 常见问题

### Q: 如何调试部署失败？
A: 查看GitHub Actions的日志输出，通常会显示具体的错误信息。

### Q: 如何更改部署配置？
A: 修改`.github/workflows/vercel-deploy.yml`文件，根据需要调整步骤或参数。

### Q: 如何部署到非生产环境？
A: 将`vercel-args`参数从`'--prod'`改为空字符串或其他参数。

## 总结

通过GitHub Actions自动部署到Vercel，你可以：
- 实现代码推送后的自动部署
- 解决GitHub账号与Vercel账号不关联的问题
- 获得更加灵活的部署工作流

---

*注：本配置适用于Next.js项目，如果你使用其他框架，可能需要调整部分配置。* 