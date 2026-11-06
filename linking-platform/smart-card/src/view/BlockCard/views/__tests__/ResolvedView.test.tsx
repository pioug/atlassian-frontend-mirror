import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import type { CardState } from '@atlaskit/linking-common/store';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { screen } from '@atlassian/testing-library/screen';
import { within } from '@atlassian/testing-library/within';

import MockAtlasProject from '../../../../__fixtures__/atlas-project';
import { isRovoChatActionVisualizeEnabled } from '../../../../utils/is-rovo-chat-action-visualize-enabled';
import ResolvedView from '../ResolvedView';
import { mockConfluenceResponse } from './__mocks__/blockCardMocks';

jest.mock('../../../../utils/is-rovo-chat-action-visualize-enabled', () => {
	const actual = jest.requireActual('../../../../utils/is-rovo-chat-action-visualize-enabled');
	return {
		isRovoChatActionVisualizeEnabled: jest.fn(actual.isRovoChatActionVisualizeEnabled),
	};
});

const mockIsRovoChatActionVisualizeEnabled = jest.mocked(isRovoChatActionVisualizeEnabled);

describe('ResolvedView', () => {
	const url = 'https://some.url';

	const renderComponent = (props?: Partial<React.ComponentProps<typeof ResolvedView>>) =>
		renderWithIntl(
			<SmartCardProvider>
				<ResolvedView
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

		expect(titleBlock).toHaveTextContent('I love cheese');
		expect(snippetBlock).toHaveTextContent('Here is your serving of cheese');
		expect(footerBlock.firstElementChild).toHaveTextContent('Confluence');
		expect(await within(footerBlock).findByRole('button')).toHaveTextContent('Open preview');
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
		expect(followAction).toHaveTextContent('Follow');
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(
			<SmartCardProvider>
				<ResolvedView
					cardState={
						{
							status: 'resolved',
							details: mockConfluenceResponse,
						} as CardState
					}
					url={url}
				/>
			</SmartCardProvider>,
		);
		await expect(container).toBeAccessible();
	});

	describe('Rovo chat action prompts', () => {
		const googleSheetsResponse = {
			...mockConfluenceResponse,
			meta: { ...mockConfluenceResponse.meta, key: 'google-object-provider' },
			data: {
				...mockConfluenceResponse.data,
				'@type': ['Document', 'schema:SpreadsheetDigitalDocument'],
			},
		} as typeof mockConfluenceResponse;

		const renderGoogleSheet = (
			actionOptions: React.ComponentProps<typeof ResolvedView>['actionOptions'],
		) =>
			renderWithIntl(
				<SmartCardProvider
					product="CONFLUENCE"
					rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
				>
					<ResolvedView
						cardState={{ status: 'resolved', details: googleSheetsResponse } as CardState}
						url={url}
						actionOptions={actionOptions}
					/>
				</SmartCardProvider>,
			);

		beforeEach(() => {
			mockIsRovoChatActionVisualizeEnabled.mockClear();
		});

		it('evaluates visualize when Rovo chat action is shown', async () => {
			renderGoogleSheet({ hide: false, rovoChatAction: { optIn: true } });
			await screen.findByTestId('smart-footer-block-resolved-view');

			expect(mockIsRovoChatActionVisualizeEnabled).toHaveBeenCalledWith(
				expect.objectContaining({
					extensionKey: 'google-object-provider',
					product: 'CONFLUENCE',
				}),
			);
		});
	});
});
