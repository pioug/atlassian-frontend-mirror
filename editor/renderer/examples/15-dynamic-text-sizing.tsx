import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { default as Renderer } from '../src/ui/Renderer';
import { document } from './helper/story-data';

const mediaProvider = storyMediaProviderFactory();
const providerFactory = ProviderFactory.create({ mediaProvider });

export default function Example() {
  return (
    <Renderer
      dataProviders={providerFactory}
      appearance="full-page"
      allowDynamicTextSizing
      document={document}
    />
  );
}
