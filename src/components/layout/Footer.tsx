import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGamepad, FaFacebookF, FaTwitter, FaInstagram, FaDiscord } from 'react-icons/fa';
import { getSiteConfig } from '@/data/site-config';

// 获取站点配置
const siteConfig = getSiteConfig();

// 快速链接
const quickLinks = siteConfig.navigation.mainNav;

// 游戏分类
const gameCategories = [
  { label: 'Action Games', href: '/#games' },
  { label: 'Puzzle Games', href: '/#games' },
  { label: 'Strategy Games', href: '/#games' },
  { label: 'Racing Games', href: '/#games' },
  { label: 'RPG Games', href: '/#games' }
];

// 法律链接
const legalLinks = [
  siteConfig.legal.privacyPolicy,
  siteConfig.legal.termsOfService,
  siteConfig.legal.cookiePolicy
];

// 社交媒体链接
const socialLinks = [
  { icon: <FaFacebookF />, href: siteConfig.social.facebook },
  { icon: <FaTwitter />, href: siteConfig.social.twitter },
  { icon: <FaInstagram />, href: siteConfig.social.instagram },
  { icon: <FaDiscord />, href: siteConfig.social.discord }
];

export default function Footer() {
  const [currentYear, setCurrentYear] = useState('');

  // 在客户端环境下设置当前年份
  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="bg-background pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <FaGamepad className="text-accent text-3xl mr-3" />
              <span className="text-2xl font-bold text-white font-inter">{siteConfig.logoText}</span>
            </div>
            <p className="text-gray-400 mb-4 font-roboto">Your one-stop destination for browser games and gaming insights.</p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.href} 
                  className="text-gray-400 hover:text-accent transition"
                  aria-label={`Social link ${index + 1}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-6 font-inter">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-accent transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-6 font-inter">Game Categories</h3>
            <ul className="space-y-3">
              {gameCategories.map((category, index) => (
                <li key={index}>
                  <Link href={category.href} className="text-gray-400 hover:text-accent transition">
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-6 font-inter">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-accent transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">{siteConfig.footerText.replace('2023', currentYear || '2023')}</p>
            <div className="flex items-center">
              {legalLinks.map((link, index) => (
                <Link key={index} href={link.href} className="text-gray-400 hover:text-accent transition text-sm mx-3">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
