export type CardStatus =
  | 'uploading'
  | 'loading'
  | 'processing'
  | 'loading-preview'
  | 'complete'
  | 'error'
  | 'failed-processing'
  | 'loading-preview';

export type FilePreviewStatus = {
  hasFilesize: boolean;
  isPreviewable: boolean;
  hasPreview: boolean;
  isSupportedByBrowser: boolean;
};

export type CardAppearance = 'auto' | 'image' | 'square' | 'horizontal';

export declare type CardDimensionValue = number | string;
