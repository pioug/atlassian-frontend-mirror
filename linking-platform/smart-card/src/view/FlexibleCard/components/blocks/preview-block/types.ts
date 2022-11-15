import { BlockProps } from '../types';

export type PreviewBlockProps = {
  /**
   * Function to be called on error loading media.
   * @internal
   */
  onError?: () => void;
} & BlockProps;
