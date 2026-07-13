import React from 'react';

import { render, screen } from '@testing-library/react';

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

describe('ExportedAnalyticsContext', () => {
	it('uses the modern analytics context', async () => {
		const { container } = render(
			<AnalyticsContext data={{ ticket: 'MAGMA-123' }}>
				<div>SomeComponent</div>
			</AnalyticsContext>,
		);

		expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
		await expect(container).toBeAccessible();
	});
});
