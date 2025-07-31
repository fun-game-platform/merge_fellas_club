import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { FaGamepad, FaPuzzlePiece, FaCar, FaChess, FaFootballBall, FaHatWizard } from 'react-icons/fa';

interface Category {
  icon: React.ReactNode;
  title: string;
  count: number;
  href: string;
}

const categories: Category[] = [
  {
    icon: <FaGamepad />,
    title: 'Action',
    count: 48,
    href: '#'
  },
  {
    icon: <FaPuzzlePiece />,
    title: 'Puzzle',
    count: 36,
    href: '#'
  },
  {
    icon: <FaCar />,
    title: 'Racing',
    count: 24,
    href: '#'
  },
  {
    icon: <FaChess />,
    title: 'Strategy',
    count: 42,
    href: '#'
  },
  {
    icon: <FaFootballBall />,
    title: 'Sports',
    count: 29,
    href: '#'
  },
  {
    icon: <FaHatWizard />,
    title: 'RPG',
    count: 31,
    href: '#'
  }
];

export default function Categories() {
  return (
    <section className="py-16 bg-background" id="categories">
      <Container>
        <h2 className="text-3xl font-bold text-white mb-10 font-inter">Browse by Category</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={category.href} legacyBehavior>
              <a className="group">
                <div className="bg-cardBg rounded-lg p-6 text-center hover:bg-secondary transition duration-300">
                  <div className="text-4xl text-accent group-hover:text-white mb-4 transition duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-white font-medium font-inter">{category.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{category.count} Games</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
