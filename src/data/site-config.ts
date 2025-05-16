import siteConfigData from './site-config.json';

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLinks {
  twitter: string;
  facebook: string;
  instagram: string;
  discord: string;
}

export interface ContactInfo {
  email: string;
  supportEmail: string;
}

export interface SiteNavigation {
  mainNav: NavItem[];
}

export interface HomeHero {
  mainTitle: string;
  subTitle: string;
  backgroundImage: string;
  browseButtonText: string;
  readButtonText: string;
  isShowGame?: boolean;
}

export interface LegalLink {
  label: string;
  href: string;
}

export interface LegalLinks {
  privacyPolicy: LegalLink;
  termsOfService: LegalLink;
  cookiePolicy: LegalLink;
}

export interface SiteConfig {
  siteName: string;
  shortDescription: string;
  longDescription: string;
  keywords: string;
  baseUrl: string;
  logoText: string;
  mainTitle: string;
  subTitle: string;
  footerText: string;
  homeHero: HomeHero;
  social: SocialLinks;
  contact: ContactInfo;
  navigation: SiteNavigation;
  legal: LegalLinks;
}

export function getSiteConfig(): SiteConfig {
  return siteConfigData as SiteConfig;
} 