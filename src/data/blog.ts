import blogData from './blog.json';
import { slugify } from '../lib/utils';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: {
    name: string;
    title: string;
    avatar?: string;
    url?: string;
  };
  image: string;
  readTime?: string;
  likes?: number;
  video?: {
    url: string;
    description: string;
  };
}

export function getAllBlogPosts(): BlogPost[] {
  return blogData as BlogPost[];
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find(post => slugify(post.title) === slug);
}

export function getRelatedBlogPosts(post: BlogPost, limit: number = 2): BlogPost[] {
  return getAllBlogPosts()
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, limit);
}

export function getAllBlogPaths() {
  return getAllBlogPosts().map(post => ({
    params: { slug: slugify(post.title) }
  }));
}