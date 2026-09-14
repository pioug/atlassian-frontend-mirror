/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener, cleanProps, withAnalytics } from '../..';

const clickButton = () => fireEvent.click(screen.getByRole('button'));

describe('withAnalytics', () => {
	it('should render the provided component', async () => {
		const Button = withAnalytics(({ children }) => (
			<button aria-label="test button">{children}</button>
		));

		render(<Button>Hello</Button>);

		expect(screen.getByRole('button')).toHaveTextContent('Hello');
		await expect(document.body).toBeAccessible();
	});

	it('should wrap the component in a WithAnalytics() component', () => {
		class Button extends Component {
			displayName = 'Button';

			render() {
				return <button />;
			}
		}
		const WrappedButton = withAnalytics(Button);

		expect(WrappedButton.displayName).toBe('WithAnalytics(Button)');
	});

	describe('wrapping callback props', () => {
		it('should call original callback props', () => {
			const spy = jest.fn();
			const Button = withAnalytics((props) => (
				<button {...cleanProps(props)} aria-label="test button" />
			));

			render(<Button onClick={spy} />);
			clickButton();

			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should fire analytics events', () => {
			const spy = jest.fn();
			const Button = withAnalytics(
				(props) => <button {...cleanProps(props)} aria-label="test button" />,
				{
					onClick: 'click',
				},
			);

			render(
				<AnalyticsListener onEvent={spy}>
					<Button analyticsId="button" />
				</AnalyticsListener>,
			);
			clickButton();

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith('button.click', {});
		});

		it('should fire analytics events when fireAnalyticsEvent is used directly', () => {
			const spy = jest.fn();
			const Button = withAnalytics(
				(props) => <button {...cleanProps(props)} aria-label="test button" />,
				(fireAnalyticsEvent) => ({
					onClick: () => fireAnalyticsEvent('click'),
				}),
			);

			render(
				<AnalyticsListener onEvent={spy}>
					<Button analyticsId="button" />
				</AnalyticsListener>,
			);
			clickButton();

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith('button.click', {});
		});

		it('should pass eventData to analytics events', () => {
			const spy = jest.fn();
			const Button = withAnalytics(
				(props) => <button {...cleanProps(props)} aria-label="test button" />,
				{
					onClick: 'click',
				},
			);

			render(
				<AnalyticsListener onEvent={spy}>
					<Button analyticsId="button" analyticsData={{ foo: 'bar' }} />
				</AnalyticsListener>,
			);
			clickButton();

			expect(spy).toHaveBeenCalledWith('button.click', { foo: 'bar' });
		});

		it('should pass through analyticsId to the WrappedComponent', () => {
			const TestComponent = ({ analyticsId }) => (
				<button
					aria-label="test button"
					data-testid="wrapped-button"
					data-analytics-id={analyticsId}
				/>
			);
			const ComponentWithAnalytics = withAnalytics(TestComponent);
			const TEST_ANALYTICS_ID = 'test.analytics.id';

			render(<ComponentWithAnalytics analyticsId={TEST_ANALYTICS_ID} />);

			expect(screen.getByTestId('wrapped-button')).toHaveAttribute(
				'data-analytics-id',
				TEST_ANALYTICS_ID,
			);
		});

		it('should use defaultProps for analyticsId and analyticsData', () => {
			const spy = jest.fn();
			const Button = withAnalytics(
				(props) => <button {...cleanProps(props)} aria-label="test button" />,
				{
					onClick: 'click',
				},
				{
					analyticsId: 'button',
					analyticsData: { foo: 'bar' },
				},
			);

			render(
				<AnalyticsListener onEvent={spy}>
					<Button />
				</AnalyticsListener>,
			);
			clickButton();

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith('button.click', { foo: 'bar' });
		});

		it('should override defaultProps with specified analyticsId and analyticsData', () => {
			const spy = jest.fn();
			const Button = withAnalytics(
				(props) => <button {...cleanProps(props)} aria-label="test button" />,
				{
					onClick: 'click',
				},
				{
					analyticsId: 'button',
					analyticsData: { foo: 'bar' },
				},
			);

			render(
				<AnalyticsListener onEvent={spy}>
					<Button analyticsId="specified.button" analyticsData={{ one: 1 }} />
				</AnalyticsListener>,
			);
			clickButton();

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith('specified.button.click', { one: 1 });
		});

		it('should not fire analytics if missing analyticsId', () => {
			const spy = jest.fn();
			const Button = withAnalytics(
				(props) => <button {...cleanProps(props)} aria-label="test button" />,
				{
					onClick: 'click',
				},
			);

			render(
				<AnalyticsListener onEvent={spy}>
					<Button analyticsData={{ one: 1 }} />
				</AnalyticsListener>,
			);
			clickButton();

			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe('withDelegation', () => {
		class TestComponent extends Component {
			onClick = () => {
				if (this.props.delegateAnalyticsEvent) {
					this.props.delegateAnalyticsEvent('click', { foo: 'bar' }, !!this.props.privateEvent);
				}
			};

			render() {
				/* eslint-disable no-unused-vars */
				const { privateEvent, ...cleanedProps } = cleanProps(this.props);
				/* eslint-enable no-unused-vars */
				return <button {...cleanedProps} aria-label="test button" onClick={this.onClick} />;
			}
		}

		it('should not pass through callback when false', () => {
			const ComponentWithAnalytics = withAnalytics(TestComponent);
			const spy = jest.fn();

			render(
				<AnalyticsListener onEvent={spy}>
					<ComponentWithAnalytics />
				</AnalyticsListener>,
			);
			clickButton();

			expect(spy).not.toHaveBeenCalled();
		});

		it('should pass through public event (ignore analyticsId)', () => {
			const ComponentWithAnalytics = withAnalytics(TestComponent, {}, {}, true);
			const spy = jest.fn();

			render(
				<AnalyticsListener onEvent={spy}>
					<ComponentWithAnalytics />
				</AnalyticsListener>,
			);
			clickButton();

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith('click', { foo: 'bar' });
		});

		it('should pass through private event (ignore analyticsId)', () => {
			const ComponentWithAnalytics = withAnalytics(TestComponent, {}, {}, true);
			const spy = jest.fn();

			render(
				<AnalyticsListener matchPrivate onEvent={spy}>
					<ComponentWithAnalytics privateEvent />
				</AnalyticsListener>,
			);
			clickButton();

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith('click', { foo: 'bar' });
		});
	});

	describe('integrated usage', () => {
		class Button extends Component {
			onClick = () => {
				this.props.fireAnalyticsEvent('click', { foo: 'bar' });
				this.props.firePrivateAnalyticsEvent('private.button.click');
			};

			render() {
				const props = cleanProps(this.props);
				return <button {...props} aria-label="test button" onClick={this.onClick} />;
			}
		}
		const ButtonWithAnalytics = withAnalytics(Button);

		it('should fire analytics events', () => {
			const spy = jest.fn();
			render(
				<AnalyticsListener onEvent={spy}>
					<ButtonWithAnalytics analyticsId="button" />
				</AnalyticsListener>,
			);
			clickButton();

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith('button.click', { foo: 'bar' });
		});

		it('should fire private analytics events', () => {
			const spy = jest.fn();
			render(
				<AnalyticsListener matchPrivate onEvent={spy}>
					<ButtonWithAnalytics analyticsId="button" />
				</AnalyticsListener>,
			);
			clickButton();

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith('private.button.click', {});
		});
	});
});
