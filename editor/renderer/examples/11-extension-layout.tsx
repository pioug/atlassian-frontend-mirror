import React from 'react';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/extension-layout.adf.json';

const mediaProvider = storyMediaProviderFactory();
const providerFactory = ProviderFactory.create({ mediaProvider });

export default function Example() {
	return <Renderer dataProviders={providerFactory} document={document} appearance="full-page" />;
}
