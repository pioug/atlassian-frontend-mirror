import React from 'react';

import { render, screen } from '@testing-library/react';

import AnalyticsContext from '../../index';

jest.mock('../../ModernAnalyticsContext', () => ({
	__esModule: true,
	default: () => <div>ModernAnalytics</div>,
}));

describe('ExportedAnalyticsListener', () => {
	test('renders the correct analytics context', () => {
		render(
			<AnalyticsContext data={{ ticket: 'MAGMA-123' }}>
				<div>SomeComponent</div>
			</AnalyticsContext>,
		);

		expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
	});
});
