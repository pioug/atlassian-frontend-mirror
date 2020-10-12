import * as fs from 'fs';
import * as path from 'path';

export default function dataUri(pathT) {
  const filePath = path.join(__dirname, '..', pathT);
  // read binary data
  const svgImage = fs.readFileSync(filePath, 'utf-8');
  // convert binary data to base64 encoded string
  const encodedImage = encodeURIComponent(svgImage)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `url("data:image/svg+xml;charset=UTF-8,${encodedImage}")`;
}
