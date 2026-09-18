import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';

import { default as Renderer } from '../src/ui/Renderer';
import Sidebar from './helper/NavigationNext';
import document from './helper/table-layout.adf.json';

const mediaProvider = storyMediaProviderFactory();
const providerFactory = ProviderFactory.create({ mediaProvider });

export default function Example(): React.JSX.Element {
	return (
		<Sidebar showSidebar={true}>
			{(additionalProps: object) => (
				<Renderer
					dataProviders={providerFactory}
					document={document as DocNode}
					{...additionalProps}
				/>
			)}
		</Sidebar>
	);
}
