import React from 'react';
import {
  StoryList,
  wideImage,
  defaultBaseUrl,
  generateFilesFromTestData,
  MediaMock,
  defaultCollectionName,
  MockFileInputParams,
} from '@atlaskit/media-test-helpers';
import { FileIdentifier } from '@atlaskit/media-client';

import { Card } from '../src';
import { MediaClientConfig } from '@atlaskit/media-core';

const identifiers = [1, 2, 3, 4].map(
  (id: number): FileIdentifier => ({
    id: `1f35526d-0299-4e1c-be10-36af3c209ab${id}`,
    collectionName: defaultCollectionName,
    mediaItemType: 'file',
  }),
);
const files = generateFilesFromTestData(
  identifiers.slice(0, 3).map(
    ({ id }: FileIdentifier): MockFileInputParams => ({
      id: id as string,
      name: `media-test-file-${id}.png`,
      dataUri: wideImage,
    }),
  ),
);
const loadingFiles = generateFilesFromTestData([
  {
    id: identifiers[3].id as string,
    name: `media-test-file-${identifiers[3].id}.png`,
    dataUri: wideImage,
    processingStatus: 'pending',
  },
]);

const mediaMock = new MediaMock({
  [defaultCollectionName]: files.concat(...loadingFiles),
});
mediaMock.enable();

const mediaClientConfig: MediaClientConfig = {
  authProvider: () =>
    Promise.resolve({
      clientId: '',
      token: '',
      baseUrl: defaultBaseUrl,
    }),
};

// standard
const standardCards = [
  {
    title: 'Image',
    content: (
      <div data-testid="media-card-standard">
        <Card
          identifier={identifiers[0]}
          mediaClientConfig={mediaClientConfig}
          appearance="image"
        />
      </div>
    ),
  },
];
const cardWithContextId = [
  {
    title: 'Image with parameter',
    content: (
      <div data-testid="media-card-with-context-id">
        <Card
          identifier={identifiers[1]}
          mediaClientConfig={mediaClientConfig}
          appearance="image"
          contextId="some-id"
        />
      </div>
    ),
  },
];
const standardCardWithMediaViewer = [
  {
    title: 'Image with media viewer integration',
    content: (
      <div data-testid="media-card-standard-with-media-viewer">
        <Card
          identifier={identifiers[2]}
          mediaClientConfig={mediaClientConfig}
          appearance="image"
          shouldOpenMediaViewer
          mediaViewerDataSource={identifiers[2]}
        />
      </div>
    ),
  },
];
const loadingCard = [
  {
    title: 'Image with media viewer integration',
    content: (
      <div data-testid="media-card-loading-card">
        <Card
          identifier={identifiers[3]}
          mediaClientConfig={mediaClientConfig}
          appearance="image"
        />
      </div>
    ),
  },
];

export default () => (
  <div>
    <h1 style={{ margin: '10px 20px' }}>File cards</h1>
    <div style={{ margin: '20px 40px' }}>
      <h3>Standard</h3>
      <StoryList>{standardCards}</StoryList>
      <StoryList>{cardWithContextId}</StoryList>
      <StoryList>{standardCardWithMediaViewer}</StoryList>
      <StoryList>{loadingCard}</StoryList>
    </div>
  </div>
);
