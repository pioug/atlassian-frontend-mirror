import React from 'react';

import { render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import AnalyticsErrorBoundary from '../../AnalyticsErrorBoundary';

jest.mock('../../AnalyticsContext/LegacyAnalyticsContext', () => ({
	__esModule: true,
	default: () => <div>LegacyAnalytics</div>,
}));

jest.mock('../../AnalyticsContext/ModernAnalyticsContext', () => ({
	__esModule: true,
	default: () => <div>ModernAnalytics</div>,
}));

const props = {
	channel: 'atlaskit',
	data: {
		componentName: 'button',
		packageName: '@atlaskit/button',
		componentVersion: '999.9.9',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
	children: <div className="child-component" />,
};

describe('ExportedAnalyticsListener with Error', () => {
	const onError = jest.fn();
	const error = new Error('Error');
	const Something = (p: { error: boolean }) => {
		if (p.error) {
			throw error;
		}
		// this is just a placeholder
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		return <div className="child-component" />;
	};

	const ErrorScreen = () => {
		return <div>Error occurred</div>;
	};

	ffTest(
		'platform.analytics-next-use-modern-context_fqgbx',
		() => {
			render(
				<AnalyticsErrorBoundary {...props} ErrorComponent={ErrorScreen} onError={onError}>
					<Something error />
				</AnalyticsErrorBoundary>,
			);

			// when the ff is on- we expect the modern context to be used
			expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
		},
		() => {
			render(
				<AnalyticsErrorBoundary {...props} ErrorComponent={ErrorScreen} onError={onError}>
					<Something error />
				</AnalyticsErrorBoundary>,
			);

			// when the ff is off - we expect the legacy context to be used
			expect(screen.getByText('LegacyAnalytics')).toBeInTheDocument();
		},
	);
});

describe('ExportedAnalyticsListener with no Error', () => {
	const onError = jest.fn();
	const Something = () => {
		// this is just a placeholder
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		return <div className="child-component" />;
	};

	ffTest(
		'platform.analytics-next-use-modern-context_fqgbx',
		() => {
			render(
				<AnalyticsErrorBoundary {...props} onError={onError}>
					<Something />
				</AnalyticsErrorBoundary>,
			);

			// when the ff is on- we expect the modern context to be used
			expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
		},
		() => {
			render(
				<AnalyticsErrorBoundary {...props} onError={onError}>
					<Something />
				</AnalyticsErrorBoundary>,
			);

			// when the ff is off - we expect the legacy context to be used
			expect(screen.getByText('LegacyAnalytics')).toBeInTheDocument();
		},
	);
});
