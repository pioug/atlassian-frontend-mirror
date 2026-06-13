import React, { useState } from 'react';

import { act, render, screen } from '@atlassian/testing-library';

import { slideAndFade } from '../../src/entry-points/animations';
import { getAriaForTrigger } from '../../src/entry-points/get-aria-for-trigger';
import { Popover } from '../../src/entry-points/popover';
import { usePopoverId } from '../../src/entry-points/use-popover-id';

// JSDOM does not implement CSS transitions, so `transitionend` never fires naturally.
// When `animate` is set, the code falls back to a `setTimeout(fn, durationMs + 50)`.
// Unit tests use fake timers to drive that fallback. Real `transitionend` behaviour
// is covered by the Playwright tests in animation-lifecycle.spec.tsx.

const animation = slideAndFade();

/**
 * Minimal Popover wrapper that exercises `onEnterFinish` and `onExitFinish` directly.
 * Pass `animated` to toggle between the animated (fallback timer) and non-animated paths.
 */
function TestPopover({
	isOpen,
	onEnterFinish,
	onExitFinish,
	animated = false,
}: {
	isOpen: boolean;
	onEnterFinish?: () => void;
	onExitFinish?: () => void;
	animated?: boolean;
}) {
	return (
		<Popover
			isOpen={isOpen}
			onEnterFinish={onEnterFinish}
			onExitFinish={onExitFinish}
			role="dialog"
			label="test-popover"
			animate={animated ? animation : undefined}
		>
			<div data-testid="content">content</div>
		</Popover>
	);
}

it('should capture and report a11y violations', async () => {
	const { container } = render(<TestPopover isOpen={false} />);
	await expect(container).toBeAccessible();
});

describe('onEnterFinish - Popover with animate=false', () => {
	it('fires once after opening', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={false} onEnterFinish={onEnterFinish} />);

		expect(onEnterFinish).not.toHaveBeenCalled();

		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} />);

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire on initial mount when isOpen is false', () => {
		const onEnterFinish = jest.fn();
		render(<TestPopover isOpen={false} onEnterFinish={onEnterFinish} />);

		expect(onEnterFinish).not.toHaveBeenCalled();
	});

	it('fires on initial mount when isOpen is true', () => {
		const onEnterFinish = jest.fn();
		render(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} />);

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire again when re-rendered with isOpen still true', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={false} onEnterFinish={onEnterFinish} />);

		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} />);
		expect(onEnterFinish).toHaveBeenCalledTimes(1);

		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} />);
		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('fires again on a second open after close', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={false} onEnterFinish={onEnterFinish} />);

		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} />);
		expect(onEnterFinish).toHaveBeenCalledTimes(1);

		rerender(<TestPopover isOpen={false} onEnterFinish={onEnterFinish} />);
		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} />);
		expect(onEnterFinish).toHaveBeenCalledTimes(2);
	});
});

// These tests are targeting the fallback timer path, which is only used when `animate` is set.
// The fallback timer is used in case the 'transitionend' event never fires (which is the case in JSDOM)
describe('onEnterFinish - Popover with animate=true', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('does not fire immediately on open', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(
			<TestPopover isOpen={false} onEnterFinish={onEnterFinish} animated />,
		);

		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} animated />);

		expect(onEnterFinish).not.toHaveBeenCalled();
	});

	it('fires after the fallback timeout when transitionend never fires', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(
			<TestPopover isOpen={false} onEnterFinish={onEnterFinish} animated />,
		);

		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('fires on initial mount when isOpen is true', () => {
		const onEnterFinish = jest.fn();
		render(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire when popup is closed before the entry animation completes', () => {
		const onEnterFinish = jest.fn();
		const { rerender } = render(
			<TestPopover isOpen={false} onEnterFinish={onEnterFinish} animated />,
		);

		rerender(<TestPopover isOpen={true} onEnterFinish={onEnterFinish} animated />);

		// Close before the fallback timeout fires - cancels the pending listener
		rerender(<TestPopover isOpen={false} onEnterFinish={onEnterFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onEnterFinish).not.toHaveBeenCalled();
	});
});

describe('onEnterFinish - StrictMode double-fire guard (Popover with animate=false)', () => {
	it('does not double-fire during open', () => {
		const onEnterFinish = jest.fn();

		const { rerender } = render(
			<React.StrictMode>
				<TestPopover isOpen={false} onEnterFinish={onEnterFinish} />
			</React.StrictMode>,
		);

		rerender(
			<React.StrictMode>
				<TestPopover isOpen={true} onEnterFinish={onEnterFinish} />
			</React.StrictMode>,
		);

		// StrictMode double-fires effects in development, but the prev-value ref
		// pattern ensures onEnterFinish is called exactly once.
		expect(onEnterFinish).toHaveBeenCalledTimes(1);
	});
});

describe('onExitFinish - Popover with animate=false', () => {
	it('fires once after closing', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} />);

		expect(onExitFinish).not.toHaveBeenCalled();

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);

		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire on initial mount when isOpen is true', () => {
		const onExitFinish = jest.fn();
		render(<TestPopover isOpen={true} onExitFinish={onExitFinish} />);

		expect(onExitFinish).not.toHaveBeenCalled();
	});

	it('does not fire on initial mount when isOpen is false', () => {
		// The prev-value ref starts equal to isOpen, so no true→false edge is detected.
		const onExitFinish = jest.fn();
		render(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);

		expect(onExitFinish).not.toHaveBeenCalled();
	});

	it('does not fire again when re-rendered with isOpen still false', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} />);

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);
		expect(onExitFinish).toHaveBeenCalledTimes(1);

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);
		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});

	it('fires again on a second close after open', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} />);

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);
		expect(onExitFinish).toHaveBeenCalledTimes(1);

		rerender(<TestPopover isOpen={true} onExitFinish={onExitFinish} />);
		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);
		expect(onExitFinish).toHaveBeenCalledTimes(2);
	});
});

describe('onExitFinish - Popover with animate=true', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('does not fire immediately on close', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} animated />);

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} animated />);

		expect(onExitFinish).not.toHaveBeenCalled();
	});

	it('fires after the fallback timeout when transitionend never fires', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} animated />);

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});

	it('does not fire when popup is reopened before the exit animation completes', () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} animated />);

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} animated />);

		// Reopen before the fallback timeout fires - cancels the pending listener
		rerender(<TestPopover isOpen={true} onExitFinish={onExitFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onExitFinish).not.toHaveBeenCalled();
	});

	// Regression: consumers reading the popover host element inside
	// `onExitFinish` must still see it attached to the DOM. The phase
	// transition to `closed` (which triggers the unmount) must happen after
	// the callback is invoked, not before.
	it('fires onExitFinish while the popover host element is still in the DOM', () => {
		let hostAttachedWhenCallbackFired: boolean | null = null;
		const onExitFinish = jest.fn(() => {
			const host = screen.queryByRole('dialog', { name: 'test-popover' });
			hostAttachedWhenCallbackFired = host !== null && document.body.contains(host);
		});

		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} animated />);

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} animated />);

		act(() => {
			jest.runAllTimers();
		});

		expect(onExitFinish).toHaveBeenCalledTimes(1);
		expect(hostAttachedWhenCallbackFired).toBe(true);
	});
});

describe('onExitFinish - StrictMode double-fire guard (Popover with animate=false)', () => {
	it('does not double-fire during close', () => {
		const onExitFinish = jest.fn();

		const { rerender } = render(
			<React.StrictMode>
				<TestPopover isOpen={true} onExitFinish={onExitFinish} />
			</React.StrictMode>,
		);

		rerender(
			<React.StrictMode>
				<TestPopover isOpen={false} onExitFinish={onExitFinish} />
			</React.StrictMode>,
		);

		// StrictMode double-fires effects in development, but the prev-value ref
		// pattern ensures onExitFinish is called exactly once.
		expect(onExitFinish).toHaveBeenCalledTimes(1);
	});
});

/**
 * A controlled popover that wires aria-expanded correctly during exit animation.
 *
 * The consumer is responsible for keeping aria-expanded=true during the exit
 * animation by not updating their isOpen state until onExitFinish fires.
 * This component demonstrates and verifies the recommended pattern.
 */
function ControlledPopoverWithAriaExpanded({ animate }: { animate: boolean }) {
	// isOpen drives both the Popover and getAriaForTrigger
	const [isOpen, setIsOpen] = useState(false);
	// isAnimatingClosed tracks the exit animation window:
	// true after close is triggered, false once onExitFinish fires.
	const [isAnimatingClosed, setIsAnimatingClosed] = useState(false);
	const popoverId = usePopoverId();

	// aria-expanded should stay true while the exit animation is running
	const ariaForTrigger = getAriaForTrigger({
		role: 'dialog',
		isOpen: isOpen || isAnimatingClosed,
		popoverId,
	});

	function handleOpen() {
		setIsAnimatingClosed(false);
		setIsOpen(true);
	}

	function handleClose() {
		if (animate) {
			// Start exit animation; keep aria-expanded=true until it finishes
			setIsAnimatingClosed(true);
			setIsOpen(false);
		} else {
			setIsOpen(false);
		}
	}

	function handleExitFinish() {
		setIsAnimatingClosed(false);
	}

	return (
		<>
			<button
				type="button"
				data-testid="trigger"
				onClick={isOpen ? handleClose : handleOpen}
				{...ariaForTrigger}
			>
				Toggle
			</button>
			<Popover
				id={popoverId}
				isOpen={isOpen}
				onExitFinish={handleExitFinish}
				animate={animate ? slideAndFade() : undefined}
				role="dialog"
				label="controlled-popover"
			>
				content
			</Popover>
		</>
	);
}

describe('aria-expanded during exit animation', () => {
	describe('without animation', () => {
		it('is false when closed', () => {
			render(<ControlledPopoverWithAriaExpanded animate={false} />);
			const trigger = screen.getByTestId('trigger');

			expect(trigger).toHaveAttribute('aria-expanded', 'false');
		});

		it('is true when open', () => {
			render(<ControlledPopoverWithAriaExpanded animate={false} />);
			const trigger = screen.getByTestId('trigger');

			act(() => {
				trigger.click();
			});

			expect(trigger).toHaveAttribute('aria-expanded', 'true');
		});

		it('goes false immediately on close when there is no animation', () => {
			render(<ControlledPopoverWithAriaExpanded animate={false} />);
			const trigger = screen.getByTestId('trigger');

			act(() => {
				trigger.click();
			});
			expect(trigger).toHaveAttribute('aria-expanded', 'true');

			act(() => {
				trigger.click();
			});
			expect(trigger).toHaveAttribute('aria-expanded', 'false');
		});

		it('completes a full open+close cycle correctly', () => {
			render(<ControlledPopoverWithAriaExpanded animate={false} />);
			const trigger = screen.getByTestId('trigger');

			act(() => {
				trigger.click();
			});
			expect(trigger).toHaveAttribute('aria-expanded', 'true');

			act(() => {
				trigger.click();
			});
			expect(trigger).toHaveAttribute('aria-expanded', 'false');

			act(() => {
				trigger.click();
			});
			expect(trigger).toHaveAttribute('aria-expanded', 'true');
		});
	});

	describe('with animation (exit animation keeps aria-expanded=true until onExitFinish)', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('is true immediately after close is triggered (exit animation in progress)', () => {
			render(<ControlledPopoverWithAriaExpanded animate={true} />);
			const trigger = screen.getByTestId('trigger');

			act(() => {
				trigger.click();
			});
			expect(trigger).toHaveAttribute('aria-expanded', 'true');

			// Trigger close — animation starts but has not finished
			act(() => {
				trigger.click();
			});

			// aria-expanded must stay true while exit animation runs
			expect(trigger).toHaveAttribute('aria-expanded', 'true');
		});

		it('goes false only after the exit animation completes (onExitFinish)', () => {
			render(<ControlledPopoverWithAriaExpanded animate={true} />);
			const trigger = screen.getByTestId('trigger');

			act(() => {
				trigger.click();
			});
			act(() => {
				trigger.click();
			});

			// Still true during animation
			expect(trigger).toHaveAttribute('aria-expanded', 'true');

			// Let the fallback timeout fire (simulates transitionend completing)
			act(() => {
				jest.runAllTimers();
			});

			// Now aria-expanded should be false
			expect(trigger).toHaveAttribute('aria-expanded', 'false');
		});

		it('completes a full open+close cycle correctly with animation', () => {
			render(<ControlledPopoverWithAriaExpanded animate={true} />);
			const trigger = screen.getByTestId('trigger');

			// Open
			act(() => {
				trigger.click();
			});
			act(() => {
				jest.runAllTimers();
			});
			expect(trigger).toHaveAttribute('aria-expanded', 'true');

			// Close — stays true during animation
			act(() => {
				trigger.click();
			});
			expect(trigger).toHaveAttribute('aria-expanded', 'true');

			// Animation completes
			act(() => {
				jest.runAllTimers();
			});
			expect(trigger).toHaveAttribute('aria-expanded', 'false');

			// Open again
			act(() => {
				trigger.click();
			});
			act(() => {
				jest.runAllTimers();
			});
			expect(trigger).toHaveAttribute('aria-expanded', 'true');
		});
	});
});
