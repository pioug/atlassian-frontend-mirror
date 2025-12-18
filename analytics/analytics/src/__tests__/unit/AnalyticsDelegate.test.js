/* eslint-disable  */
import React, { Component } from 'react';
import { mount } from 'enzyme';
import { shouldIgnoreLog } from '@af/suppress-react-warnings';
import { AnalyticsDelegate, cleanProps, withAnalytics } from '../..';

afterEach(() => {
	jest.resetAllMocks();
});

const Button = withAnalytics(
	class B extends Component {
		onClick = () => {
			this.props.fireAnalyticsEvent('click');
			this.props.firePrivateAnalyticsEvent('private.button.click', {
				one: 1,
			});
		};

		render() {
			const props = cleanProps(this.props);
			return <button {...props} onClick={this.onClick} />;
		}
	},
);

describe('AnalyticsDelegate', () => {
	beforeEach(() => {
		jest.spyOn(global.console, 'warn').mockImplementation(() => {});
		jest.spyOn(global.console, 'error').mockImplementation(() => {});
	});
	afterEach(() => {
		global.console.warn.mockRestore();
		global.console.error.mockRestore();
	});

	it('should ignore events if no delegateAnalyticsEvent callback', () => {
		const component = mount(
			<AnalyticsDelegate>
				<Button />
			</AnalyticsDelegate>,
		);
		component.find(Button).simulate('click');
		const mockWarnCalls = console.warn.mock.calls.filter((call) => !shouldIgnoreLog(call));
		expect(mockWarnCalls.length).toBe(0);
		const mockCalls = console.error.mock.calls.filter((call) => !shouldIgnoreLog(call));
		expect(mockCalls.length).toBe(0);
	});

	it('should pass through public/private events', () => {
		const spy = jest.fn();
		const component = mount(
			<AnalyticsDelegate delegateAnalyticsEvent={spy}>
				<Button analyticsId="cheese" />
			</AnalyticsDelegate>,
		);
		component.find(Button).simulate('click');
		expect(spy).toHaveBeenCalledTimes(2);
		expect(spy).toHaveBeenCalledWith('cheese.click', {}, false);
		expect(spy).toHaveBeenCalledWith('private.button.click', { one: 1 }, true);
	});
});
