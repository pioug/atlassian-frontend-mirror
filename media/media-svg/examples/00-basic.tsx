import React from 'react';

import { MediaClientProvider } from '@atlaskit/media-client-react';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers';

import MediaSvg from '../src';

const mediaClientConfig = createStorybookMediaClientConfig();

const identifier = {
  mediaItemType: 'file' as const,
  id: 'd4fb1cef-d845-42d4-beca-7b185966f4d6',
  collectionName: 'MediaServicesSample',
};

const onError = (error: Error) => {
  console.log(error);
};

export default function () {
  return (
    <MediaClientProvider clientConfig={mediaClientConfig}>
      <MediaSvg
        testId="media-svg"
        identifier={identifier}
        dimensions={{ width: 600 }}
        onError={onError}
        alt={'This is a nice image'}
      />
    </MediaClientProvider>
  );
}
