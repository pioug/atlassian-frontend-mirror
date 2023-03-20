import React, { useState } from 'react';
import {
  createStorybookMediaClientConfig,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { Card } from '@atlaskit/media-card';
import { Identifier } from '@atlaskit/media-client';
import { imageItem } from '../example-helpers';
import { MediaViewer } from '../src';

const mediaClientConfig = createStorybookMediaClientConfig();

const Example = () => {
  const [selectedIdentifier, setSelectedIdentifier] = useState<
    Identifier | undefined
  >();

  return (
    <>
      <Card
        identifier={imageItem}
        mediaClientConfig={mediaClientConfig}
        onClick={() => setSelectedIdentifier(imageItem)}
      />
      {selectedIdentifier && (
        <MediaViewer
          mediaClientConfig={mediaClientConfig}
          selectedItem={selectedIdentifier}
          items={[selectedIdentifier]}
          collectionName={defaultCollectionName}
          onClose={() => setSelectedIdentifier(undefined)}
        />
      )}
    </>
  );
};

export default Example;
