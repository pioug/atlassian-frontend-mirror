import React from 'react';

import { render, screen } from '@testing-library/react';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import AnalyticsErrorBoundary from '../../AnalyticsErrorBoundary';

jest.mock('../../AnalyticsContext/LegacyAnalyticsContext', () => ({
	__esModule: true,
	default: ({ children }: { children: React.ReactNode }) => <div>LegacyAnalytics{children}</div>,
}));

jest.mock('../../AnalyticsContext/ModernAnalyticsContext', () => ({
	__esModule: true,
	default: ({ children }: { children: React.ReactNode }) => <div>ModernAnalytics{children}</div>,
}));

const props = {
	channel: 'atlaskit',
	data: {
		componentName: 'button',
		packageName: '@atlaskit/button',
		componentVersion: '999.9.9',
	},
};

const ChildComponent = () => <div data-testid="child-component" />;

const SomethingWithError = ({ error: hasError }: { error: boolean }) => {
	if (hasError) {
		throw new Error('Error');
	}
	return <ChildComponent />;
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('AnalyticsErrorBoundary', () => {
	beforeEach(() => {
		jest.spyOn(global.console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should render the child component', () => {
		const onError = jest.fn();
		render(
			<AnalyticsErrorBoundary {...props} onError={onError}>
				<ChildComponent />
			</AnalyticsErrorBoundary>,
		);

		expect(onError).not.toHaveBeenCalled();
		expect(screen.getByTestId('child-component')).toBeInTheDocument();
	});

	it('uses modern context when the Admin Hub gate is on, despite the legacy-context gate', () => {
		passGate('analytics-next-use-legacy-context');
		passGate('adminhub-analytics-next-use-modern-context');

		render(
			<AnalyticsErrorBoundary {...props}>
				<ChildComponent />
			</AnalyticsErrorBoundary>,
		);

		expect(screen.getByText('ModernAnalytics')).toBeInTheDocument();
		expect(screen.queryByText('LegacyAnalytics')).not.toBeInTheDocument();
	});

	it('should render error component when error occurs', async () => {
		const onError = jest.fn();

		const ErrorScreen = () => {
			return <div>Error occurred</div>;
		};

		render(
			<AnalyticsErrorBoundary {...props} ErrorComponent={ErrorScreen} onError={onError}>
				<SomethingWithError error={true} />
			</AnalyticsErrorBoundary>,
		);

		expect(onError).toHaveBeenCalledTimes(1);
		expect(screen.getByText('Error occurred')).toBeInTheDocument();
	});

	it('should render empty DOM when error occurs and no ErrorComponent', async () => {
		const onError = jest.fn();

		const { container } = render(
			<AnalyticsErrorBoundary {...props} onError={onError}>
				<SomethingWithError error={true} />
			</AnalyticsErrorBoundary>,
		);

		expect(onError).toHaveBeenCalledTimes(1);
		expect(container).toBeEmptyDOMElement();
	});
});
