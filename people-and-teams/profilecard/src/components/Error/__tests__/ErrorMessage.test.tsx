import React from 'react';

import { render } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import ErrorMessage from '../ErrorMessage';

const mockFireAnalytics = jest.fn();
const mockFireAnalyticsNext = jest.fn();

jest.mock('../../../util/performance', () => ({
	getPageTime: jest.fn().mockImplementation(() => 1000),
}));

Object.defineProperty(performance, 'now', {
	writable: true,
	value: jest.fn().mockReturnValue(1000),
});

describe('ErrorMessage', () => {
	const event = {
		eventType: 'ui',
		action: 'rendered',
		actionSubject: 'profilecard',
		actionSubjectId: 'error',
		attributes: {
			hasRetry: false,
			errorType: 'default',
			packageName: '@product/platform',
			packageVersion: '0.0.0',
			firedAt: Math.round(1000),
		},
	};
	beforeEach(() => {
		jest.clearAllMocks();
	});

	ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
		it('should render the error message', () => {
			render(
				<ErrorMessage
					fireAnalytics={mockFireAnalytics}
					fireAnalyticsNext={mockFireAnalyticsNext}
				/>,
			);
			expect(mockFireAnalytics).toHaveBeenCalledWith(event);
			expect(mockFireAnalyticsNext).not.toHaveBeenCalled();
		});

		it('should capture and report a11y violations', async () => {
			const { container } = render(
				<ErrorMessage
					fireAnalytics={mockFireAnalytics}
					fireAnalyticsNext={mockFireAnalyticsNext}
				/>,
			);
			await expect(container).toBeAccessible();
		});
	});

	ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
		it('should render the error message', () => {
			render(
				<ErrorMessage
					fireAnalytics={mockFireAnalytics}
					fireAnalyticsNext={mockFireAnalyticsNext}
				/>,
			);
			expect(mockFireAnalyticsNext).toHaveBeenCalledWith(
				`${event.eventType}.${event.actionSubject}.${event.action}.${event.actionSubjectId}`,
				event.attributes,
			);
			expect(mockFireAnalytics).not.toHaveBeenCalled();
		});

		it('should capture and report a11y violations', async () => {
			const { container } = render(
				<ErrorMessage
					fireAnalytics={mockFireAnalytics}
					fireAnalyticsNext={mockFireAnalyticsNext}
				/>,
			);
			await expect(container).toBeAccessible();
		});
	});
});
