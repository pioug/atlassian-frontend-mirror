import React from 'react';

import { render } from '@testing-library/react';

import ErrorMessage from '../ErrorMessage';

const mockFireAnalytics = jest.fn();

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

	it('should render the error message', () => {
		render(<ErrorMessage fireAnalytics={mockFireAnalytics} />);
		expect(mockFireAnalytics).toHaveBeenCalledWith(
			`${event.eventType}.${event.actionSubject}.${event.action}.${event.actionSubjectId}`,
			event.attributes,
		);
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<ErrorMessage fireAnalytics={mockFireAnalytics} />);
		await expect(container).toBeAccessible();
	});
});
