import React, { useState } from 'react';
import { MediaTable, MediaTableItem } from '../src';
import {
  createUploadMediaClientConfig,
  audioNoCoverFileId,
  largeImageFileId,
  smallImageFileId,
  imageFileId,
  audioFileId,
  docFileId,
  gifFileId,
  videoProcessingFailedId,
} from '@atlaskit/media-test-helpers';
import FieldRange from '@atlaskit/field-range';
import { ExampleWrapper } from '../example-helpers/styled';

const items: MediaTableItem[] = [
  {
    identifier: imageFileId,
  },
  {
    identifier: imageFileId,
  },
  {
    identifier: audioFileId,
  },
  {
    identifier: videoProcessingFailedId,
  },
  {
    identifier: docFileId,
  },
  {
    identifier: gifFileId,
  },
  {
    identifier: audioNoCoverFileId,
  },
  {
    identifier: largeImageFileId,
  },
  {
    identifier: smallImageFileId,
  },
];
const mediaClientConfig = createUploadMediaClientConfig();

export default () => {
  const [width, setWidth] = useState(1000);

  return (
    <ExampleWrapper>
      <div>
        Parent width: {width}px
        <FieldRange
          value={width}
          min={0}
          max={1500}
          step={5}
          onChange={setWidth}
        />
      </div>
      <div style={{ width: `${width}px` }}>
        <MediaTable items={items} mediaClientConfig={mediaClientConfig} />
      </div>
    </ExampleWrapper>
  );
};
