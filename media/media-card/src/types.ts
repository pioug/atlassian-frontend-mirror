export type CardStatus =
  | 'uploading'
  | 'loading'
  | 'processing'
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
