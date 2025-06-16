import Layout from '@/components/layout/Layout';
import { Container } from '@/components/ui/container';
import { getSiteConfig } from '@/data/site-config';

export default function CookiePolicy() {
  const siteConfig = getSiteConfig();
  
  return (
    <Layout 
      title={`Cookie Policy - ${siteConfig.siteName}`}
      description="Cookie Policy for GamePortal - Learn how we use cookies and similar technologies on our website."
    >
      <Container>
        <div className="py-16 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">Cookie Policy</h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <h2>1. What are Cookies?</h2>
            <p>Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the website owners.</p>
            
            <h2>2. How We Use Cookies</h2>
            <p>We use cookies for a variety of reasons, including:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.</li>
              <li><strong>Performance Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the way our website works.</li>
              <li><strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</li>
              <li><strong>Targeting Cookies:</strong> These cookies are set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.</li>
            </ul>
            
            <h2>3. Types of Cookies We Use</h2>
            <p>The types of cookies used on our website can be classified into one of the following categories:</p>
            
            <h3>3.1 Session Cookies</h3>
            <p>Session cookies are temporary cookies that are erased when you close your browser. These cookies do not collect information from your computer. They typically store information in the form of a session identification that does not personally identify the user.</p>
            
            <h3>3.2 Persistent Cookies</h3>
            <p>Persistent cookies remain on your hard drive until you erase them or they expire. These cookies may collect identifying information about the user, such as web surfing behavior or user preferences for a specific website.</p>
            
            <h2>4. Third-Party Cookies</h2>
            <p>In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website, deliver advertisements on and through the website, and so on.</p>
            
            <h2>5. Controlling Cookies</h2>
            <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.</p>
            
            <h2>6. More Information About Cookies</h2>
            <p>If you'd like to learn more about cookies in general and how to manage them, visit <a href="https://www.aboutcookies.org" className="text-accent hover:underline">aboutcookies.org</a>.</p>
            
            <h2>7. Changes to This Cookie Policy</h2>
            <p>We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.</p>
            
            <h2>8. Contact Us</h2>
            <p>If you have any questions about our Cookie Policy, please contact us at: {siteConfig.contact.email}</p>
          </div>
        </div>
      </Container>
    </Layout>
  );
} 