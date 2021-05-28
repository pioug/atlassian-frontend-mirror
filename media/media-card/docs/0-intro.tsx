import React from 'react';
import {
  md,
  code,
  Example,
  Props,
  AtlassianInternalWarning,
} from '@atlaskit/docs';
import { createRxjsNotice } from '@atlaskit/media-common/docs';

export default md`
${(<AtlassianInternalWarning />)}

${createRxjsNotice('Media Card')}

This component provides 2 exports:

  1.  Card
  2.  CardView

  ### Note:

  Don't forget to add polyfills for fetch, ES6 & ES7 to your product build if you want to target older browsers.
  We recommend the use of [babel-preset-env](https://babeljs.io/docs/plugins/preset-env/) & [babel-polyfill](https://babeljs.io/docs/usage/polyfill/)

  ## Usage
  ### Card

  ${code`
  import { Card } from '@atlaskit/media-card';
  import { MediaClientConfig } from '@atlaskit/media-core';

  const mediaClientConfig = {
    authProvider,
  };

  // url preview
  const urlPreviewId = {
    mediaItemType: 'link',
    url: 'https://atlassian.com',
  };

  <Card mediaClientConfig={mediaClientConfig} identifier={urlPreviewId} />;

  // stored link
  const linkId = {
    mediaItemType: 'link',
    id: 'some-link-id',
    collectionName: 'some-collection-name',
  };

  <Card mediaClientConfig={mediaClientConfig} identifier={linkId} />;

  // stored file
  const fileId = {
    mediaItemType: 'file',
    id: 'some-file-id',
    collectionName: 'some-collection-name',
  };

  <Card mediaClientConfig={mediaClientConfig} identifier={fileId} />;
`}

### Card View

${code`
import { CardView } from @atlaskit/media-card;
const resizeModes: Array<ImageResizeMode> = ['crop', 'fit', 'full-fit'];

export const createCardsOfDifferentResizeModes = () => {
  return resizeModes.map(mode => {
    const content = images.map(img => (
      <CardView
        appearance="image"
        status="complete"
        mediaItemType="file"
        resizeMode={mode}
        dataURI={img}
      />
    ));

    return {
      title: mode,
      content,
    };
  });
};
`}

${(
  <Example
    Component={require('../examples/0-file-card-flow').default}
    title="File Card"
    source={require('!!raw-loader!../examples/0-file-card-flow')}
  />
)}

${(
  <Props
    heading="Properties"
    props={require('!!extract-react-types-loader!../src/root/card')}
  />
)}

`;
