import React from 'react';
import { mount } from 'enzyme';
import * as analyticsModule from '../../../utils/analytics/analytics';
import MediaInlineAnalyticsErrorBoundary from '../../mediaInlineAnalyticsErrorBoundary';

const fireOperationalEvent = jest.spyOn(analyticsModule, 'fireMediaCardEvent');

class MockComponent extends React.Component<{ callFn?: Function }> {
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

describe('MediaInlineAnalyticsErrorBoundary', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it(`should render inline child component`, () => {
		const component = mount(
			<MediaInlineAnalyticsErrorBoundary>
				<MockComponent />
			</MediaInlineAnalyticsErrorBoundary>,
		);
		expect(component.find(MockComponent).exists()).toBe(true);
	});

	it(`should render error boundary component when error thrown with the correct message`, () => {
		const component = mount(
			<MediaInlineAnalyticsErrorBoundary>
				<MockComponent callFn={rejectWithError} />
			</MediaInlineAnalyticsErrorBoundary>,
		);
		const inlineCardErrorView = component.find('ErrorBoundaryComponent');
		expect(inlineCardErrorView.exists()).toBe(true);
		expect(inlineCardErrorView.prop('message')).toBe("We couldn't load this content");
	});

	it(`should fire operational event on rendering`, () => {
		mount(
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
	});
});
