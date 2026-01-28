import React from 'react';

import { render } from '@testing-library/react';

import { LoadingState } from '../LoadingState';

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
		actionSubjectId: 'spinner',
		attributes: {
			packageName: '@product/platform',
			packageVersion: '0.0.0',
			firedAt: Math.round(1000),
		},
	};
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render the error message', () => {
		render(<LoadingState fireAnalytics={mockFireAnalytics} profileType="user" />);
		expect(mockFireAnalytics).toHaveBeenCalledWith(
			`${event.eventType}.${event.actionSubject}.${event.action}.${event.actionSubjectId}`,
			event.attributes,
		);
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<LoadingState fireAnalytics={mockFireAnalytics} profileType="user" />,
		);
		await expect(container).toBeAccessible();
	});
});
