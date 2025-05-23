import aboutData from './about.json';

export interface HeroSection {
  title: string;
  subtitle: string;
  image: string;
  content?: string;
}

export interface ValueItem {
  title: string;
  description: string;
}

export interface MissionSection {
  title: string;
  content: string;
  contentHtml?: string;
  values: ValueItem[];
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface StorySection {
  title: string;
  content: string;
  contentHtml?: string;
  milestones: Milestone[];
}

export interface TeamMember {
  name: string;
  title: string;
  bio: string;
  bioHtml?: string;
  image: string;
}

export interface TeamSection {
  title: string;
  subtitle: string;
  subtitleHtml?: string;
  members: TeamMember[];
}

export interface SocialLinks {
  twitter: string;
  facebook: string;
  discord: string;
}

export interface ContactSection {
  title: string;
  content: string;
  contentHtml?: string;
  email: string;
  social: SocialLinks;
}

export interface FAQ {
  question: string;
  answer: string;
  answerHtml?: string;
}

export interface FAQSection {
  title: string;
  questions: FAQ[];
}

export interface AboutPageData {
  pageTitle: string;
  pageDescription: string;
  pageKeywords: string;
  heroSection: HeroSection;
  missionSection: MissionSection;
  storySection: StorySection;
  teamSection: TeamSection;
  contactSection: ContactSection;
  faqSection: FAQSection;
}

export function getAboutPageData(): AboutPageData {
  return aboutData as AboutPageData;
} 