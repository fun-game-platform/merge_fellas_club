import { GetServerSideProps } from 'next';
import { format } from 'date-fns';
import fs from 'fs';
import path from 'path';
import { slugify } from '@/lib/utils';
import { getSiteConfig } from '@/data/site-config';

// 定义游戏数据的接口
interface Game {
  id: string;
  title: string;
  description: string;
  seo_content?: string;
  [key: string]: unknown; // 允许其他属性
}

// 定义博客文章数据的接口
interface BlogPost {
  id: string;
  title: string;
  content: string;
  [key: string]: unknown; // 允许其他属性
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // 设置基础URL
  const siteConfig = getSiteConfig();
  const baseUrl = siteConfig.baseUrl;
  
  // 获取当前日期，格式化为YYYY-MM-DD
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  
  // 定义需要包含在站点地图中的页面
  const pages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/about', changefreq: 'monthly', priority: '0.8' },
    { url: '/games', changefreq: 'weekly', priority: '0.9' },
    { url: '/blog', changefreq: 'weekly', priority: '0.8' },
    { url: '/privacy-policy', changefreq: 'yearly', priority: '0.5' },
    { url: '/terms-of-service', changefreq: 'yearly', priority: '0.5' },
    { url: '/cookie-policy', changefreq: 'yearly', priority: '0.5' },
  ];
  
  // 读取游戏数据
  let games: Game[] = [];
  try {
    const gamesFilePath = path.join(process.cwd(), 'src', 'data', 'games.json');
    const gamesData = fs.readFileSync(gamesFilePath, 'utf8');
    games = JSON.parse(gamesData);
  } catch (error) {
    console.error('读取games.json失败:', error);
  }

  // 读取博客文章数据
  let blogPosts: BlogPost[] = [];
  try {
    const blogFilePath = path.join(process.cwd(), 'src', 'data', 'blog.json');
    const blogData = fs.readFileSync(blogFilePath, 'utf8');
    blogPosts = JSON.parse(blogData);
  } catch (error) {
    console.error('读取blog.json失败:', error);
  }

  // 将游戏数据转换为站点地图格式
  const gamePages = games.map((game: Game) => ({
    url: `/games/${slugify(game.title)}`,
    changefreq: 'weekly',
    priority: '0.7'
  }));

  // 将博客文章数据转换为站点地图格式
  const blogPages = blogPosts.map((post: BlogPost) => ({
    url: `/blog/${slugify(post.title)}`,
    changefreq: 'monthly',
    priority: '0.7'
  }));
  
  // 合并所有页面
  const allPages = [...pages, ...gamePages, ...blogPages];
  
  // 生成XML，不使用xhtml:link元素添加canonical标记
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => {
    const fullUrl = `${baseUrl}${page.url}`;
    return `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `;
  }).join('')}
</urlset>`;

  // 设置响应头和状态码
res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

// 这个组件不会被渲染，因为我们在getServerSideProps中直接返回了XML
const Sitemap = () => null;
export default Sitemap; 