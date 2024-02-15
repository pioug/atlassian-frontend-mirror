import type { WithMediaClientConfigProps } from '@atlaskit/media-client-react';
import { MediaImageInternalProps } from './mediaImage';

export type MediaImageStatus = 'loading' | 'error' | 'processed' | 'succeeded';

export interface MediaImageState {
  /** Current status of the image to be loaded */
  status: MediaImageStatus;
  /** Image source. It will be added in case the request for the image returns with success or image preview is available */
  src?: string;
}

export interface MediaImageChildrenProps {
  /** Boolean with value to check if component is loading image source from API */
  loading: boolean;
  /** Boolean with value to check if there was an error during the image load from media API */
  error: boolean;
  /** Data structure with image data, if media API returned with success */
  data?: MediaImageState;
}

export type MediaImageWithMediaClientConfigProps =
  WithMediaClientConfigProps<MediaImageInternalProps>;
