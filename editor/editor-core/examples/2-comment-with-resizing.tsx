import React from 'react';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { exampleDocument } from '../example-helpers/grid-document';
import CommentExample from './2-comment';

const mediaProvider = storyMediaProviderFactory({
  includeUserAuthProvider: false,
});

export default function CommentWithResizingExample() {
  return (
    <CommentExample
      replacementDoc={exampleDocument}
      editorProps={{
        defaultValue: exampleDocument,
        media: {
          provider: mediaProvider,
          allowMediaSingle: true,
          allowResizing: true,
        },
        allowLayouts: true,
      }}
    />
  );
}
