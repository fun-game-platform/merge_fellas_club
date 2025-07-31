import Link from 'next/link';
import { FaStar, FaUsers, FaShareAlt } from 'react-icons/fa';
import { slugify } from '@/lib/utils';
import { ShareModal } from '@/components/ui/share-modal';
import { useState } from 'react';

interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  rating: number;
  ratingCount?: number;
  playerCount?: number;
  seo_content?: string;
}

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const { id, title, description, category, image, rating, ratingCount, playerCount } = game;
  const slug = slugify(title);
  
  // 防止分享按钮点击事件冒泡到Link
  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="game-card-wrapper h-full">
      <div className="game-card bg-card rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer h-full flex flex-col">
        <Link href={`/games/${slug}`} className="flex-1 flex flex-col">
          <img 
            src={image} 
            alt={`${title} Game`} 
            className="w-full h-40 object-cover"
          />
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-white font-inter line-clamp-1">{title}</h3>
              <span className="bg-secondary text-xs text-white px-2 py-1 rounded-full">{category}</span>
            </div>
            <p className="text-gray-400 text-sm mb-3 font-roboto flex-1">
              {description.length > 70 ? `${description.substring(0, 70)}...` : description}
            </p>
            <div className="flex justify-between items-center mt-auto">
              <div className="flex items-center">
                <FaStar className="text-yellow-400" />
                <span className="ml-1 text-white">{rating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm ml-1">({ratingCount || 0})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <FaUsers className="text-accent" />
                  <span className="text-gray-400 text-sm ml-1">{playerCount?.toLocaleString() || 0}</span>
                </div>
                <div onClick={handleShareClick}>
                  <ShareModal
                    title={`${title} - Play now on GamePortal`}
                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/games/${slug}`}
                    description={description}
                    image={image}
                    trigger={
                      <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background transition-colors">
                        <FaShareAlt className="text-accent text-sm" />
                      </button>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
