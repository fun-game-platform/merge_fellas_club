import { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import FeaturedGames from '@/components/games/FeaturedGames';
import BlogPosts from '@/components/blog/BlogPosts';
import Newsletter from '@/components/home/Newsletter';
import { getAllBlogPosts, BlogPost } from '@/data/blog';
import { getAllGames, Game } from '@/data/games';
import { getSiteConfig } from '@/data/site-config';
import { buildCanonicalUrl } from '@/lib/utils';

interface HomeProps {
  games: Game[];
  posts: BlogPost[];
}

export default function Home({ games, posts }: HomeProps) {
  // 从配置文件中获取网站信息
  const siteConfig = getSiteConfig();
  
  // Homepage SEO data
  const title = `${siteConfig.siteName} - ${siteConfig.shortDescription}`;
  const description = siteConfig.longDescription;
  const keywords = siteConfig.keywords;
  const ogUrl = buildCanonicalUrl('', siteConfig.baseUrl);
  
  // Structured data for the homepage using schema.org WebSite type
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteConfig.siteName,
    "url": ogUrl,
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": buildCanonicalUrl('search?q={search_term_string}', siteConfig.baseUrl),
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Layout 
      title={title}
      description={description}
      keywords={keywords}
      ogUrl={ogUrl}
      structuredData={homeStructuredData}
    >
      <Hero />
      <FeaturedGames games={games} />
      <BlogPosts posts={posts} />
      <Newsletter />
    </Layout>
  );
}

// 这个函数在构建时运行
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const games = getAllGames();
  const posts = getAllBlogPosts();

  return {
    props: {
      games,
      posts,
    },
    // 增量静态再生成 - 每24小时重新生成一次页面
    revalidate: 86400,
  };
}