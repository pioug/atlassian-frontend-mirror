/* eslint-disable */

import React, { Component } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsDecorator, cleanProps, withAnalytics } from '../..';

const Button = withAnalytics(
	class B extends Component {
		onClick = () => {
			const parentData = this.props.getParentAnalyticsData('click');
			this.props.testSpy(parentData);
		};

		render() {
			/* eslint-disable no-unused-vars */
			const { testSpy, ...props } = cleanProps(this.props);
			/* eslint-enable no-unused-vars */
			return <button {...props} aria-label="test button" onClick={this.onClick} />;
		}
	},
);

const clickButton = () => fireEvent.click(screen.getByRole('button'));

describe('getParentAnalyticsData', () => {
	it('should return empty object if no parent decorators', () => {
		const spy = jest.fn();
		render(<Button analyticsId="button" testSpy={spy} />);

		clickButton();
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith({});
	});

	it('should return parentData from immediate parent decorator', () => {
		const spy = jest.fn();
		render(
			<AnalyticsDecorator data={{ one: 1 }}>
				<Button analyticsId="button" testSpy={spy} />
			</AnalyticsDecorator>,
		);

		clickButton();
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith({ one: 1 });
	});

	it('should return parentData from multiple parent decorators', () => {
		const spy = jest.fn();
		render(
			<AnalyticsDecorator data={{ one: 1 }}>
				<AnalyticsDecorator data={{ two: 2 }}>
					<Button analyticsId="button" testSpy={spy} />
				</AnalyticsDecorator>
			</AnalyticsDecorator>,
		);

		clickButton();
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith({ one: 1, two: 2 });
	});

	it('should override fields with parent decorator data', () => {
		const spy = jest.fn();
		render(
			<AnalyticsDecorator data={{ one: 2 }}>
				<AnalyticsDecorator data={{ one: 1 }}>
					<Button analyticsId="button" testSpy={spy} />
				</AnalyticsDecorator>
			</AnalyticsDecorator>,
		);

		clickButton();
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith({ one: 2 });
	});

	it('should return parentData provided by the getData function', () => {
		const spy = jest.fn();
		const getData = () => ({ two: 2 });
		render(
			<AnalyticsDecorator getData={getData}>
				<Button analyticsId="button" testSpy={spy} />
			</AnalyticsDecorator>,
		);

		clickButton();
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith({ two: 2 });
	});

	it('should not return parentData when matchPrivate is true', () => {
		const spy = jest.fn();
		render(
			<AnalyticsDecorator data={{ two: 2 }} matchPrivate>
				<Button analyticsId="button" testSpy={spy} />
			</AnalyticsDecorator>,
		);

		clickButton();
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith({});
	});

	it('should return parentData when partial string match is true', () => {
		const spy = jest.fn();
		render(
			<AnalyticsDecorator data={{ two: 2 }} match="button.">
				<Button analyticsId="button" testSpy={spy} />
			</AnalyticsDecorator>,
		);

		clickButton();
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith({ two: 2 });
	});

	it('should return parentData when full string match is true', () => {
		const spy = jest.fn();
		render(
			<AnalyticsDecorator data={{ two: 2 }} match="button.click">
				<Button analyticsId="button" testSpy={spy} />
			</AnalyticsDecorator>,
		);

		clickButton();
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith({ two: 2 });
	});

	it('should not return parentData when string match is false', () => {
		const spy = jest.fn();
		render(
			<AnalyticsDecorator data={{ two: 2 }} match="no">
				<Button analyticsId="button" testSpy={spy} />
			</AnalyticsDecorator>,
		);

		clickButton();
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith({});
	});

	it('should return parentData when regex match is true', () => {
		const spy = jest.fn();
		render(
			<AnalyticsDecorator data={{ two: 2 }} match={/^bu.*$/}>
				<Button analyticsId="button" testSpy={spy} />
			</AnalyticsDecorator>,
		);

		clickButton();
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith({ two: 2 });
	});

	it('should return parentData when regex match is false', () => {
		const spy = jest.fn();
		render(
			<AnalyticsDecorator data={{ two: 2 }} match={/^no.*$/}>
				<Button analyticsId="button" testSpy={spy} />
			</AnalyticsDecorator>,
		);

		clickButton();
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith({});
	});

	it('should return parentData when function match is true', () => {
		const spy = jest.fn();
		render(
			<AnalyticsDecorator data={{ two: 2 }} match={() => true}>
				<Button analyticsId="button" testSpy={spy} />
			</AnalyticsDecorator>,
		);

		clickButton();
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith({ two: 2 });
	});

	it('should not return parentData when function match is false', () => {
		const spy = jest.fn();
		render(
			<AnalyticsDecorator data={{ two: 2 }} match={() => false}>
				<Button analyticsId="button" testSpy={spy} />
			</AnalyticsDecorator>,
		);

		clickButton();
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith({});
	});
});
