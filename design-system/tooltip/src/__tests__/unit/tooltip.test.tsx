import React, { forwardRef } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';

import Tooltip from '../../tooltip';
import { type TooltipPrimitiveProps } from '../../tooltip-primitive';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

jest.mock('@atlaskit/platform-feature-flags');
const mockGetBooleanFF = fg as jest.MockedFunction<typeof fg>;

describe('Tooltip', () => {
	beforeEach(() => {
		mockGetBooleanFF.mockImplementation((key) => key === 'platform-tooltip-focus-visible-new');
		HTMLElement.prototype.matches = jest.fn().mockReturnValue(true);
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should not be shown by default', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);
			expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
			unmount();
		});
	});

	it('should get tooltip that uses wrapped approach by role', () => {
		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);
		expect(screen.getByRole('presentation')).toBeInTheDocument();
	});

	it('should be visible when trigger is hovered', () => {
		const onShow = jest.fn();
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world" onShow={onShow}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world" onShow={onShow}>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');

			fireEvent.mouseOver(trigger);
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByTestId('tooltip')).toHaveTextContent('hello world');
			expect(onShow).toHaveBeenCalledTimes(1);
			onShow.mockClear();
			unmount();
		});
	});

	it('should abort showing if there is a mouseout while waiting for the delay', () => {
		const onShow = jest.fn();
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world" onShow={onShow} delay={300}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world" onShow={onShow} delay={300}>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');

			// Trigger showing tooltip
			fireEvent.mouseOver(trigger);
			act(() => {
				jest.advanceTimersByTime(299);
			});
			expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
			expect(onShow).not.toHaveBeenCalled();

			// hide the tooltip
			fireEvent.mouseOut(trigger);

			// Now we can flush the delay and still the tooltip won't show
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
			expect(onShow).not.toHaveBeenCalled();
			onShow.mockClear();
			unmount();
		});
	});

	it('should be hidden when trigger is unhovered', () => {
		const onHide = jest.fn();
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world" onHide={onHide}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world" onHide={onHide}>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');

			// Trigger showing tooltip
			fireEvent.mouseOver(trigger);
			act(() => {
				jest.runAllTimers();
			});
			expect(screen.getByTestId('tooltip')).toBeInTheDocument();

			// Trigger hiding tooltip
			fireEvent.mouseOut(trigger);
			// flush delay
			act(() => {
				jest.runOnlyPendingTimers();
			});
			// flush motion
			act(() => {
				jest.runOnlyPendingTimers();
			});

			expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
			expect(onHide).toHaveBeenCalledTimes(1);
			onHide.mockClear();
			unmount();
		});
	});

	it('should abort hiding if there is a mouseover while waiting for the delay to hide', () => {
		const onHide = jest.fn();

		const wrapped = (
			<Tooltip testId="tooltip" content="hello world" onHide={onHide} delay={300}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world" onHide={onHide} delay={300}>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			// This mockClear has to run first because onHide will run on unmount
			onHide.mockClear();

			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');

			// Trigger showing tooltip
			fireEvent.mouseOver(trigger);
			act(() => {
				jest.runAllTimers();
			});
			expect(screen.getByTestId('tooltip')).toBeInTheDocument();

			// Trigger hiding tooltip
			fireEvent.mouseOut(trigger);
			// don't quite finish delay
			act(() => {
				jest.advanceTimersByTime(299);
			});
			expect(screen.getByTestId('tooltip')).toBeInTheDocument();

			// Going back over the tooltip
			fireEvent.mouseOver(trigger);
			// Flushing any pending delays
			act(() => {
				jest.runAllTimers();
			});
			// Being safe and flushing motion if there was one
			act(() => {
				jest.runAllTimers();
			});
			// Tooltip is still around being awesome
			expect(screen.getByTestId('tooltip')).toBeInTheDocument();
			expect(onHide).toHaveBeenCalledTimes(0);
			unmount();
		});
	});

	it('should abort hiding if there is a mouseover while animating out', () => {
		const onHide = jest.fn();
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world" onHide={onHide}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world" onHide={onHide}>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			// This mockClear has to run first because onHide will run on unmount
			onHide.mockClear();
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');

			// Trigger showing tooltip
			fireEvent.mouseOver(trigger);
			act(() => {
				jest.runAllTimers();
			});
			expect(screen.getByTestId('tooltip')).toBeInTheDocument();

			// Trigger hiding tooltip
			fireEvent.mouseOut(trigger);
			// flush delay
			act(() => {
				jest.runOnlyPendingTimers();
			});
			// go partially through the motion
			act(() => {
				jest.advanceTimersByTime(1);
			});
			// tooltip is visible but fading out
			expect(screen.getByTestId('tooltip')).toBeInTheDocument();
			// on hide not called yet
			expect(onHide).toHaveBeenCalledTimes(0);

			// mouseover the trigger again
			fireEvent.mouseOver(trigger);
			// this would normally trigger the tooltip to hide
			act(() => {
				jest.runAllTimers();
			});

			// But the tooltip is back and being awesome
			expect(screen.getByTestId('tooltip')).toBeInTheDocument();
			expect(onHide).toHaveBeenCalledTimes(0);
			unmount();
		});
	});

	it('should show the tooltip when the trigger is focused', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');

			fireEvent.focus(trigger);
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByTestId('tooltip')).toHaveTextContent('hello world');
			unmount();
		});
	});

	it('should not show the tooltip when the trigger is focused and focus is not visible', () => {
		HTMLElement.prototype.matches = jest.fn().mockReturnValue(false);
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');

			fireEvent.focus(trigger);
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
			unmount();
		});
	});

	it('should hide the tooltip when the trigger loses focus', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { rerender, unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');

			fireEvent.focus(trigger);
			act(() => {
				jest.runAllTimers();
			});

			fireEvent.blur(trigger);
			act(() => {
				jest.runAllTimers();
			});

			rerender(jsx);

			// Waits for exit animation to finish
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
			unmount();
		});
	});

	it('should be visible after trigger is clicked', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');

			fireEvent.mouseOver(trigger);
			fireEvent.click(trigger);
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByTestId('tooltip')).toHaveTextContent('hello world');
			unmount();
		});
	});

	it('should be hidden after trigger click with hideTooltipOnClick set', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world" hideTooltipOnClick>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world" hideTooltipOnClick>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');

			fireEvent.mouseOver(trigger);
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByTestId('tooltip')).toHaveTextContent('hello world');

			fireEvent.click(trigger);
			act(() => {
				jest.runAllTimers();
			});
			expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
			unmount();
		});
	});

	it('should be hidden after trigger click with hideTooltipOnMouseDown set', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world" hideTooltipOnMouseDown>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world" hideTooltipOnMouseDown>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');

			fireEvent.mouseOver(trigger);
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByTestId('tooltip')).toHaveTextContent('hello world');

			fireEvent.mouseDown(trigger);
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
			unmount();
		});
	});

	it('should be hidden after Escape pressed', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world" hideTooltipOnMouseDown>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world" hideTooltipOnMouseDown>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');
			fireEvent.mouseOver(trigger);

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByTestId('tooltip')).toHaveTextContent('hello world');
			fireEvent.keyDown(trigger, { key: 'Escape' });
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
			unmount();
		});
	});

	it('should render whatever is passed to component prop', () => {
		const CustomTooltip = forwardRef<HTMLDivElement, TooltipPrimitiveProps>(
			({ style, testId }, ref) => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<strong ref={ref} style={style} data-testid={testId}>
					Im a custom tooltip
				</strong>
			),
		);
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world" component={CustomTooltip}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world" component={CustomTooltip}>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');
			fireEvent.mouseOver(trigger);

			act(() => {
				jest.runAllTimers();
			});

			const tooltip = screen.getByTestId('tooltip');
			expect(tooltip).toHaveTextContent('Im a custom tooltip');
			expect(tooltip.tagName).toEqual('STRONG');
			unmount();
		});
	});

	it('should render a wrapping div element by default when using the wrapped approach', () => {
		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		expect(screen.getByTestId('tooltip--container').tagName).toEqual('DIV');
	});

	it('should render a wrapping span element is supplied by the tag prop when using the wrapped approach', () => {
		render(
			<Tooltip testId="tooltip" content="hello world" tag="span">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		expect(screen.getByTestId('tooltip--container').tagName).toEqual('SPAN');
	});

	it('should wait a default delay before showing', () => {
		const onShow = jest.fn();
		const wrapped = (
			<Tooltip testId="tooltip" content="Tooltip" onShow={onShow} delay={300}>
				<button data-testid="trigger" type="button">
					click me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="Tooltip" onShow={onShow} delay={300}>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						click me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');

			// Start showing
			fireEvent.mouseOver(trigger);

			// Delay not completed yet
			act(() => {
				jest.advanceTimersByTime(299);
			});
			expect(onShow).toHaveBeenCalledTimes(0);
			// Delay completed
			act(() => {
				jest.advanceTimersByTime(1);
			});

			expect(onShow).toHaveBeenCalledTimes(1);
			expect(screen.getByTestId('tooltip')).toBeInTheDocument();
			onShow.mockClear();
			unmount();
		});
	});

	it('should wait a configurable delay before showing', () => {
		const onShow = jest.fn();
		const wrapped = (
			<Tooltip testId="tooltip" content="Tooltip" onShow={onShow} delay={1000}>
				<button data-testid="trigger" type="button">
					click me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="Tooltip" onShow={onShow} delay={1000}>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						click me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');

			fireEvent.mouseOver(trigger);

			act(() => {
				jest.advanceTimersByTime(999);
			});
			expect(onShow).toHaveBeenCalledTimes(0);
			expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

			act(() => {
				jest.advanceTimersByTime(1);
			});
			expect(onShow).toHaveBeenCalledTimes(1);
			expect(screen.getByTestId('tooltip')).toBeInTheDocument();
			unmount();
			onShow.mockClear();
		});
	});

	it('should wait a default delay before hiding', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="Tooltip">
				<button data-testid="trigger" type="button">
					click me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="Tooltip">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						click me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');

			// Show tooltip
			fireEvent.mouseOver(trigger);
			act(() => {
				jest.runAllTimers();
			});
			expect(screen.getByTestId('tooltip')).toBeInTheDocument();

			// start hiding
			fireEvent.mouseOut(trigger);
			act(() => {
				jest.advanceTimersByTime(299);
			});
			// haven't waited long enough
			expect(screen.getByTestId('tooltip')).toBeInTheDocument();

			// finish delay
			act(() => {
				jest.advanceTimersByTime(1);
			});

			// Still present because we haven't flushed motion
			expect(screen.getByTestId('tooltip')).toBeInTheDocument();

			// Flushing motion
			act(() => {
				jest.runAllTimers();
			});
			expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
			unmount();
		});
	});

	it('should wait a configurable delay before hiding', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="Tooltip" delay={1000}>
				<button data-testid="trigger" type="button">
					click me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="Tooltip" delay={1000}>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						click me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { rerender, unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');
			fireEvent.mouseOver(trigger);

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByTestId('tooltip')).toBeInTheDocument();
			fireEvent.mouseOut(trigger);

			act(() => {
				jest.advanceTimersByTime(999);
			});

			rerender(jsx);

			expect(screen.getByTestId('tooltip')).toBeInTheDocument();

			act(() => {
				jest.advanceTimersByTime(1);
			});

			rerender(jsx);

			// Waits for exit animation to finish
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
			unmount();
		});
	});

	it('should not show when content is null', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content={null}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content={null}>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');
			fireEvent.mouseOver(trigger);

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
			unmount();
		});
	});

	it('should not show when content is undefined', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content={undefined}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content={undefined}>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');
			fireEvent.mouseOver(trigger);

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
			unmount();
		});
	});

	it('should not show when content is an empty string', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');
			fireEvent.mouseOver(trigger);

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
			unmount();
		});
	});

	it('should position tooltip to the left of the mouse', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world" position="mouse" mousePosition="left">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world" position="mouse" mousePosition="left">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');
			fireEvent.mouseOver(trigger);

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByTestId('tooltip')).toHaveAttribute('data-placement', 'left');
			unmount();
		});
	});

	it('should position tooltip to the bottom of trigger when interacting with keyboard and position is mouse', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world" position="mouse" mousePosition="right">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world" position="mouse" mousePosition="right">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');
			fireEvent.focus(trigger);

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByTestId('tooltip')).toHaveAttribute('data-placement', 'right');
			unmount();
		});
	});

	it('should position tooltip to the top of trigger when interacting with keyboard', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world" position="left">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world" position="left">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');
			fireEvent.focus(trigger);

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByTestId('tooltip')).toHaveAttribute('data-placement', 'left');
			unmount();
		});
	});

	it('should stay visible when hover tooltip', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="Tooltip">
				<button data-testid="trigger" type="button">
					click me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="Tooltip">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						click me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');

			// Trigger showing tooltip
			fireEvent.mouseOver(trigger);
			act(() => {
				jest.runAllTimers();
			});
			expect(screen.getByTestId('tooltip')).toBeInTheDocument();

			// Trigger hiding tooltip
			fireEvent.mouseOut(trigger);
			// flush delay
			act(() => {
				jest.runOnlyPendingTimers();
			});
			fireEvent.mouseOver(screen.queryByTestId('tooltip')!);
			// flush motion
			act(() => {
				jest.runOnlyPendingTimers();
			});

			expect(screen.getByTestId('tooltip')).toBeInTheDocument();
			unmount();
		});
	});

	it('should send analytics event when tooltip becomes visible', () => {
		const onAnalyticsEvent = jest.fn();
		const wrapped = (
			<AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
				<Tooltip content="Tooltip content">
					<p data-testid="trigger">Foo</p>
				</Tooltip>
			</AnalyticsListener>
		);
		const renderProp = (
			<AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
				<Tooltip content="Tooltip content">
					{(tooltipProps) => (
						<p {...tooltipProps} data-testid="trigger">
							Foo
						</p>
					)}
				</Tooltip>
			</AnalyticsListener>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { rerender, unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');
			fireEvent.mouseOver(trigger);

			act(() => {
				jest.runAllTimers();
			});

			rerender(jsx);

			expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);
			expect(onAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: {
						action: 'displayed',
						actionSubject: 'tooltip',
						attributes: {
							componentName: 'tooltip',
							packageName,
							packageVersion,
						},
					},
				}),
				'atlaskit',
			);
			unmount();
			onAnalyticsEvent.mockClear();
		});
	});

	it('should send analytics event when tooltip is hidden', () => {
		const onAnalyticsEvent = jest.fn();
		const wrapped = (
			<AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
				<Tooltip content="Tooltip content" testId="tooltip">
					<p data-testid="trigger">Foo</p>
				</Tooltip>
			</AnalyticsListener>
		);
		const renderProp = (
			<AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
				<Tooltip content="Tooltip content" testId="tooltip">
					{(tooltipProps) => (
						<p {...tooltipProps} data-testid="trigger">
							Foo
						</p>
					)}
				</Tooltip>
			</AnalyticsListener>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { rerender, unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');
			fireEvent.mouseOver(trigger);

			// show tooltip
			act(() => {
				jest.runAllTimers();
			});
			expect(screen.getByTestId('tooltip')).toBeInTheDocument();

			// hide tooltip
			fireEvent.mouseOut(trigger);
			// flush delay
			act(() => {
				jest.runOnlyPendingTimers();
			});
			// flush motion
			act(() => {
				jest.runOnlyPendingTimers();
			});

			rerender(jsx);

			expect(onAnalyticsEvent).toHaveBeenCalledTimes(2);
			expect(onAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: {
						action: 'hidden',
						actionSubject: 'tooltip',
						attributes: {
							componentName: 'tooltip',
							packageName,
							packageVersion,
						},
					},
				}),
				'atlaskit',
			);
			unmount();
			onAnalyticsEvent.mockClear();
		});
	});

	it('should have strategy as fixed by default', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="hello world" position="mouse" mousePosition="left">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="hello world" position="mouse" mousePosition="left">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');
			fireEvent.mouseOver(trigger);

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByTestId('tooltip--wrapper')).toHaveStyle(
				'position: fixed; left: 0px; top: 0px;',
			);
			unmount();
		});
	});

	it('should have strategy as absolute for popper', () => {
		const wrapped = (
			<Tooltip
				testId="tooltip"
				content="hello world"
				position="mouse"
				mousePosition="left"
				strategy="absolute"
			>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip
				testId="tooltip"
				content="hello world"
				position="mouse"
				mousePosition="left"
				strategy="absolute"
			>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');
			fireEvent.mouseOver(trigger);

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByTestId('tooltip--wrapper')).toHaveStyle(
				'position: absolute; left: 0px; top: 0px;',
			);
			unmount();
		});
	});

	it('should render hidden text for screen readers', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="Save">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="Save">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						hidden content
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');
			fireEvent.mouseOver(trigger);

			act(() => {
				jest.runAllTimers();
			});

			const tooltip = screen.getByTestId('tooltip');
			const hiddenElement = screen.getByTestId('tooltip-hidden');
			// element is hidden
			expect(hiddenElement.hidden).toBe(true);
			// hidden element linked to trigger
			expect(hiddenElement.id).toBe(trigger.getAttribute('aria-describedby'));
			// hidden element has the correct content
			expect(tooltip).toHaveTextContent(hiddenElement.textContent ?? '');
			expect(hiddenElement).toHaveTextContent('Save');

			unmount();
		});
	});

	it('should not render hidden text for screen readers when asked not to', () => {
		const wrapped = (
			<Tooltip testId="tooltip" content="Save" isScreenReaderAnnouncementDisabled>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>
		);
		const renderProp = (
			<Tooltip testId="tooltip" content="Save" isScreenReaderAnnouncementDisabled>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						hidden content
					</button>
				)}
			</Tooltip>
		);

		[wrapped, renderProp].forEach((jsx) => {
			const { unmount } = render(jsx);

			const trigger = screen.getByTestId('trigger');
			fireEvent.mouseOver(trigger);

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByTestId('tooltip')).toBeInTheDocument();
			expect(screen.queryByTestId('tooltip-hidden')).not.toBeInTheDocument();
			// trigger not pointing to any hidden element
			expect(trigger).not.toHaveAttribute('aria-describedby');

			unmount();
		});
	});

	it('should not throw when the first child of tooltip is not an element', () => {
		render(
			<Tooltip testId="tooltip" content="Save">
				hello
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		fireEvent.mouseOver(screen.getByTestId('trigger'));

		expect(() => {
			jest.runAllTimers();
		}).not.toThrow();
	});

	it('should pick up the latest child ref after a re-render using the children-not-a-function API', () => {
		const { rerender } = render(
			<Tooltip testId="tooltip" content="Save">
				{null}
			</Tooltip>,
		);

		rerender(
			<Tooltip testId="tooltip" content="Save">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);
		fireEvent.mouseOver(screen.getByTestId('trigger'));

		act(() => {
			jest.runAllTimers();
		});

		expect(() => {
			// If this throws it means the test id resolved to "{testId}--unresolved".
			screen.getByTestId('tooltip');
		}).not.toThrow();
	});

	describe('pointer events', () => {
		it('should not disable pointer events by default', () => {
			const { rerender } = render(
				<Tooltip testId="tooltip" content="Save">
					{null}
				</Tooltip>,
			);

			rerender(
				<Tooltip testId="tooltip" content="Save">
					<button data-testid="trigger" type="button">
						focus me
					</button>
				</Tooltip>,
			);
			fireEvent.mouseOver(screen.getByTestId('trigger'));

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByTestId('tooltip--wrapper')).not.toHaveStyle('pointer-events: none');
		});

		it('should disable pointer events if ignorePointerEvents is true', () => {
			const { rerender } = render(
				<Tooltip testId="tooltip" content="Save">
					{null}
				</Tooltip>,
			);

			rerender(
				<Tooltip testId="tooltip" content="Save" ignoreTooltipPointerEvents>
					<button data-testid="trigger" type="button">
						focus me
					</button>
				</Tooltip>,
			);
			fireEvent.mouseOver(screen.getByTestId('trigger'));

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByTestId('tooltip--wrapper')).toHaveStyle('pointer-events: none');
		});
	});
});
