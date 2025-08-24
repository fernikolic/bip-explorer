const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Hide problematic config files
const configsToHide = ['vite.config.ts', 'postcss.config.js'];
configsToHide.forEach(config => {
  if (fs.existsSync(config)) {
    fs.renameSync(config, `${config}.backup`);
    console.log(`Hidden ${config}`);
  }
});

try {
  console.log('Building frontend directly with npx...');
  
  // Change the build environment
  process.env.NODE_ENV = 'production';
  process.env.REPL_ID = undefined; // Disable Replit-specific features
  
  // Build frontend directly - this bypasses all npm script path issues
  execSync('cd client && npx vite build --outDir ../client/dist --emptyOutDir', { stdio: 'inherit' });
  
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} finally {
  // Restore config files
  configsToHide.forEach(config => {
    if (fs.existsSync(`${config}.backup`)) {
      fs.renameSync(`${config}.backup`, config);
      console.log(`Restored ${config}`);
    }
  });
}

console.log('Build completed successfully!');