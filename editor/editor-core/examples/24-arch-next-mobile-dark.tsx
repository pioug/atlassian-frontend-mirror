import React from 'react';
import { AtlaskitThemeProvider } from '@atlaskit/theme';
import { exampleDocument } from '../example-helpers/example-document';
import Example from './24-arch-next-mobile';

export default function DarkExample() {
  return (
    <AtlaskitThemeProvider mode="dark">
      <Example defaultValue={exampleDocument} />
    </AtlaskitThemeProvider>
  );
}
