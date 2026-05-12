import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import * as analyticsModule from '../../../utils/analytics/analytics';
import MediaInlineAnalyticsErrorBoundary from '../../mediaInlineAnalyticsErrorBoundary';

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

describe('MediaInlineAnalyticsErrorBoundary a11y', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<MediaInlineAnalyticsErrorBoundary>
				<MockComponent />
			</MediaInlineAnalyticsErrorBoundary>,
		);
		await expect(container).toBeAccessible();
	});
});

/*
 * Re-enabled in the Enzyme → RTL migration.
 *
 * Originally skipped on 2024-10-10 (PR #150687, ref #hot-112198) because the
 * Enzyme `mount`-based assertions left open handles and timed out CI:
 *   - the `withAnalyticsEvents` HOC subscription was not torn down between tests
 *   - `componentDidCatch` → `setState({ hasError: true })` left pending React
 *     work scheduled after the test body returned
 *
 * Migrating to RTL `render` resolves both: `@testing-library/react` registers
 * an automatic `cleanup()` in `afterEach`, which unmounts the tree (tearing
 * down the analytics subscription) and flushes the trailing `setState` before
 * the next test starts. Verified locally with `afm test unit ... --run-in-band`:
 * all 3 tests pass with no open-handle warnings.
 */
describe('MediaInlineAnalyticsErrorBoundary', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it(`should render inline child component`, () => {
		render(
			<MediaInlineAnalyticsErrorBoundary>
				<MockComponent />
			</MediaInlineAnalyticsErrorBoundary>,
		);
		expect(screen.getByText('Mock Component')).toBeInTheDocument();
	});

	it(`should render error boundary component when error thrown with the correct message`, () => {
		// React logs caught errors via console.error; silence to keep test output clean.
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		render(
			<MediaInlineAnalyticsErrorBoundary>
				<MockComponent callFn={rejectWithError} />
			</MediaInlineAnalyticsErrorBoundary>,
		);
		const errorBoundary = screen.getByTestId('media-inline-error-boundary');
		expect(errorBoundary).toBeInTheDocument();
		expect(errorBoundary).toHaveTextContent("We couldn't load this content");
		consoleSpy.mockRestore();
	});

	it(`should fire operational event on rendering`, () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		render(
			<MediaInlineAnalyticsErrorBoundary>
				<MockComponent callFn={rejectWithError} />
			</MediaInlineAnalyticsErrorBoundary>,
		);
		expect(fireOperationalEvent).toBeCalledTimes(1);
		expect(fireOperationalEvent).toBeCalledWith(
			{
				action: 'failed',
				actionSubject: 'mediaInlineRender',
				attributes: {
					error: expect.objectContaining({ message: 'whatever' }),
					info: {
						componentStack: expect.any(String),
					},
					browserInfo: expect.any(String),
					failReason: 'unexpected-error',
				},
				eventType: 'operational',
			},
			expect.any(Function),
		);
		consoleSpy.mockRestore();
	});
});
