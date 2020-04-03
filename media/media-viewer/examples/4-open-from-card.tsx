import React from 'react';
import { Card } from '@atlaskit/media-card';
import {
  externalImageIdentifier,
  externalSmallImageIdentifier,
  imageFileId,
  docFileId,
  animatedFileId,
  defaultCollectionName,
  createStorybookMediaClientConfig,
} from '@atlaskit/media-test-helpers';

const mediaClientConfig = createStorybookMediaClientConfig();
const defaultList = [
  animatedFileId,
  imageFileId,
  externalSmallImageIdentifier,
  docFileId,
];
const listWithCurrentIdentifier = [externalImageIdentifier, ...defaultList];
const listWithoutCurrentIdentifier = [...defaultList];

export default () => (
  <div>
    <h1>Datasource with current identifier</h1>
    <Card
      shouldOpenMediaViewer
      mediaClientConfig={mediaClientConfig}
      identifier={externalImageIdentifier}
      mediaViewerDataSource={{ list: listWithCurrentIdentifier }}
    />
    <h1>Datasource without current identifier</h1>
    <Card
      shouldOpenMediaViewer
      mediaClientConfig={mediaClientConfig}
      identifier={externalImageIdentifier}
      mediaViewerDataSource={{ list: listWithoutCurrentIdentifier }}
    />
    <h1>With collection data source</h1>
    <Card
      shouldOpenMediaViewer
      mediaClientConfig={mediaClientConfig}
      identifier={externalImageIdentifier}
      mediaViewerDataSource={{ collectionName: defaultCollectionName }}
    />
  </div>
);
