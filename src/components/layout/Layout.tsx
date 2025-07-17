import React, { ReactNode } from "react";
import Head from "next/head";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteConfig } from "@/data/site-config";
import MonetagAd from "../monetag-ad";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  structuredData?: Record<string, any>;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  description,
  keywords,
  ogImage,
  ogUrl,
  structuredData,
}) => {
  const siteConfig = getSiteConfig();

  // 使用props或从siteConfig中获取默认值
  const pageTitle =
    title || `${siteConfig.siteName} - ${siteConfig.shortDescription}`;
  const pageDescription = description || siteConfig.longDescription;
  const pageKeywords = keywords || siteConfig.keywords;
  const pageOgImage = ogImage || `${siteConfig.baseUrl}/og-image.jpg`;
  const pageOgUrl = ogUrl || siteConfig.baseUrl;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <link rel="canonical" href={pageOgUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageOgUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageOgImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageOgUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageOgImage} />

        <meta name="monetag" content="4be45c3d4bf83b835948e3f2a7dd09ef" />
        {/* Structured Data */}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )}
      </Head>
      <MonetagAd />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
