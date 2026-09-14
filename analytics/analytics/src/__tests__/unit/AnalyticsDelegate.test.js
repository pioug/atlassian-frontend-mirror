/* eslint-disable */
import React, { Component } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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
			return <button {...props} aria-label="test button" onClick={this.onClick} />;
		}
	},
);

const clickButton = () => fireEvent.click(screen.getByRole('button'));

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
		render(
			<AnalyticsDelegate>
				<Button />
			</AnalyticsDelegate>,
		);

		clickButton();
		const mockWarnCalls = console.warn.mock.calls.filter((call) => !shouldIgnoreLog(call));
		expect(mockWarnCalls.length).toBe(0);
		const mockCalls = console.error.mock.calls.filter((call) => !shouldIgnoreLog(call));
		expect(mockCalls.length).toBe(0);
	});

	it('should pass through public/private events', () => {
		const spy = jest.fn();
		render(
			<AnalyticsDelegate delegateAnalyticsEvent={spy}>
				<Button analyticsId="cheese" />
			</AnalyticsDelegate>,
		);

		clickButton();
		expect(spy).toHaveBeenCalledTimes(2);
		expect(spy).toHaveBeenCalledWith('cheese.click', {}, false);
		expect(spy).toHaveBeenCalledWith('private.button.click', { one: 1 }, true);
	});
});
