import React from 'react';
import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import Example from './24-arch-next-mobile';

export default function DarkExample() {
  const exampleDocument = useExampleDocument();

  return (
    <AtlaskitThemeProvider mode="dark">
      <Example defaultValue={exampleDocument} />
    </AtlaskitThemeProvider>
  );
}
