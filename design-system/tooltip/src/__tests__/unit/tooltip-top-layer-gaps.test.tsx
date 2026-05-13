import React, { forwardRef } from 'react';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { act, fireEvent, render, screen, userEvent } from '@atlassian/testing-library';

import Tooltip from '../../tooltip';
import { type TooltipPrimitiveProps } from '../../tooltip-primitive';

const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

function runAllTimers() {
	act(() => {
		jest.runAllTimers();
	});
}

/**
 * Simulates a popover light dismiss (Escape or click outside) by dispatching
 * a `toggle` event with `newState: 'closed'` on the popover element.
 */
function simulatePopoverClose(popoverEl: HTMLElement) {
	const event = new Event('toggle', { bubbles: true });
	Object.defineProperty(event, 'newState', { value: 'closed' });
	act(() => {
		popoverEl.dispatchEvent(event);
	});
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Tooltip top-layer coverage gaps', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		// Ensure any ongoing drag is finished
		fireEvent.dragEnd(window);
		jest.useRealTimers();
	});

	// ── Escape key dismissal ──
	it('should hide tooltip when Escape is pressed (via popover light dismiss)', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		// Simulate Escape via popover light dismiss
		const popover = screen.getByTestId('tooltip--popover');
		simulatePopoverClose(popover);
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	// ── Abort show on mouseout during delay ──
	it('should abort showing if there is a mouseout while waiting for the delay', async () => {
		const user = createUser();
		const onShow = jest.fn();

		render(
			<Tooltip testId="tooltip" content="hello world" onShow={onShow} delay={300}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		act(() => {
			jest.advanceTimersByTime(299);
		});
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
		expect(onShow).not.toHaveBeenCalled();

		await user.unhover(screen.getByTestId('trigger'));
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
		expect(onShow).not.toHaveBeenCalled();
	});

	// ── Abort hide on re-hover during hide delay ──
	it('should abort hiding if there is a mouseover while waiting for the delay to hide', async () => {
		const user = createUser();
		const onHide = jest.fn();

		render(
			<Tooltip testId="tooltip" content="hello world" onHide={onHide} delay={300}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		// Show tooltip
		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		// Start hiding
		await user.unhover(screen.getByTestId('trigger'));
		act(() => {
			jest.advanceTimersByTime(299);
		});
		// Tooltip still visible during delay
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		// Re-hover to abort hiding
		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		runAllTimers();

		expect(screen.getByTestId('tooltip')).toBeInTheDocument();
		expect(onHide).not.toHaveBeenCalled();
	});

	// ── hideTooltipOnClick ──
	it('should hide tooltip after trigger click with hideTooltipOnClick set', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="hello world" hideTooltipOnClick>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		await user.click(screen.getByTestId('trigger'));
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	// ── hideTooltipOnMouseDown ──
	it('should hide tooltip after mouseDown with hideTooltipOnMouseDown set', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="hello world" hideTooltipOnMouseDown>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		fireEvent.mouseDown(screen.getByTestId('trigger'));
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	// ── Custom component prop ──
	it('should render whatever is passed to component prop', async () => {
		const user = createUser();
		const CustomTooltip: React.ForwardRefExoticComponent<
			React.PropsWithoutRef<TooltipPrimitiveProps> & React.RefAttributes<HTMLDivElement>
		> = forwardRef<HTMLDivElement, TooltipPrimitiveProps>(({ style, testId }, ref) => (
			<strong ref={ref} style={style} data-testid={testId}>
				Im a custom tooltip
			</strong>
		));

		render(
			<Tooltip testId="tooltip" content="hello world" component={CustomTooltip}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		const tooltip = screen.getByTestId('tooltip');
		expect(tooltip).toHaveTextContent('Im a custom tooltip');
		expect(tooltip.tagName).toEqual('STRONG');
	});

	// ── Analytics: display event ──
	it('should send analytics event when tooltip becomes visible', async () => {
		const user = createUser();
		const onAnalyticsEvent = jest.fn();

		render(
			<AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
				<Tooltip content="Tooltip content" testId="tooltip">
					<p data-testid="trigger">Foo</p>
				</Tooltip>
			</AnalyticsListener>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);
		expect(onAnalyticsEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				payload: expect.objectContaining({
					action: 'displayed',
					actionSubject: 'tooltip',
				}),
			}),
			'atlaskit',
		);
	});

	// ── Analytics: hidden event ──
	it('should send analytics event when tooltip is hidden', async () => {
		const user = createUser();
		const onAnalyticsEvent = jest.fn();

		render(
			<AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
				<Tooltip content="Tooltip content" testId="tooltip">
					<p data-testid="trigger">Foo</p>
				</Tooltip>
			</AnalyticsListener>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		await user.unhover(screen.getByTestId('trigger'));
		runAllTimers();
		runAllTimers();

		expect(onAnalyticsEvent).toHaveBeenCalledTimes(2);
		expect(onAnalyticsEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				payload: expect.objectContaining({
					action: 'hidden',
					actionSubject: 'tooltip',
				}),
			}),
			'atlaskit',
		);
	});

	// ── aria-describedby on trigger ──
	it('should set aria-describedby on trigger referencing hidden content', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="Save">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		const trigger = screen.getByTestId('trigger');
		const hiddenElement = screen.getByTestId('tooltip-hidden');

		expect(hiddenElement.hidden).toBe(true);
		expect(hiddenElement.id).toBe(trigger.getAttribute('aria-describedby'));
		expect(hiddenElement).toHaveTextContent('Save');
	});

	// ── Drag awareness: hide during drag ──
	it('should hide a visible tooltip when a drag starts', async () => {
		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button" draggable>
					focus me
				</button>
			</Tooltip>,
		);

		fireEvent.mouseOver(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		fireEvent.dragStart(screen.getByTestId('trigger'));
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	// ── Drag awareness: suppress during drag ──
	it('should not show tooltips during a drag', () => {
		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button" draggable>
					focus me
				</button>
			</Tooltip>,
		);

		fireEvent.dragStart(screen.getByTestId('trigger'));

		fireEvent.mouseOver(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	// ── Drag awareness: re-enable after drag ──
	it('should not suppress tooltips after a drag ends', () => {
		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button" draggable>
					focus me
				</button>
			</Tooltip>,
		);

		const trigger = screen.getByTestId('trigger');
		fireEvent.dragStart(trigger);
		fireEvent.dragEnd(trigger);

		fireEvent.mouseOver(trigger);
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();
	});

	// ── Content as undefined ──
	it('should not render tooltip when content is undefined', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content={undefined}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	// ── Singleton: show immediately if another tooltip is already showing ──
	it('should show second tooltip immediately if first is already showing', async () => {
		const user = createUser();
		const onShow = jest.fn();

		render(
			<div>
				<Tooltip testId="tooltip-a" content="Tooltip A" onShow={onShow} delay={1000}>
					<button data-testid="trigger-a" type="button">
						trigger a
					</button>
				</Tooltip>
				<Tooltip testId="tooltip-b" content="Tooltip B" onShow={onShow} delay={1000}>
					<button data-testid="trigger-b" type="button">
						trigger b
					</button>
				</Tooltip>
			</div>,
		);

		await user.hover(screen.getByTestId('trigger-a'));
		runAllTimers();
		expect(onShow).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('tooltip-a')).toBeInTheDocument();
		onShow.mockClear();

		// Second tooltip should show immediately (no delay)
		await user.hover(screen.getByTestId('trigger-b'));
		expect(onShow).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('tooltip-b')).toBeInTheDocument();
	});

	// ── Multiple tooltips: immediate transition between visible/waiting-to-hide states ──
	it('should immediately show B and hide A when B is hovered while A is waiting to hide', async () => {
		render(
			<div>
				<Tooltip testId="tooltip-a" content="First tooltip">
					<button data-testid="trigger-a" type="button">
						trigger a
					</button>
				</Tooltip>
				<Tooltip testId="tooltip-b" content="Second tooltip">
					<button data-testid="trigger-b" type="button">
						trigger b
					</button>
				</Tooltip>
			</div>,
		);

		// Show tooltip-A
		fireEvent.mouseOver(screen.getByTestId('trigger-a'));
		runAllTimers();
		expect(screen.getByTestId('tooltip-a')).toBeInTheDocument();

		// Start hiding A
		fireEvent.mouseOut(screen.getByTestId('trigger-a'));
		act(() => {
			jest.advanceTimersByTime(290);
		});
		expect(screen.getByTestId('tooltip-a')).toBeInTheDocument();

		// Hover B: A immediately hides, B immediately shows
		fireEvent.mouseOver(screen.getByTestId('trigger-b'));
		expect(screen.queryByTestId('tooltip-a')).not.toBeInTheDocument();
		expect(screen.getByTestId('tooltip-b')).toBeInTheDocument();
	});

	// ── Nested tooltips ──
	it('should support nested tooltips (inner replaces outer)', () => {
		render(
			<Tooltip content="outer" testId="tooltip--outer">
				<div data-testid="outer">
					<h4>Outer content</h4>
					<Tooltip content="inner" testId="tooltip--inner">
						<div data-testid="inner">inner</div>
					</Tooltip>
				</div>
			</Tooltip>,
		);

		// Show outer tooltip
		fireEvent.mouseOver(screen.getByTestId('outer'));
		runAllTimers();
		expect(screen.getByTestId('tooltip--outer')).toBeInTheDocument();
		expect(screen.queryByTestId('tooltip--inner')).not.toBeInTheDocument();

		// Show inner tooltip (outer should hide)
		fireEvent.mouseOver(screen.getByTestId('inner'));
		runAllTimers();
		expect(screen.getByTestId('tooltip--inner')).toBeInTheDocument();
		expect(screen.queryByTestId('tooltip--outer')).not.toBeInTheDocument();
	});

	// ── Shortcut rendering ──
	it('should display keyboard shortcut in the tooltip when provided', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="Save" shortcut={['Ctrl', '[']}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		const popover = screen.getByTestId('tooltip--popover');
		expect(popover).toHaveAttribute('role', 'tooltip');
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();
	});

	// ── Shortcut hidden text should not contain shortcut keys ──
	it('should not include keyboard shortcut in the hidden text for screen readers', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="Save" shortcut={['Ctrl', '[']}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		const hiddenElement = screen.getByTestId('tooltip-hidden');
		expect(hiddenElement).not.toHaveTextContent('Ctrl [');
		expect(hiddenElement).toHaveTextContent(/^Save$/);
	});

	// ── isScreenReaderAnnouncementDisabled ──
	it('should not render hidden text when isScreenReaderAnnouncementDisabled is true', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="Save" isScreenReaderAnnouncementDisabled>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		expect(screen.getByTestId('tooltip')).toBeInTheDocument();
		expect(screen.queryByTestId('tooltip-hidden')).not.toBeInTheDocument();
		expect(screen.getByTestId('trigger')).not.toHaveAttribute('aria-describedby');
	});

	// ── Configurable hide delay ──
	it('should wait a configurable delay before hiding', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="Tooltip" delay={1000}>
				<button data-testid="trigger" type="button">
					click me
				</button>
			</Tooltip>,
		);

		// Show tooltip
		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		// Start hiding
		await user.unhover(screen.getByTestId('trigger'));
		act(() => {
			jest.advanceTimersByTime(999);
		});
		// Haven't waited long enough
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		// Finish delay
		act(() => {
			jest.advanceTimersByTime(1);
		});
		// Run exit animation
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	// ── Visible after trigger click (without hideTooltipOnClick) ──
	it('should remain visible after trigger is clicked (without hideTooltipOnClick)', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		await user.click(screen.getByTestId('trigger'));
		runAllTimers();

		expect(screen.getByTestId('tooltip')).toHaveTextContent('hello world');
	});

	// ── canAppear gating ──
	it('should only show tooltip if canAppear returns true', () => {
		let canAppear = false;

		render(
			<Tooltip testId="tooltip" content="hi there" canAppear={() => canAppear}>
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						Trigger
					</button>
				)}
			</Tooltip>,
		);

		fireEvent.mouseOver(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

		canAppear = true;

		fireEvent.mouseOver(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();
	});

	// ── Tag prop ──
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

	it('should render a wrapping span element when tag="span" is set', () => {
		render(
			<Tooltip testId="tooltip" content="hello world" tag="span">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		expect(screen.getByTestId('tooltip--container').tagName).toEqual('SPAN');
	});
});
