import { GetStaticProps } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import { FaSearch, FaFilter, FaTag, FaCalendar, FaEye, FaComment } from 'react-icons/fa';
import Layout from '@/components/layout/Layout';
import { Container } from '@/components/ui/container';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlogCard from '@/components/blog/BlogCard';
import { getAllBlogPosts, BlogPost } from '@/data/blog';
import { formatDate, slugify, buildCanonicalUrl } from '@/lib/utils';
import { getSiteConfig } from '@/data/site-config';

interface BlogPageProps {
  posts: BlogPost[];
}

// Get all blog categories
const getAllCategories = (posts: BlogPost[]): string[] => {
  const categories = posts.map(post => post.category);
  const uniqueCategories = Array.from(new Set(categories)); // Convert Set to array using Array.from
  return uniqueCategories;
};

export default function BlogPage({ posts }: BlogPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const siteConfig = getSiteConfig();
  
  const categories = ['All', ...getAllCategories(posts)];
  
  // Filter blog posts by search term and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort by date (newest first)
  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // SEO data
  const title = `Blog - ${siteConfig.siteName}`;
  const description = "Discover the latest gaming news, trends, and insights. Get updates on new releases, gaming strategies, and more.";
  const keywords = siteConfig.keywords;
  const ogUrl = buildCanonicalUrl('blog', siteConfig.baseUrl);
  
  // Structured data
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": title,
    "description": description,
    "url": ogUrl,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": posts.slice(0, 10).map((post, index) => ({
        "@type": "BlogPosting",
        "position": index + 1,
        "url": buildCanonicalUrl(`blog/${slugify(post.title)}`, siteConfig.baseUrl),
        "headline": post.title,
        "author": {
          "@type": "Person",
          "name": post.author.name
        },
        "datePublished": post.date
      }))
    }
  };

  return (
    <Layout
      title={title}
      description={description}
      keywords={keywords}
      ogUrl={ogUrl}
      structuredData={blogStructuredData}
    >
      <section className="py-16 bg-primary">
        <Container>
          <h1 className="text-3xl font-bold text-white mb-8 font-inter">Gaming News & In-Depth Content</h1>
          
          <div className="mb-10">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full bg-background text-white py-3 px-4 pl-12 rounded-lg border border-gray-700 focus:border-accent focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              {/* Category selection */}
              <div className="relative w-full md:w-64">
                <select
                  className="w-full appearance-none bg-background text-white py-3 px-4 pl-12 rounded-lg border border-gray-700 focus:border-accent focus:outline-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Blog post list */}
          {sortedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-cardBg rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
              <p className="text-gray-400">Please try adjusting your search or selecting a different category</p>
            </div>
          )}
        </Container>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const posts = getAllBlogPosts();
  
  return {
    props: {
      posts,
    },
    // Incremental Static Regeneration - regenerate page every 24 hours
    revalidate: 86400,
  };
}; 