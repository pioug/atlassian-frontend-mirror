import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import CardClient from '@atlaskit/link-provider/client';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';

import { createRendererWindowBindings } from './helper/testing-setup';
import { RendererWithAnnotationsAndBodiedExtensions } from './reference-renderer-annotation-provider/RendererWithAnnotationsAndBodiedExtensions';

export default function Example(): React.JSX.Element {
	createRendererWindowBindings(window);
	return (
		<div id="renderer-container">
			<SmartCardProvider client={new CardClient('stg')}>
				<RendererWithAnnotationsAndBodiedExtensions
					initialDoc={exampleDocumentWithComments as DocNode}
					initialData={{}}
				/>
			</SmartCardProvider>
		</div>
	);
}

const exampleDocumentWithComments = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [{ type: 'text', text: 'Top level content ' }],
		},
		{
			type: 'bodiedExtension',
			attrs: {
				extensionKey: 'bodied-eh',
				extensionType: 'com.atlassian.confluence.macro.core',
				parameters: {},
				layout: 'default',
				localId: 'testId',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'nested bodied extension content. nested bodied extension content. nested bodied extension content.',
						},
					],
				},
			],
		},
	],
};
