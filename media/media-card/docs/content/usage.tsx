import React from 'react';
import { md, code, Example } from '@atlaskit/docs';

export default md`
  ${code`
  import { Card } from '@atlaskit/media-card';
  import { MediaClientConfig } from '@atlaskit/media-core';

  const mediaClientConfig = {
    authProvider,
  };

  // external url preview
  const urlPreviewId = {
    mediaItemType: 'external-image',
    dataURI: 'http://external-image-url',
  };

  <Card mediaClientConfig={mediaClientConfig} identifier={urlPreviewId} />;

  // stored file
  const fileId = {
    mediaItemType: 'file',
    id: 'some-file-id',
    collectionName: 'some-collection-name',
  };

  <Card mediaClientConfig={mediaClientConfig} identifier={fileId} />;
`}

${(
	<Example
		Component={require('./simple-usage-example').default}
		title="File Card"
		source={require('!!raw-loader!./simple-usage-example')}
	/>
)}
`;
