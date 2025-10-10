import React from 'react';

import { render, screen } from '@testing-library/react';

import AnalyticsListener from '../../index';

jest.mock('../../ModernAnalyticsListener', () => ({
	__esModule: true,
	default: () => <div>ModernAnalytics</div>,
}));

describe('ExportedAnalyticsListener', () => {
	test('renders analytics context', () => {
		const onEvent = jest.fn();
		render(<AnalyticsListener onEvent={onEvent} />);

		expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
	});
});
