import Link from 'next/link';
import { Container } from '@/components/ui/container';
import BlogCard from './BlogCard';
import { BlogPost } from '@/data/blog';

interface BlogPostsProps {
  posts: BlogPost[];
}

export default function BlogPosts({ posts }: BlogPostsProps) {
  // 对传入的posts进行排序，取最新的3篇
  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <section id="blog" className="py-16 bg-background">
      <Container>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-white font-inter">Latest Gaming Insights</h2>
          <Link href="/blog" className="text-accent hover:underline flex items-center">
            All Articles <i className="fas fa-chevron-right ml-2"></i>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
