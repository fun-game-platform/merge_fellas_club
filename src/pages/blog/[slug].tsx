import { GetStaticProps, GetStaticPaths } from "next";
import Link from "next/link";
import { useState } from "react";
import {
  FaUser,
  FaHeart,
  FaComment,
  FaBookmark,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaReddit,
  FaPlayCircle,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaLink,
  FaShareAlt,
  FaTimes,
  FaWeibo,
  FaQq,
  FaWeixin,
} from "react-icons/fa";
import Layout from "@/components/layout/Layout";
import { Container } from "@/components/ui/container";
import {
  getAllBlogPaths,
  getBlogPostBySlug,
  getRelatedBlogPosts,
  BlogPost,
  getAllBlogPosts,
} from "@/data/blog";
import { formatDate, slugify, buildCanonicalUrl } from "@/lib/utils";
import { renderMarkdown } from "@/lib/markdown";
import { ShareModal } from "@/components/ui/share-modal";
import { getSiteConfig } from '@/data/site-config';

interface BlogPostPageProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  slug: string;
}

export default function BlogPostPage({
  post,
  relatedPosts,
  slug,
}: BlogPostPageProps) {
  if (!post) {
    return (
      <Layout title="Article Not Found - GamePortal Blog">
        <section className="py-16 bg-primary">
          <Container>
            <div className="flex flex-col items-center justify-center h-64">
              <h2 className="text-2xl font-bold text-white mb-4">
                Article Not Found
              </h2>
              <Link href="/#blog" className="text-accent hover:underline">
                Return to Blog
              </Link>
            </div>
          </Container>
        </section>
      </Layout>
    );
  }

  const siteConfig = getSiteConfig();
  
  // SEO数据
  const title = `${post.title} | ${siteConfig.siteName}`;
  const description = post.excerpt;
  const keywords = `${post.category}, blog, gaming blog, game news, gaming tips, ${siteConfig.keywords}`;
  const ogUrl = buildCanonicalUrl(`blog/${slug}`, siteConfig.baseUrl);
  const ogImage = post.image;

  // Structured data for the blog article using schema.org BlogPosting type
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "url": post.author.url || siteConfig.baseUrl,
    },
    "@id": ogUrl,
    publisher: {
      "@type": "Organization",
      name: "GamePortal",
      logo: {
        "@type": "ImageObject",
        url: "https://gameportal.replit.app/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": ogUrl,
    },
    articleSection: post.category,
    wordCount: post.content.split(" ").length,
  };

  return (
    <Layout
      title={title}
      description={description}
      keywords={keywords}
      ogUrl={ogUrl}
      ogImage={ogImage}
      structuredData={articleStructuredData}
    >
      <section className="py-16 bg-primary">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link
                href="/#blog"
                className="text-accent hover:underline flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back to Blog
              </Link>
            </div>

            <article className="bg-cardBg rounded-lg overflow-hidden shadow-lg">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 md:h-80 object-cover"
              />

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center mb-6">
                  <span className="bg-secondary text-xs text-white px-2 py-1 rounded-full mr-3">
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Published on {formatDate(post.date)}
                  </span>
                  <span className="text-gray-400 text-sm mx-2">•</span>
                  <span className="text-gray-400 text-sm">
                    {post.readTime || "8 min read"}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 font-inter">
                  {post.title}
                </h1>

                <div className="flex items-center mb-8">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={`${post.author.name}'s avatar`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-accent"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-accent">
                      <FaUser />
                    </div>
                  )}
                  <div className="ml-4">
                    {post.author.url ? (
                      <div className="flex items-center">
                        <a
                          href={post.author.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-medium font-inter hover:text-accent transition flex items-center group"
                        >
                          {post.author.name}
                          <FaExternalLinkAlt className="ml-2 text-xs text-accent group-hover:text-white transition" />
                        </a>
                        <span
                          className="ml-2 px-2 py-0.5 text-xs bg-accent/20 text-accent rounded-full flex items-center"
                          title="作者网站"
                        >
                          <FaLink className="mr-1 text-xs" />
                          <span className="hidden sm:inline">Visit</span>
                        </span>
                      </div>
                    ) : (
                      <h4 className="text-white font-medium font-inter">
                        {post.author.name}
                      </h4>
                    )}
                    <p className="text-gray-400 text-sm">{post.author.title}</p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none font-roboto">
                  {renderMarkdown(post.content)}

                  {post.video && (
                    <div className="bg-background rounded-lg overflow-hidden my-6">
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-white mb-3 font-inter">
                          Embedded Video
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                          {post.video.description}
                        </p>
                      </div>
                      <div
                        className="aspect-w-16 aspect-h-9 bg-black w-full"
                        style={{ height: "380px" }}
                      >
                        {post.video.url ? (
                          <iframe
                            src={post.video.url}
                            title={post.video.description}
                            className="w-full h-full"
                            allowFullScreen
                            loading="lazy"
                          ></iframe>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <FaPlayCircle className="text-5xl text-accent mb-4 mx-auto" />
                              <p className="text-gray-400">Video unavailable</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700">
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <button className="bg-accent/10 hover:bg-accent/20 px-3 py-1.5 rounded-full text-accent flex items-center transition">
                        <FaHeart className="mr-2" />
                        <span className="font-medium">{post.likes || 0}</span>
                        <span className="ml-1 text-xs text-accent/80">
                          Like
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                      <ShareModal
                        title={post.title}
                        url={ogUrl}
                        description={post.excerpt}
                        image={post.image}
                        trigger={
                          <button className="bg-accent/10 hover:bg-accent/20 px-3 py-1.5 rounded-full text-accent flex items-center transition">
                            <FaShareAlt className="mr-2" />
                            <span>Share</span>
                          </button>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {relatedPosts.length > 0 && (
              <div className="mt-10">
                <h3 className="text-2xl font-bold text-white mb-6 font-inter">
                  Related Articles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <div
                      key={relatedPost.id}
                      className="bg-cardBg rounded-lg overflow-hidden shadow-lg flex"
                    >
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-24 h-full object-cover"
                      />
                      <div className="p-4">
                        <span className="bg-secondary text-xs text-white px-2 py-1 rounded-full">
                          {relatedPost.category}
                        </span>
                        <h4 className="text-white font-medium mt-2 font-inter">
                          {relatedPost.title}
                        </h4>
                        <p className="text-gray-400 text-xs mt-1">
                          {formatDate(relatedPost.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </Layout>
  );
}

// 这个函数在构建时运行，生成所有可能的博客文章页面路径
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllBlogPaths();

  return {
    paths,
    fallback: "blocking", // 如果访问未生成的页面，会在服务端生成
  };
};

// 这个函数为每个博客文章页面生成静态内容
export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;

  // 查找与slug匹配的博客文章
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      notFound: true, // 返回404页面
    };
  }

  // 查找相关文章（同类别）
  const relatedPosts = getRelatedBlogPosts(post, 2);

  return {
    props: {
      post,
      relatedPosts,
      slug,
    },
    // 增量静态再生成 - 每24小时重新生成一次页面
    revalidate: 86400,
  };
};
