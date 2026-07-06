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

const renderAnalyticsContext = () =>
	render(
		<AnalyticsContext data={{ ticket: 'MAGMA-123' }}>
			<div>SomeComponent</div>
		</AnalyticsContext>,
	);

describe('AnalyticsContext analytics-next-lock-context-type gate', () => {
	it('has no accessibility violations', async () => {
		failGate('analytics-next-lock-context-type');
		failGate('analytics-next-use-legacy-context');
		const { container } = renderAnalyticsContext();
		await expect(container).toBeAccessible();
	});

	describe('gate off (live per-render read)', () => {
		it('uses modern context when analytics-next-use-legacy-context is off', () => {
			failGate('analytics-next-lock-context-type');
			failGate('analytics-next-use-legacy-context');
			renderAnalyticsContext();
			expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
		});

		it('uses legacy context when analytics-next-use-legacy-context is on', () => {
			failGate('analytics-next-lock-context-type');
			passGate('analytics-next-use-legacy-context');
			renderAnalyticsContext();
			expect(screen.getByText('LegacyAnalytics')).toBeInTheDocument();
		});
	});

	describe('gate on (value captured at mount)', () => {
		it('uses modern context when analytics-next-use-legacy-context is off', () => {
			passGate('analytics-next-lock-context-type');
			failGate('analytics-next-use-legacy-context');
			renderAnalyticsContext();
			expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
		});

		it('uses legacy context when analytics-next-use-legacy-context is on', () => {
			passGate('analytics-next-lock-context-type');
			passGate('analytics-next-use-legacy-context');
			renderAnalyticsContext();
			expect(screen.getByText('LegacyAnalytics')).toBeInTheDocument();
		});
	});
});
