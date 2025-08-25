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
    const ogImage = seoData.ogImage || 'https://cdn.jsdelivr.net/gh/fernikolic/bip-explorer@main/client/public/BIP_Explorer_Social_1200x630.png';
    const twitterImage = seoData.twitterCard === 'summary' ? 'https://cdn.jsdelivr.net/gh/fernikolic/bip-explorer@main/client/public/BIP_Explorer_Social_400x400.png' : 'https://cdn.jsdelivr.net/gh/fernikolic/bip-explorer@main/client/public/BIP_Explorer_Social_1024x512.png';

    // Open Graph meta tags
    setMetaTag('og:title', ogTitle, true);
    setMetaTag('og:description', ogDescription, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:site_name', 'BIP Explorer', true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:image:secure_url', ogImage, true);
    setMetaTag('og:image:type', 'image/png', true);
    setMetaTag('og:image:width', '1200', true);
    setMetaTag('og:image:height', '630', true);
    setMetaTag('og:image:alt', ogTitle, true);
    setMetaTag('og:locale', 'en_US', true);
    
    if (seoData.canonicalUrl) {
      setMetaTag('og:url', seoData.canonicalUrl, true);
    }

    // Twitter Card tags
    const twitterCard = seoData.twitterCard || 'summary_large_image';
    setMetaTag('twitter:card', twitterCard);
    setMetaTag('twitter:site', '@BIPExplorer', false); // Update with actual Twitter handle
    setMetaTag('twitter:creator', '@BIPExplorer', false); // Update with actual Twitter handle
    setMetaTag('twitter:title', ogTitle);
    setMetaTag('twitter:description', ogDescription);
    setMetaTag('twitter:image', twitterImage);
    setMetaTag('twitter:image:alt', ogTitle);
    
    // Additional Twitter meta tags
    if (twitterCard === 'summary_large_image') {
      setMetaTag('twitter:image:width', '1024');
      setMetaTag('twitter:image:height', '512');
    } else {
      setMetaTag('twitter:image:width', '400');
      setMetaTag('twitter:image:height', '400');
    }

    // Facebook App ID (if you have one)
    // setMetaTag('fb:app_id', 'YOUR_FACEBOOK_APP_ID', true);
    
    // LinkedIn specific tags
    setMetaTag('linkedin:owner', 'BIP Explorer', false);
    
    // Additional meta tags for better social sharing
    setMetaTag('article:publisher', 'BIP Explorer', true);
    setMetaTag('article:author', 'BIP Explorer', true);

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