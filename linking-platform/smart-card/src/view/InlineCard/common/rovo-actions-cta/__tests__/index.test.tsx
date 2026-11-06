import React from 'react';

import { IntlProvider } from 'react-intl';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import mockState from '../../../../../__fixtures__/document-entity';
import { isRovoChatActionVisualizeEnabled } from '../../../../../utils/is-rovo-chat-action-visualize-enabled';
import { InlineRovoActionButton } from '../index';

jest.mock('../../../../../utils/is-rovo-chat-action-visualize-enabled', () => {
	const actual = jest.requireActual('../../../../../utils/is-rovo-chat-action-visualize-enabled');
	return {
		isRovoChatActionVisualizeEnabled: jest.fn(actual.isRovoChatActionVisualizeEnabled),
	};
});

const mockIsRovoChatActionVisualizeEnabled = jest.mocked(isRovoChatActionVisualizeEnabled);

jest.mock('../../one-click-chat-spotlight/async', () => ({
	OneClickChatSpotlightLoader: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="mock-spotlight-loader">{children}</div>
	),
}));

describe('InlineRovoActionButton', () => {
	it('should be accessible', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<SmartCardProvider
					storeOptions={{
						initialState: {
							'https://example.com/': {
								status: 'resolved',
								details: mockState,
							},
						},
					}}
				>
					<InlineRovoActionButton
						testId="rovo-actions-cta"
						actionOptions={{ hide: true, rovoChatAction: { optIn: true } }}
						url={'https://example.com/'}
					/>
				</SmartCardProvider>
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});

	it('renders the icon', () => {
		render(
			<IntlProvider locale="en">
				<SmartCardProvider
					storeOptions={{
						initialState: {
							'https://example.com/': {
								status: 'resolved',
								details: mockState,
							},
						},
					}}
				>
					<InlineRovoActionButton
						testId="rovo-actions-cta"
						actionOptions={{ hide: true, rovoChatAction: { optIn: true } }}
						url={'https://example.com/'}
					/>
				</SmartCardProvider>
			</IntlProvider>,
		);
		expect(screen.getByTestId('rovo-actions-cta')).toBeInTheDocument();
	});

	describe.each([
		['legacy', false],
		['spotlight', true],
	])('Google Sheets visualize (%s inline CTA)', (_, isSpotlightEnabled) => {
		const googleSheetsState = {
			...mockState,
			data: {
				...mockState.data,
				'@type': ['Document', 'schema:SpreadsheetDigitalDocument'],
			},
		} as typeof mockState;

		const renderGoogleSheet = ({
			product = 'CONFLUENCE',
			actionOptions = { hide: false, rovoChatAction: { optIn: true } },
		}: {
			actionOptions?: React.ComponentProps<typeof InlineRovoActionButton>['actionOptions'];
			product?: 'CONFLUENCE' | 'JSW';
		} = {}) =>
			render(
				<IntlProvider locale="en">
					<SmartCardProvider
						product={product}
						rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
						storeOptions={{
							initialState: {
								'https://example.com/': {
									status: 'resolved',
									details: googleSheetsState,
								},
							},
						}}
					>
						<InlineRovoActionButton
							testId="rovo-actions-cta"
							actionOptions={actionOptions}
							url={'https://example.com/'}
						/>
					</SmartCardProvider>
				</IntlProvider>,
			);

		beforeEach(() => {
			if (isSpotlightEnabled) {
				passGate('platform_sl_one_click_chat_spotlight_v2_fg');
			} else {
				failGate('platform_sl_one_click_chat_spotlight_v2_fg');
			}
			mockIsRovoChatActionVisualizeEnabled.mockClear();
		});

		it('renders visualize action without spotlight when kill switch is on and experiment is enabled', () => {
			passGate('platform_sl_3p_auth_visualize_killswitch');
			mockExpEnabled('platform_sl_3p_auth_visualize_exp');

			renderGoogleSheet();

			expect(screen.getByTestId('rovo-actions-cta')).toHaveTextContent('Visualize');
			expect(screen.queryByTestId('mock-spotlight-loader')).not.toBeInTheDocument();
		});

		it('renders nothing when experiment is disabled', () => {
			passGate('platform_sl_3p_auth_visualize_killswitch');
			mockExpDisabled('platform_sl_3p_auth_visualize_exp');

			renderGoogleSheet();

			expect(screen.queryByTestId('rovo-actions-cta')).not.toBeInTheDocument();
		});

		it('renders nothing outside Confluence even when experiment is enabled', () => {
			// Kill switch is not forced: the product rule short-circuits before any gate
			// is evaluated, and forcing an uncalled gate fails the test.
			mockExpEnabled('platform_sl_3p_auth_visualize_exp');

			renderGoogleSheet({ product: 'JSW' });

			expect(screen.queryByTestId('rovo-actions-cta')).not.toBeInTheDocument();
		});

		it.each([
			['hidden', { hide: true, rovoChatAction: { optIn: true } }],
			['not opted in', { hide: false }],
		])(
			'does not evaluate visualize (no exposure) when Rovo chat action is %s',
			(_, actionOptions) => {
				renderGoogleSheet({ actionOptions });

				expect(mockIsRovoChatActionVisualizeEnabled).not.toHaveBeenCalled();
				expect(screen.queryByTestId('rovo-actions-cta')).not.toBeInTheDocument();
			},
		);

		it('renders nothing when kill switch is off', () => {
			failGate('platform_sl_3p_auth_visualize_killswitch');
			mockExpEnabled('platform_sl_3p_auth_visualize_exp');

			renderGoogleSheet();

			expect(screen.queryByTestId('rovo-actions-cta')).not.toBeInTheDocument();
		});
	});

	describe('Google Docs (non-Sheets) alongside the visualize experiment', () => {
		const renderGoogleDoc = () =>
			render(
				<IntlProvider locale="en">
					<SmartCardProvider
						product="CONFLUENCE"
						rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
						storeOptions={{
							initialState: {
								'https://example.com/': {
									status: 'resolved',
									details: mockState,
								},
							},
						}}
					>
						<InlineRovoActionButton
							testId="rovo-actions-cta"
							actionOptions={{ hide: false, rovoChatAction: { optIn: true } }}
							url={'https://example.com/'}
						/>
					</SmartCardProvider>
				</IntlProvider>,
			);

		beforeEach(() => {
			mockIsRovoChatActionVisualizeEnabled.mockClear();
		});

		it('still wraps the summarize action in the spotlight when the spotlight gate is on', () => {
			passGate('platform_sl_one_click_chat_spotlight_v2_fg');

			renderGoogleDoc();

			expect(screen.getByTestId('mock-spotlight-loader')).toContainElement(
				screen.getByTestId('rovo-actions-cta'),
			);
			expect(screen.getByTestId('rovo-actions-cta')).not.toHaveTextContent('Visualize');
			expect(mockIsRovoChatActionVisualizeEnabled).not.toHaveBeenCalled();
		});

		it('renders the summarize action without the spotlight when the spotlight gate is off', () => {
			failGate('platform_sl_one_click_chat_spotlight_v2_fg');

			renderGoogleDoc();

			expect(screen.getByTestId('rovo-actions-cta')).toBeInTheDocument();
			expect(screen.getByTestId('rovo-actions-cta')).not.toHaveTextContent('Visualize');
			expect(screen.queryByTestId('mock-spotlight-loader')).not.toBeInTheDocument();
			expect(mockIsRovoChatActionVisualizeEnabled).not.toHaveBeenCalled();
		});
	});
});
