import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/media-layout.adf.json';
import type { DocNode } from '@atlaskit/adf-schema/schema';

const mediaProvider = storyMediaProviderFactory();
const providerFactory = ProviderFactory.create({ mediaProvider });

export default function Example(): React.JSX.Element {
	return (
		<Renderer
			dataProviders={providerFactory}
			document={document as DocNode}
			appearance="full-page"
		/>
	);
}
