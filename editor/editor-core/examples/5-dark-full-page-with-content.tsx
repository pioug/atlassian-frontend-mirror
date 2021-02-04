import React from 'react';
import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import { default as FullPageExample, ExampleProps } from './5-full-page';
import { EditorProps } from './../src/editor';

export default function Example(props: EditorProps & ExampleProps) {
  const exampleDocument = useExampleDocument();

  return (
    <AtlaskitThemeProvider mode="dark">
      <FullPageExample defaultValue={exampleDocument} {...props} />
    </AtlaskitThemeProvider>
  );
}
