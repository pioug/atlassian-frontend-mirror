import React, { useState } from 'react';

import { act, render, screen, waitFor } from '@atlassian/testing-library';

import { Popover } from '../../src/popover/popover';

/**
 * Fires a capture-phase keydown for Escape on the popover element.
 * This mirrors what the browser does when the user presses Escape.
 */
function fireEscapeKeydown(element: HTMLElement) {
	element.dispatchEvent(
		new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
	);
}

/**
 * Fires a synthetic `toggle` event simulating a browser light-dismiss.
 * JSDOM does not implement the native Popover API, so toggle events must be
 * dispatched manually to exercise the handleToggle path.
 */
function fireLightDismissToggle(element: HTMLElement) {
	const event = new Event('toggle', { bubbles: false }) as ToggleEvent;
	Object.defineProperty(event, 'newState', { value: 'closed', configurable: true });
	Object.defineProperty(event, 'oldState', { value: 'open', configurable: true });
	element.dispatchEvent(event);
}

/**
 * Fires a synthetic `beforetoggle` event simulating a browser open.
 */
function fireOpenBeforeToggle(element: HTMLElement) {
	const event = new Event('beforetoggle', { bubbles: false }) as ToggleEvent;
	Object.defineProperty(event, 'newState', { value: 'open', configurable: true });
	Object.defineProperty(event, 'oldState', { value: 'closed', configurable: true });
	element.dispatchEvent(event);
}

/**
 * Fires a synthetic `toggle` event simulating a browser open.
 */
function fireOpenToggle(element: HTMLElement) {
	const event = new Event('toggle', { bubbles: false }) as ToggleEvent;
	Object.defineProperty(event, 'newState', { value: 'open', configurable: true });
	Object.defineProperty(event, 'oldState', { value: 'closed', configurable: true });
	element.dispatchEvent(event);
}

function PopoverWithChangingOnClose() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button data-testid="changing-handler-trigger" onClick={() => setIsOpen(true)}>
				Open
			</button>
			<Popover
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				role="dialog"
				label="changing-handler-test"
				shouldAnimate
			>
				<button data-testid="changing-handler-close" onClick={() => setIsOpen(false)}>
					Close
				</button>
			</Popover>
		</>
	);
}

it('should capture and report a11y violations', async () => {
	const { container } = render(
		<Popover isOpen={true} onClose={() => {}} role="dialog" label="a11y-test">
			content
		</Popover>,
	);
	await expect(container).toBeAccessible();
});

describe('Popover native lifecycle listener stability', () => {
	it('keeps lifecycle listeners attached when onClose changes during a controlled close', async () => {
		render(<PopoverWithChangingOnClose />);

		act(() => {
			screen.getByTestId('changing-handler-trigger').click();
		});
		act(() => {
			screen.getByTestId('changing-handler-close').click();
		});

		await waitFor(() => {
			expect(
				screen.queryByRole('dialog', { name: 'changing-handler-test' }),
			).not.toBeInTheDocument();
		});
	});
});

describe('Popover closeReasonRef - race condition between Escape keydown and programmatic close', () => {
	it('reports reason "light-dismiss" after a prior Escape+programmatic-close race', () => {
		// Arrange
		const onClose = jest.fn();
		const { rerender } = render(
			<Popover isOpen={true} onClose={onClose} role="dialog" label="race-test">
				content
			</Popover>,
		);
		const popover = screen.getByRole('dialog', { name: 'race-test' });

		// Simulate: Escape keydown fires first (capture phase sets closeReasonRef to 'escape')
		act(() => {
			fireEscapeKeydown(popover);
		});

		// Simulate: programmatic close wins the race - rerender with isOpen=false
		// This calls hidePopover() with programmaticCloseRef=true, then the toggle
		// handler fires with programmaticCloseRef.current===true and returns early.
		// Before the fix, closeReasonRef stayed 'escape' after this early return.
		rerender(
			<Popover isOpen={false} onClose={onClose} role="dialog" label="race-test">
				content
			</Popover>,
		);

		act(() => {
			fireLightDismissToggle(popover);
		});

		// onClose should NOT have been called for the programmatic close
		expect(onClose).not.toHaveBeenCalled();

		// Reopen for the next cycle. The Popover unmounts its host element on
		// close, so re-query for the freshly mounted element.
		rerender(
			<Popover isOpen={true} onClose={onClose} role="dialog" label="race-test">
				content
			</Popover>,
		);
		const reopenedPopover = screen.getByRole('dialog', { name: 'race-test' });

		act(() => {
			fireOpenToggle(reopenedPopover);
		});

		// Now trigger a genuine light-dismiss (no Escape keydown this time)
		act(() => {
			fireLightDismissToggle(reopenedPopover);
		});

		// The subsequent light-dismiss must report 'light-dismiss', not the stale 'escape'
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledWith({ reason: 'light-dismiss' });
	});

	/**
	 * This test covers controlled closure before the task-queued native toggle event.
	 * Playwright covers the complete browser event and final-focus sequence.
	 */
	it('restores focus after the current event when a controlled manual popover closes', async () => {
		const { rerender } = render(
			<>
				<button data-testid="trigger">Open spotlight</button>
				<Popover isOpen={true} mode="manual" role="dialog" label="manual-focus-test">
					<button data-testid="dismiss">Dismiss spotlight</button>
				</Popover>
			</>,
		);
		const trigger = screen.getByTestId('trigger');
		trigger.focus();
		const popover = screen.getByRole('dialog', { name: 'manual-focus-test' });
		act(() => {
			fireOpenBeforeToggle(popover);
		});
		const dismiss = screen.getByTestId('dismiss');
		dismiss.focus();
		const triggerFocus = jest.spyOn(trigger, 'focus');

		rerender(
			<>
				<button data-testid="trigger">Open spotlight</button>
				<Popover isOpen={false} mode="manual" role="dialog" label="manual-focus-test">
					<button data-testid="dismiss">Dismiss spotlight</button>
				</Popover>
			</>,
		);

		expect(triggerFocus).not.toHaveBeenCalled();
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});
		expect(triggerFocus).toHaveBeenCalledWith({ preventScroll: true });
	});

	it('reports reason "escape" when Escape keydown causes the close (no programmatic race)', () => {
		const onClose = jest.fn();
		render(
			<Popover isOpen={true} onClose={onClose} role="dialog" label="escape-test">
				content
			</Popover>,
		);
		const popover = screen.getByRole('dialog', { name: 'escape-test' });

		act(() => {
			fireOpenToggle(popover);
		});

		// Escape keydown sets closeReasonRef to 'escape', then light-dismiss toggle fires
		act(() => {
			fireEscapeKeydown(popover);
		});

		act(() => {
			fireLightDismissToggle(popover);
		});

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });
	});

	it('reports reason "light-dismiss" for a plain click-outside close (no Escape)', () => {
		const onClose = jest.fn();
		render(
			<Popover isOpen={true} onClose={onClose} role="dialog" label="light-dismiss-test">
				content
			</Popover>,
		);
		const popover = screen.getByRole('dialog', { name: 'light-dismiss-test' });

		act(() => {
			fireOpenToggle(popover);
		});

		act(() => {
			fireLightDismissToggle(popover);
		});

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledWith({ reason: 'light-dismiss' });
	});
});
