import React from 'react';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import type { CardState } from '@atlaskit/linking-common/store';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';
import { within } from '@atlassian/testing-library/within';

import MockAtlasProject from '../../../../__fixtures__/atlas-project';
import { ANALYTICS_CHANNEL } from '../../../../utils/analytics/analytics';
import ResolvedView from '../ResolvedView';
import { mockConfluenceResponse } from './__mocks__/blockCardMocks';

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
			onEvent = jest.fn(),
		) =>
			renderWithIntl(
				<AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={onEvent}>
					<SmartCardProvider
						plugins={{ resolve: () => ({ remix: { isAvailable: () => true, open: jest.fn() } }) }}
						product="CONFLUENCE"
						rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
					>
						<ResolvedView
							cardState={{ status: 'resolved', details: googleSheetsResponse } as CardState}
							id="block-card-id"
							url={url}
							actionOptions={actionOptions}
						/>
					</SmartCardProvider>
				</AnalyticsListener>,
			);

		it('renders Remix independently when Rovo chat is not opted in', async () => {
			passGate('platform_sl_3p_auth_visualize_killswitch');
			mockExpEnabled('platform_sl_3p_auth_visualize_exp');
			renderGoogleSheet({
				hide: false,
				remixAction: { optIn: true },
				rovoChatAction: { optIn: false },
			});
			expect(await screen.findByRole('button', { name: 'Remix' })).toBeInTheDocument();
			expect(screen.queryByTestId('smart-action-rovo-chat-action-1')).not.toBeInTheDocument();
		});

		it('includes the block card ID in Remix click analytics', async () => {
			passGate('platform_sl_3p_auth_visualize_killswitch');
			mockExpEnabled('platform_sl_3p_auth_visualize_exp');
			const onEvent = jest.fn();
			renderGoogleSheet({ hide: false, remixAction: { optIn: true } }, onEvent);

			await userEvent.setup().click(await screen.findByRole('button', { name: 'Remix' }));
			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: expect.objectContaining({
						eventType: 'ui',
						action: 'clicked',
						actionSubject: 'button',
						actionSubjectId: 'remix',
						attributes: expect.objectContaining({ id: 'block-card-id', display: 'block' }),
					}),
				}),
				ANALYTICS_CHANNEL,
			);
		});

		it('does not include Remix as a Rovo chat prompt', async () => {
			renderGoogleSheet({ hide: false, rovoChatAction: { optIn: true } });
			await screen.findByTestId('smart-footer-block-resolved-view');

			expect(screen.queryByText('Remix')).not.toBeInTheDocument();
		});
	});
});
