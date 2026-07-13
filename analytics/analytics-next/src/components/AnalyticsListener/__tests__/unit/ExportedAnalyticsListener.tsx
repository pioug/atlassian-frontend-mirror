import React from 'react';

import { render, screen } from '@testing-library/react';

import AnalyticsListener from '../../index';

// The modern context path is selected via isModernContextEnabledEnv (env-driven and falsy in
// Jest). Force it truthy so the modern listener is exercised without removing the env util.
jest.mock('../../../../utils/isModernContextEnabledEnv', () => ({
	__esModule: true,
	default: true,
}));

jest.mock('../../LegacyAnalyticsListener', () => ({
	__esModule: true,
	default: () => <div>LegacyAnalytics</div>,
}));

jest.mock('../../ModernAnalyticsListener', () => ({
	__esModule: true,
	default: () => <div>ModernAnalytics</div>,
}));

describe('ExportedAnalyticsListener', () => {
	it('uses the modern analytics listener', async () => {
		const onEvent = jest.fn();
		const { container } = render(<AnalyticsListener onEvent={onEvent} />);

		expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
		await expect(container).toBeAccessible();
	});
});
