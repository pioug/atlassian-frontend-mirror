import { Preview, ImagePreview } from '../types';
import { getImageInfo, getFileInfo } from '@atlaskit/media-ui';

export async function getPreviewFromImage(
  file: File,
  devicePixelRatio?: number,
): Promise<Preview> {
  const fileInfo = await getFileInfo(file);
  const imageInfo = await getImageInfo(fileInfo);
  if (imageInfo === null) {
    return { file };
  } else {
    const { width, height, scaleFactor } = imageInfo;
    const preview: ImagePreview = {
      file,
      dimensions: {
        width,
        height,
      },
      scaleFactor: devicePixelRatio || scaleFactor,
    };
    return preview;
  }
}

export const SCALE_FACTOR_DEFAULT = 1;
