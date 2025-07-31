import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { FaEnvelope } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const { toast } = useToast();

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (!email) {
      setMessage({
        text: 'Please enter your email address',
        type: 'error'
      });
      return;
    }

    if (!isValidEmail(email)) {
      setMessage({
        text: 'Please enter a valid email address',
        type: 'error'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate subscription
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Show toast notification
      toast({
        title: "Subscription Successful",
        description: "Thank you for subscribing to our newsletter!",
        duration: 3000,
      });
      
      setEmail('');
    }, 1000);
  };

  return (
    <section className="py-16 bg-primary">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-inter">Stay Updated</h2>
          <p className="text-gray-300 mb-6 font-roboto">Subscribe to our newsletter to get the latest game releases, blog articles, and exclusive offers.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-4 py-3 rounded-lg bg-background border border-gray-700 text-white focus:outline-none focus:border-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-accent text-background font-medium rounded-lg hover:bg-opacity-90 transition whitespace-nowrap flex items-center justify-center"
              disabled={isSubmitting}
            >
              <FaEnvelope className="mr-2" />
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          
          {message && (
            <p className={`text-sm mt-4 ${message.type === 'success' ? 'text-accent' : 'text-red-500'}`}>
              {message.text}
            </p>
          )}
          
          <p className="text-gray-400 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </Container>
    </section>
  );
}
