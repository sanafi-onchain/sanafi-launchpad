import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  const isProduction = (process.env.SANAFI_NODE_ENV as string) !== 'staging';

  return (
    <Html lang="en">
      <Head>
        {/* Primary Meta Tags */}
        <meta
          name="title"
          content="Ethics - Ethical Project Launchpad | Build Responsible Technology"
        />
        <meta
          name="description"
          content="Launch your next project with Ethics - the platform that prioritizes responsible development, ethical innovation, and sustainable technology solutions. Build the future responsibly."
        />
        <meta
          name="keywords"
          content="ethical launchpad, responsible technology, sustainable development, blockchain ethics, ethical innovation, responsible AI, green technology, sustainable blockchain"
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="author" content="Ethics Team" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.ethics.ltd/" />
        <meta
          property="og:title"
          content="Ethics - Ethical Project Launchpad | Build Responsible Technology"
        />
        <meta
          property="og:description"
          content="Launch your next project with Ethics - the platform that prioritizes responsible development, ethical innovation, and sustainable technology solutions. Build the future responsibly."
        />
        <meta
          property="og:image"
          content="https://imagedelivery.net/77VSeueIxa_OonUVDWCJsg/logo-ethics-only-e-symbol-new/public"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Ethics Launchpad" />

        {/* X (Twitter) */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://app.ethics.ltd/" />
        <meta
          property="twitter:title"
          content="Ethics - Ethical Project Launchpad | Build Responsible Technology"
        />
        <meta
          property="twitter:description"
          content="Launch your next project with Ethics - the platform that prioritizes responsible development, ethical innovation, and sustainable technology solutions. Build the future responsibly."
        />
        <meta
          property="twitter:image"
          content="https://imagedelivery.net/77VSeueIxa_OonUVDWCJsg/logo-ethics-only-e-symbol-new/public"
        />
        <meta property="twitter:creator" content="@ethicslaunch" />

        {/* Favicon with cache busting */}
        <link rel="icon" href={`/favicon.ico?v=${Date.now()}`} />
        <link rel="icon" type="image/x-icon" href={`/favicon.ico?v=${Date.now()}`} />
        <link rel="shortcut icon" href={`/favicon.ico?v=${Date.now()}`} />
        <link rel="apple-touch-icon" href={`/favicon.ico?v=${Date.now()}`} />

        {/* Force favicon refresh with meta tag */}
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Lora:ital,wght@0,400..700;1,400..700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <Script src="https://terminal.jup.ag/main-v4.js" />
        {/* Cloudflare Web Analytics */}
        {isProduction && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "25939db0a1964db09be4a9f717ff1f21"}'
          />
        )}
        {/* End Cloudflare Web Analytics */}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
