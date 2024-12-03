import React from 'react';

import { render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

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
	ffTest(
		'analytics-next-use-modern-context_jira',
		() => {
			const onEvent = jest.fn();
			render(<AnalyticsListener onEvent={onEvent} />);

			// when the ff is on- we expect the modern context to be used
			expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
		},
		() => {
			const onEvent = jest.fn();
			render(<AnalyticsListener onEvent={onEvent} />);

			// when the ff is off - we expect the legacy context to be used
			expect(screen.getByText('LegacyAnalytics')).toBeInTheDocument();
		},
	);
});
