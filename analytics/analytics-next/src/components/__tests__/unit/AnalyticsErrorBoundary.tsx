import React from 'react';

import { render, screen } from '@testing-library/react';

import AnalyticsErrorBoundary from '../../AnalyticsErrorBoundary';

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
