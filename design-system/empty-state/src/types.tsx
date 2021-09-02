import type { ReactNode } from 'react';

export interface RenderImageProps {
  maxImageWidth?: number;
  maxImageHeight?: number;
  imageWidth?: number;
  imageHeight?: number;
}

export type Sizes = 'narrow' | 'wide';
export type Width = Sizes;

export interface EmptyStateProps {
  /**
   * Title that briefly describes the page to the user.
   */
  header: string;
  /**
   * The main block of text that holds additional supporting information.
   */
  description?: ReactNode;
  /**
   * Controls how much horizontal space the component fills. Defaults to "wide".
   */
  width?: Width;
  /**
   * @deprecated
   * Duplicates the `width` prop. Use `width instead`.
   */
  size?: Width;
  /**
   * The url of image that will be shown above the title, fed directly into the `src` prop of an <img> element.
   * Note, this image will be constrained by the `maxWidth` and `maxHeight` props.
   */
  imageUrl?: string;
  /**
   * Maximum width (in pixels) of the image, default value is 160.
   */
  maxImageWidth?: number;
  /**
   * Maximum height (in pixels) of the image, default value is 160.
   */
  maxImageHeight?: number;
  /**
   * Primary action button for the page, usually it will be something like "Create" (or "Retry" for error pages).
   */
  primaryAction?: ReactNode;
  /**
   * An alternative API to supply an image using a render prop. Only rendered if no `imageUrl` is supplied.
   */
  renderImage?: (props: RenderImageProps) => React.ReactNode;
  /**
   * Secondary action button for the page.
   */
  secondaryAction?: ReactNode;
  /**
   * Button with link to some external resource like documentation or tutorial, it will be opened in a new tab.
   */
  tertiaryAction?: ReactNode;
  /**
   * A hook for automated testing
   */
  testId?: string;
  /**
   * Used to indicate a loading state. Will show a spinner next to the action buttons when true.
   */
  isLoading?: boolean;
  /**
   * Width of the image that is rendered in EmptyState component.
   * Useful when you want image to be of exact width to stop it bouncing around when loading in.
   */
  imageWidth?: number;
  /**
   * Height of the image that is rendered in EmptyState component.
   * Useful when you want image to be of exact height to stop it bouncing around when loading in.
   * Only set `height` if you want the image to resize down on smaller devices.
   */
  imageHeight?: number;
}
