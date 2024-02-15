import React, { useContext } from 'react';
import {
  MediaClientContext,
  MediaClientProvider,
} from '@atlaskit/media-client-react';
import type { MediaImageWithMediaClientConfigProps } from '../types';
import { MediaImageV2Base } from './mediaImageV2Base';

const MediaImageWithMediaClient = ({
  mediaClientConfig,
  ...otherProps
}: MediaImageWithMediaClientConfigProps) => {
  const mediaClientContext = useContext(MediaClientContext);

  if (mediaClientContext) {
    return <MediaImageV2Base {...otherProps} />;
  }

  return (
    <MediaClientProvider clientConfig={mediaClientConfig}>
      <MediaImageV2Base {...otherProps} />
    </MediaClientProvider>
  );
};

export default MediaImageWithMediaClient;
