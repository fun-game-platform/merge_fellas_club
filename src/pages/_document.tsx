import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
        <meta name="author" content="GamePortal" />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Merge Fellas Club" />
        <meta property="og:description" content="Play Merge Fellas Games For Free" />
        <meta property="og:image" content="/share.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Merge Fellas Club" />
        <meta name="twitter:description" content="Play Merge Fellas Games For Free" />
        <meta name="twitter:image" content="/share.png" />
        
        {/* Robots */}
        <meta name="robots" content="index, follow" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}