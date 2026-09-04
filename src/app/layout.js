import "./globals.css";

export const metadata = {
  title: "SEO Inspector — Free SEO Analysis Tool",
  description: "Instantly analyze any webpage's SEO health. Check meta tags, Open Graph, headings, images, and more. Free to use.",
  keywords: "SEO, meta tags, SEO analysis, SEO checker, Open Graph, website audit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800,900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
