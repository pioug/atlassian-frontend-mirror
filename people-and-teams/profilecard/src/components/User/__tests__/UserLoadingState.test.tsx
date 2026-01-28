import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import UserLoadingState from '../UserLoadingState';

jest.mock('../../../util/performance', () => {
	return {
		...jest.requireActual('../../../util/performance'),
		getPageTime: jest.fn().mockReturnValue(1000),
	};
});

describe('analytics', () => {
	const mockFireAnalytics = jest.fn();

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

	const renderUserLoadingState = () => {
		return render(
			<IntlProvider locale="en">
				<UserLoadingState fireAnalytics={mockFireAnalytics} />
			</IntlProvider>,
		);
	};

	it('should fire analytics keyboard profile card event on Enter key', async () => {
		renderUserLoadingState();
		expect(mockFireAnalytics).toHaveBeenCalledWith(
			`${event.eventType}.${event.actionSubject}.${event.action}.${event.actionSubjectId}`,
			event.attributes,
		);
	});
	it('should capture and report a11y violations', async () => {
		const { container } = renderUserLoadingState();
		await expect(container).toBeAccessible();
	});
});
