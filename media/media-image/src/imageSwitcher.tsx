import React from 'react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { MediaImageLoader } from './mediaImageLoader';
import { MediaImageWithMediaClientConfigProps } from './types';
import MediaImageV2WithErrorBoundary from './v2/mediaImageV2WithErrorBoundary';

function ImageSwitcher(props: MediaImageWithMediaClientConfigProps) {
  return getBooleanFF('platform.media-experience.imagev2_7n83d') ? (
    <MediaImageV2WithErrorBoundary {...props} />
  ) : (
    <MediaImageLoader {...props} />
  );
}

export default ImageSwitcher;
