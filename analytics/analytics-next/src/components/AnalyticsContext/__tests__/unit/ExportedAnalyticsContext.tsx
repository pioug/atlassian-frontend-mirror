import React from 'react';

import { render, screen } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import AnalyticsContext from '../../index';

jest.mock('../../LegacyAnalyticsContext', () => ({
	__esModule: true,
	default: () => <div>LegacyAnalytics</div>,
}));

jest.mock('../../ModernAnalyticsContext', () => ({
	__esModule: true,
	default: () => <div>ModernAnalytics</div>,
}));

describe('ExportedAnalyticsListener', () => {
	it('has no accessibility violations', async () => {
		const { container } = render(
			<AnalyticsContext data={{ ticket: 'MAGMA-123' }}>
				<div>SomeComponent</div>
			</AnalyticsContext>,
		);
		await expect(container).toBeAccessible();
	});

	it('with analytics-next-use-legacy-context on', () => {
		passGate('analytics-next-use-legacy-context');

		render(
			<AnalyticsContext data={{ ticket: 'MAGMA-123' }}>
				<div>SomeComponent</div>
			</AnalyticsContext>,
		);

		// when the ff is off - we expect the legacy context to be used
		expect(screen.getByText('LegacyAnalytics')).toBeInTheDocument();
	});

	it('with analytics-next-use-legacy-context off', () => {
		failGate('analytics-next-use-legacy-context');

		render(
			<AnalyticsContext data={{ ticket: 'MAGMA-123' }}>
				<div>SomeComponent</div>
			</AnalyticsContext>,
		);

		// when the ff is on- we expect the modern context to be used
		expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
	});
});
