import React from 'react';
import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';
import { ThemeProvider as StyledThemeProvider } from '@emotion/react';
import DeprecatedThemeProvider from '@atlaskit/theme/deprecated-provider-please-do-not-use';
import { default as FullPageExample } from './5-full-page';

export default function Example() {
  const exampleDocument = useExampleDocument();

  return (
    <DeprecatedThemeProvider mode="dark" provider={StyledThemeProvider}>
      <FullPageExample editorProps={{ defaultValue: exampleDocument }} />
    </DeprecatedThemeProvider>
  );
}
