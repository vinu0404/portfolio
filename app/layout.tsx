import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import { profile, publication } from "@/data/portfolio";
import { siteUrl } from "@/lib/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Preloader from "@/components/ui/Preloader";
import Nav from "@/components/ui/Nav";
import Cursor from "@/components/ui/Cursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import PageTransition from "@/components/ui/PageTransition";
import LogoSlot from "@/components/ui/LogoSlot";

const syne = Syne({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-syne", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

const description = `${profile.title}. ${profile.oneLiner}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${profile.name}, ${profile.title}`, template: `%s | ${profile.name}` },
  description,
  authors: [{ name: profile.name, url: profile.links.github }],
  openGraph: { type: "website", url: "/", title: `${profile.name}, ${profile.title}`, description, siteName: profile.name },
  twitter: { card: "summary_large_image", title: `${profile.name}, ${profile.title}`, description },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#f4f5f7", colorScheme: "light" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  sameAs: [profile.links.github, profile.links.linkedin],
  alumniOf: { "@type": "CollegeOrUniversity", name: "Rajiv Gandhi Institute of Petroleum Technology (RGIPT)" },
  knowsAbout: ["Generative AI", "Retrieval-augmented generation", "Multi-agent systems", "LLM evaluation"],
  subjectOf: { "@type": "ScholarlyArticle", name: publication.title, url: publication.url },
};

// Runs before paint: marks JS on, and skips the preloader on repeat visits in this session.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('vk-intro'))d.classList.add('seen')}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="bg-bg text-fg">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <Preloader />
        <SmoothScroll>
          <Nav logo={<LogoSlot />} />
          <ScrollProgress />
          <PageTransition>
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
          </PageTransition>
        </SmoothScroll>
        <Cursor />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
