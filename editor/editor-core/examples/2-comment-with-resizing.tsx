import React from 'react';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';

import { exampleDocument } from '../example-helpers/grid-document';
import CommentExample from './2-comment';

const mediaProvider = storyMediaProviderFactory();

const smartCardClient = new ConfluenceCardClient('stg');
const cardProvider = Promise.resolve(new ConfluenceCardProvider('stg'));

export default function CommentWithResizingExample() {
  return (
    <SmartCardProvider client={smartCardClient}>
      <CommentExample
        replacementDoc={exampleDocument}
        editorProps={{
          defaultValue: exampleDocument,
          appearance: 'chromeless',
          media: {
            provider: mediaProvider,
            allowMediaSingle: true,
            allowResizing: true,
            allowLinking: true,
          },
          allowLayouts: true,
          smartLinks: {
            provider: cardProvider,
            allowBlockCards: true,
            allowEmbeds: true,
          },
        }}
      />
    </SmartCardProvider>
  );
}
