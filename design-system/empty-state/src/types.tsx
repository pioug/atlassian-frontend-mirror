export interface RenderImageProps {
  maxImageWidth?: number;
  maxImageHeight?: number;
  imageWidth?: number;
  imageHeight?: number;
}

export type Sizes = 'narrow' | 'wide';
export type Width = Sizes;

export type { EmptyStateProps } from './empty-state';
