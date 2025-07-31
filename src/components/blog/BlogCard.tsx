import Link from 'next/link';
import { FaUser, FaShare } from 'react-icons/fa';
import { formatDate, slugify } from '@/lib/utils';
import { ShareModal } from '@/components/ui/share-modal';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: {
    name: string;
    title: string;
    avatar?: string; // Optional author avatar
  };
  image: string;
}

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const { id, title, excerpt, category, date, author, image } = post;
  const slug = slugify(title);
  const formattedDate = formatDate(date);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : '';

  // 处理分享按钮点击，防止事件冒泡
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Link href={`/blog/${slug}`}>
      <div className="blog-card bg-cardBg rounded-lg overflow-hidden shadow-lg cursor-pointer hover:opacity-95 transition-opacity">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className="bg-secondary text-xs text-white px-2 py-1 rounded-full">
              {category}
            </span>
            <span className="text-gray-400 text-xs ml-auto">{formattedDate}</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3 font-inter">{title}</h3>
          <p className="text-gray-400 text-sm mb-4 font-roboto">{excerpt}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {author.avatar ? (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-accent">
                  <FaUser />
                </div>
              )}
              <span className="ml-2 text-gray-300 text-sm">By {author.name}</span>
            </div>
            <div className="flex items-center" onClick={handleShareClick}>
              <ShareModal 
                title={title}
                url={url}
                description={excerpt}
                image={image}
                trigger={
                  <Button variant="ghost" size="sm" className="text-accent flex items-center">
                    <FaShare className="mr-1" size={14} />
                    <span>Share</span>
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
