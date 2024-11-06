import React from 'react';

import { screen } from '@testing-library/react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { type CardState } from '@atlaskit/linking-common';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';

import MockAtlasProject from '../../../../../__fixtures__/atlas-project';
import { mockAnalytics } from '../../../../../utils/mocks';
import FlexibleResolvedView from '../FlexibleResolvedView';

import { mockConfluenceResponse } from './__mocks__/blockCardMocks';

describe('FlexibleResolvedView', () => {
	const url = 'https://some.url';

	const renderComponent = (props?: Partial<React.ComponentProps<typeof FlexibleResolvedView>>) =>
		renderWithIntl(
			<SmartCardProvider>
				<FlexibleResolvedView
					analytics={mockAnalytics}
					cardState={
						{
							status: 'resolved',
							details: mockConfluenceResponse,
						} as CardState
					}
					url={url}
					{...props}
				/>
			</SmartCardProvider>,
		);

	it('renders resolved view', async () => {
		renderComponent();

		const titleBlock = await screen.findByTestId('smart-block-title-resolved-view');
		const footerBlock = await screen.findByTestId('smart-footer-block-resolved-view');
		const snippetBlock = await screen.findByTestId('smart-block-snippet-resolved-view');
		const previewBlock = await screen.findByTestId('smart-block-preview-resolved-view');

		expect(titleBlock.textContent?.trim()).toBe('I love cheese');
		expect(snippetBlock.textContent).toBe('Here is your serving of cheese');
		expect(footerBlock.firstElementChild?.textContent?.trim()).toBe('Confluence');
		expect(footerBlock.children[1]?.textContent?.trim()).toBe('Open preview');
		expect(previewBlock).toBeDefined();
	});

	it('elements like Comments & reactions rendered in top block or bottom metadata block', async () => {
		renderComponent();
		const metadataElements = await screen.findAllByTestId('smart-block-metadata-resolved-view');

		const bottomMetadataElements = await screen.findAllByTestId('smart-element-badge');
		const reactCount = bottomMetadataElements[0];
		const commentCount = bottomMetadataElements[1];
		expect(metadataElements.length).toEqual(2);
		expect(metadataElements[1].children).toContain(reactCount.parentElement);
		expect(metadataElements[1].children).toContain(commentCount.parentElement);
	});

	it('renders server actions', async () => {
		renderComponent({
			cardState: {
				status: 'resolved',
				details: MockAtlasProject,
			} as CardState,
			actionOptions: { hide: false },
		});
		await screen.findByTestId('smart-footer-block-resolved-view');

		const followAction = await screen.findByTestId('smart-action-follow-action');
		expect(followAction).toBeInTheDocument();
		expect(followAction.textContent).toEqual('Follow');
	});
});
