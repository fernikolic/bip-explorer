#!/usr/bin/env node

/**
 * Social Media Validation Utility
 * This script validates Open Graph and Twitter Card metadata
 * Uses open-source tools to test social sharing compatibility
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

// Platform requirements
const platformRequirements = {
  facebook: {
    name: 'Facebook/Open Graph',
    image: {
      minWidth: 600,
      minHeight: 315,
      recommendedWidth: 1200,
      recommendedHeight: 630,
      ratio: '1.91:1',
      maxSize: '8MB'
    },
    requiredTags: ['og:title', 'og:description', 'og:image', 'og:url']
  },
  twitter: {
    name: 'Twitter Cards',
    image: {
      summary: {
        minWidth: 144,
        minHeight: 144,
        recommendedWidth: 400,
        recommendedHeight: 400,
        ratio: '1:1'
      },
      summary_large_image: {
        minWidth: 300,
        minHeight: 157,
        recommendedWidth: 1024,
        recommendedHeight: 512,
        ratio: '2:1'
      },
      maxSize: '5MB'
    },
    requiredTags: ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']
  },
  linkedin: {
    name: 'LinkedIn',
    image: {
      minWidth: 1080,
      minHeight: 566,
      recommendedWidth: 1200,
      recommendedHeight: 630,
      ratio: '1.91:1',
      maxSize: '5MB'
    },
    requiredTags: ['og:title', 'og:description', 'og:image']
  },
  whatsapp: {
    name: 'WhatsApp',
    image: {
      minWidth: 300,
      minHeight: 200,
      recommendedWidth: 400,
      recommendedHeight: 400,
      ratio: '1:1',
      maxSize: '300KB'
    },
    requiredTags: ['og:title', 'og:description', 'og:image']
  }
};

// Test URLs for validation
const testUrls = [
  'https://developers.facebook.com/tools/debug/',
  'https://cards-dev.twitter.com/validator',
  'https://www.linkedin.com/post-inspector/',
  'https://socialsharepreview.com/'
];

function validateImageSizes() {
  log('\n📏 Validating Image Sizes...', 'blue');
  
  const publicDir = path.join(__dirname, '../client/public');
  const images = [
    'BIP_Explorer_Social_1200x630.png',
    'BIP_Explorer_Social_1024x512.png', 
    'BIP_Explorer_Social_400x400.png',
    'BIP_Explorer_Social_1200x1200.png'
  ];

  images.forEach(imageName => {
    const imagePath = path.join(publicDir, imageName);
    if (fs.existsSync(imagePath)) {
      const stats = fs.statSync(imagePath);
      const sizeKB = Math.round(stats.size / 1024);
      log(`✅ ${imageName}: ${sizeKB}KB`, 'green');
    } else {
      log(`❌ Missing: ${imageName}`, 'red');
    }
  });
}

function validateMetaTags() {
  log('\n🏷️  Validating Meta Tags...', 'blue');
  
  const htmlPath = path.join(__dirname, '../client/index.html');
  if (!fs.existsSync(htmlPath)) {
    log('❌ index.html not found', 'red');
    return;
  }
  
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  
  // Check required Open Graph tags
  const ogTags = ['og:title', 'og:description', 'og:image', 'og:type', 'og:site_name'];
  ogTags.forEach(tag => {
    if (htmlContent.includes(`property="${tag}"`)) {
      log(`✅ ${tag}`, 'green');
    } else {
      log(`❌ Missing: ${tag}`, 'red');
    }
  });
  
  // Check Twitter Card tags  
  const twitterTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
  twitterTags.forEach(tag => {
    if (htmlContent.includes(`name="${tag}"`)) {
      log(`✅ ${tag}`, 'green');
    } else {
      log(`❌ Missing: ${tag}`, 'red');
    }
  });
}

function generateTestInstructions() {
  log('\n🧪 Social Media Testing Instructions', 'blue');
  log('='.repeat(50), 'blue');
  
  Object.entries(platformRequirements).forEach(([platform, req]) => {
    log(`\n${req.name}:`, 'bold');
    if (req.image.recommendedWidth) {
      log(`  📐 Recommended: ${req.image.recommendedWidth}x${req.image.recommendedHeight}`, 'yellow');
    }
    log(`  🏷️  Required tags: ${req.requiredTags.join(', ')}`, 'yellow');
  });
  
  log('\n🔗 Test Your URLs:', 'bold');
  testUrls.forEach(url => {
    log(`  • ${url}`, 'yellow');
  });
}

function generateOptimizationTips() {
  log('\n💡 Optimization Tips', 'blue');
  log('='.repeat(50), 'blue');
  
  const tips = [
    '✅ Use high-quality images with good contrast',
    '✅ Keep file sizes under 1MB for faster loading',
    '✅ Include descriptive alt text for accessibility',
    '✅ Test on multiple platforms before deployment',
    '✅ Use absolute URLs for images (not relative paths)',
    '✅ Ensure images load quickly on mobile networks',
    '✅ Consider WebP format for better compression',
    '✅ Use structured data for rich snippets'
  ];
  
  tips.forEach(tip => log(tip, 'green'));
}

// Main execution
function main() {
  log('🚀 Social Media Validation Tool', 'bold');
  log('='.repeat(50), 'blue');
  
  validateImageSizes();
  validateMetaTags();
  generateTestInstructions();
  generateOptimizationTips();
  
  log('\n✨ Validation Complete!', 'bold');
  log('Run this script after any social media changes to ensure compatibility.', 'yellow');
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  validateImageSizes,
  validateMetaTags,
  platformRequirements
};