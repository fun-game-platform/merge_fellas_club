import { GetStaticProps } from 'next';
import { FaTwitter, FaFacebook, FaDiscord, FaEnvelope, FaCheck } from 'react-icons/fa';
import Layout from '@/components/layout/Layout';
import { Container } from '@/components/ui/container';
import { getAboutPageData, AboutPageData } from '@/data/about';
import { getSiteConfig, SiteConfig } from '@/data/site-config';

interface AboutPageProps {
  aboutData: AboutPageData;
  siteConfig: SiteConfig;
}

export default function AboutPage({ aboutData, siteConfig }: AboutPageProps) {
  const { 
    heroSection, 
    missionSection, 
    contactSection, 
    faqSection, 
    pageTitle, 
    pageDescription, 
    pageKeywords 
  } = aboutData;

  return (
    <Layout
      title={pageTitle}
      description={pageDescription}
      keywords={pageKeywords}
      ogUrl={`${siteConfig.baseUrl}/about`}
    >
      {/* Hero Section */}
      <section 
        className="relative py-24 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: `linear-gradient(rgba(6, 11, 40, 0.8), rgba(6, 11, 40, 0.8)), url(${heroSection.image})` }}
      >
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-inter">{heroSection.title}</h1>
            <p className="text-xl text-gray-300 font-roboto">{heroSection.subtitle}</p>
            {heroSection.content && (
              <div 
                className="mt-6 text-gray-300"
                dangerouslySetInnerHTML={{ __html: heroSection.content }}
              />
            )}
          </div>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-primary">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 font-inter">{missionSection.title}</h2>
            {missionSection.contentHtml ? (
              <div 
                className="text-gray-300 font-roboto"
                dangerouslySetInnerHTML={{ __html: missionSection.contentHtml }}
              />
            ) : (
              <p className="text-gray-300 font-roboto">{missionSection.content}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {missionSection.values.map((value, index) => (
              <div key={index} className="bg-cardBg rounded-lg p-6 shadow-lg">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mb-4">
                  <FaCheck className="text-background" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 font-inter">{value.title}</h3>
                <p className="text-gray-400 font-roboto">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-background">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 font-inter">{contactSection.title}</h2>
              {contactSection.contentHtml ? (
                <div 
                  className="text-gray-300 font-roboto mb-8"
                  dangerouslySetInnerHTML={{ __html: contactSection.contentHtml }}
                />
              ) : (
                <p className="text-gray-300 font-roboto mb-8">{contactSection.content}</p>
              )}
              
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-cardBg flex items-center justify-center mr-4">
                  <FaEnvelope className="text-accent" />
                </div>
                <a href={`mailto:${contactSection.email}`} className="text-white hover:text-accent transition">
                  {contactSection.email}
                </a>
              </div>
              
              <div className="flex space-x-4 mt-8">
                <a 
                  href={contactSection.social.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-cardBg flex items-center justify-center text-white hover:text-accent transition"
                >
                  <FaTwitter className="text-xl" />
                </a>
                <a 
                  href={contactSection.social.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-cardBg flex items-center justify-center text-white hover:text-accent transition"
                >
                  <FaFacebook className="text-xl" />
                </a>
                <a 
                  href={contactSection.social.discord} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-cardBg flex items-center justify-center text-white hover:text-accent transition"
                >
                  <FaDiscord className="text-xl" />
                </a>
              </div>
            </div>
            
            <div className="bg-cardBg rounded-lg p-8">
              <h3 className="text-xl font-semibold text-white mb-6 font-inter">{faqSection.title}</h3>
              <div className="space-y-6">
                {faqSection.questions.map((faq, index) => (
                  <div key={index}>
                    <h4 className="text-lg font-medium text-white mb-2 font-inter">{faq.question}</h4>
                    {faq.answerHtml ? (
                      <div 
                        className="text-gray-400 font-roboto"
                        dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                      />
                    ) : (
                      <p className="text-gray-400 font-roboto">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const aboutData = getAboutPageData();
  const siteConfig = getSiteConfig();
  
  return {
    props: {
      aboutData,
      siteConfig,
    },
    // Incremental Static Regeneration - regenerate page every 24 hours
    revalidate: 86400,
  };
}; 