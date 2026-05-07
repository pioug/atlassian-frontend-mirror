import React from 'react';

import { IntlProvider } from 'react-intl';
import { DiProvider, injectable } from 'react-magnetic-di';

import { renderWithIntl } from '@atlaskit/link-test-helpers';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { fireEvent, render, screen } from '@atlassian/testing-library';

import { getCachedProviderPctMapAndRefresh } from '../../../../state/services/personalization';
import { InlineCardUnauthorizedView } from '../index';

const mockGetProviderPctMapSyncLoaded = injectable(getCachedProviderPctMapAndRefresh, () => ({
	'figma-object-provider': 52,
}));

const mockGetProviderPctMapSyncExploratoryShare = injectable(getCachedProviderPctMapAndRefresh, () => ({
	'figma-object-provider': 15,
}));

const mockGetProviderPctMapSyncThirtyPct = injectable(getCachedProviderPctMapAndRefresh, () => ({
	'figma-object-provider': 30,
}));

const mockGetProviderPctMapSyncTwentyNinePct = injectable(getCachedProviderPctMapAndRefresh, () => ({
	'figma-object-provider': 29,
}));

const mockGetProviderPctMapSyncNoPercentage = injectable(getCachedProviderPctMapAndRefresh, () => null);

const mockGetProviderPctMapSyncUnexpected = injectable(getCachedProviderPctMapAndRefresh, () => {
	throw new Error('getCachedProviderPctMapAndRefresh should not be called');
});

type Injectable = ReturnType<typeof injectable>;

const renderWithSocialProofDi = (ui: React.ReactElement, socialProofMock: Injectable) =>
	render(
		<DiProvider use={[socialProofMock]}>
			<IntlProvider locale="en">{ui}</IntlProvider>
		</DiProvider>,
	);

describe('Unauthorised View', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	it('should have correct text', () => {
		const testUrl = 'http://unauthorised-test/';
		const { container } = renderWithIntl(<InlineCardUnauthorizedView url={testUrl} />);

		expect(container).toHaveTextContent(testUrl);
	});

	it('should have a link to the url', () => {
		const testUrl = 'http://unauthorised-test/';
		renderWithIntl(<InlineCardUnauthorizedView url={testUrl} />);
		const link = screen.getByText(testUrl, { exact: false }).closest('a');

		expect(link).not.toBeNull;
		expect(link!.href).toBe(testUrl);
	});

	it('should show correct text if action is available', () => {
		const testUrl = 'http://unauthorised-test/';

		const { container } = renderWithIntl(
			<InlineCardUnauthorizedView context="3P" url={testUrl} onAuthorise={jest.fn()} />,
		);

		expect(container).toHaveTextContent(`${testUrl}Connect your 3P account`);
	});

	it('should not show action button when action is not available', () => {
		const testUrl = 'http://unauthorised-test/';

		const { container } = renderWithIntl(<InlineCardUnauthorizedView context="3P" url={testUrl} />);

		expect(container).not.toHaveTextContent('Connect');
	});

	it('should not redirect user if they do not click on the authorize button', () => {
		const onClick = jest.fn();
		const onAuthorise = jest.fn();
		const testUrl = 'http://unauthorised-test/';
		renderWithIntl(
			<InlineCardUnauthorizedView url={testUrl} onClick={onClick} onAuthorise={onAuthorise} />,
		);

		const message = screen.getByText(testUrl);
		fireEvent.click(message!);
		expect(onClick).toHaveBeenCalled();
		expect(onAuthorise).not.toHaveBeenCalled();
	});

	it('should capture and report a11y violations', async () => {
		const testUrl = 'http://unauthorised-test/';
		const { container } = renderWithIntl(<InlineCardUnauthorizedView url={testUrl} />);
		await expect(container).toBeAccessible();
	});

	ffTest.on('platform_sl_3p_preauth_soc_proof_inline_killswitch', 'killswitch on', () => {
		eeTest
			.describe(
				'platform_sl_3p_preauth_social_proof_inline_cta',
				'social proof CTA experiment on',
			)
			.variant(true, () => {
				it('should show "Connect" (short label) instead of "Connect your X account" when social proof is shown', () => {
					const testUrl = 'http://unauthorised-test/';
					const { container } = renderWithSocialProofDi(
						<InlineCardUnauthorizedView
							context="Figma"
							extensionKey="figma-object-provider"
							url={testUrl}
							onAuthorise={jest.fn()}
						/>,
						mockGetProviderPctMapSyncLoaded,
					);
					expect(container).toHaveTextContent('Connect');
					expect(container).not.toHaveTextContent('Connect your Figma account');
				});

				it('shows social proof pill with percentage when social proof data is present', () => {
					const testUrl = 'http://unauthorised-test/';
					const { getByTestId, container } = renderWithSocialProofDi(
						<InlineCardUnauthorizedView
							context="Figma"
							extensionKey="figma-object-provider"
							url={testUrl}
							onAuthorise={jest.fn()}
							testId="inline-card-unauthorized-view"
						/>,
						mockGetProviderPctMapSyncLoaded,
					);
					expect(
						getByTestId('inline-card-unauthorized-view-social-proof-tag'),
					).toBeInTheDocument();
					expect(container).toHaveTextContent('52% of your team previews Figma');
				});

				it('uses exploratory previewing copy when connected share is below 30%', () => {
					const testUrl = 'http://unauthorised-test/';
					const { getByTestId, container } = renderWithSocialProofDi(
						<InlineCardUnauthorizedView
							context="Figma"
							extensionKey="figma-object-provider"
							url={testUrl}
							onAuthorise={jest.fn()}
							testId="inline-card-unauthorized-view"
						/>,
						mockGetProviderPctMapSyncExploratoryShare,
					);
					expect(
						getByTestId('inline-card-unauthorized-view-social-proof-tag'),
					).toBeInTheDocument();
					expect(container).toHaveTextContent('Your team is previewing Figma');
				});

				it('omits pill and uses legacy connect when exploratory share has no provider display name', () => {
					const testUrl = 'http://unauthorised-test/';
					const { queryByTestId, container } = renderWithSocialProofDi(
						<InlineCardUnauthorizedView
							extensionKey="figma-object-provider"
							url={testUrl}
							onAuthorise={jest.fn()}
							testId="inline-card-unauthorized-view"
						/>,
						mockGetProviderPctMapSyncExploratoryShare,
					);
					expect(
						queryByTestId('inline-card-unauthorized-view-social-proof-tag'),
					).not.toBeInTheDocument();
					expect(container).not.toHaveTextContent('Your team is previewing');
					expect(container).not.toHaveTextContent('% of your team previews');
				});

				it('starts percentage headline messaging at exactly 30% adoption', () => {
					const testUrl = 'http://unauthorised-test/';
					const { container } = renderWithSocialProofDi(
						<InlineCardUnauthorizedView
							context="Figma"
							extensionKey="figma-object-provider"
							url={testUrl}
							onAuthorise={jest.fn()}
							testId="inline-card-unauthorized-view"
						/>,
						mockGetProviderPctMapSyncThirtyPct,
					);
					expect(container).toHaveTextContent('30% of your team previews Figma');
				});

				it('uses exploratory copy at 29% adoption', () => {
					const testUrl = 'http://unauthorised-test/';
					const { container } = renderWithSocialProofDi(
						<InlineCardUnauthorizedView
							context="Figma"
							extensionKey="figma-object-provider"
							url={testUrl}
							onAuthorise={jest.fn()}
							testId="inline-card-unauthorized-view"
						/>,
						mockGetProviderPctMapSyncTwentyNinePct,
					);
					expect(container).toHaveTextContent('Your team is previewing Figma');
				});

				it('uses high-share no-context copy when provider display name is missing', () => {
					const testUrl = 'http://unauthorised-test/';
					const { container } = renderWithSocialProofDi(
						<InlineCardUnauthorizedView
							extensionKey="figma-object-provider"
							url={testUrl}
							onAuthorise={jest.fn()}
							testId="inline-card-unauthorized-view"
						/>,
						mockGetProviderPctMapSyncLoaded,
					);
					expect(container).toHaveTextContent('52% of your team previews this');
				});

				it('omits the pill when context and personalization share are both absent', () => {
					const testUrl = 'http://unauthorised-test/';
					const { queryByTestId, container } = renderWithSocialProofDi(
						<InlineCardUnauthorizedView
							url={testUrl}
							onAuthorise={jest.fn()}
							testId="inline-card-unauthorized-view"
						/>,
						mockGetProviderPctMapSyncNoPercentage,
					);
					expect(
						queryByTestId('inline-card-unauthorized-view-social-proof-tag'),
					).not.toBeInTheDocument();
					expect(container).not.toHaveTextContent('previewing');
					expect(container).not.toHaveTextContent('% of your team');
				});

				it('uses the long connect label and omits the pill when no persisted percentage is available', () => {
					const testUrl = 'http://unauthorised-test/';
					const { queryByTestId, container } = renderWithSocialProofDi(
						<InlineCardUnauthorizedView
							context="Figma"
							extensionKey="figma-object-provider"
							url={testUrl}
							onAuthorise={jest.fn()}
							testId="inline-card-unauthorized-view"
						/>,
						mockGetProviderPctMapSyncNoPercentage,
					);
					expect(
						queryByTestId('inline-card-unauthorized-view-social-proof-tag'),
					).not.toBeInTheDocument();
					expect(container).toHaveTextContent('Connect your Figma account');
				});
			});

		it('does not show social proof pill when onAuthorise is not provided', () => {
			const testUrl = 'http://unauthorised-test/';
			const { queryByTestId } = renderWithSocialProofDi(
				<InlineCardUnauthorizedView
					context="Figma"
					extensionKey="figma-object-provider"
					url={testUrl}
					testId="inline-card-unauthorized-view"
				/>,
				mockGetProviderPctMapSyncUnexpected,
			);
			expect(queryByTestId('inline-card-unauthorized-view-social-proof-tag')).not.toBeInTheDocument();
		});

		eeTest
			.describe(
				'platform_sl_3p_preauth_social_proof_inline_cta',
				'social proof CTA experiment off',
			)
			.variant(false, () => {
				it('shows original "Connect your X account" label when experiment is off', () => {
					const testUrl = 'http://unauthorised-test/';
					const { container } = renderWithSocialProofDi(
						<InlineCardUnauthorizedView context="Figma" url={testUrl} onAuthorise={jest.fn()} />,
						mockGetProviderPctMapSyncLoaded,
					);
					expect(container).toHaveTextContent('Connect your Figma account');
					expect(container).not.toHaveTextContent('52%');
				});
			});
	});

	ffTest.off('platform_sl_3p_preauth_soc_proof_inline_killswitch', 'killswitch off', () => {
		it('shows original "Connect your X account" label when killswitch is off', () => {
			const testUrl = 'http://unauthorised-test/';
			const { container } = renderWithSocialProofDi(
				<InlineCardUnauthorizedView context="Figma" url={testUrl} onAuthorise={jest.fn()} />,
				mockGetProviderPctMapSyncUnexpected,
			);
			expect(container).toHaveTextContent('Connect your Figma account');
			expect(container).not.toHaveTextContent('52%');
		});
	});
});
