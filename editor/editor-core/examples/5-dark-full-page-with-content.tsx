import React from 'react';
import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import DeprecatedThemeProvider from '@atlaskit/theme/deprecated-provider-please-do-not-use';
import { default as FullPageExample, ExampleProps } from './5-full-page';
import { EditorProps } from './../src/editor';

export default function Example(props: EditorProps & ExampleProps) {
  const exampleDocument = useExampleDocument();

  return (
    <DeprecatedThemeProvider mode="dark" provider={StyledThemeProvider}>
      <FullPageExample defaultValue={exampleDocument} {...props} />
    </DeprecatedThemeProvider>
  );
}
