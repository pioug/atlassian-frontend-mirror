import React from 'react';

import { render, screen } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import AnalyticsContext from '../../index';

// The modern context path is selected via isModernContextEnabledEnv (env-driven and falsy in
// Jest). Force it truthy so the modern context is exercised without removing the env util.
jest.mock('../../../../utils/isModernContextEnabledEnv', () => ({
	__esModule: true,
	default: true,
}));

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

// The context is now always modern; the analytics-next-lock-context-type gate only controls
// whether that value is captured at mount or read live, so both states resolve to modern.
describe('AnalyticsContext analytics-next-lock-context-type gate', () => {
	it('has no accessibility violations', async () => {
		failGate('analytics-next-lock-context-type');
		const { container } = renderAnalyticsContext();
		await expect(container).toBeAccessible();
	});

	describe('gate off (live per-render read)', () => {
		it('uses the modern context', () => {
			failGate('analytics-next-lock-context-type');
			renderAnalyticsContext();
			expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
		});
	});

	describe('gate on (value captured at mount)', () => {
		it('uses the modern context', () => {
			passGate('analytics-next-lock-context-type');
			renderAnalyticsContext();
			expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
		});
	});
});
