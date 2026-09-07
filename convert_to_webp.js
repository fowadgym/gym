const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, 'public');

async function convertDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      await convertDir(filePath);
    } else if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const ext = path.extname(file);
      const newFilePath = filePath.replace(new RegExp(`${ext}$`, 'i'), '.webp');
      console.log(`Converting ${filePath} -> ${newFilePath}`);
      
      try {
        await sharp(filePath)
          .webp({ quality: 80 })
          .toFile(newFilePath);
        
        fs.unlinkSync(filePath); // delete original
        console.log(`Successfully converted and deleted original: ${file}`);
      } catch (err) {
        console.error(`Error converting ${file}:`, err);
      }
    }
  }
}

convertDir(publicDir).then(() => {
  console.log('Conversion complete!');
}).catch(console.error);
