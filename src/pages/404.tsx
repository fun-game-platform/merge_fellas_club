import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Container } from '@/components/ui/container';
import { FaHome } from 'react-icons/fa';
import { getSiteConfig } from '@/data/site-config';
import { buildCanonicalUrl } from '@/lib/utils';

export default function NotFound() {
  const siteConfig = getSiteConfig();
  
  // SEO data for the 404 page
  const title = "404 - Page Not Found";
  const description = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.";
  const ogUrl = buildCanonicalUrl('404', siteConfig.baseUrl);

  return (
    <Layout 
      title={title}
      description={description}
      ogUrl={ogUrl}
    >
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 bg-primary">
        <Container>
          <h1 className="text-6xl font-bold text-accent mb-6">404</h1>
          <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-secondary text-white rounded-full hover:bg-opacity-90 transition"
          >
            <FaHome className="mr-2" />
            Back to Home
          </Link>
        </Container>
      </div>
    </Layout>
  );
}