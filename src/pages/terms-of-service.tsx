import Layout from '@/components/layout/Layout';
import { Container } from '@/components/ui/container';
import { getSiteConfig } from '@/data/site-config';

export default function TermsOfService() {
  const siteConfig = getSiteConfig();
  
  return (
    <Layout 
      title={`Terms of Service - ${siteConfig.siteName}`}
      description="Terms of Service for GamePortal - Read about the terms and conditions that govern your use of our platform."
    >
      <Container>
        <div className="py-16 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">Terms of Service</h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <h2>1. Agreement to Terms</h2>
            <p>By accessing or using the {siteConfig.siteName} website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
            
            <h2>2. Use License</h2>
            <p>Permission is granted to temporarily access the materials on {siteConfig.siteName}'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul>
              <li>Modify or copy the materials;</li>
              <li>Use the materials for any commercial purpose, or for any public display;</li>
              <li>Attempt to decompile or reverse engineer any software contained on {siteConfig.siteName}'s website;</li>
              <li>Remove any copyright or other proprietary notations from the materials; or</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            
            <h2>3. User Accounts</h2>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>
            <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
            
            <h2>4. User Content</h2>
            <p>Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the service, including its legality, reliability, and appropriateness.</p>
            
            <h2>5. Prohibited Uses</h2>
            <p>In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content:</p>
            <ul>
              <li>For any unlawful purpose;</li>
              <li>To solicit others to perform or participate in any unlawful acts;</li>
              <li>To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances;</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others;</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate;</li>
              <li>To submit false or misleading information;</li>
              <li>To upload or transmit viruses or any other type of malicious code;</li>
              <li>To collect or track the personal information of others;</li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape;</li>
              <li>For any obscene or immoral purpose; or</li>
              <li>To interfere with or circumvent the security features of the service.</li>
            </ul>
            
            <h2>6. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            
            <h2>7. Limitation of Liability</h2>
            <p>In no event shall {siteConfig.siteName}, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
            
            <h2>8. Changes</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.</p>
            
            <h2>9. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at: {siteConfig.contact.email}</p>
          </div>
        </div>
      </Container>
    </Layout>
  );
} 