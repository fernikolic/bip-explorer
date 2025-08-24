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
  console.log('Building with npm run build...');
  
  // Change the build environment
  process.env.NODE_ENV = 'production';
  process.env.REPL_ID = undefined; // Disable Replit-specific features
  
  // Run the build using the existing npm script
  execSync('npm run build', { stdio: 'inherit' });
  
  // Move output if needed
  if (fs.existsSync('dist/public')) {
    if (fs.existsSync('client/dist')) {
      execSync('rm -rf client/dist');
    }
    execSync('mkdir -p client');
    execSync('mv dist/public client/dist');
    console.log('Moved build output to client/dist');
  }
  
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