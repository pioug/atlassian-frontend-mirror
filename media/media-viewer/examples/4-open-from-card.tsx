import React from 'react';
import { Card } from '@atlaskit/media-card';
import {
  externalImageIdentifier,
  externalSmallImageIdentifier,
  imageFileId,
  docFileId,
  animatedFileId,
  createStorybookMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import { MainWrapper } from '../example-helpers/MainWrapper';

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
  <MainWrapper shouldApplyStyles={false}>
    <h1>Datasource with current identifier</h1>
    <Card
      shouldOpenMediaViewer
      mediaClientConfig={mediaClientConfig}
      identifier={externalImageIdentifier}
      mediaViewerItems={listWithCurrentIdentifier}
    />
    <h1>Datasource without current identifier</h1>
    <Card
      shouldOpenMediaViewer
      mediaClientConfig={mediaClientConfig}
      identifier={externalImageIdentifier}
      mediaViewerItems={listWithoutCurrentIdentifier}
    />
  </MainWrapper>
);
