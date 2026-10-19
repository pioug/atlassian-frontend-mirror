import React from 'react';

import { IntlProvider } from 'react-intl';
import { DiProvider, injectable } from 'react-magnetic-di';

import { renderWithIntl } from '@atlaskit/link-test-helpers/react-testing-library';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { wasExperimentExposed } from '@atlassian/experiment-test-utils/was-experiment-exposed';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
// eslint-disable-next-line @atlaskit/platform/no-barrel-entry-imports
import { fireEvent, render, screen, userEvent } from '@atlassian/testing-library';

import { getCachedProviderPctMapAndRefresh } from '../../../../state/services/personalization/getCachedProviderPctMapAndRefresh';
import { InlineCardUnauthorizedView } from '../index';

const mockFireEvent = jest.fn();
jest.mock('../../../../common/analytics/generated/use-analytics-events', () => ({
	useAnalyticsEvents: () => ({ fireEvent: mockFireEvent }),
}));

const UPDATE_CTA_GATE = 'platform_sl_3p_preauth_update_cta_fg';
const UPDATE_CTA_EXPERIMENT = 'platform_sl_3p_preauth_update_cta_exp';

const mockGetProviderPctMapSyncLoaded = injectable(getCachedProviderPctMapAndRefresh, () => ({
	'figma-object-provider': 52,
}));

const mockGetProviderPctMapSyncExploratoryShare = injectable(
	getCachedProviderPctMapAndRefresh,
	() => ({
		'figma-object-provider': 15,
	}),
);

const mockGetProviderPctMapSyncThirtyPct = injectable(getCachedProviderPctMapAndRefresh, () => ({
	'figma-object-provider': 30,
}));

const mockGetProviderPctMapSyncTwentyNinePct = injectable(
	getCachedProviderPctMapAndRefresh,
	() => ({
		'figma-object-provider': 29,
	}),
);

const mockGetProviderPctMapSyncNoPercentage = injectable(
	getCachedProviderPctMapAndRefresh,
	() => null,
);
const mockGetProviderPctMapSyncLoadedNoPercentage = injectable(
	getCachedProviderPctMapAndRefresh,
	() => ({}),
);

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
		mockFireEvent.mockClear();
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
		failGate(UPDATE_CTA_GATE);
		mockExpEnabled(UPDATE_CTA_EXPERIMENT);
		const testUrl = 'http://unauthorised-test/';

		const { container } = renderWithSocialProofDi(
			<InlineCardUnauthorizedView context="3P" url={testUrl} onAuthorise={jest.fn()} />,
			mockGetProviderPctMapSyncNoPercentage,
		);

		expect(container).toHaveTextContent(`${testUrl}Connect your 3P account`);
		expect(wasExperimentExposed(UPDATE_CTA_EXPERIMENT)).toBe(false);
	});

	it('should not show action button when action is not available', () => {
		const testUrl = 'http://unauthorised-test/';

		const { container } = renderWithIntl(<InlineCardUnauthorizedView context="3P" url={testUrl} />);

		expect(container).not.toHaveTextContent('Connect');
	});

	it('should not redirect user if they do not click on the authorize button', () => {
		failGate(UPDATE_CTA_GATE);
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

	describe('pre-auth update CTA experiment', () => {
		it('preserves the ordinary label and exposes the control cohort when the experiment is disabled', () => {
			passGate(UPDATE_CTA_GATE);
			mockExpDisabled(UPDATE_CTA_EXPERIMENT);

			renderWithSocialProofDi(
				<InlineCardUnauthorizedView
					context="Figma"
					url="http://unauthorised-test/"
					onAuthorise={jest.fn()}
				/>,
				mockGetProviderPctMapSyncNoPercentage,
			);

			expect(
				screen.getByRole('button', { name: 'Connect your Figma account' }),
			).toBeInTheDocument();
			expect(wasExperimentExposed(UPDATE_CTA_EXPERIMENT)).toBe(true);
		});

		it('uses the provider treatment label and authorises exactly once from the keyboard', async () => {
			passGate(UPDATE_CTA_GATE);
			mockExpEnabled(UPDATE_CTA_EXPERIMENT);
			const onAuthorise = jest.fn();
			const onClick = jest.fn();

			renderWithSocialProofDi(
				<InlineCardUnauthorizedView
					context="Figma"
					extensionKey="figma-object-provider"
					url="http://unauthorised-test/"
					onAuthorise={onAuthorise}
					onClick={onClick}
					testId="inline-card-unauthorized-view"
				/>,
				mockGetProviderPctMapSyncNoPercentage,
			);

			expect(
				screen.queryByTestId('inline-card-unauthorized-view-social-proof-tag'),
			).not.toBeInTheDocument();
			const connectButton = screen.getByRole('button', { name: 'Connect Figma to update' });

			connectButton.focus();
			const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
			await user.keyboard('{Enter}');

			expect(onAuthorise).toHaveBeenCalledTimes(1);
			expect(onClick).not.toHaveBeenCalled();
			expect(mockFireEvent).toHaveBeenCalledTimes(1);
			expect(mockFireEvent).toHaveBeenCalledWith('track.applicationAccount.authStarted', {});
			expect(wasExperimentExposed(UPDATE_CTA_EXPERIMENT)).toBe(true);
		});

		it.each([undefined, '   '])(
			'uses the generic treatment label when the provider is %p',
			(context) => {
				passGate(UPDATE_CTA_GATE);
				mockExpEnabled(UPDATE_CTA_EXPERIMENT);

				renderWithSocialProofDi(
					<InlineCardUnauthorizedView
						context={context}
						url="http://unauthorised-test/"
						onAuthorise={jest.fn()}
					/>,
					mockGetProviderPctMapSyncNoPercentage,
				);

				expect(screen.getByRole('button', { name: 'Connect to update' })).toHaveTextContent(
					/^Connect to update$/,
					{ normalizeWhitespace: false },
				);
				expect(wasExperimentExposed(UPDATE_CTA_EXPERIMENT)).toBe(true);
			},
		);

		it('uses the generic social-proof treatment label and authorises exactly once from the keyboard', async () => {
			passGate(UPDATE_CTA_GATE);
			mockExpEnabled(UPDATE_CTA_EXPERIMENT);
			const onAuthorise = jest.fn();
			const onClick = jest.fn();

			const { container } = renderWithSocialProofDi(
				<InlineCardUnauthorizedView
					context="Figma"
					extensionKey="figma-object-provider"
					url="http://unauthorised-test/"
					onAuthorise={onAuthorise}
					onClick={onClick}
					testId="inline-card-unauthorized-view"
				/>,
				mockGetProviderPctMapSyncLoaded,
			);

			expect(
				screen.getByTestId('inline-card-unauthorized-view-social-proof-tag'),
			).toBeInTheDocument();
			const accessibleName = '52% of your team sees Figma previews Connect to update';
			const connectButton = screen.getByRole('button', { name: accessibleName });

			connectButton.focus();
			const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
			await user.keyboard('{Enter}');

			expect(onAuthorise).toHaveBeenCalledTimes(1);
			expect(onClick).not.toHaveBeenCalled();
			expect(mockFireEvent).toHaveBeenCalledTimes(1);
			expect(mockFireEvent).toHaveBeenCalledWith('track.applicationAccount.authStarted', {});
			expect(wasExperimentExposed(UPDATE_CTA_EXPERIMENT)).toBe(true);
			await expect(container).toBeAccessible();
		});
	});

	describe('social proof', () => {
		describe('connect CTA', () => {
			it('should show "Connect" (short label) instead of "Connect your X account" when social proof is shown', () => {
				failGate(UPDATE_CTA_GATE);
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

			it('authorises once from the nested "Connect" button without opening the Smart Link', async () => {
				failGate(UPDATE_CTA_GATE);
				const testUrl = 'http://unauthorised-test/';
				const onAuthorise = jest.fn();
				const onClick = jest.fn();
				renderWithSocialProofDi(
					<InlineCardUnauthorizedView
						context="Figma"
						extensionKey="figma-object-provider"
						url={testUrl}
						onAuthorise={onAuthorise}
						onClick={onClick}
						testId="inline-card-unauthorized-view"
					/>,
					mockGetProviderPctMapSyncLoaded,
				);

				const connectButton = screen.getByTestId('button-connect-account');
				expect(connectButton).toHaveTextContent('Connect');

				const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
				await user.click(connectButton);

				expect(onAuthorise).toHaveBeenCalledTimes(1);
				expect(onClick).not.toHaveBeenCalled();
				expect(mockFireEvent).toHaveBeenCalledTimes(1);
				expect(mockFireEvent).toHaveBeenCalledWith('track.applicationAccount.authStarted', {});
			});

			it('shows social proof pill with percentage when social proof data is present', () => {
				failGate(UPDATE_CTA_GATE);
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
				expect(getByTestId('inline-card-unauthorized-view-social-proof-tag')).toBeInTheDocument();
				expect(container).toHaveTextContent('52% of your team sees Figma previews');
			});

			it('uses exploratory preview copy when connected share is below 30%', () => {
				failGate(UPDATE_CTA_GATE);
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
				expect(getByTestId('inline-card-unauthorized-view-social-proof-tag')).toBeInTheDocument();
				expect(container).toHaveTextContent('Your team sees richer Figma previews');
			});

			it('uses no-context exploratory copy when exploratory share has no provider display name', () => {
				failGate(UPDATE_CTA_GATE);
				const testUrl = 'http://unauthorised-test/';
				const { getByTestId, container } = renderWithSocialProofDi(
					<InlineCardUnauthorizedView
						extensionKey="figma-object-provider"
						url={testUrl}
						onAuthorise={jest.fn()}
						testId="inline-card-unauthorized-view"
					/>,
					mockGetProviderPctMapSyncExploratoryShare,
				);
				expect(getByTestId('inline-card-unauthorized-view-social-proof-tag')).toBeInTheDocument();
				expect(container).toHaveTextContent('Your team sees richer previews');
				expect(container).toHaveTextContent('Connect');
			});

			it('starts percentage headline messaging at exactly 30% adoption', () => {
				failGate(UPDATE_CTA_GATE);
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
				expect(container).toHaveTextContent('30% of your team sees Figma previews');
			});

			it('uses exploratory copy at 29% adoption', () => {
				failGate(UPDATE_CTA_GATE);
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
				expect(container).toHaveTextContent('Your team sees richer Figma previews');
			});

			it('uses high-share no-context copy when provider display name is missing', () => {
				failGate(UPDATE_CTA_GATE);
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
				expect(container).toHaveTextContent('52% of your team sees richer previews');
			});

			it('omits the pill when context and personalization are both unavailable before traits load', () => {
				failGate(UPDATE_CTA_GATE);
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

			it('shows no-context low-share copy when traits are loaded but provider percentage is missing', () => {
				failGate(UPDATE_CTA_GATE);
				const testUrl = 'http://unauthorised-test/';
				const { getByTestId, container } = renderWithSocialProofDi(
					<InlineCardUnauthorizedView
						extensionKey="figma-object-provider"
						url={testUrl}
						onAuthorise={jest.fn()}
						testId="inline-card-unauthorized-view"
					/>,
					mockGetProviderPctMapSyncLoadedNoPercentage,
				);
				expect(getByTestId('inline-card-unauthorized-view-social-proof-tag')).toBeInTheDocument();
				expect(container).toHaveTextContent('Your team sees richer previews');
				expect(container).toHaveTextContent('Connect');
			});

			it('shows exploratory context copy when traits are loaded but provider percentage is missing', () => {
				failGate(UPDATE_CTA_GATE);
				const testUrl = 'http://unauthorised-test/';
				const { getByTestId, container } = renderWithSocialProofDi(
					<InlineCardUnauthorizedView
						context="Figma"
						extensionKey="figma-object-provider"
						url={testUrl}
						onAuthorise={jest.fn()}
						testId="inline-card-unauthorized-view"
					/>,
					mockGetProviderPctMapSyncLoadedNoPercentage,
				);
				expect(getByTestId('inline-card-unauthorized-view-social-proof-tag')).toBeInTheDocument();
				expect(container).toHaveTextContent('Your team sees richer Figma previews');
				expect(container).toHaveTextContent('Connect');
			});
		});

		it('does not show a CTA or expose the update experiment when onAuthorise is not provided', () => {
			mockExpEnabled(UPDATE_CTA_EXPERIMENT);
			const testUrl = 'http://unauthorised-test/';
			renderWithSocialProofDi(
				<InlineCardUnauthorizedView
					context="Figma"
					extensionKey="figma-object-provider"
					url={testUrl}
					testId="inline-card-unauthorized-view"
				/>,
				mockGetProviderPctMapSyncUnexpected,
			);
			expect(
				screen.queryByTestId('inline-card-unauthorized-view-social-proof-tag'),
			).not.toBeInTheDocument();
			expect(screen.queryByTestId('button-connect-account')).not.toBeInTheDocument();
			expect(screen.queryByRole('button')).not.toBeInTheDocument();
			expect(wasExperimentExposed(UPDATE_CTA_EXPERIMENT)).toBe(false);
		});

		it('shows the long connect label until personalization data is available', () => {
			failGate(UPDATE_CTA_GATE);
			const { container } = renderWithSocialProofDi(
				<InlineCardUnauthorizedView
					context="Figma"
					extensionKey="figma-object-provider"
					url="http://unauthorised-test/"
					onAuthorise={jest.fn()}
				/>,
				mockGetProviderPctMapSyncNoPercentage,
			);
			expect(container).toHaveTextContent('Connect your Figma account');
			expect(
				screen.queryByTestId('inline-card-unauthorized-view-social-proof-tag'),
			).not.toBeInTheDocument();
		});
	});
});
