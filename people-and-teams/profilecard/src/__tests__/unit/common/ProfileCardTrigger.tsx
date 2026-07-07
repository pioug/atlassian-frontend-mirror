// platform/packages/people-and-teams/profilecard/src/__tests__/unit/ProfileCardTrigger.test.tsx

import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { Text } from '@atlaskit/primitives/compiled';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { renderWithAnalyticsListener } from '@atlassian/ptc-test-utils';

import ProfileCardTrigger from '../../../components/common/ProfileCardTrigger';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

describe('ProfileCardTrigger', () => {
	const mockFetchProfile = jest.fn();
	const renderProfileCard = jest.fn();
	const fireAnalytics = jest.fn();
	const fixAriaAttributeViolationGate = 'fix_aria_attribute_violation_on_agent_card_trigger';

	const renderWithIntl = ({
		trigger,
		fetchProfile,
		disabledAriaAttributes,
	}: {
		trigger: 'hover' | 'click';
		fetchProfile?: jest.Mock;
		disabledAriaAttributes?: boolean;
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
					disabledAriaAttributes={disabledAriaAttributes}
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
			jest.spyOn(performance, 'now').mockReturnValue(1000);
		});

		it('should fire analytics hover profile card event', async () => {
			const { user } = renderWithIntl({ trigger: 'hover' });
			await user.hover(screen.getByTestId('profile-card-testid'));
			await waitFor(() => {
				expect(screen.getByTestId('profile-card--trigger-content')).toBeInTheDocument();
			});
			await user.hover(screen.getByTestId('profile-card--trigger-content'));
			expect(fireAnalytics).toHaveBeenCalledWith(
				`${hoverProfileCardEvent.eventType}.${hoverProfileCardEvent.actionSubject}.${hoverProfileCardEvent.action}`,
				hoverProfileCardEvent.attributes,
			);
		});
		it('should fire analytics click profile card event', async () => {
			const { user } = renderWithIntl({ trigger: 'click' });
			await user.click(screen.getByTestId('profile-card-testid'));
			expect(fireAnalytics).toHaveBeenCalledWith(
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
			expect(fireAnalytics).toHaveBeenCalledWith(
				`${loadingProfileCardEvent.eventType}.${loadingProfileCardEvent.actionSubject}.${loadingProfileCardEvent.action}.${loadingProfileCardEvent.actionSubjectId}`,
				loadingProfileCardEvent.attributes,
			);
		});
	});

	describe('aria attributes on the trigger', () => {
		const openPopupAndGetTrigger = async () => {
			const triggerEl = screen.getByTestId('profile-card-testid');
			fireEvent.click(triggerEl);
			await waitFor(() => {
				expect(screen.getByTestId('profile-card--trigger-content')).toBeInTheDocument();
			});
			return triggerEl;
		};

		it('keeps the aria attributes provided by the popup trigger when disabledAriaAttributes is not set', async () => {
			renderWithIntl({ trigger: 'click' });

			const triggerEl = await openPopupAndGetTrigger();
			expect(triggerEl).toHaveAttribute('aria-haspopup');
			expect(triggerEl).toHaveAttribute('aria-expanded');
			expect(triggerEl).toHaveAttribute('aria-controls');
		});

		it('removes aria-expanded, aria-haspopup and aria-controls from the trigger when disabledAriaAttributes is set and the gate is enabled', async () => {
			passGate(fixAriaAttributeViolationGate);
			const { container } = renderWithIntl({ trigger: 'click', disabledAriaAttributes: true });

			const triggerEl = await openPopupAndGetTrigger();
			expect(triggerEl).not.toHaveAttribute('aria-expanded');
			expect(triggerEl).not.toHaveAttribute('aria-haspopup');
			expect(triggerEl).not.toHaveAttribute('aria-controls');
			await expect(container).toBeAccessible();
		});

		it('removes aria-expanded and aria-haspopup but keeps aria-controls on the trigger when disabledAriaAttributes is set and the gate is disabled', async () => {
			failGate(fixAriaAttributeViolationGate);
			renderWithIntl({ trigger: 'click', disabledAriaAttributes: true });

			const triggerEl = await openPopupAndGetTrigger();
			expect(triggerEl).not.toHaveAttribute('aria-expanded');
			expect(triggerEl).not.toHaveAttribute('aria-haspopup');
			expect(triggerEl).toHaveAttribute('aria-controls');
		});
	});
});
