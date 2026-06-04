import type { Metadata, Viewport } from "next";
import "./globals.css";
import ConditionalLayoutWrapper from "./conditional-layout-wrapper";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { generateStructuredData } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";

// Using system fonts to avoid build-time network dependency
// Inter font will be loaded via CSS from Google Fonts at runtime

export const metadata: Metadata = generateSEOMetadata({
  title: undefined, // Will use default title
  description: "Formula Hellas is a new Formula Student competition, part of the Formula Student World Competition Series, hosted at the Serres Racing Circuit in Northern Greece. The inaugural edition runs 02–07 August 2026.",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationStructuredData = generateStructuredData({
    type: 'Organization',
    data: {},
  });

  const websiteStructuredData = generateStructuredData({
    type: 'WebSite',
    data: {},
  });

  return (
    <html lang="en">
      <head>
        {/* Resource hints for performance */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
      </head>
      <body 
        className="font-sans antialiased bg-white text-gray-900"
        style={{ fontFamily: 'Inter, var(--font-sans)' }}
        suppressHydrationWarning
      >
        <ConditionalLayoutWrapper>{children}</ConditionalLayoutWrapper>
        <Analytics />
      </body>
    </html>
  );
}
