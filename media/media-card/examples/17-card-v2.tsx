import CardV2Loader from '../src/card/v2/cardV2Loader';
import React from 'react';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import {
  createMockedMediaApi,
  fileMap,
} from '../src/card/v2/__tests__/utils/_createMediaClient';
import { MediaClientConfig } from '@atlaskit/media-client';
import { MainWrapper } from '../example-helpers';

const dummyMediaClientConfig = {} as MediaClientConfig;

const mockedMediaApi = createMockedMediaApi();
const identifier = {
  mediaItemType: 'file',
  id: fileMap.workingVideo.id,
  collectionName: fileMap.workingVideo.collection,
} as const;

export default () => (
  <MainWrapper developmentOnly>
    <MockedMediaClientProvider mockedMediaApi={mockedMediaApi}>
      <CardV2Loader
        mediaClientConfig={dummyMediaClientConfig}
        identifier={identifier}
        isLazy={false}
        shouldOpenMediaViewer
        useInlinePlayer
      />
    </MockedMediaClientProvider>
  </MainWrapper>
);
