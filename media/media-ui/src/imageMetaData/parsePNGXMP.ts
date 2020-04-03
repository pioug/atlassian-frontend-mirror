import { ImageMetaDataTags } from './types';

export function parseXMPMetaData(xmpMetaData: string): ImageMetaDataTags {
  const metadata: ImageMetaDataTags = {};
  const tags = xmpMetaData.match(/<(tiff|exif):.+>/gi);
  if (tags) {
    tags.forEach((tag: string) => {
      const match = tag.match(/<(tiff|exif):([^>]+)>([^<]+)/i);
      if (match) {
        const name = match[2];
        metadata[name] = match[3];
      }
    });
  }
  return metadata;
}
