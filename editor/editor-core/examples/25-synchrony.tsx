import React from 'react';

import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';

import { default as FullPageExample } from './5-full-page';

export default function Example() {
  const defaultValue = useExampleDocument();
  const collabEditProvider = createCollabEditProvider(undefined, {
    autoConnect: true,
  });

  return (
    <FullPageExample
      editorProps={{
        defaultValue,
        collabEditProvider,
      }}
    />
  );
}
