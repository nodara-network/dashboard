const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
const inputLogo = path.join(__dirname, '../nodara-logo.jpg');
const outputDir = path.join(__dirname, '../public/icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function generateIcons() {
  try {
    console.log('Generating PWA icons from Nodara logo using macOS sips...');
    
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      try {
        execSync(`sips -z ${size} ${size} "${inputLogo}" --out "${outputPath}"`, { stdio: 'pipe' });
        console.log(`✓ Generated icon-${size}x${size}.png`);
      } catch (error) {
        console.log(`⚠ Could not generate ${size}x${size} icon, creating placeholder...`);
        createPlaceholderIcon(size, outputPath);
      }
    }
    
    console.log('\n🎉 All PWA icons generated successfully!');
    console.log('📁 Icons saved to: public/icons/');
    console.log('🔧 Update your manifest to use PNG icons instead of SVG');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    console.log('💡 Make sure the nodara-logo.jpg file exists in the project root');
  }
}

function createPlaceholderIcon(size, outputPath) {
  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size/4}" fill="#ffffff"/>
  <text x="${size/2}" y="${size/2 + size/20}" text-anchor="middle" fill="#000000" font-family="Arial" font-size="${size/8}" font-weight="bold">N</text>
</svg>`;
  
  fs.writeFileSync(outputPath.replace('.png', '.svg'), svg);
}

generateIcons(); 