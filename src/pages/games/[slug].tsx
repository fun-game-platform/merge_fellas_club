import { useState, useRef, useEffect } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import Link from "next/link";
import {
  FaStar,
  FaUser,
  FaCalendar,
  FaGamepad,
  FaUsers,
  FaBookmark,
  FaShareAlt,
  FaThumbsUp,
  FaReply,
  FaExpand,
  FaCompress,
  FaExternalLinkAlt,
} from "react-icons/fa";
import Layout from "@/components/layout/Layout";
import { Container } from "@/components/ui/container";
import { ShareModal } from "@/components/ui/share-modal";
import SeoContent from "@/components/games/SeoContent";
import {
  getAllGamePaths,
  getGameBySlug,
  getRelatedGames,
  getOutsideGames,
  Game,
  GameComment,
  OutsideGame,
} from "@/data/games";
import {
  formatDate,
  cn,
  slugify,
  generateRandomUsername,
  formatCommentTime,
  sanitizeText,
  getRelativeTimeString,
  buildCanonicalUrl,
} from "@/lib/utils";
import { useRouter } from "next/router";
import { getSiteConfig } from "@/data/site-config";

// 定义结构化数据类型
type VideoGameStructuredData = {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  genre: string;
  gamePlatform: string;
  applicationCategory: string;
  operatingSystem: string;
  url: string;
  image: string;
  author: {
    "@type": string;
    name: string;
  };
  datePublished: string;
  aggregateRating: {
    "@type": string;
    ratingValue: number;
    ratingCount: number;
    bestRating: string;
    worstRating: string;
  };
  video?: {
    "@type": string;
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    embedUrl: string;
    contentUrl: string;
  };
  mainEntity?: {
    "@type": string;
    name: string;
    acceptedAnswer: {
      "@type": string;
      text: string;
    };
  }[];
};

type FAQPageStructuredData = {
  "@context": string;
  "@type": string;
  url: string;
  mainEntity: {
    "@type": string;
    name: string;
    acceptedAnswer: {
      "@type": string;
      text: string;
    };
  }[];
};

// 通用结构化数据类型联合
type StructuredData = VideoGameStructuredData | FAQPageStructuredData;

interface GameDetailProps {
  game: Game;
  relatedGames: Game[];
  outsideGames: OutsideGame[];
}

export default function GameDetail({
  game,
  relatedGames,
  outsideGames,
}: GameDetailProps) {
  const [comment, setComment] = useState("");
  const [gameData, setGameData] = useState<Game>(game);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cssFullscreen, setCssFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [likingComments, setLikingComments] = useState<string[]>([]);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();
  const currentSlug = router.query.slug as string;

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
    const handleIframeLoad = () => {
      setIsLoading(false);
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad);
      // 如果iframe已经加载（缓存）
      if (iframe.contentDocument?.readyState === "complete") {
        setIsLoading(false);
      }
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleIframeLoad);
      }
    };
  }, []);

  // 监听ESC键退出全屏
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && cssFullscreen) {
        setCssFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [cssFullscreen]);

  // 处理全屏请求
  const handleFullscreen = () => {
    if (!gameContainerRef.current) return;

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
    cssFullscreen &&
      "fixed inset-0 z-50 bg-black rounded-none aspect-auto h-screen" // CSS全屏样式
  );

  // 处理评论提交
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    // 过滤评论文本
    const sanitizedComment = sanitizeText(comment.trim());

    // 创建新评论对象
    const newComment: GameComment = {
      author: generateRandomUsername(),
      text: sanitizedComment,
      time: formatCommentTime(),
      likes: 0,
      replies: [],
    };

    try {
      // 先更新本地状态，让用户看到立即反馈
      const updatedGame = { ...gameData };
      if (!updatedGame.comments) {
        updatedGame.comments = [];
      }
      updatedGame.comments = [newComment, ...updatedGame.comments];
      setGameData(updatedGame);

      // 清空评论输入框
      setComment("");

      // 调用API保存评论到服务器
      const response = await fetch(`/api/comments/${game.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) {
        throw new Error("Comment submission failed");
      }

      // 成功保存后，获取最新的评论列表（可选）
      const result = await response.json();
      if (result.comments) {
        const freshGame = { ...gameData, comments: result.comments };
        setGameData(freshGame);
      }
    } catch (error) {
      console.error("Comment submission error:", error);
      alert("Comment submission failed, please try again later.");
    }
  };

  // 处理点赞
  const handleLike = async (commentIndex: number, replyIndex?: number) => {
    // 生成唯一标识以防止重复点赞请求
    const likeId =
      replyIndex !== undefined
        ? `${commentIndex}-${replyIndex}`
        : `${commentIndex}`;

    // 如果正在处理点赞请求，则跳过
    if (likingComments.includes(likeId)) return;

    try {
      // 将评论ID加入正在处理的列表
      setLikingComments((prev) => [...prev, likeId]);

      // 克隆游戏数据以进行修改
      const updatedGame = { ...gameData };

      // 如果是回复的点赞
      if (
        replyIndex !== undefined &&
        updatedGame.comments?.[commentIndex]?.replies
      ) {
        const reply = updatedGame.comments[commentIndex].replies?.[replyIndex];
        if (reply) {
          reply.likes += 1;
        }
      }
      // 如果是评论的点赞
      else if (updatedGame.comments?.[commentIndex]) {
        updatedGame.comments[commentIndex].likes += 1;
      }

      // 更新本地状态，提供即时反馈
      setGameData(updatedGame);

      // 调用API保存点赞状态
      const response = await fetch(`/api/comments/like/${game.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentIndex,
          replyIndex,
        }),
      });

      if (!response.ok) {
        throw new Error("Like operation failed");
      }

      // 可选：从服务器获取最新评论状态
      const result = await response.json();
      if (result.comments) {
        setGameData((prev) => ({ ...prev, comments: result.comments }));
      }
    } catch (error) {
      console.error("Like operation error:", error);
      // 回滚本地状态
      setGameData({ ...gameData });
    } finally {
      // 从处理列表中移除该评论
      setLikingComments((prev) => prev.filter((id) => id !== likeId));
    }
  };

  const siteConfig = getSiteConfig();

  if (!game) {
    return (
      <Layout title="Game Not Found - GamePortal">
        <section className="py-16 bg-primary">
          <Container>
            <div className="flex flex-col items-center justify-center h-64">
              <h2 className="text-2xl font-bold text-white mb-4">
                Game Not Found
              </h2>
              <Link href="/#games" className="text-accent hover:underline">
                Return to Games
              </Link>
            </div>
          </Container>
        </section>
      </Layout>
    );
  }

  // Prepare SEO data for this specific game
  const title = `${game.title} - Play Now for Free | GamePortal`;
  const description = `Play ${
    game.title
  } online for free! ${game.description.substring(
    0,
    120
  )}... No downloads required, play directly in your browser.`;
  const keywords = `${game.title}, ${
    game.category
  } game, browser game, online game, free game, ${
    game.tags ? game.tags.join(", ") : ""
  }`;
  const ogUrl = buildCanonicalUrl(
    `games/${currentSlug || slugify(game.title)}`,
    siteConfig.baseUrl
  );

  // Structured data for the game (using schema.org VideoGame type)
  const gameStructuredData: VideoGameStructuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description,
    genre: game.category,
    gamePlatform: "Web Browser",
    applicationCategory: "Game",
    operatingSystem: "Any",
    url: ogUrl,
    image: game.image,
    author: {
      "@type": "Organization",
      name: game.developer,
    },
    datePublished: game.releaseDate,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: game.rating || 0,
      ratingCount: game.rating || 0,
      bestRating: "5",
      worstRating: "1",
    },
    ...(game.video_content && {
      video: {
        "@type": "VideoObject",
        name: game.video_content.name,
        description: game.video_content.description || game.description,
        thumbnailUrl: game.image,
        uploadDate: game.releaseDate,
        embedUrl: game.video_content.embedUrl,
        contentUrl: game.video_content.embedUrl,
      },
    }),
    ...(game.faq_content &&
      game.faq_content.length > 0 && {
        mainEntity: game.faq_content.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }),
  };

  // 如果有FAQ内容，添加FAQPage结构化数据
  const faqStructuredData: FAQPageStructuredData | null =
    game.faq_content && game.faq_content.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url: ogUrl,
          mainEntity: game.faq_content.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  // 合并所有结构化数据
  const structuredData: StructuredData[] = [gameStructuredData];
  if (faqStructuredData) {
    structuredData.push(faqStructuredData);
  }

  return (
    <Layout
      title={title}
      description={description}
      keywords={keywords}
      ogUrl={ogUrl}
      ogImage={game.image}
      structuredData={structuredData}
    >
      <section className="py-16 bg-primary">
        <Container>
          <h1 className="text-3xl font-bold text-white mb-12 font-inter">
            Game Spotlight: <span className="text-accent">{game.title}</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-cardBg rounded-lg overflow-hidden shadow-lg mb-6">
                <div
                  ref={gameContainerRef}
                  className={gameContainerClassName}
                  style={{ height: cssFullscreen ? "100vh" : "500px" }}
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 md:h-12 md:w-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  <iframe
                    ref={iframeRef}
                    src={game.iframeUrl}
                    title={game.title}
                    className="w-full h-full"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                    loading="eager"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    style={{ pointerEvents: showOverlay ? "none" : "auto" }}
                  />

                  {/* 游戏控制按钮 (全屏) */}
                  {!cssFullscreen && !showOverlay && (
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button
                        onClick={handleFullscreen}
                        className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors"
                        aria-label={
                          isFullscreen || cssFullscreen
                            ? "退出全屏"
                            : "进入全屏"
                        }
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

                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2 font-inter">
                        {game.title}
                      </h2>
                      <div className="flex flex-wrap items-center mb-4">
                        <span className="bg-secondary text-xs text-white px-2 py-1 rounded-full mr-2">
                          {game.category}
                        </span>
                        {game.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-background text-xs text-white px-2 py-1 rounded-full mr-2 mt-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center bg-background px-3 py-2 rounded-full">
                      <FaStar className="text-yellow-400" />
                      <span className="ml-1 text-white font-medium">
                        {game.rating.toFixed(1)}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">
                        ({game.ratingCount || 0})
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6 font-roboto">
                    {game.description}
                  </p>

                  {/* SEO内容渲染区域 - 放在FAQ后，视频前 */}
                  {game.seo_content && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-white mb-4 font-inter border-l-4 border-accent pl-3 py-1">
                        Game Overview
                      </h3>
                      <SeoContent content={game.seo_content} />
                    </div>
                  )}

                  {/* FAQ内容展示区域 - 放在描述后，SEO内容前 */}
                  {game.faq_content && game.faq_content.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-white mb-4 font-inter border-l-4 border-accent pl-3 py-1">
                        FAQ
                      </h3>
                      <div className="bg-background/40 p-4 rounded-lg border border-gray-700">
                        <dl className="space-y-4">
                          {game.faq_content.map((faq, index) => (
                            <div key={index} className="mb-4 last:mb-0">
                              <dt className="text-accent font-medium mb-1">
                                {faq.question}
                              </dt>
                              <dd className="text-gray-300 text-sm pl-4 border-l-2 border-gray-700">
                                {faq.answer}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  )}

                  {/* 视频内容展示区域 - 放在最后 */}
                  {game.video_content && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-white mb-4 font-inter border-l-4 border-accent pl-3 py-1">
                        Game Video
                      </h3>
                      <div className="bg-background/40 p-4 rounded-lg border border-gray-700">
                        <div className="aspect-video w-full mb-4">
                          <iframe
                            src={game.video_content.embedUrl}
                            title={game.video_content.name}
                            className="w-full h-full rounded-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        {game.video_content.name && (
                          <h4 className="text-lg font-medium text-white mb-2">
                            {game.video_content.name}
                          </h4>
                        )}
                        {game.video_content.description && (
                          <p className="text-gray-300 font-roboto">
                            {game.video_content.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-background rounded-lg p-3 text-center">
                      <div className="text-accent text-xl mb-1">
                        <FaCalendar />
                      </div>
                      <p className="text-gray-400 text-xs">RELEASED</p>
                      <p className="text-white text-sm">
                        {formatDate(game.releaseDate)}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-3 text-center">
                      <div className="text-accent text-xl mb-1">
                        <FaGamepad />
                      </div>
                      <p className="text-gray-400 text-xs">PLATFORM</p>
                      <p className="text-white text-sm">Browser</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 text-center">
                      <div className="text-accent text-xl mb-1">
                        <FaUsers />
                      </div>
                      <p className="text-gray-400 text-xs">PLAYERS</p>
                      <p className="text-white text-sm">
                        {game.playerCount?.toLocaleString() || "12,453"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-2 bg-accent text-background rounded-full hover:bg-opacity-90 font-medium transition flex items-center">
                      <FaBookmark className="mr-2" />
                      Add to Favorites
                    </button>

                    <ShareModal
                      title={`${game.title} - Play now on GamePortal`}
                      url={ogUrl}
                      description={description}
                      image={game.image}
                      trigger={
                        <button className="px-4 py-2 bg-transparent border border-gray-600 text-white rounded-full hover:border-accent hover:text-accent transition flex items-center">
                          <FaShareAlt className="mr-2" />
                          Share
                        </button>
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-cardBg rounded-lg overflow-hidden shadow-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6 font-inter">
                  评论{" "}
                  <span className="text-gray-400 text-sm">
                    ({gameData.comments?.length || 0})
                  </span>
                </h3>

                <div className="mb-6">
                  <div className="flex items-start space-x-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white">
                      <FaUser />
                    </div>
                    <div className="flex-1">
                      <form onSubmit={handleCommentSubmit}>
                        <textarea
                          className="w-full bg-background text-white p-3 rounded-lg resize-none border border-gray-700 focus:border-accent focus:outline-none"
                          placeholder="Add a comment..."
                          rows={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end mt-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-secondary text-white rounded-full hover:bg-opacity-90 transition text-sm"
                          >
                            Post Comment
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {gameData.comments && gameData.comments.length > 0 ? (
                    gameData.comments.map((comment, index) => (
                      <div key={index} className="flex space-x-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-accent">
                          <FaUser />
                        </div>
                        <div className="flex-1">
                          <div className="bg-background p-4 rounded-lg">
                            <div className="flex justify-between mb-2">
                              <h4 className="font-medium text-white font-inter">
                                {comment.author}
                              </h4>
                              {/* <span className="text-gray-400 text-xs">
                                {getRelativeTimeString(comment.time)}
                              </span> */}
                            </div>
                            <p className="text-gray-300 text-sm font-roboto">
                              {comment.text}
                            </p>
                            <div className="flex items-center mt-3 text-sm">
                              <button
                                className={`${
                                  likingComments.includes(index.toString())
                                    ? "text-accent"
                                    : "text-gray-400 hover:text-accent"
                                } transition flex items-center`}
                                onClick={() => handleLike(index)}
                                disabled={likingComments.includes(
                                  index.toString()
                                )}
                              >
                                <FaThumbsUp className="mr-1" /> {comment.likes}
                              </button>
                              {/* <button className="text-gray-400 hover:text-accent transition flex items-center ml-4">
                                <FaReply className="mr-1" /> Reply
                              </button> */}
                            </div>
                          </div>

                          {comment.replies &&
                            comment.replies.map((reply, replyIndex) => (
                              <div
                                key={replyIndex}
                                className="flex space-x-4 mt-4 ml-6"
                              >
                                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-secondary">
                                  <FaUser />
                                </div>
                                <div className="flex-1">
                                  <div className="bg-background p-3 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                      <h4 className="font-medium text-white text-sm font-inter">
                                        {reply.author}
                                      </h4>
                                      <span className="text-gray-400 text-xs">
                                        {getRelativeTimeString(reply.time)}
                                      </span>
                                    </div>
                                    <p className="text-gray-300 text-sm font-roboto">
                                      {reply.text}
                                    </p>
                                    <div className="flex items-center mt-2 text-sm">
                                      <button
                                        className={`${
                                          likingComments.includes(
                                            `${index}-${replyIndex}`
                                          )
                                            ? "text-accent"
                                            : "text-gray-400 hover:text-accent"
                                        } transition flex items-center`}
                                        onClick={() =>
                                          handleLike(index, replyIndex)
                                        }
                                        disabled={likingComments.includes(
                                          `${index}-${replyIndex}`
                                        )}
                                      >
                                        <FaThumbsUp className="mr-1" />{" "}
                                        {reply.likes}
                                      </button>
                                      {/* <button className="text-gray-400 hover:text-accent transition flex items-center ml-4">
                                        <FaReply className="mr-1" /> Reply
                                      </button> */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-4">
                      暂无评论。成为第一个评论的人！
                    </p>
                  )}
                </div>

                {gameData.comments && gameData.comments.length > 3 && (
                  <div className="text-center">
                    <button className="text-accent hover:underline flex items-center justify-center mx-auto">
                      加载更多评论 <i className="fas fa-chevron-down ml-2"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar with Related Games */}
            <div className="lg:col-span-1">
              <div className="bg-cardBg rounded-lg overflow-hidden shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4 font-inter">
                  Similar Games
                </h3>

                {relatedGames.length > 0 ? (
                  relatedGames.map((relatedGame, index) => (
                    <Link
                      key={relatedGame.id}
                      href={`/games/${slugify(relatedGame.title)}`}
                      className={`flex items-center transition-opacity hover:opacity-80 ${
                        index < relatedGames.length - 1
                          ? "mb-4 pb-4 border-b border-gray-700"
                          : ""
                      }`}
                    >
                      <img
                        src={relatedGame.image}
                        alt={relatedGame.title}
                        className="w-20 h-14 object-cover rounded mr-3"
                      />
                      <div>
                        <h4 className="text-white font-medium font-inter">
                          {relatedGame.title}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {relatedGame.category}
                        </p>
                        <div className="flex items-center mt-1">
                          <FaStar className="text-yellow-400 text-xs" />
                          <span className="text-white text-xs ml-1">
                            {relatedGame.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No related games found.
                  </p>
                )}
              </div>

              {/* 外部优秀游戏区域 */}
              <div className="bg-cardBg rounded-lg overflow-hidden shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4 font-inter">
                  Hot Outside Games
                </h3>

                {outsideGames && outsideGames.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {outsideGames.map((outsideGame, index) => (
                      <a
                        key={index}
                        href={outsideGame.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-background rounded-lg overflow-hidden hover:ring-1 hover:ring-accent transition-all group flex flex-col"
                        title={outsideGame.title}
                      >
                        <div className="relative w-full aspect-[16/9] overflow-hidden">
                          <img
                            src={outsideGame.image}
                            alt={outsideGame.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <FaExternalLinkAlt className="text-white text-lg" />
                          </div>
                        </div>
                        <div className="p-2 flex-grow flex items-center justify-center">
                          <h4
                            className="text-white text-xs font-medium text-center line-clamp-1 w-full px-1"
                            title={outsideGame.title}
                          >
                            {outsideGame.title}
                          </h4>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    Wait for the outside games to be added.
                  </p>
                )}
              </div>

              <div className="bg-cardBg rounded-lg overflow-hidden shadow-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 font-inter">
                  Popular Games
                </h3>

                <div className="bg-background rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">Active Players</h4>
                    <span className="text-accent font-medium">145,780</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">Total Games</h4>
                    <span className="text-accent font-medium">256</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <Link href="/games" className="text-accent hover:underline">
                    View All Games
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}

// 这个函数在构建时运行，生成所有可能的游戏页面路径
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllGamePaths();

  return {
    paths,
    fallback: "blocking", // 如果访问未生成的页面，会在服务端生成
  };
};

// 这个函数为每个游戏页面生成静态内容
export const getStaticProps: GetStaticProps<GameDetailProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;

  // 查找与slug匹配的游戏
  const game = getGameBySlug(slug);

  if (!game) {
    return {
      notFound: true, // 返回404页面
    };
  }

  // 查找相关游戏（同类别）
  const relatedGames = getRelatedGames(game, 4);

  // 获取外部游戏数据
  const outsideGames = getOutsideGames();

  return {
    props: {
      game,
      relatedGames,
      outsideGames,
    },
    // 增量静态再生成 - 每24小时重新生成一次页面
    revalidate: 86400,
  };
};
