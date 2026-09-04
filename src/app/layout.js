import "./globals.css";

export const metadata = {
  title: "SEO Inspector — Free SEO Analysis Tool",
  description: "Instantly analyze any webpage's SEO health. Check meta tags, Open Graph, headings, images, and more. Free to use.",
  keywords: "SEO, meta tags, SEO analysis, SEO checker, Open Graph, website audit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
