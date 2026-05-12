import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import MediaCardAnalyticsErrorBoundary from '../../media-card-analytics-error-boundary';
import * as analyticsModule from '../../../utils/analytics/analytics';

const fireOperationalEvent = jest.spyOn(analyticsModule, 'fireMediaCardEvent');

class MockComponent extends React.Component<{ callFn?: () => void }> {
	componentDidMount() {
		this.props?.callFn && this.props.callFn();
	}
	render(): React.ReactNode {
		return <div>Mock Component</div>;
	}
}
const rejectWithError = () => {
	throw new Error('whatever');
};

describe('MediaCardAnalyticsErrorBoundary', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<MediaCardAnalyticsErrorBoundary>
				<MockComponent />
			</MediaCardAnalyticsErrorBoundary>,
		);
		await expect(container).toBeAccessible();
	});

	it(`should render child component with card layout`, () => {
		render(
			<MediaCardAnalyticsErrorBoundary>
				<MockComponent />
			</MediaCardAnalyticsErrorBoundary>,
		);
		expect(screen.getByText('Mock Component')).toBeInTheDocument();
		expect(screen.queryByTestId('unhandled-error-card')).not.toBeInTheDocument();
	});

	it(`should render UnhandledErrorCard when error thrown`, () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		render(
			<MediaCardAnalyticsErrorBoundary>
				<MockComponent callFn={rejectWithError} />
			</MediaCardAnalyticsErrorBoundary>,
		);

		expect(screen.getByTestId('unhandled-error-card')).toBeInTheDocument();
		consoleSpy.mockRestore();
	});

	it(`should fire operational event on rendering`, () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		render(
			<MediaCardAnalyticsErrorBoundary>
				<MockComponent callFn={rejectWithError} />
			</MediaCardAnalyticsErrorBoundary>,
		);
		expect(fireOperationalEvent).toBeCalledTimes(1);
		expect(fireOperationalEvent).toBeCalledWith(
			{
				action: 'failed',
				actionSubject: 'mediaCardRender',
				attributes: {
					error: expect.objectContaining({ message: 'whatever' }),
					failReason: 'unexpected-error',
					info: {
						componentStack: expect.any(String),
					},
					browserInfo: expect.any(String),
				},
				eventType: 'operational',
			},
			expect.any(Function),
		);
		consoleSpy.mockRestore();
	});
});
