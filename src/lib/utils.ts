import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 构建标准化的URL
 * @param path 相对路径
 * @param baseUrl 基础URL
 * @returns 完整的标准化URL
 */
export function buildCanonicalUrl(path: string, baseUrl: string): string {
  // 确保baseUrl不以斜杠结尾
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // 确保path以斜杠开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // 组合并返回完整URL
  return `${base}${normalizedPath}`;
}

export function getImageUrl(path: string): string {
  return `https://images.unsplash.com/${path}`;
}

export function formatDate(dateString: string): string {
  // 检查日期字符串是否有效
  if (!dateString || typeof dateString !== 'string') {
    return "unknown date";
  }
  
  // 尝试创建Date对象
  const date = new Date(dateString);
  
  // 验证日期是否有效
  if (isNaN(date.getTime())) {
    console.error("Invalid date string in formatDate:", dateString);
    return "unknown date";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', options);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function getRelatedItems<T extends { id: string; category: string }>(
  items: T[],
  currentItem: T,
  limit: number = 4
): T[] {
  return items
    .filter(item => 
      item.id !== currentItem.id && 
      item.category === currentItem.category
    )
    .slice(0, limit);
}

/**
 * 生成随机用户名
 */
export function generateRandomUsername(): string {
  const prefixes = ["Game", "Happy", "Super", "Invincible", "Mystery", "Shadow", "Lightning", "Star", "Magic", "Ultimate"];
  const suffixes = ["Player", "Warrior", "Knight", "Explorer", "Master", "Knight", "Hunter", "Mage", "Rogue", "Guardian"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const randomNum = Math.floor(Math.random() * 1000);
  return `${prefix}${suffix}${randomNum}`;
}

/**
 * 格式化评论时间
 */
export function formatCommentTime(): string {
  // 为新评论生成与假设时间线一致的ISO时间字符串
  // 我们假设现在是2025-05-10，所以新评论时间应该接近这个日期
  const fakeNow = new Date('2025-05-10T12:00:00Z');
  
  // 减去0-60分钟的随机时间，使得评论看起来是最近发布的
  const randomMinutes = Math.floor(Math.random() * 60);
  fakeNow.setMinutes(fakeNow.getMinutes() - randomMinutes);
  
  return fakeNow.toISOString();
}

/**
 * 从ISO日期字符串生成相对时间展示
 * 例如："1天前"、"2小时前"、"刚刚"等
 */
export function getRelativeTimeString(dateString: string): string {
  // 检查日期字符串是否有效
  if (!dateString || typeof dateString !== 'string') {
    return "未知时间";
  }
  
  // 尝试创建Date对象
  const date = new Date(dateString);
  
  // 验证日期是否有效
  if (isNaN(date.getTime())) {
    console.error("Invalid date string:", dateString);
    return "未知时间";
  }
  
  // 为演示目的，我们假装当前时间是2025-05-10
  // 这样就能根据2025-05-06到2025-05-09的评论时间计算相对时间
  const fakeNow = new Date('2025-05-10T12:00:00Z');
  const fakeDiffInSeconds = Math.floor((fakeNow.getTime() - date.getTime()) / 1000);
  
  // 使用fakeDiffInSeconds来计算相对时间
  if (fakeDiffInSeconds < 60) {
    return "刚刚";
  } else if (fakeDiffInSeconds < 3600) {
    const minutes = Math.floor(fakeDiffInSeconds / 60);
    return `${minutes}分钟前`;
  } else if (fakeDiffInSeconds < 86400) {
    const hours = Math.floor(fakeDiffInSeconds / 3600);
    return `${hours}小时前`;
  } else if (fakeDiffInSeconds < 2592000) {
    const days = Math.floor(fakeDiffInSeconds / 86400);
    return `${days}天前`;
  } else {
    // 超过30天则显示具体日期
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('zh-CN', options);
  }
}

/**
 * XSS过滤函数，防止跨站脚本攻击
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
