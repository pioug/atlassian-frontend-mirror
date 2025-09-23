import React from 'react';

import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { GiveKudosLauncherLazy } from '@atlaskit/give-kudos';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import {
	mockRunItLaterSynchronously,
	renderWithAnalyticsListener,
} from '@atlassian/ptc-test-utils';

import ProfileClient from '../../../client/ProfileCardClient';
import { getMockProfileClient } from '../../../mocks';
import { type ProfileCardTriggerProps } from '../../../types';
import { DELAY_MS_HIDE, DELAY_MS_SHOW } from '../../../util/config';
import { ProfileCardLazy } from '../lazyProfileCard';
import ProfilecardTrigger from '../ProfileCardTrigger';

const mockClient = getMockProfileClient(ProfileClient, 0);

jest.mock('@atlaskit/give-kudos', () => ({
	...jest.requireActual('@atlaskit/give-kudos'),
	GiveKudosLauncherLazy: jest.fn(),
}));

jest.mock('../lazyProfileCard', () => ({
	ProfileCardLazy: jest.fn(),
}));

jest.mock('../../../util/performance', () => {
	return {
		...jest.requireActual('../../../util/performance'),
		getPageTime: jest.fn().mockReturnValue(1000),
	};
});

const mockGiveKudosLauncherLazy = GiveKudosLauncherLazy as unknown as jest.Mock;
const mockProfileCardLazy = ProfileCardLazy as unknown as jest.Mock;

describe('Profile card trigger', () => {
	const mockTeamCentralBaseUrl = 'mock-team-central-base-url';

	const mockGiveKudosLauncherLazyText = 'MockGiveKudosLauncherLazy';
	const mockProfileCardLazyText = 'MockProfileCardLazy';
	const mockTriggerText = 'Trigger';

	const mockGetTeamCentralBaseUrl = jest.fn();
	const mockShouldShowGiveKudos = jest.fn();
	const mockResourceClient = {
		...mockClient,
		getTeamCentralBaseUrl: mockGetTeamCentralBaseUrl,
		shouldShowGiveKudos: mockShouldShowGiveKudos,
	};
	const mockDefaultProps = {
		cloudId: 'cloud-id',
		userId: 'user-id',
		resourceClient: mockResourceClient,
	};

	beforeEach(() => {
		jest.clearAllMocks();

		mockGiveKudosLauncherLazy.mockImplementation(() => <div>{mockGiveKudosLauncherLazyText}</div>);
		mockProfileCardLazy.mockImplementation(() => <div>{mockProfileCardLazyText}</div>);

		mockGetTeamCentralBaseUrl.mockResolvedValue(mockTeamCentralBaseUrl);
		mockShouldShowGiveKudos.mockResolvedValue(true);
	});

	const renderProfileCardTrigger = (props: Partial<ProfileCardTriggerProps>) => {
		return render(
			<IntlProvider locale="en">
				<ProfilecardTrigger {...mockDefaultProps} {...props}>
					<div>{mockTriggerText}</div>
				</ProfilecardTrigger>
			</IntlProvider>,
		);
	};

	it('should capture and report a11y violations', async () => {
		const { container } = renderProfileCardTrigger({});
		await expect(container).toBeAccessible();
	});

	it('renders the trigger', async () => {
		renderProfileCardTrigger({});

		expect(await screen.findByText(mockTriggerText)).toBeVisible();
	});

	describe('popup', () => {
		const userForFakeTimers = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('renders the popup after a delay on trigger hover', async () => {
			renderProfileCardTrigger({});

			// Initial state - popup should not be visible
			expect(screen.queryByText(mockProfileCardLazyText)).toBeNull();

			// hover the trigger
			// timer started, so popup should not appear yet
			await userForFakeTimers.hover(screen.getByText(mockTriggerText));

			// Immediately after hover, popup should not appear yet
			expect(screen.queryByText(mockProfileCardLazyText)).toBeNull();

			// Advance time but not enough to trigger the popup
			act(() => {
				jest.advanceTimersByTime(DELAY_MS_SHOW - 1);
			});

			// Still should not appear
			expect(screen.queryByText(mockProfileCardLazyText)).toBeNull();

			// Advance the final 1ms to trigger the popup
			act(() => {
				jest.advanceTimersByTime(1);
			});

			// Now the popup should appear
			expect(screen.queryByText(mockProfileCardLazyText)).toBeVisible();
		});

		it('renders the popup after a custom delay on trigger hover', async () => {
			renderProfileCardTrigger({ showDelay: 300 });

			expect(screen.queryByText(mockProfileCardLazyText)).toBeNull();

			// hover the trigger
			// timer started, so popup should not appear yet
			await userForFakeTimers.hover(screen.getByText(mockTriggerText));

			// Immediately after hover, popup should not appear yet
			expect(screen.queryByText(mockProfileCardLazyText)).toBeNull();

			// timer not quite there, so popup should not appear yet
			act(() => {
				jest.advanceTimersByTime(300 - 1);
			});

			// Still should not appear
			expect(screen.queryByText(mockProfileCardLazyText)).toBeNull();

			// now the popup should appear
			act(() => {
				jest.advanceTimersByTime(1);
			});

			expect(screen.queryByText(mockProfileCardLazyText)).toBeVisible();
		});

		it('renders the popup immediately on trigger click', async () => {
			renderProfileCardTrigger({ trigger: 'click' });

			await waitFor(() => {
				expect(screen.queryByText(mockProfileCardLazyText)).toBeNull();
			});

			// click the trigger
			await userForFakeTimers.click(screen.getByText(mockTriggerText));

			// popup should appear immediately, (there is still a setTimeout, after 0ms)
			jest.advanceTimersByTime(1);
			await waitFor(() => {
				expect(screen.queryByText(mockProfileCardLazyText)).toBeVisible();
			});
		});

		ffTest.on('fix_profilecard_trigger_isvisible', 'isVisible fixed', () => {
			it('renders the popup based on isVisible prop', async () => {
				const { rerender } = renderProfileCardTrigger({ isVisible: true });

				// popup should appear immediately, (there is still a setTimeout, after 0ms)
				jest.advanceTimersByTime(1);
				await waitFor(() => {
					expect(screen.queryByText(mockProfileCardLazyText)).toBeVisible();
				});

				rerender(
					<IntlProvider locale="en">
						<ProfilecardTrigger {...mockDefaultProps} isVisible={false}>
							<div>{mockTriggerText}</div>
						</ProfilecardTrigger>
					</IntlProvider>,
				);

				await waitFor(() => {
					expect(screen.queryByText(mockProfileCardLazyText)).toBeNull();
				});
			});

			it('preserves normal hover delays when isVisible reflects current state', async () => {
				const { rerender } = renderProfileCardTrigger({ trigger: 'hover' });

				// hover the trigger to make visible=true
				await userForFakeTimers.hover(screen.getByText(mockTriggerText));

				// advance time to show the popup
				act(() => {
					jest.advanceTimersByTime(DELAY_MS_SHOW);
				});

				expect(screen.queryByText(mockProfileCardLazyText)).toBeVisible();

				// Now rerender with isVisible=true (reflecting current state)
				// This should NOT cause immediate hiding when mouse leaves
				rerender(
					<IntlProvider locale="en">
						<ProfilecardTrigger {...mockDefaultProps} trigger="hover" isVisible={true}>
							<div>{mockTriggerText}</div>
						</ProfilecardTrigger>
					</IntlProvider>,
				);

				// Simulate mouse leave - should use normal hide delay, not immediate
				await userForFakeTimers.unhover(screen.getByText(mockTriggerText));

				// Should still be visible since normal hide delay hasn't elapsed
				expect(screen.queryByText(mockProfileCardLazyText)).toBeVisible();

				// After normal hide delay, should disappear
				act(() => {
					jest.advanceTimersByTime(DELAY_MS_HIDE);
				});

				await waitFor(() => {
					expect(screen.queryByText(mockProfileCardLazyText)).toBeNull();
				});
			});

			it('uses immediate delays when isVisible overrides current visible state', async () => {
				const { rerender } = renderProfileCardTrigger({ trigger: 'hover', isVisible: false });

				// Initially should be hidden
				expect(screen.queryByText(mockProfileCardLazyText)).toBeNull();

				// Change isVisible to true while component visible state is false
				// This is external control and should use immediate delay
				rerender(
					<IntlProvider locale="en">
						<ProfilecardTrigger {...mockDefaultProps} trigger="hover" isVisible={true}>
							<div>{mockTriggerText}</div>
						</ProfilecardTrigger>
					</IntlProvider>,
				);

				// popup should appear immediately (after 0ms delay)
				jest.advanceTimersByTime(1);
				await waitFor(() => {
					expect(screen.queryByText(mockProfileCardLazyText)).toBeVisible();
				});

				// Change isVisible to false while component visible state is true
				// This should also use immediate delay
				rerender(
					<IntlProvider locale="en">
						<ProfilecardTrigger {...mockDefaultProps} trigger="hover" isVisible={false}>
							<div>{mockTriggerText}</div>
						</ProfilecardTrigger>
					</IntlProvider>,
				);

				// Should hide immediately (after 0ms delay)
				jest.advanceTimersByTime(1);
				await waitFor(() => {
					expect(screen.queryByText(mockProfileCardLazyText)).toBeNull();
				});
			});

			it('click trigger always uses immediate delays regardless of isVisible', async () => {
				const { rerender } = renderProfileCardTrigger({ trigger: 'click', isVisible: false });

				// Click should show immediately
				await userForFakeTimers.click(screen.getByText(mockTriggerText));
				jest.advanceTimersByTime(1);

				await waitFor(() => {
					expect(screen.queryByText(mockProfileCardLazyText)).toBeVisible();
				});

				// Rerender with isVisible=true (reflecting current state)
				rerender(
					<IntlProvider locale="en">
						<ProfilecardTrigger {...mockDefaultProps} trigger="click" isVisible={true}>
							<div>{mockTriggerText}</div>
						</ProfilecardTrigger>
					</IntlProvider>,
				);

				// Click again should toggle immediately
				await userForFakeTimers.click(screen.getByText(mockTriggerText));
				jest.advanceTimersByTime(1);

				// Should still be immediate even when isVisible matches visible state
				await waitFor(() => {
					expect(screen.queryByText(mockProfileCardLazyText)).toBeVisible();
				});
			});
		});
	});

	it('renders with valid team central values', async () => {
		const mockGetProfile = jest.fn();
		const mockGetReportingLines = jest.fn();

		renderProfileCardTrigger({
			resourceClient: {
				...mockResourceClient,
				getProfile: mockGetProfile,
				getReportingLines: mockGetReportingLines,
			},
			trigger: 'click',
		});

		// click the trigger
		await userEvent.click(await screen.findByText(mockTriggerText));

		expect(await screen.findByText(mockGiveKudosLauncherLazyText)).toBeInTheDocument();

		expect(mockGetTeamCentralBaseUrl).toHaveBeenCalledTimes(1);
		expect(mockGetTeamCentralBaseUrl).toHaveBeenCalledWith({
			withOrgContext: true,
			withSiteContext: true,
		});
		expect(mockGiveKudosLauncherLazy).toHaveBeenCalledTimes(1);
		expect(mockGiveKudosLauncherLazy.mock.calls[0][0].teamCentralBaseUrl).toBe(
			mockTeamCentralBaseUrl,
		);
		expect(mockProfileCardLazy).toHaveBeenCalled();
		mockProfileCardLazy.mock.calls.forEach((call) => {
			const relevantCallArgs = call[0];
			expect(
				(relevantCallArgs.isKudosEnabled === false &&
					relevantCallArgs.teamCentralBaseUrl === undefined) ||
					relevantCallArgs.teamCentralBaseUrl !== undefined,
			).toBe(true);
		});
	});

	it('renders tabIndex 0 when ariaHideProfileTrigger is not set', async () => {
		renderProfileCardTrigger({
			prepopulatedData: { fullName: 'Tester' },
		});

		const profileTriggerButton = await screen.findByRole('button', {
			name: 'More information about Tester',
		});

		expect(profileTriggerButton).toHaveAttribute('tabIndex', '0');
		expect(profileTriggerButton).not.toHaveAttribute('aria-hidden');
		expect(profileTriggerButton).toHaveAttribute('aria-label');
	});

	it('renders tabIndex 0 when ariaHideProfileTrigger is false', async () => {
		renderProfileCardTrigger({
			prepopulatedData: { fullName: 'Tester' },
			ariaHideProfileTrigger: false,
		});
		const profileTriggerButton = await screen.findByRole('button', {
			name: 'More information about Tester',
		});

		expect(profileTriggerButton).toHaveAttribute('tabIndex', '0');
		expect(profileTriggerButton).not.toHaveAttribute('aria-hidden');
		expect(profileTriggerButton).toHaveAttribute('aria-label');
	});

	it('renders tabIndex -1 when ariaHideProfileTrigger is true', async () => {
		renderProfileCardTrigger({
			prepopulatedData: { fullName: 'Tester' },
			ariaHideProfileTrigger: true,
			testId: 'profile-card-testid',
		});
		const profileTriggerButton = await screen.findByTestId('profile-card-testid');

		expect(profileTriggerButton).toHaveAttribute('tabIndex', '-1');
		expect(profileTriggerButton).toHaveAttribute('aria-hidden', 'true');
		expect(profileTriggerButton).not.toHaveAttribute('aria-label');
		expect(profileTriggerButton).not.toHaveAttribute('aria-labelledby');
	});

	describe('analytics', () => {
		const hoverProfileCardEvent = {
			action: 'triggered',
			actionSubject: 'profilecard',
			attributes: {
				method: 'hover',
				firedAt: 1000,
				packageName: process.env._PACKAGE_NAME_,
				packageVersion: process.env._PACKAGE_VERSION_,
			},
		};
		const clickProfileCardEvent = {
			action: 'triggered',
			actionSubject: 'profilecard',
			attributes: {
				method: 'click',
				firedAt: 1000,
				packageName: process.env._PACKAGE_NAME_,
				packageVersion: process.env._PACKAGE_VERSION_,
			},
		};

		beforeEach(() => {
			mockRunItLaterSynchronously();
		});

		const renderProfileCardTrigger = (props: Partial<ProfileCardTriggerProps>) => {
			return renderWithAnalyticsListener(
				<IntlProvider locale="en">
					<ProfilecardTrigger {...mockDefaultProps} {...props}>
						<div>{mockTriggerText}</div>
					</ProfilecardTrigger>
				</IntlProvider>,
			);
		};

		ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
			it('should fire analytics hover profile card event', async () => {
				const { user, expectEventToBeFired } = renderProfileCardTrigger({
					testId: 'profile-card-testid',
				});
				await user.hover(screen.getByTestId('profile-card-testid'));
				expectEventToBeFired('ui', hoverProfileCardEvent);
			});
			it('should fire analytics click profile card event', async () => {
				const { user, expectEventToBeFired } = renderProfileCardTrigger({
					testId: 'profile-card-testid',
					trigger: 'click',
				});
				await user.click(screen.getByTestId('profile-card-testid'));
				expectEventToBeFired('ui', clickProfileCardEvent);
			});
			it('should fire analytics keyboard profile card event on Enter key', async () => {
				const { user, expectEventToBeFired } = renderProfileCardTrigger({
					testId: 'profile-card-testid',
				});
				await user.click(screen.getByTestId('profile-card-testid'));
				await user.keyboard('{Enter}');
				expectEventToBeFired('ui', clickProfileCardEvent);
			});
		});

		ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
			it('should fire analytics hover profile card event', async () => {
				const { user, expectEventToBeFired } = renderProfileCardTrigger({
					testId: 'profile-card-testid',
				});
				await user.hover(screen.getByTestId('profile-card-testid'));
				expectEventToBeFired('ui', hoverProfileCardEvent);
			});
			it('should fire analytics click profile card event', async () => {
				const { user, expectEventToBeFired } = renderProfileCardTrigger({
					testId: 'profile-card-testid',
					trigger: 'click',
				});
				await user.click(screen.getByTestId('profile-card-testid'));
				expectEventToBeFired('ui', clickProfileCardEvent);
			});
			it('should fire analytics keyboard profile card event on Enter key', async () => {
				const { user, expectEventToBeFired } = renderProfileCardTrigger({
					testId: 'profile-card-testid',
				});
				await user.click(screen.getByTestId('profile-card-testid'));
				await user.keyboard('{Enter}');
				expectEventToBeFired('ui', clickProfileCardEvent);
			});
		});
	});
});
