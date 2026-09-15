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
 * Dispatch directly when a test needs to control the close-event ordering.
 */
function fireLightDismissToggle(element: HTMLElement) {
	const event = new Event('toggle', { bubbles: false }) as ToggleEvent;
	Object.defineProperty(event, 'newState', { value: 'closed', configurable: true });
	Object.defineProperty(event, 'oldState', { value: 'open', configurable: true });
	element.dispatchEvent(event);
}

/**
 * Fires a synthetic `beforetoggle` event simulating a browser open.
 * Replaces the mount-time focus snapshot after the test focuses its trigger.
 */
function fireOpenBeforeToggle(element: HTMLElement) {
	const event = new Event('beforetoggle', { bubbles: false }) as ToggleEvent;
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

describe('Popover focus transfer before the closed toggle', () => {
	it.each(['parent', 'outside'] as const)(
		'preserves focus transferred to a %s button after beforetoggle',
		async (destination) => {
			function content(isOpen: boolean) {
				return (
					<>
						<Popover isOpen mode="manual" role="dialog" label="parent">
							<div>
								<button data-testid="submenu-trigger">Open submenu</button>
								<button data-testid="parent-destination">Parent action</button>
								<Popover isOpen={isOpen} mode="manual" role="dialog" label="child">
									<button data-testid="child-action">Child action</button>
								</Popover>
							</div>
						</Popover>
						<button data-testid="outside-destination">Outside action</button>
					</>
				);
			}

			const { rerender } = render(content(true));
			const child = screen.getByRole('dialog', { name: 'child' });
			const trigger = screen.getByTestId('submenu-trigger');
			const target = screen.getByTestId(`${destination}-destination`);
			act(() => {
				trigger.focus();
				fireOpenBeforeToggle(child);
				screen.getByTestId('child-action').focus();
			});

			// Controlled close fires beforetoggle synchronously, but queues toggle.
			rerender(content(false));
			target.focus();
			expect(target).toHaveFocus();

			// Unmounting confirms closed-toggle handling has finished before checking focus.
			await waitFor(() => {
				expect(child).not.toBeInTheDocument();
			});

			expect(target).toHaveFocus();
		},
	);
});

describe('Popover closeReasonRef - race condition between Escape keydown and programmatic close', () => {
	it('suppresses onClose when synthetic Escape follows a programmatic close', () => {
		const onClose = jest.fn();
		const { rerender } = render(
			<Popover isOpen={true} onClose={onClose} role="dialog" label="synthetic-escape-test">
				content
			</Popover>,
		);
		const popover = screen.getByRole('dialog', { name: 'synthetic-escape-test' });

		// hidePopover() queues its toggle event. A synthetic event can run before that task.
		rerender(
			<Popover isOpen={false} onClose={onClose} role="dialog" label="synthetic-escape-test">
				content
			</Popover>,
		);

		act(() => {
			fireEscapeKeydown(popover);
			fireLightDismissToggle(popover);
		});

		expect(onClose).not.toHaveBeenCalled();
	});

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
		// The controlled close must suppress onClose and clear the prior Escape reason.
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
		await waitFor(() => {
			expect(popover).not.toBeInTheDocument();
		});
		expect(triggerFocus).toHaveBeenCalledWith({ preventScroll: true });
	});

	it('reports reason "escape" when Escape keydown causes the close (no programmatic race)', async () => {
		const onClose = jest.fn();
		render(
			<Popover isOpen={true} onClose={onClose} role="dialog" label="escape-test">
				content
			</Popover>,
		);
		const popover = screen.getByRole('dialog', { name: 'escape-test' });

		// The polyfill hides during document capture, before our keydown listener.
		// Defer that hide to reproduce native ordering: keydown first, dismissal second.
		const hidePopover = jest.spyOn(popover, 'hidePopover').mockImplementationOnce(() => {});
		act(() => {
			fireEscapeKeydown(popover);
		});
		hidePopover.mockRestore();

		act(() => {
			popover.hidePopover();
		});
		await waitFor(() => {
			expect(popover).not.toBeInTheDocument();
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
			fireLightDismissToggle(popover);
		});

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledWith({ reason: 'light-dismiss' });
	});
});
