import { BlockProps } from '../types';
import { MediaPlacement } from '../../../../../constants';

export type OnPreviewRenderOptions = {
  placement?: MediaPlacement;
};

export type PreviewBlockProps = {
  /**
   * Indicate whether preview block should ignore the padding its parent container.
   * Default is false.
   */
  ignoreContainerPadding?: boolean;

  /**
   * Function to be called on error loading media.
   * @internal
   */
  onError?: () => void;

  /**
   * The placement of the preview block in relation of its container.
   * This makes the preview block leave flex layout to absolute positioning
   * to the left/right of the container.
   */
  placement?: MediaPlacement;

  /**
   * An image URL to render. This will replace the default image from smart link data.
   */
  overrideUrl?: string;
} & BlockProps;
