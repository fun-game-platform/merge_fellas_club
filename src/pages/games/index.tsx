import { GetStaticProps } from 'next';
import { FaSearch, FaFilter } from 'react-icons/fa';
import Layout from '@/components/layout/Layout';
import { Container } from '@/components/ui/container';
import GameCard from '@/components/games/GameCard';
import { getAllGames, Game } from '@/data/games';
import { getSiteConfig } from '@/data/site-config';
import { useState } from 'react';

interface GamesPageProps {
  games: Game[];
}

// 获取所有游戏种类
const getAllCategories = (games: Game[]): string[] => {
  const categories = games.map(game => game.category);
  const uniqueCategories = Array.from(new Set(categories)); // 使用Array.from转换Set为数组
  return uniqueCategories;
};

export default function GamesPage({ games }: GamesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...getAllCategories(games)];
  
  // 根据搜索词和分类筛选游戏
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const siteConfig = getSiteConfig();
  
  // Meta 数据
  const title = "All Games - Merge Fellas Club";
  const description = "Browse our collection of free online games. Play directly in your browser with no downloads required.";
  const keywords = "online games, free games, browser games, html5 games, unity games, no download games";
  const ogUrl = `${siteConfig.baseUrl}/games`;
  
  // 结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free Online Games",
    "description": description,
    "url": ogUrl,
    "hasPart": games.map(game => ({
      "@type": "WebPage",
      "url": `${siteConfig.baseUrl}/games/${game.id}`,
      "name": game.title,
      // ... existing code ...
    }))
  };

  return (
    <Layout
      title={title}
      description={description}
      keywords={keywords}
      ogUrl={ogUrl}
      structuredData={structuredData}
    >
      <section className="py-16 bg-primary">
        <Container>
          <h1 className="text-3xl font-bold text-white mb-8 font-inter">Browse Our Games</h1>
          
          <div className="mb-10">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* 搜索框 */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search games..."
                  className="w-full bg-background text-white py-3 px-4 pl-12 rounded-lg border border-gray-700 focus:border-accent focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              {/* 分类选择 */}
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
          
          {/* 游戏列表 */}
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="bg-cardBg rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">No games found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </Container>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<GamesPageProps> = async () => {
  const games = getAllGames();
  
  return {
    props: {
      games,
    },
    // 增量静态再生成 - 每24小时重新生成一次页面
    revalidate: 86400,
  };
}; 