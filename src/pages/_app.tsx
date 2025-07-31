import { AppProps } from 'next/app';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CustomToaster } from "@/components/ui/custom-toaster";
import { GoogleAnalytics } from '@next/third-parties/google';
import './index.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google Analytics */}
      <GoogleAnalytics gaId="G-VFE294HXZ2" />
      
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CustomToaster />
          <Component {...pageProps} />
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}