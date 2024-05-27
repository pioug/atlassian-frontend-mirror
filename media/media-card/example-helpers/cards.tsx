import React from 'react';

import {
  createStorybookMediaClientConfig,
  imageFileId,
  unknownFileId,
  errorFileId,
  videoFileId,
  audioFileId,
  docFileId,
  smallImageFileId,
  wideImageFileId,
  largeImageFileId,
} from '@atlaskit/media-test-helpers';
import { type FileIdentifier } from '@atlaskit/media-client';

import { createApiCards, actions } from '.';
import { CardLoading, CardError, Card } from '../src';

const mediaClientConfig = createStorybookMediaClientConfig();
// standard
const successIdentifier: FileIdentifier = imageFileId;
export const standardCards = [
  {
    title: 'Image',
    content: (
      <Card
        identifier={successIdentifier}
        mediaClientConfig={mediaClientConfig}
        appearance="image"
      />
    ),
  },
];

export const cardWithContextId = [
  {
    title: 'Image with parameter',
    content: (
      <Card
        identifier={successIdentifier}
        mediaClientConfig={mediaClientConfig}
        appearance="image"
        contextId="some-id"
      />
    ),
  },
];

//error cards
export const errorCardsDark = [
  {
    title: 'Image',
    content: (
      <Card
        identifier={errorFileId}
        mediaClientConfig={mediaClientConfig}
        appearance="image"
      />
    ),
  },
];

export const errorCards = [
  {
    title: 'Image',
    content: (
      <Card
        identifier={errorFileId}
        mediaClientConfig={mediaClientConfig}
        appearance="image"
      />
    ),
  },
  {
    title: 'Image with alt text',
    content: (
      <Card
        identifier={errorFileId}
        mediaClientConfig={mediaClientConfig}
        alt="When an image fails to load, you will see the alt text value here (if present)"
        appearance="image"
      />
    ),
  },
];

export const menuCards = [
  {
    title: 'Image',
    content: (
      <Card
        identifier={successIdentifier}
        mediaClientConfig={mediaClientConfig}
        appearance="image"
        actions={actions}
      />
    ),
  },
];

// api cards
export const apiCards = createApiCards('image', successIdentifier);

// no thumbnail
export const noThumbnailCards = [
  {
    title: 'Image',
    content: (
      <Card
        identifier={unknownFileId}
        mediaClientConfig={mediaClientConfig}
        appearance="image"
      />
    ),
  },
];

// lazy load
export const lazyLoadCards = [
  {
    title: 'Lazy',
    content: (
      <Card
        isLazy={true}
        identifier={successIdentifier}
        mediaClientConfig={mediaClientConfig}
        appearance="image"
      />
    ),
  },
  {
    title: 'No lazy',
    content: (
      <Card
        isLazy={false}
        identifier={successIdentifier}
        mediaClientConfig={mediaClientConfig}
        appearance="image"
      />
    ),
  },
];

// no hover state cards
export const noHoverStateCards = [
  {
    title: 'Overlay disabled',
    content: (
      <Card
        identifier={successIdentifier}
        mediaClientConfig={mediaClientConfig}
        appearance="image"
        disableOverlay={true}
      />
    ),
  },
  {
    title: 'Selected',
    content: (
      <Card
        identifier={successIdentifier}
        mediaClientConfig={mediaClientConfig}
        appearance="image"
        disableOverlay={true}
        selectable={true}
        selected={true}
      />
    ),
  },
];

// collection and no collection configuration of files
export const fileWithNoCollection: FileIdentifier = {
  mediaItemType: 'file',
  id: 'e84c54a4-38b2-463f-ae27-5ba043c3e4c2',
};

export const collectionConfigCards = [
  {
    title: 'Standalone file (NO collection)',
    content: (
      <Card
        identifier={fileWithNoCollection}
        mediaClientConfig={mediaClientConfig}
      />
    ),
  },
  {
    title: 'File within collection',
    content: (
      <Card
        identifier={successIdentifier}
        mediaClientConfig={mediaClientConfig}
      />
    ),
  },
];

const divStyle = {
  width: '100px',
  height: '100px',
};
const dimensions = { height: 50, width: 50 };

export const lightDefaultCards = [
  {
    title: 'Medium Loading',
    content: (
      <div style={divStyle}>
        <CardLoading />
      </div>
    ),
  },
  {
    title: 'Medium Error',
    content: (
      <div style={divStyle}>
        <CardError />
      </div>
    ),
  },
];

export const lightResizedCards = [
  {
    title: 'Medium Loading',
    content: <CardLoading dimensions={dimensions} />,
  },
  {
    title: 'Medium Error',
    content: <CardError dimensions={dimensions} />,
  },
];

// file cards
export const videoFileCard = (
  <Card mediaClientConfig={mediaClientConfig} identifier={videoFileId} />
);

export const imageFileCard = (
  <Card mediaClientConfig={mediaClientConfig} identifier={imageFileId} />
);

export const audioFileCard = (
  <Card mediaClientConfig={mediaClientConfig} identifier={audioFileId} />
);

export const docFileCard = (
  <Card mediaClientConfig={mediaClientConfig} identifier={docFileId} />
);

export const unknownFileCard = (
  <Card mediaClientConfig={mediaClientConfig} identifier={unknownFileId} />
);

export const resizingDefaultCards = [
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

export const croppedCards = [
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

export const fitCards = [
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

export const fullFitCards = [
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

export const stretchyFitCards = [
  {
    title: 'Small',
    content: (
      <Card
        identifier={smallImageFileId}
        mediaClientConfig={mediaClientConfig}
        resizeMode="stretchy-fit"
      />
    ),
  },
  {
    title: 'Wide',
    content: (
      <Card
        identifier={wideImageFileId}
        mediaClientConfig={mediaClientConfig}
        resizeMode="stretchy-fit"
      />
    ),
  },
  {
    title: 'Large',
    content: (
      <Card
        identifier={largeImageFileId}
        mediaClientConfig={mediaClientConfig}
        resizeMode="stretchy-fit"
      />
    ),
  },
];
