import Link from 'next/link';
import { Container } from '@/components/ui/container';
import GameCard from './GameCard';
import { Game } from '@/data/games';

interface FeaturedGamesProps {
  games: Game[];
}

export default function FeaturedGames({ games }: FeaturedGamesProps) {
  // 使用传入的games数据，取前4个作为featured
  const featuredGames = games.slice(0, 4);

  return (
    <section id="games" className="py-16 bg-background">
      <Container>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-white font-inter">Featured Games</h2>
          <Link href="/games" className="text-accent hover:underline flex items-center">
            View All <i className="fas fa-chevron-right ml-2"></i>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </Container>
    </section>
  );
}
