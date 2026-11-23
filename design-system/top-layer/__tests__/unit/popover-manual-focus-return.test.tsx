import React, { useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { Popover } from '../../src/popover/popover';
import { type TPopoverCloseReason } from '../../src/popover/types';
import { useManualLightDismiss } from '../../src/use-manual-light-dismiss';

type TCloseRef = { current: ((args: { isOtherOpen: boolean }) => void) | null };

/**
 * A `manual` popover that asks first and accepts, as the wrappers use it. `closeRef` lets a test
 * close it from state, and open another layer (`other`) in the same commit.
 */
function Subject({
	closeRef,
	reopenRef,
	onClose,
	shouldAnimate = false,
}: {
	closeRef?: TCloseRef;
	reopenRef?: { current: (() => void) | null };
	onClose?: (args: { reason: TPopoverCloseReason }) => void;
	shouldAnimate?: boolean;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [isOtherOpen, setIsOtherOpen] = useState(false);
	const popoverRef = useRef<HTMLDivElement>(null);
	useManualLightDismiss({
		isOpen,
		popoverRef,
		onClose({ reason }: { reason: TPopoverCloseReason }) {
			onClose?.({ reason });
			setIsOpen(false);
		},
	});
	if (closeRef) {
		closeRef.current = ({ isOtherOpen: shouldOpenOther }) => {
			setIsOpen(false);
			setIsOtherOpen(shouldOpenOther);
		};
	}
	if (reopenRef) {
		reopenRef.current = () => {
			setIsOpen(true);
		};
	}
	return (
		<>
			<button type="button" onClick={() => setIsOpen(true)}>
				Trigger
			</button>
			<button type="button">Outside</button>
			<Popover
				ref={popoverRef}
				mode="manual"
				isOpen={isOpen}
				role="dialog"
				label="Subject"
				shouldAnimate={shouldAnimate}
			>
				<button type="button">Inside</button>
				<button type="button">Second inside</button>
			</Popover>
			{/* Shows in the commit that closes the subject, as a modal dialog that a menu item opens. */}
			<Popover mode="manual" isOpen={isOtherOpen} role="dialog" label="Other" testId="other">
				<button type="button">Other inside</button>
			</Popover>
		</>
	);
}

async function flushMicrotasks() {
	await act(async () => {
		await Promise.resolve();
	});
}

function openFromTrigger(): void {
	const trigger = screen.getByRole('button', { name: 'Trigger' });
	act(() => {
		trigger.focus();
		trigger.click();
	});
	act(() => {
		screen.getByRole('button', { name: 'Inside' }).focus();
	});
}

describe('Popover mode="manual": focus return and inner popovers on hide', () => {
	it('returns focus to the opener after an Escape close', async () => {
		render(<Subject />);
		openFromTrigger();

		act(() => {
			screen
				.getByRole('button', { name: 'Inside' })
				.dispatchEvent(
					new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
				);
		});
		await flushMicrotasks();

		expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
	});

	it('does not return focus after a light dismiss, as native light dismiss', async () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);
		openFromTrigger();
		const outside = screen.getByRole('button', { name: 'Outside' });

		act(() => {
			outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }));
			outside.dispatchEvent(new MouseEvent('pointerup', { bubbles: true, cancelable: true }));
			outside.dispatchEvent(
				new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }),
			);
		});
		// The light dismiss asks in a task after the press.
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});
		await flushMicrotasks();

		expect(onClose).toHaveBeenCalledWith({ reason: 'light-dismiss' });
		expect(screen.getByRole('button', { name: 'Trigger' })).not.toHaveFocus();
	});

	it('does not return focus after a light dismiss whose click moved focus into the popover', async () => {
		render(<Subject />);
		openFromTrigger();
		const outside = screen.getByRole('button', { name: 'Outside' });
		const unbind = bind(outside, {
			type: 'click',
			listener() {
				screen.getByRole('button', { name: 'Inside' }).focus();
			},
		});

		act(() => {
			outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }));
			outside.dispatchEvent(new MouseEvent('pointerup', { bubbles: true, cancelable: true }));
			outside.dispatchEvent(
				new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }),
			);
		});
		await flushMicrotasks();
		await flushMicrotasks();
		unbind();

		expect(screen.getByRole('button', { name: 'Trigger' })).not.toHaveFocus();
	});

	it('returns focus to the opener after a close from state with focus inside', async () => {
		const closeRef: TCloseRef = { current: null };
		render(<Subject closeRef={closeRef} />);
		openFromTrigger();

		act(() => {
			closeRef.current?.({ isOtherOpen: false });
		});
		await flushMicrotasks();

		expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
	});

	it('does not move focus that has a place after the close', async () => {
		const closeRef: TCloseRef = { current: null };
		render(<Subject closeRef={closeRef} />);
		openFromTrigger();
		const outside = screen.getByRole('button', { name: 'Outside' });

		act(() => {
			outside.focus();
			closeRef.current?.({ isOtherOpen: false });
		});
		await flushMicrotasks();

		expect(outside).toHaveFocus();
	});

	it('returns focus as another layer opens in the same commit, so that layer records the opener', async () => {
		const closeRef: TCloseRef = { current: null };
		render(<Subject closeRef={closeRef} />);
		openFromTrigger();
		const focusAtOtherOpen: { current: Element | null } = { current: null };
		// The other popover mounts in the commit, so listen on the document.
		const unbind = bind(document, {
			type: 'beforetoggle',
			listener(event) {
				const isOtherOpening =
					event.target instanceof HTMLElement &&
					event.target.getAttribute('data-testid') === 'other' &&
					'newState' in event &&
					event.newState === 'open';
				if (isOtherOpening) {
					// eslint-disable-next-line testing-library/no-node-access -- the element that a layer records as its opener
					focusAtOtherOpen.current = document.activeElement;
				}
			},
			options: { capture: true },
		});

		act(() => {
			closeRef.current?.({ isOtherOpen: true });
		});
		unbind();

		expect(focusAtOtherOpen.current).toBe(screen.getByRole('button', { name: 'Trigger' }));
	});

	it('does not return focus when the popover shows again before the return runs', async () => {
		const closeRef: TCloseRef = { current: null };
		const reopenRef: { current: (() => void) | null } = { current: null };
		render(<Subject closeRef={closeRef} reopenRef={reopenRef} shouldAnimate />);
		openFromTrigger();
		// Not the element that initial focus picks, so a return and a new initial focus would show.
		const secondInside = screen.getByRole('button', { name: 'Second inside' });
		act(() => {
			secondInside.focus();
		});

		// The popover stays mounted during its exit animation. The reopen commits in the same task as
		// the close, before the microtask of the return.
		act(() => {
			closeRef.current?.({ isOtherOpen: false });
		});
		act(() => {
			reopenRef.current?.();
		});
		await flushMicrotasks();

		expect(secondInside).toHaveFocus();
	});

	it('hides the open popovers inside it as it hides', () => {
		const closeRef: TCloseRef = { current: null };
		render(<Subject closeRef={closeRef} />);
		openFromTrigger();
		const inside = screen.getByRole('button', { name: 'Inside' });
		const inner = document.createElement('div');
		inner.setAttribute('popover', 'manual');
		act(() => {
			inside.after(inner);
			inner.showPopover();
		});
		expect(inner.matches(':popover-open')).toBe(true);

		act(() => {
			closeRef.current?.({ isOtherOpen: false });
		});

		expect(inner.matches(':popover-open')).toBe(false);
	});
});
