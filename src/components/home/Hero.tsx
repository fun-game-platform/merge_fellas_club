'use client'
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { FaGamepad, FaBookOpen, FaExpand, FaCompress, FaStar } from "react-icons/fa";
import { getSiteConfig } from "@/data/site-config";
import { getAllGames } from "@/data/games";
import cn from "classnames";

export default function Hero() {
  const siteConfig = getSiteConfig();
  const homeHero = siteConfig.homeHero;
  
  // 检查是否显示游戏部分
  const isShowGame = homeHero?.isShowGame || false;
  
  // 使用 homeHero 配置或站点基本配置
  const heroContent = homeHero || {
    mainTitle: siteConfig.mainTitle,
    subTitle: siteConfig.subTitle,
    backgroundImage: "/images/hero-background.jpg", // 默认背景图
    browseButtonText: "浏览游戏",
    readButtonText: "阅读博客"
  };
  
  // 仅当需要显示游戏时才加载游戏数据
  const games = isShowGame ? getAllGames() : [];
  const featuredGame = isShowGame && games.length > 1 ? games[1] : null; // 使用 Merge Fellas: Italian Brainrot 游戏
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cssFullscreen, setCssFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 检测是否为iOS设备
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isIOSDevice =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      setIsIOS(isIOSDevice);
    }
  }, []);

  // 处理iframe加载
  useEffect(() => {
    if (!isShowGame || !featuredGame) return; // 如果不显示游戏或没有特色游戏，跳过这个效果
    
    const handleIframeLoad = () => {
      setIsLoading(false);
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad);
      // 如果iframe已经加载（缓存）
      if (iframe.contentDocument?.readyState === 'complete') {
        setIsLoading(false);
      }
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleIframeLoad);
      }
    };
  }, [isShowGame, featuredGame]);

  // 监听ESC键退出全屏
  useEffect(() => {
    if (!isShowGame) return; // 如果不显示游戏，跳过这个效果
    
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && cssFullscreen) {
        setCssFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [cssFullscreen, isShowGame]);

  // 处理全屏请求
  const handleFullscreen = () => {
    if (!isShowGame || !gameContainerRef.current) return;

    if (isIOS) {
      setCssFullscreen(!cssFullscreen);
      return;
    }

    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        gameContainerRef.current.requestFullscreen();
      }
    } catch (err) {
      console.error(`Fullscreen error: ${err}`);
      setCssFullscreen(!cssFullscreen); // 如果发生错误，使用CSS模拟全屏
    }
  };

  // 处理播放按钮点击
  const handlePlay = () => {
    setShowOverlay(false);
  };

  // 构建游戏容器类名
  const gameContainerClassName = cn(
    "bg-black rounded-lg overflow-hidden w-full shadow-lg relative",
    cssFullscreen && "fixed inset-0 z-50 bg-black rounded-none aspect-auto h-screen" // CSS全屏样式
  );
  
  const mainTitleParts = heroContent.mainTitle.split(" ");
  const firstPart = mainTitleParts.slice(0, -1).join(" ");
  const lastPart = mainTitleParts.slice(-1)[0];

  // 渲染普通的 Hero 部分（无 iframe 游戏）
  if (!isShowGame) {
    return (
      <section
        className="relative bg-cover bg-center py-16 lg:py-24"
        style={{
          backgroundImage: `url('${heroContent.backgroundImage}')`,
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-inter">
              {firstPart}<br />
              <span className="text-accent">{lastPart}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 font-roboto">
              {heroContent.subTitle}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/games"
                className="px-8 py-3 bg-secondary hover:bg-opacity-90 text-white font-medium rounded-full transition duration-300 transform hover:scale-105 flex items-center"
              >
                <FaGamepad className="mr-2" />
                {heroContent.browseButtonText}
              </Link>
              <Link
                href="/blog"
                className="px-8 py-3 bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-background font-medium rounded-full transition duration-300 flex items-center"
              >
                <FaBookOpen className="mr-2" />
                {heroContent.readButtonText}
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 渲染带 iframe 游戏的 Hero 部分（显示游戏）
  return (
    <section
      className="relative bg-cover bg-center py-16 lg:py-24"
      style={{
        backgroundImage: `url('${heroContent.backgroundImage}')`,
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 左侧文字部分 - 在移动端下放在第二位 */}
          <div className="lg:col-span-5 order-2 lg:order-1 mt-8 lg:mt-0">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-inter">
              {firstPart}<br />
              <span className="text-accent">{lastPart}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 font-roboto">
              {heroContent.subTitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/games"
                className="px-8 py-3 bg-secondary hover:bg-opacity-90 text-white font-medium rounded-full transition duration-300 transform hover:scale-105 flex items-center"
              >
                <FaGamepad className="mr-2" />
                {heroContent.browseButtonText}
              </Link>
              <Link
                href="/blog"
                className="px-8 py-3 bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-background font-medium rounded-full transition duration-300 flex items-center"
              >
                <FaBookOpen className="mr-2" />
                {heroContent.readButtonText}
              </Link>
            </div>
          </div>
          
          {/* 右侧游戏iframe部分 - 在移动端下放在第一位 */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-cardBg rounded-lg overflow-hidden shadow-lg">
              <div
                ref={gameContainerRef}
                className={gameContainerClassName}
                style={{ height: cssFullscreen ? "100vh" : "400px" }}
              >
                {/* 加载指示器 */}
                {isLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/70">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 border-t-4 border-accent border-solid rounded-full animate-spin"></div>
                      <p className="mt-4 text-white">Game Loading</p>
                    </div>
                  </div>
                )}

                {/* CSS全屏模式下的关闭按钮 */}
                {cssFullscreen && (
                  <button
                    onClick={() => setCssFullscreen(false)}
                    className="absolute top-4 right-4 z-30 bg-black/70 text-white p-2 rounded-full"
                    aria-label="退出全屏"
                  >
                    <FaCompress className="h-6 w-6" />
                  </button>
                )}

                {/* 播放覆盖层 */}
                {showOverlay && (
                  <div className="absolute inset-0 z-10 bg-black/70 flex items-center justify-center">
                    <button
                      onClick={handlePlay}
                      className="bg-accent hover:bg-opacity-80 text-background w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                      aria-label="开始游戏"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                )}

                {featuredGame && (
                  <iframe
                    ref={iframeRef}
                    src={featuredGame.iframeUrl}
                    title={featuredGame.title}
                    className="w-full h-full"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                    loading="eager"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    style={{ pointerEvents: showOverlay ? "none" : "auto" }}
                  />
                )}

                {/* 游戏控制按钮 (全屏) */}
                {!cssFullscreen && !showOverlay && (
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      onClick={handleFullscreen}
                      className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors"
                      aria-label={isFullscreen || cssFullscreen ? "退出全屏" : "进入全屏"}
                    >
                      {isFullscreen || cssFullscreen ? (
                        <FaCompress className="h-5 w-5" />
                      ) : (
                        <FaExpand className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
              
              {featuredGame && (
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 font-inter">
                        {featuredGame.title}
                      </h3>
                      <div className="flex items-center">
                        <span className="bg-secondary text-xs text-white px-2 py-1 rounded-full mr-2">
                          {featuredGame.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center bg-background px-3 py-1 rounded-full">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="ml-1 text-white text-sm font-medium">
                        {featuredGame.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
