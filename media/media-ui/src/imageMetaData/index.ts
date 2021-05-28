import {
  ImageInfo,
  ImageMetaData,
  ImageMetaDataTags,
  SupportedImageMetaTag,
  FileInfo,
  ExifOrientation,
} from './types';
import { readImageMetaTags } from './metatags';

import { loadImage, readImageNaturalOrientationFromDOM } from '../util';
import { isRotated } from './imageOrientationUtil';

const { Orientation, XResolution } = SupportedImageMetaTag;

// http://bonfx.com/why-is-the-web-72-dpi-and-print-300-dpi/
const DPI_WEB_BASELINE = 72;

export { ExifOrientation } from './types';
export type {
  ImageInfo,
  ImageMetaData,
  ImageMetaDataTags,
  FileInfo,
} from './types';

export async function getImageInfo(
  fileInfo: FileInfo,
): Promise<ImageInfo | null> {
  const metadata = await readImageMetaData(fileInfo);
  if (!metadata) {
    return null;
  }
  const { width, height, tags } = metadata;
  const scaleFactor = getScaleFactor(fileInfo.file, tags);
  return {
    scaleFactor,
    width,
    height,
  };
}

export function getScaleFactor(
  file: File,
  tags: ImageMetaDataTags | null,
): number {
  const scaleFactorFromFilename = getScaleFactorFromFile(file);
  if (scaleFactorFromFilename !== null) {
    return scaleFactorFromFilename;
  } else if (tags) {
    /**
     * Scale Factor is actually a 2D thing, but in practice X & Y are same in 99% cases.
     * So we are only relying on X axis.
     */
    if (typeof tags['PixelPerUnitX'] === 'number') {
      // 1 inch = 0.0254 meters
      return (
        Math.round((tags['PixelPerUnitX'] as number) * 0.0254) /
        DPI_WEB_BASELINE
      );
    } else {
      return (
        getMetaTagNumericValue(tags, XResolution, DPI_WEB_BASELINE) /
        DPI_WEB_BASELINE
      );
    }
  } else {
    return 1;
  }
}

const getOrientationFromTags = (tags: ImageMetaDataTags | null) => {
  if (tags && tags[Orientation]) {
    const tagValue = tags[Orientation];
    if (tagValue) {
      const numericValue = parseInt(tagValue, 10);
      if (isNaN(numericValue)) {
        return ExifOrientation[tagValue];
      }
      return numericValue;
    }
  }
  return 1;
};

export async function getOrientation(file: File): Promise<number> {
  const tags = await readImageMetaTags(file);
  return getOrientationFromTags(tags);
}

export function getMetaTagNumericValue(
  tags: ImageMetaDataTags,
  key: string,
  defaultValue: number,
): number {
  try {
    const num = parseFloat(`${tags[key]}`);
    if (!isNaN(num)) {
      return num;
    }
  } catch (e) {
    //
  }
  return defaultValue;
}

export function getScaleFactorFromFile(file: File): number | null {
  try {
    // filenames with scale ratio in name take precedence - eg. filename@2x.png
    const match = file.name.trim().match(/@([0-9\.]+)x\.[a-z]{3}$/);
    if (match) {
      return parseFloat(match[1]);
    }
  } catch (e) {
    // parse problem, return null
  }
  return null;
}

export async function readImageMetaData(
  fileInfo: FileInfo,
): Promise<ImageMetaData | null> {
  const { file, src } = fileInfo;
  const type = file.type;
  let width = 0;
  let height = 0;
  const tags = await readImageMetaTags(file);
  // since we're reading metadata anyway, try to get dimensions from there...
  if (tags && tags.PixelXDimension) {
    width = getMetaTagNumericValue(tags, 'PixelXDimension', 0);
  }
  if (tags && tags.PixelXDimension) {
    height = getMetaTagNumericValue(tags, 'PixelYDimension', 0);
  }
  // otherwise, load the image async (ideally avoid if found above due to being slightly expensive)
  const orientation = getOrientationFromTags(tags);
  const isImageRotated = isRotated(orientation);
  const data: ImageMetaData = {
    type,
    width,
    height,
    naturalWidth: width,
    naturalHeight: height,
    tags,
  };

  if (isImageRotated || (width === 0 && height === 0)) {
    try {
      const img = await loadImage(src);
      const { width, height } = readImageNaturalOrientationFromDOM(img);
      data.width = width;
      data.height = height;
      data.naturalWidth = img.naturalWidth;
      data.naturalHeight = img.naturalHeight;
    } catch (e) {
      return null;
    }
  }

  return data;
}

export { getCssFromImageOrientation, isRotated } from './imageOrientationUtil';
