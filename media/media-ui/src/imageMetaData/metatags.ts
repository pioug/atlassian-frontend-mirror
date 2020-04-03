import { ImageMetaDataTags, ImageType } from './types';
import { readJPEGExifMetaData } from './parseJPEG';
import { readPNGXMPMetaData } from './parsePNG';
import { parseXMPMetaData } from './parsePNGXMP';

export async function readImageMetaTags(
  file: File,
): Promise<ImageMetaDataTags | null> {
  const type = file.type;
  try {
    if (type === ImageType.PNG) {
      // http://www.libpng.org/pub/png/spec/1.2/PNG-Chunks.html#C.Summary-of-standard-chunks
      // iTXt = XML text with metadata
      // pHYs = Physical pixel dimensions
      const { iTXt, pHYs } = await readPNGXMPMetaData(file);
      const xmpMetaData = { ...parseXMPMetaData(iTXt), ...pHYs };
      return xmpMetaData;
    } else if (file.type === ImageType.JPEG) {
      return await readJPEGExifMetaData(file);
    }
  } catch (e) {
    // problem parsing metadata
  }
  return null;
}
