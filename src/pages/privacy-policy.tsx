import Layout from '@/components/layout/Layout';
import { Container } from '@/components/ui/container';
import { getSiteConfig } from '@/data/site-config';

export default function PrivacyPolicy() {
  const siteConfig = getSiteConfig();
  
  return (
    <Layout 
      title={`Privacy Policy - ${siteConfig.siteName}`}
      description="Privacy Policy for GamePortal - Learn how we collect, use, and protect your personal information."
    >
      <Container>
        <div className="py-16 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <h2>1. Introduction</h2>
            <p>Welcome to {siteConfig.siteName}. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
            
            <h2>2. The Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you, including:</p>
            <ul>
              <li>Identity Data: includes name, username or similar identifier</li>
              <li>Contact Data: includes email address</li>
              <li>Technical Data: includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform</li>
              <li>Usage Data: includes information about how you use our website, products and services</li>
            </ul>
            
            <h2>3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul>
              <li>To register you as a new customer</li>
              <li>To process and deliver your service</li>
              <li>To manage our relationship with you</li>
              <li>To improve our website, products/services, and customer relationships</li>
              <li>To recommend content that may be of interest to you</li>
            </ul>
            
            <h2>4. Data Security</h2>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
            
            <h2>5. Data Retention</h2>
            <p>We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.</p>
            
            <h2>6. Your Legal Rights</h2>
            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
            <ul>
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
            
            <h2>7. Changes to This Privacy Policy</h2>
            <p>We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.</p>
            
            <h2>8. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at: {siteConfig.contact.email}</p>
          </div>
        </div>
      </Container>
    </Layout>
  );
} 