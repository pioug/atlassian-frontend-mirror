import React from 'react';
import {
  createUploadMediaClient,
  genericFileId,
  audioFileId,
  gifFileId,
  docFileId,
} from '@atlaskit/media-test-helpers';
import { Filmstrip, FilmstripItem } from '../../src';

const defaultMediaClient = createUploadMediaClient();

const sampleFiles: FilmstripItem[] = [
  {
    identifier: genericFileId,
  },
  {
    identifier: audioFileId,
  },
  {
    identifier: gifFileId,
  },
  {
    identifier: docFileId,
  },
];

const Example = () => {
  return (
    <Filmstrip
      mediaClientConfig={defaultMediaClient && defaultMediaClient.config}
      items={sampleFiles}
    />
  );
};

export default () => <Example />;
