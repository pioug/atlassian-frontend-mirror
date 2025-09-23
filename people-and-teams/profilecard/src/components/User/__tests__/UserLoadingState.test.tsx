import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { mockRunItLaterSynchronously } from '@atlassian/ptc-test-utils';

import UserLoadingState from '../UserLoadingState';

jest.mock('../../../util/performance', () => {
	return {
		...jest.requireActual('../../../util/performance'),
		getPageTime: jest.fn().mockReturnValue(1000),
	};
});

describe('analytics', () => {
	const mockFireAnalytics = jest.fn();
	const mockFireAnalyticsNext = jest.fn();

	const event = {
		eventType: 'ui',
		action: 'rendered',
		actionSubject: 'profilecard',
		actionSubjectId: 'spinner',
		attributes: {
			packageName: process.env._PACKAGE_NAME_,
			packageVersion: process.env._PACKAGE_VERSION_,
			firedAt: 1000,
		},
	};

	beforeEach(() => {
		mockRunItLaterSynchronously();
	});

	const renderUserLoadingState = () => {
		return render(
			<IntlProvider locale="en">
				<UserLoadingState
					fireAnalytics={mockFireAnalytics}
					fireAnalyticsNext={mockFireAnalyticsNext}
				/>
			</IntlProvider>,
		);
	};

	ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
		it('should fire loading profile card event', async () => {
			renderUserLoadingState();
			expect(mockFireAnalytics).toHaveBeenCalledWith(event);
		});
	});

	ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
		it('should fire analytics keyboard profile card event on Enter key', async () => {
			renderUserLoadingState();
			expect(mockFireAnalyticsNext).toHaveBeenCalledWith(
				`${event.eventType}.${event.actionSubject}.${event.action}.${event.actionSubjectId}`,
				event.attributes,
			);
		});
	});
});
