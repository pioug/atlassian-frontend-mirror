export type ImageMetaDataTags = {
  Orientation?: string;
  PixelPerUnitX?: number;
  PixelPerUnitY?: number;
  [key: string]: string | number | undefined;
};

export type ImageMetaData = {
  type: string;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
  tags: ImageMetaDataTags | null;
};

export type ImageInfo = {
  scaleFactor: number;
  width: number;
  height: number;
};

export enum ImageType {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
}

export enum SupportedImageMetaTag {
  XResolution = 'XResolution',
  YResolution = 'YResolution',
  Orientation = 'Orientation',
}

export type FileInfo = {
  file: File;
  src: string;
};

// http://sylvana.net/jpegcrop/exif_orientation.html
export const ExifOrientation: { [key: string]: number } = {
  'top-left': 1, // none
  'top-right': 2, // flip horizontal
  'bottom-right': 3, // rotate 180
  'bottom-left': 4, // flip vertical
  'left-top': 5, // transpose
  'right-top': 6, // rotate 90
  'right-bottom': 7, // transverse
  'left-bottom': 8, // rotate 270
};

export type PNGMetaData = {
  iTXt: string; // the XML metadata, needs to be parsed by ./parsePNGXMP.ts
  pHYs: { PixelPerUnitX?: number; PixelPerUnitY?: number }; // DPI info (if present)
};

export type PNGChunk = {
  name: string;
  data: Uint8Array;
};
