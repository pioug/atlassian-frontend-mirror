import React from 'react';
import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import DeprecatedThemeProvider from '@atlaskit/theme/deprecated-provider-please-do-not-use';
import Example from './24-arch-next-mobile';

export default function DarkExample() {
  const exampleDocument = useExampleDocument();

  return (
    <DeprecatedThemeProvider mode="dark" provider={StyledThemeProvider}>
      <Example defaultValue={exampleDocument} />
    </DeprecatedThemeProvider>
  );
}
