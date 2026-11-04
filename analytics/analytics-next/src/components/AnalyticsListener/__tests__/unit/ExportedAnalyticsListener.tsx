import React from 'react';

import { render, screen } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import AnalyticsListener from '../../index';

jest.mock('../../LegacyAnalyticsListener', () => ({
	__esModule: true,
	default: () => <div>LegacyAnalytics</div>,
}));

jest.mock('../../ModernAnalyticsListener', () => ({
	__esModule: true,
	default: () => <div>ModernAnalytics</div>,
}));

describe('ExportedAnalyticsListener', () => {
	it('with analytics-next-use-legacy-context on', () => {
		passGate('analytics-next-use-legacy-context');

		const onEvent = jest.fn();
		render(<AnalyticsListener onEvent={onEvent} />);

		// when the ff is off - we expect the legacy context to be used
		expect(screen.getByText('LegacyAnalytics')).toBeInTheDocument();
	});

	it('with analytics-next-use-legacy-context off', () => {
		failGate('analytics-next-use-legacy-context');

		const onEvent = jest.fn();
		render(<AnalyticsListener onEvent={onEvent} />);

		// when the ff is on- we expect the modern context to be used
		expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
	});

	it('uses modern context when the Admin Hub gate is on, despite the legacy-context gate', async () => {
		passGate('analytics-next-use-legacy-context');
		passGate('adminhub-analytics-next-use-modern-context');

		const { container } = render(<AnalyticsListener onEvent={jest.fn()} />);

		expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
		await expect(container).toBeAccessible();
	});
});
