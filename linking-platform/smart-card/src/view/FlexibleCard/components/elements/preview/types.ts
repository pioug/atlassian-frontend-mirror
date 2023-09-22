import { ElementProps } from '../types';

export type PreviewProps = ElementProps & {
  /**
   * An image URL to render. This will replace the default image from smart link data.
   */
  overrideUrl?: string;

  /**
   * Function to be called on error loading media.
   * @internal
   */
  onError?: () => void;

  onLoad?: () => void;
};
