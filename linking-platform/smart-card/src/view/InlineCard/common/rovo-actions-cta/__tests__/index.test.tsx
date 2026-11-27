import React from 'react';

import { IntlProvider } from 'react-intl';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { wasExperimentExposed } from '@atlassian/experiment-test-utils/was-experiment-exposed';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import mockState from '../../../../../__fixtures__/document-entity';
import { ANALYTICS_CHANNEL } from '../../../../../utils/analytics/analytics';
import { isRemixActionEnabled } from '../../../../../utils/is-remix-action-enabled';
import { InlineCardResolvedViewFunctional } from '../../../ResolvedView/InlineCardResolvedViewFunctional';
import { InlineRovoActionButton } from '../index';

jest.mock('../../../../../utils/is-remix-action-enabled', () => {
	const actual = jest.requireActual('../../../../../utils/is-remix-action-enabled');
	return {
		isRemixActionEnabled: jest.fn(actual.isRemixActionEnabled),
	};
});

const mockIsRemixActionEnabled = jest.mocked(isRemixActionEnabled);

// Remix is available, so Remix depends only on the kill switch and the experiment.
const remixPlugins = {
	resolve: () => ({ remix: { isAvailable: () => true, open: jest.fn() } }),
};

jest.mock('@atlaskit/icon-lab/core/ai-generative-remix', () => ({
	__esModule: true,
	default: () => <span aria-hidden="true" data-testid="remix-icon" />,
}));

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

	describe('Google Sheets independent Remix action', () => {
		const googleSheetsState = {
			...mockState,
			data: {
				...mockState.data,
				'@type': ['Document', 'schema:SpreadsheetDigitalDocument'],
			},
		} as typeof mockState;

		const renderGoogleSheet = ({
			product = 'CONFLUENCE',
			onEvent = jest.fn(),
			actionOptions = {
				hide: false,
				remixAction: { optIn: true },
				rovoChatAction: { optIn: true },
			},
		}: {
			actionOptions?: React.ComponentProps<typeof InlineRovoActionButton>['actionOptions'];
			onEvent?: jest.Mock;
			product?: 'CONFLUENCE' | 'JSW';
		} = {}) =>
			render(
				<AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={onEvent}>
					<IntlProvider locale="en">
						<SmartCardProvider
							plugins={remixPlugins}
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
							<InlineCardResolvedViewFunctional
								id="inline-card-id"
								testId="sheet"
								actionOptions={actionOptions}
								link={'https://example.com/'}
							/>
						</SmartCardProvider>
					</IntlProvider>
				</AnalyticsListener>,
			);

		beforeEach(() => {
			mockIsRemixActionEnabled.mockClear();
		});

		it('renders Remix action without spotlight when kill switch is on and experiment is enabled', () => {
			passGate('platform_sl_3p_auth_visualize_killswitch');
			mockExpEnabled('platform_sl_3p_auth_visualize_exp');

			renderGoogleSheet();

			expect(screen.getByTestId('sheet-remix-action')).toHaveTextContent('Remix');
			expect(wasExperimentExposed('platform_sl_3p_auth_visualize_exp')).toBe(true);
			expect(screen.queryByTestId('mock-spotlight-loader')).not.toBeInTheDocument();
		});

		it('renders Remix independently of Rovo chat action opt-in', () => {
			passGate('platform_sl_3p_auth_visualize_killswitch');
			mockExpEnabled('platform_sl_3p_auth_visualize_exp');
			renderGoogleSheet({
				actionOptions: {
					hide: false,
					remixAction: { optIn: true },
					rovoChatAction: { optIn: false },
				},
			});
			expect(screen.getByRole('button', { name: 'Remix' })).toBeInTheDocument();
		});

		it('opens Remix on click', async () => {
			passGate('platform_sl_3p_auth_visualize_killswitch');
			mockExpEnabled('platform_sl_3p_auth_visualize_exp');
			const open = jest.fn();
			jest
				.spyOn(remixPlugins, 'resolve')
				.mockReturnValueOnce({ remix: { isAvailable: () => true, open } });
			renderGoogleSheet();
			await userEvent.setup().click(screen.getByTestId('sheet-remix-action'));
			expect(open).toHaveBeenCalledWith(expect.objectContaining({ url: expect.any(String) }));
		});

		it('includes the inline card ID in Remix click analytics', async () => {
			passGate('platform_sl_3p_auth_visualize_killswitch');
			mockExpEnabled('platform_sl_3p_auth_visualize_exp');
			const onEvent = jest.fn();
			renderGoogleSheet({ onEvent });

			await userEvent.setup().click(screen.getByRole('button', { name: 'Remix' }));
			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: expect.objectContaining({
						eventType: 'ui',
						action: 'clicked',
						actionSubject: 'button',
						actionSubjectId: 'remix',
						attributes: expect.objectContaining({ id: 'inline-card-id', display: 'inline' }),
					}),
				}),
				ANALYTICS_CHANNEL,
			);
		});

		it('renders nothing when experiment is disabled', () => {
			passGate('platform_sl_3p_auth_visualize_killswitch');
			mockExpDisabled('platform_sl_3p_auth_visualize_exp');

			renderGoogleSheet();

			expect(screen.queryByTestId('sheet-remix-action')).not.toBeInTheDocument();
			expect(wasExperimentExposed('platform_sl_3p_auth_visualize_exp')).toBe(false);
		});

		it('renders nothing outside Confluence even when experiment is enabled', () => {
			// Kill switch is not forced: the product rule short-circuits before any gate
			// is evaluated, and forcing an uncalled gate fails the test.
			mockExpEnabled('platform_sl_3p_auth_visualize_exp');

			renderGoogleSheet({ product: 'JSW' });

			expect(screen.queryByTestId('sheet-remix-action')).not.toBeInTheDocument();
		});

		it.each([
			['hidden', { hide: true, remixAction: { optIn: true }, rovoChatAction: { optIn: true } }],
			['not opted in', { hide: false, rovoChatAction: { optIn: true } }],
		])('does not evaluate Remix (no exposure) when Remix action is %s', (_, actionOptions) => {
			renderGoogleSheet({ actionOptions });

			expect(mockIsRemixActionEnabled).not.toHaveBeenCalled();
			expect(screen.queryByTestId('sheet-remix-action')).not.toBeInTheDocument();
		});

		it('renders nothing when kill switch is off', () => {
			failGate('platform_sl_3p_auth_visualize_killswitch');
			mockExpEnabled('platform_sl_3p_auth_visualize_exp');

			renderGoogleSheet();

			expect(screen.queryByTestId('sheet-remix-action')).not.toBeInTheDocument();
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
			mockIsRemixActionEnabled.mockClear();
		});

		it('still wraps the summarize action in the spotlight when the spotlight gate is on', () => {
			passGate('platform_sl_one_click_chat_spotlight_v2_fg');

			renderGoogleDoc();

			expect(screen.getByTestId('mock-spotlight-loader')).toContainElement(
				screen.getByTestId('rovo-actions-cta'),
			);
			expect(screen.getByTestId('rovo-actions-cta')).not.toHaveTextContent('Remix');
			expect(mockIsRemixActionEnabled).not.toHaveBeenCalled();
		});
	});
});
