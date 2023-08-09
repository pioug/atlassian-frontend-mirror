import type { RichMediaLayout } from '@atlaskit/adf-schema';

export const MEDIA_SINGLE_MIN_PIXEL_WIDTH = 24;
export const MEDIA_SINGLE_SNAP_GAP = 3;
export const MEDIA_SINGLE_HIGHLIGHT_GAP = 10;
export const MEDIA_SINGLE_HANDLE_MARGIN = 12;
export const MEDIA_SINGLE_GUTTER_SIZE = MEDIA_SINGLE_HANDLE_MARGIN * 2;
export const DEFAULT_IMAGE_WIDTH = 250;
export const DEFAULT_IMAGE_HEIGHT = 200;

export enum Layout {
  FULL_WIDTH = 'full-width',
  WIDE = 'wide',
  CENTER = 'center',
  ALIGN_START = 'align-start',
  ALIGN_END = 'align-end',
  WRAP_RIGHT = 'wrap-right',
  WRAP_LEFT = 'wrap-left',
}

export const wrappedLayouts: RichMediaLayout[] = [
  'wrap-left',
  'wrap-right',
  'align-end',
  'align-start',
];

export const DEFAULT_ROUNDING_INTERVAL = 0.5;
