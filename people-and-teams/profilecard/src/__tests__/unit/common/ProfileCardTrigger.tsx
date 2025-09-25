// platform/packages/people-and-teams/profilecard/src/__tests__/unit/ProfileCardTrigger.test.tsx

import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { Text } from '@atlaskit/primitives/compiled';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import {
	mockRunItLaterSynchronously,
	renderWithAnalyticsListener,
} from '@atlassian/ptc-test-utils';

import ProfileCardTrigger from '../../../components/common/ProfileCardTrigger';

describe('ProfileCardTrigger', () => {
	const mockFetchProfile = jest.fn();
	const renderProfileCard = jest.fn();
	const fireAnalytics = jest.fn();
	const fireAnalyticsNext = jest.fn();

	const renderWithIntl = ({
		trigger,
		fetchProfile,
	}: {
		trigger: 'hover' | 'click';
		fetchProfile?: jest.Mock;
	}) => {
		return renderWithAnalyticsListener(
			<IntlProvider locale="en">
				<ProfileCardTrigger
					trigger={trigger}
					renderProfileCard={renderProfileCard}
					fetchProfile={fetchProfile || mockFetchProfile}
					profileCardType="user"
					testId="profile-card-testid"
					fireAnalytics={fireAnalytics}
					fireAnalyticsNext={fireAnalyticsNext}
				>
					<Text>Profile card Trigger</Text>
				</ProfileCardTrigger>
			</IntlProvider>,
		);
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should show profile card on mouse enter', async () => {
		const { getByText } = renderWithIntl({ trigger: 'hover' });

		fireEvent.mouseEnter(getByText('Profile card Trigger'));

		await waitFor(() => {
			expect(mockFetchProfile).toHaveBeenCalled();
			expect(renderProfileCard).toHaveBeenCalled();
		});
	});

	it('should show profile card on click', async () => {
		const { getByText } = renderWithIntl({ trigger: 'click' });

		fireEvent.click(getByText('Profile card Trigger'));

		await waitFor(() => {
			expect(mockFetchProfile).toHaveBeenCalled();
			expect(renderProfileCard).toHaveBeenCalled();
		});
	});

	describe('analytics', () => {
		const hoverProfileCardEvent = {
			eventType: 'ui',
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
			eventType: 'ui',
			action: 'triggered',
			actionSubject: 'profilecard',
			attributes: {
				method: 'click',
				firedAt: 1000,
				packageName: process.env._PACKAGE_NAME_,
				packageVersion: process.env._PACKAGE_VERSION_,
			},
		};

		const loadingProfileCardEvent = {
			eventType: 'ui',
			action: 'rendered',
			actionSubject: 'profilecard',
			actionSubjectId: 'spinner',
			attributes: {
				firedAt: 1000,
				packageName: process.env._PACKAGE_NAME_,
				packageVersion: process.env._PACKAGE_VERSION_,
			},
		};
		beforeEach(() => {
			mockRunItLaterSynchronously();
			jest.spyOn(performance, 'now').mockReturnValue(1000);
		});

		ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
			it('should fire analytics hover profile card event', async () => {
				const { user } = renderWithIntl({ trigger: 'hover' });
				await user.hover(screen.getByTestId('profile-card-testid'));
				await waitFor(() => {
					expect(screen.getByTestId('profile-card--trigger-content')).toBeInTheDocument();
				});
				await user.hover(screen.getByTestId('profile-card--trigger-content'));
				expect(fireAnalytics).toHaveBeenCalledWith(expect.objectContaining(hoverProfileCardEvent));
			});
			it('should fire analytics click profile card event', async () => {
				const { user } = renderWithIntl({ trigger: 'click' });
				await user.click(screen.getByTestId('profile-card-testid'));
				expect(fireAnalytics).toHaveBeenCalledWith(expect.objectContaining(clickProfileCardEvent));
			});
			it('should fire loading profile card event', async () => {
				const mockFetchProfile = jest.fn(() => new Promise(() => {}));

				const { user } = renderWithIntl({
					trigger: 'hover',
					fetchProfile: mockFetchProfile,
				});

				await user.hover(screen.getByTestId('profile-card-testid'));
				await waitFor(() => {
					expect(screen.getByTestId('profilecard.profilecardtrigger.loading')).toBeInTheDocument();
				});
				expect(fireAnalytics).toHaveBeenCalledWith(
					expect.objectContaining(loadingProfileCardEvent),
				);
			});
		});

		ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
			it('should fire analytics hover profile card event', async () => {
				const { user } = renderWithIntl({ trigger: 'hover' });
				await user.hover(screen.getByTestId('profile-card-testid'));
				await waitFor(() => {
					expect(screen.getByTestId('profile-card--trigger-content')).toBeInTheDocument();
				});
				await user.hover(screen.getByTestId('profile-card--trigger-content'));
				expect(fireAnalyticsNext).toHaveBeenCalledWith(
					`${hoverProfileCardEvent.eventType}.${hoverProfileCardEvent.actionSubject}.${hoverProfileCardEvent.action}`,
					hoverProfileCardEvent.attributes,
				);
			});
			it('should fire analytics click profile card event', async () => {
				const { user } = renderWithIntl({ trigger: 'click' });
				await user.click(screen.getByTestId('profile-card-testid'));
				expect(fireAnalyticsNext).toHaveBeenCalledWith(
					`${clickProfileCardEvent.eventType}.${clickProfileCardEvent.actionSubject}.${clickProfileCardEvent.action}`,
					clickProfileCardEvent.attributes,
				);
			});
			it('should fire loading profile card event', async () => {
				const mockFetchProfile = jest.fn(() => new Promise(() => {}));

				const { user } = renderWithIntl({
					trigger: 'hover',
					fetchProfile: mockFetchProfile,
				});

				await user.hover(screen.getByTestId('profile-card-testid'));
				await waitFor(() => {
					expect(screen.getByTestId('profilecard.profilecardtrigger.loading')).toBeInTheDocument();
				});
				expect(fireAnalyticsNext).toHaveBeenCalledWith(
					`${loadingProfileCardEvent.eventType}.${loadingProfileCardEvent.actionSubject}.${loadingProfileCardEvent.action}.${loadingProfileCardEvent.actionSubjectId}`,
					loadingProfileCardEvent.attributes,
				);
			});
		});
	});
});
