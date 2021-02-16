import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/table-layout.adf.json';

import Sidebar from './helper/NavigationNext';

const mediaProvider = storyMediaProviderFactory();
const providerFactory = ProviderFactory.create({ mediaProvider });

export default function Example() {
  return (
    <Sidebar showSidebar={true}>
      {(additionalProps: object) => (
        <Renderer
          dataProviders={providerFactory}
          document={document}
          {...additionalProps}
        />
      )}
    </Sidebar>
  );
}
