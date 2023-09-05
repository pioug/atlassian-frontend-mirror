import CardV2Loader from '../src/card/v2/cardV2Loader';
import React from 'react';
import { MediaClientContext } from '@atlaskit/media-client-react';
import {
  createMediaClient,
  fileMap,
} from '../src/card/v2/__tests__/utils/_createMediaClient';
import { MediaClientConfig } from '@atlaskit/media-client';
import { MainWrapper } from '../example-helpers';

const dummyMediaClientConfig = {} as MediaClientConfig;

const mediaClient = createMediaClient();
const identifier = {
  mediaItemType: 'file',
  id: fileMap.workingVideo.id,
  collectionName: fileMap.workingVideo.collection,
} as const;

export default () => (
  <MainWrapper developmentOnly>
    <MediaClientContext.Provider value={mediaClient}>
      <CardV2Loader
        mediaClientConfig={dummyMediaClientConfig}
        identifier={identifier}
        isLazy={false}
        shouldOpenMediaViewer
        useInlinePlayer
      />
    </MediaClientContext.Provider>
  </MainWrapper>
);
