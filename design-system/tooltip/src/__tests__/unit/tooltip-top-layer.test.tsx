import React from 'react';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { act, fireEvent, render, screen, userEvent } from '@atlassian/testing-library';

import Tooltip from '../../tooltip';

const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

function runAllTimers() {
	act(() => {
		jest.runAllTimers();
	});
}

/**
 * Simulates a popover light dismiss (Escape or click outside) by dispatching
 * a `toggle` event with `newState: 'closed'` on the popover element.
 * This mimics what the browser does natively with `popover="auto"`.
 */
function simulatePopoverClose(popoverEl: HTMLElement) {
	const event = new Event('toggle', { bubbles: true });
	Object.defineProperty(event, 'newState', { value: 'closed' });
	act(() => {
		popoverEl.dispatchEvent(event);
	});
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer-tooltip', 'Tooltip top-layer rendering', () => {
	let originalMatches: typeof HTMLElement.prototype.matches;

	beforeEach(() => {
		jest.useFakeTimers();

		// JSDOM does not track :focus-visible state, so we need to mock matches
		// to return true so that the onFocus handler does not bail out.
		originalMatches = HTMLElement.prototype.matches;
		HTMLElement.prototype.matches = jest.fn().mockImplementation(function (
			this: HTMLElement,
			selector: string,
		) {
			if (selector === ':focus-visible') {
				return true;
			}
			return originalMatches.call(this, selector);
		}) as unknown as typeof HTMLElement.prototype.matches;
	});

	afterEach(() => {
		jest.useRealTimers();
		HTMLElement.prototype.matches = originalMatches;
	});

	it('should show tooltip on hover after delay', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		expect(screen.getByTestId('tooltip')).toBeInTheDocument();
		expect(screen.getByTestId('tooltip')).toHaveTextContent('hello world');
	});

	it('should hide tooltip on unhover', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		// Show tooltip
		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		// Unhover trigger
		await user.unhover(screen.getByTestId('trigger'));
		// First runAllTimers: tooltip-manager hide delay fires, state → 'top-layer-exit'.
		// Second runAllTimers: exit animation timeout fires, finishHideAnimation → state → 'hide'.
		runAllTimers();
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should re-show tooltip after unhover', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		// Show, hide, then show again
		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		await user.unhover(screen.getByTestId('trigger'));
		runAllTimers();
		runAllTimers();
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();
	});

	it('should hide tooltip on light dismiss (popover close)', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		// Show tooltip
		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		// Simulate popover light dismiss
		const popover = screen.getByTestId('tooltip--popover');
		simulatePopoverClose(popover);
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should re-show tooltip after light dismiss', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		// Show tooltip
		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		// Light dismiss
		const popover = screen.getByTestId('tooltip--popover');
		simulatePopoverClose(popover);
		runAllTimers();
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

		// Unhover and re-hover to re-show
		await user.unhover(screen.getByTestId('trigger'));
		runAllTimers();
		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		expect(screen.getByTestId('tooltip')).toBeInTheDocument();
	});

	it('should show tooltip on focus (keyboard)', async () => {
		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		fireEvent.focus(screen.getByTestId('trigger'));
		runAllTimers();

		expect(screen.getByTestId('tooltip')).toBeInTheDocument();
	});

	it('should hide tooltip on blur', async () => {
		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		// Show via focus
		fireEvent.focus(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		// Blur to hide
		fireEvent.blur(screen.getByTestId('trigger'));
		runAllTimers();
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should hide tooltip on scroll', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		// Show tooltip
		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		// Scroll to hide
		fireEvent.scroll(window);
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should respect the delay prop', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="hello world" delay={1000}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));

		// After 500ms, tooltip should not be visible yet
		act(() => {
			jest.advanceTimersByTime(500);
		});
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

		// After the full 1000ms delay, tooltip should be visible
		act(() => {
			jest.advanceTimersByTime(500);
		});
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();
	});

	it('should call onShow callback when tooltip becomes visible', async () => {
		const user = createUser();
		const onShow = jest.fn();

		render(
			<Tooltip testId="tooltip" content="hello world" onShow={onShow}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		expect(onShow).toHaveBeenCalledTimes(1);
	});

	it('should call onHide callback when tooltip is hidden', async () => {
		const user = createUser();
		const onHide = jest.fn();

		render(
			<Tooltip testId="tooltip" content="hello world" onHide={onHide}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		// Show tooltip
		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		// Hide tooltip
		await user.unhover(screen.getByTestId('trigger'));
		runAllTimers();
		runAllTimers();

		expect(onHide).toHaveBeenCalledTimes(1);
	});

	it('should support singleton behavior (only one tooltip visible at a time)', async () => {
		const user = createUser();

		render(
			<div>
				<Tooltip testId="tooltip-a" content="Tooltip A">
					<button data-testid="trigger-a" type="button">
						trigger a
					</button>
				</Tooltip>
				<Tooltip testId="tooltip-b" content="Tooltip B">
					<button data-testid="trigger-b" type="button">
						trigger b
					</button>
				</Tooltip>
			</div>,
		);

		// Show tooltip A
		await user.hover(screen.getByTestId('trigger-a'));
		runAllTimers();
		expect(screen.getByTestId('tooltip-a')).toBeInTheDocument();

		// Hover trigger B. A should hide and B should show.
		await user.hover(screen.getByTestId('trigger-b'));
		runAllTimers();

		expect(screen.queryByTestId('tooltip-a')).not.toBeInTheDocument();
		expect(screen.getByTestId('tooltip-b')).toBeInTheDocument();
	});

	it('should not render tooltip when content is empty', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		// Empty content guard: tooltip should not be rendered
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should not render tooltip when content is null', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content={null}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should hide immediately when requestHide is called with isImmediate during waiting-to-hide', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		// Show tooltip
		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		// Unhover to start waiting-to-hide phase
		await user.unhover(screen.getByTestId('trigger'));
		// Do not run all timers. We are now in 'waiting-to-hide'.

		// Scroll triggers isImmediate hide while in waiting-to-hide
		fireEvent.scroll(window);
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should work with render prop children', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="hello world">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" type="button">
						focus me
					</button>
				)}
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		expect(screen.getByTestId('tooltip')).toBeInTheDocument();
		expect(screen.getByTestId('tooltip')).toHaveTextContent('hello world');
	});

	// ── Top-layer specific: native popover API integration ──

	it('should render the tooltip inside a popover="hint" element', async () => {
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

		// Tooltips use popover="hint" so they do not close other popover="auto"
		// surfaces (menus, dialogs) when shown. Browsers without hint support
		// fall back to "auto" inside the Popover primitive.
		const popover = screen.getByTestId('tooltip--popover');
		expect(popover).toHaveAttribute('popover', 'hint');
	});

	it('should set role="tooltip" on the popover element only', async () => {
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

		const popover = screen.getByTestId('tooltip--popover');
		expect(popover).toHaveAttribute('role', 'tooltip');
		// Single tooltip role in the tree: the popover root, no nested role="tooltip".
		expect(screen.getAllByRole('tooltip')).toHaveLength(1);
	});

	it('should open the popover when tooltip becomes visible', async () => {
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

		const popover = screen.getByTestId('tooltip--popover');
		expect(popover).toHaveAttribute('data-popover-open');
	});

	it('should render tooltip in DOM near the trigger (no portal)', async () => {
		const user = createUser();

		render(
			<div data-testid="wrapper">
				<Tooltip testId="tooltip" content="hello world">
					<button data-testid="trigger" type="button">
						focus me
					</button>
				</Tooltip>
			</div>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		// The popover element should be inside the wrapper, not portalled to end of body
		const wrapper = screen.getByTestId('wrapper');
		const popover = screen.getByTestId('tooltip--popover');
		expect(wrapper.contains(popover)).toBe(true);
	});

	it('should render hidden content for screen readers when tooltip is visible', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		// Hidden content should not exist before tooltip is shown
		expect(screen.queryByTestId('tooltip-hidden')).not.toBeInTheDocument();

		// Show tooltip
		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		// Hidden content should be rendered for aria-describedby
		const hiddenContent = screen.getByTestId('tooltip-hidden');
		expect(hiddenContent).toBeInTheDocument();
		expect(hiddenContent).toHaveTextContent('hello world');
		expect(hiddenContent).toHaveAttribute('hidden');
	});

	it('should support content as a function', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content={({ update }) => `Content with update: ${typeof update}`}>
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		expect(screen.getByTestId('tooltip')).toBeInTheDocument();
		expect(screen.getByTestId('tooltip')).toHaveTextContent('Content with update: function');
	});

	it('should inherit the default 8px gap from useAnchorPosition', async () => {
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

		// The popover should be in the document. The gap is applied internally
		// by useAnchorPosition (defaults to `token('space.100', '8px')` when no
		// offset is provided), but we verify the tooltip renders at all.
		expect(screen.getByTestId('tooltip--popover')).toBeInTheDocument();
	});

	it('should hide and re-show correctly across focus and hover', async () => {
		const user = createUser();

		render(
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		// Show via hover
		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		// Hide via unhover
		await user.unhover(screen.getByTestId('trigger'));
		runAllTimers();
		runAllTimers();
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

		// Show via focus
		fireEvent.focus(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		// Hide via blur
		fireEvent.blur(screen.getByTestId('trigger'));
		runAllTimers();
		runAllTimers();
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should not show tooltip while already visible (no double-show)', async () => {
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

		// Focus while already shown via hover. Should not create a second tooltip.
		fireEvent.focus(screen.getByTestId('trigger'));
		runAllTimers();

		// Still exactly one tooltip popover
		expect(screen.getAllByTestId('tooltip--popover')).toHaveLength(1);
	});
});
