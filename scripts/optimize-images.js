#!/usr/bin/env node

/**
 * Image Optimization Script for Social Media
 * Uses ImageMagick to create optimized social media images
 * Generates multiple sizes for different platforms
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Image configurations for different platforms
const imageConfigs = [
  {
    name: 'Facebook/Open Graph',
    filename: 'BIP_Explorer_Social_1200x630.png',
    size: '1200x630!',
    description: 'Optimal for Facebook, LinkedIn, and other Open Graph platforms'
  },
  {
    name: 'Twitter Large Card',
    filename: 'BIP_Explorer_Social_1024x512.png', 
    size: '1024x512!',
    description: 'Perfect for Twitter summary_large_image cards'
  },
  {
    name: 'Twitter Summary',
    filename: 'BIP_Explorer_Social_400x400.png',
    size: '400x400!',
    description: 'Square format for Twitter summary cards'
  },
  {
    name: 'Instagram/Square',
    filename: 'BIP_Explorer_Social_1200x1200.png',
    size: '1200x1200!',
    description: 'Square format for Instagram and general social sharing'
  }
];

function checkImageMagick() {
  try {
    execSync('magick -version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    log('❌ ImageMagick not found. Installing...', 'red');
    try {
      log('Installing ImageMagick via Homebrew...', 'yellow');
      execSync('brew install imagemagick', { stdio: 'inherit' });
      return true;
    } catch (installError) {
      log('❌ Failed to install ImageMagick. Please install manually:', 'red');
      log('   macOS: brew install imagemagick', 'yellow');
      log('   Ubuntu: sudo apt-get install imagemagick', 'yellow');
      log('   Windows: Download from https://imagemagick.org/', 'yellow');
      return false;
    }
  }
}

function optimizeImages(sourceImage) {
  const publicDir = path.join(__dirname, '../client/public');
  const sourcePath = path.join(publicDir, sourceImage);
  
  if (!fs.existsSync(sourcePath)) {
    log(`❌ Source image not found: ${sourcePath}`, 'red');
    return;
  }
  
  log(`📸 Optimizing images from: ${sourceImage}`, 'blue');
  
  imageConfigs.forEach(config => {
    try {
      const outputPath = path.join(publicDir, config.filename);
      
      // ImageMagick command with optimizations
      const command = [
        'magick',
        `"${sourcePath}"`,
        '-resize', config.size,
        '-strip',                    // Remove metadata
        '-interlace', 'Plane',       // Progressive JPEG equivalent for PNG
        '-gaussian-blur', '0.05',    // Subtle blur for better compression
        '-quality', '95',            // High quality
        '-define', 'png:compression-level=9',  // Maximum PNG compression
        `"${outputPath}"`
      ].join(' ');
      
      execSync(command, { stdio: 'pipe' });
      
      // Get file size
      const stats = fs.statSync(outputPath);
      const sizeKB = Math.round(stats.size / 1024);
      
      log(`✅ ${config.name}: ${config.filename} (${sizeKB}KB)`, 'green');
      log(`   ${config.description}`, 'yellow');
      
      // Create WebP version for better performance
      const webpPath = outputPath.replace('.png', '.webp');
      const webpCommand = [
        'magick',
        `"${outputPath}"`,
        '-quality', '90',
        `"${webpPath}"`
      ].join(' ');
      
      execSync(webpCommand, { stdio: 'pipe' });
      const webpStats = fs.statSync(webpPath);
      const webpSizeKB = Math.round(webpStats.size / 1024);
      log(`   WebP version: ${webpSizeKB}KB`, 'green');
      
    } catch (error) {
      log(`❌ Failed to create ${config.filename}: ${error.message}`, 'red');
    }
  });
}

function validateImages() {
  const publicDir = path.join(__dirname, '../client/public');
  
  log('\n📋 Image Validation Report:', 'blue');
  
  imageConfigs.forEach(config => {
    const imagePath = path.join(publicDir, config.filename);
    if (fs.existsSync(imagePath)) {
      const stats = fs.statSync(imagePath);
      const sizeKB = Math.round(stats.size / 1024);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      
      // Validation checks
      const checks = [];
      if (sizeKB < 1000) checks.push('✅ Size < 1MB');
      else if (sizeKB < 2000) checks.push('⚠️  Size > 1MB');
      else checks.push('❌ Size > 2MB');
      
      log(`\n${config.name}:`, 'bold');
      log(`  File: ${config.filename}`, 'yellow');
      log(`  Size: ${sizeKB}KB (${sizeMB}MB)`, 'yellow');
      log(`  ${checks.join(', ')}`, checks.includes('❌') ? 'red' : 'green');
    } else {
      log(`\n❌ Missing: ${config.filename}`, 'red');
    }
  });
}

function generateInstructions() {
  log('\n📚 Usage Instructions:', 'blue');
  log('='.repeat(50), 'blue');
  
  const instructions = [
    '1. Place your source image in client/public/',
    '2. Run: npm run optimize-images [source-image-name]',
    '3. Optimized images will be generated automatically',
    '4. Test with: npm run validate-social',
    '5. Update meta tags to use new image paths',
    '',
    'Platform-specific recommendations:',
    '• Facebook/LinkedIn: Use BIP_Explorer_Social_1200x630.png',
    '• Twitter Large: Use BIP_Explorer_Social_1024x512.png', 
    '• Twitter Summary: Use BIP_Explorer_Social_400x400.png',
    '• Instagram: Use BIP_Explorer_Social_1200x1200.png'
  ];
  
  instructions.forEach(instruction => {
    log(instruction, 'yellow');
  });
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const sourceImage = args[0] || 'BIP_Explorer_Main_Image.png';
  
  log('🖼️  Social Media Image Optimizer', 'bold');
  log('='.repeat(50), 'blue');
  
  if (!checkImageMagick()) {
    process.exit(1);
  }
  
  optimizeImages(sourceImage);
  validateImages();
  generateInstructions();
  
  log('\n✨ Image optimization complete!', 'bold');
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { optimizeImages, validateImages };