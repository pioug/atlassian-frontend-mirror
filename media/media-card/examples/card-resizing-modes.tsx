import React from 'react';
import {
  StoryList,
  createStorybookMediaClientConfig,
  smallImageFileId,
  wideImageFileId,
  largeImageFileId,
} from '@atlaskit/media-test-helpers';

import { Card } from '../src';

const mediaClientConfig = createStorybookMediaClientConfig();
const defaultCards = [
  {
    title: 'Small',
    content: (
      <Card
        identifier={smallImageFileId}
        mediaClientConfig={mediaClientConfig}
      />
    ),
  },
  {
    title: 'Wide',
    content: (
      <Card
        identifier={wideImageFileId}
        mediaClientConfig={mediaClientConfig}
      />
    ),
  },
  {
    title: 'Large',
    content: (
      <Card
        identifier={largeImageFileId}
        mediaClientConfig={mediaClientConfig}
      />
    ),
  },
];
const croppedCards = [
  {
    title: 'Small',
    content: (
      <Card
        identifier={smallImageFileId}
        mediaClientConfig={mediaClientConfig}
        resizeMode="crop"
      />
    ),
  },
  {
    title: 'Wide',
    content: (
      <Card
        identifier={wideImageFileId}
        mediaClientConfig={mediaClientConfig}
        resizeMode="crop"
      />
    ),
  },
  {
    title: 'Large',
    content: (
      <Card
        identifier={largeImageFileId}
        mediaClientConfig={mediaClientConfig}
        resizeMode="crop"
      />
    ),
  },
];
const fitCards = [
  {
    title: 'Small',
    content: (
      <Card
        identifier={smallImageFileId}
        mediaClientConfig={mediaClientConfig}
        resizeMode="fit"
      />
    ),
  },
  {
    title: 'Wide',
    content: (
      <Card
        identifier={wideImageFileId}
        mediaClientConfig={mediaClientConfig}
        resizeMode="fit"
      />
    ),
  },
  {
    title: 'Large',
    content: (
      <Card
        identifier={largeImageFileId}
        mediaClientConfig={mediaClientConfig}
        resizeMode="fit"
      />
    ),
  },
];
const fullFitCards = [
  {
    title: 'Small',
    content: (
      <Card
        identifier={smallImageFileId}
        mediaClientConfig={mediaClientConfig}
        resizeMode="full-fit"
      />
    ),
  },
  {
    title: 'Wide',
    content: (
      <Card
        identifier={wideImageFileId}
        mediaClientConfig={mediaClientConfig}
        resizeMode="full-fit"
      />
    ),
  },
  {
    title: 'Large',
    content: (
      <Card
        identifier={largeImageFileId}
        mediaClientConfig={mediaClientConfig}
        resizeMode="full-fit"
      />
    ),
  },
];

export default () => (
  <div>
    <h3>Default</h3>
    <StoryList>{defaultCards}</StoryList>
    <h3>Crop</h3>
    <StoryList>{croppedCards}</StoryList>
    <h3>Fit</h3>
    <StoryList>{fitCards}</StoryList>
    <h3>Full Fit</h3>
    <StoryList>{fullFitCards}</StoryList>
  </div>
);
