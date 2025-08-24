import { useEffect } from 'react';

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: object;
}

export const useSEO = (seoData: SEOData) => {
  useEffect(() => {
    // Set page title
    document.title = seoData.title;

    // Helper function to set or update meta tag
    const setMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (element) {
        element.content = content;
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.content = content;
        document.head.appendChild(element);
      }
    };

    // Set meta description
    setMetaTag('description', seoData.description);

    // Set keywords if provided
    if (seoData.keywords) {
      setMetaTag('keywords', seoData.keywords);
    }

    // Set author if provided
    if (seoData.author) {
      setMetaTag('author', seoData.author);
    }

    // Set canonical URL if provided
    if (seoData.canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonical) {
        canonical.href = seoData.canonicalUrl;
      } else {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = seoData.canonicalUrl;
        document.head.appendChild(canonical);
      }
    }

    // Open Graph tags
    const ogTitle = seoData.ogTitle || seoData.title;
    const ogDescription = seoData.ogDescription || seoData.description;
    const ogType = seoData.ogType || 'website';
    const ogImage = seoData.ogImage || '/BIP_Explorer_Main_Image.png';

    setMetaTag('og:title', ogTitle, true);
    setMetaTag('og:description', ogDescription, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:site_name', 'BIP Explorer', true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:image:width', '1920', true);
    setMetaTag('og:image:height', '1080', true);
    setMetaTag('og:image:alt', ogTitle, true);
    
    if (seoData.canonicalUrl) {
      setMetaTag('og:url', seoData.canonicalUrl, true);
    }

    // Twitter Card tags
    const twitterCard = seoData.twitterCard || 'summary_large_image';
    setMetaTag('twitter:card', twitterCard);
    setMetaTag('twitter:title', ogTitle);
    setMetaTag('twitter:description', ogDescription);
    setMetaTag('twitter:image', ogImage);
    setMetaTag('twitter:image:alt', ogTitle);

    // Structured Data (JSON-LD)
    if (seoData.structuredData) {
      let jsonLd = document.querySelector('script[type="application/ld+json"]');
      if (jsonLd) {
        jsonLd.textContent = JSON.stringify(seoData.structuredData);
      } else {
        jsonLd = document.createElement('script');
        (jsonLd as HTMLScriptElement).type = 'application/ld+json';
        jsonLd.textContent = JSON.stringify(seoData.structuredData);
        document.head.appendChild(jsonLd);
      }
    }
  }, [seoData]);
};