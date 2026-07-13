import React from 'react';

import { render, screen } from '@testing-library/react';

import AnalyticsErrorBoundary from '../../AnalyticsErrorBoundary';

// AnalyticsErrorBoundary selects the modern context path via isModernContextEnabledEnv (env-driven
// and falsy in Jest). Force it truthy so the modern context is exercised without removing the env util.
jest.mock('../../../utils/isModernContextEnabledEnv', () => ({
	__esModule: true,
	default: true,
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

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
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

	test('renders the analytics context when there is an error', () => {
		render(
			<AnalyticsErrorBoundary {...props} ErrorComponent={ErrorScreen} onError={onError}>
				<Something error />
			</AnalyticsErrorBoundary>,
		);

		expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
	});
});

describe('ExportedAnalyticsListener with no Error', () => {
	const onError = jest.fn();
	const Something = () => {
		// this is just a placeholder
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		return <div className="child-component" />;
	};

	test('renders the correct analytics context when there is no error', () => {
		render(
			<AnalyticsErrorBoundary {...props} onError={onError}>
				<Something />
			</AnalyticsErrorBoundary>,
		);

		expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
	});
});
