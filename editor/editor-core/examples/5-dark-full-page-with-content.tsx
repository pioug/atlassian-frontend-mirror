import React from 'react';
import { default as FullPageExample, ExampleProps } from './5-full-page';
import { exampleDocument } from '../example-helpers/example-document';
import { EditorProps } from './../src/editor';
import { AtlaskitThemeProvider } from '@atlaskit/theme';

export default function Example(props: EditorProps & ExampleProps) {
  return (
    <AtlaskitThemeProvider mode={'dark'}>
      <FullPageExample defaultValue={exampleDocument} {...props} />
    </AtlaskitThemeProvider>
  );
}
