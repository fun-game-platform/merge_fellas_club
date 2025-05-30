import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { FaBars, FaSignInAlt } from 'react-icons/fa';
import { getSiteConfig } from '@/data/site-config';
import { useToast } from '@/hooks/use-toast';

// 获取站点配置
const siteConfig = getSiteConfig();
const navItems = siteConfig.navigation.mainNav;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // 处理登录点击
  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Tips",
      description: "Login function is coming soon, please wait!",
      duration: 3000,
    });
    closeMenu();
  };

  // 检查当前路径是否匹配导航项
  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  // Handle click outside to close menu
  useEffect(() => {
    // 确保代码只在客户端运行
    if (typeof window !== 'undefined') {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('#mobile-menu-button') && !target.closest('#nav-menu')) {
          closeMenu();
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isMenuOpen]);

  // Handle resize to ensure menu visibility
  useEffect(() => {
    // 确保代码只在客户端运行
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        if (window.innerWidth >= 1024) {
          setIsMenuOpen(true);
        } else {
          setIsMenuOpen(false);
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize(); // Set initial state

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/share.png" 
                alt="Merge Fellas Club Logo" 
                width={160} 
                height={160} 
                className="mr-3" 
                unoptimized
              />
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            id="mobile-menu-button" 
            className="lg:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <FaBars className="text-2xl" />
          </button>
          
          {/* Navigation menu */}
          <nav 
            id="nav-menu" 
            className={cn(
              "w-full lg:w-auto mt-4 lg:mt-0",
              isMenuOpen ? "block" : "hidden lg:block"
            )}
          >
            <ul className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className={cn(
                      "block py-2 text-white hover:text-accent font-medium",
                      isActiveRoute(item.href) && "border-b-2 border-secondary"
                    )}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-4 lg:mt-0 lg:ml-6">
                <a 
                  href="#" 
                  className="inline-block px-6 py-2 bg-secondary text-white rounded-full hover:bg-opacity-90 transition duration-200 font-medium cursor-pointer"
                  onClick={handleLoginClick}
                >
                  <FaSignInAlt className="inline mr-2" />Login
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
