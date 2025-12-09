import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';
import type { MentionProvider } from '@atlaskit/mention/types';
import type { DocNode } from '@atlaskit/adf-schema';
import ProfileCardClient from '@atlaskit/profilecard/client';
import { getMockProfileClient } from '@atlaskit/profilecard/mocks';
import { IntlProvider } from 'react-intl-next';

import Renderer from '../../ui/Renderer';

const mentionProvider = Promise.resolve({
	shouldHighlightMention(mention: { id: string }) {
		return mention.id === 'ABCDE-ABCDE-ABCDE-ABCDE';
	},
} as MentionProvider);

const mockProfileClient = getMockProfileClient(ProfileCardClient, 0);

const mockProfilecardProvider = Promise.resolve({
	cloudId: 'test-cloud-id',
	resourceClient: mockProfileClient,
	getActions: () => [],
});

const providerFactory = ProviderFactory.create({
	mentionProvider,
	profilecardProvider: mockProfilecardProvider,
});

const adfMention: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Hi, my name is... My name is... My name is... My name is ',
				},
				{
					type: 'mention',
					attrs: {
						id: '1',
						text: '@Oscar Wallhult',
					},
				},
			],
		},
	],
};

export function RendererMention(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<MockMediaClientProvider>
				<Renderer
					adfStage={'stage0'}
					document={adfMention}
					appearance={'full-page'}
					dataProviders={providerFactory}
					media={{
						allowLinking: true,
					}}
					allowColumnSorting={true}
				/>
			</MockMediaClientProvider>
		</IntlProvider>
	);
}
