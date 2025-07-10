import gamesData from './games.json';
import { slugify } from '@/lib/utils';

export interface Game {
  genre: any;
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  rating: number;
  ratingCount?: number;
  releaseDate: string;
  developer: string;
  playerCount?: number;
  iframeUrl: string;
  tags?: string[];
  comments?: GameComment[];
  seo_content?: string;
  video_content?: {
    name: string;
    description?: string;
    embedUrl: string;
  };
  faq_content?: {
    question: string;
    answer: string;
  }[];
}

export interface GameComment {
  author: string;
  text: string;
  time: string;
  likes: number;
  replies?: GameComment[];
}

// 外部游戏数据接口
export interface OutsideGame {
  title: string;
  image: string;
  link: string;
}

export function getAllGames(): Game[] {
  return gamesData as unknown as Game[];
}

export function getGameBySlug(slug: string): Game | undefined {
  return getAllGames().find(game => slugify(game.title) === slug);
}

export function getRelatedGames(game: Game, limit: number = 4): Game[] {
  return getAllGames()
    .filter(g => g.category === game.category && g.id !== game.id)
    .slice(0, limit);
}

export function getAllGamePaths() {
  return getAllGames().map(game => ({
    params: { slug: slugify(game.title) }
  }));
}

// 获取外部游戏数据
export function getOutsideGames(): OutsideGame[] {
  try {
    // 导入外部游戏数据
    // @ts-ignore
    const outsideGames = require('./outside-games.json');
    return outsideGames;
  } catch (error) {
    console.error('Failed to load outside games:', error);
    return [];
  }
}