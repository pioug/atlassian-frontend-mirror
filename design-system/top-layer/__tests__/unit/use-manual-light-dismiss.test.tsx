import React, { createRef, useMemo, useRef } from 'react';

import { bind, bindAll } from 'bind-event-listener';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { Dialog } from '../../src/dialog/dialog-content';
import { useCloseOnUnclaimedEscape } from '../../src/page-surface/use-close-on-unclaimed-escape';
import { Popover } from '../../src/popover/popover';
import { useManualLightDismiss } from '../../src/use-manual-light-dismiss';

/**
 * A pointer press, as a browser sends it: `pointerdown` on `start`, `pointerup` on `end`, then
 * `click`. For a drag (`start` and `end` differ) a browser sends the `click` to their nearest common
 * ancestor; `document.body` stands in for it, which is also an ancestor of both. jsdom has no
 * `PointerEvent`, so the pointer events are `MouseEvent`s.
 */
function firePress({ start, end = start }: { start: Element; end?: Element }): void {
	act(() => {
		start.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }));
		end.dispatchEvent(new MouseEvent('pointerup', { bubbles: true, cancelable: true }));
		(start === end ? start : document.body).dispatchEvent(
			new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }),
		);
	});
}

// A `click` with no pointer press, as from the keyboard or `element.click()`.
function fireClickWithoutPress({ target }: { target: Element }): void {
	act(() => {
		target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
	});
}

// A keydown, as a browser sends it.
function fireKeyDown({
	target,
	key = 'Escape',
	isComposing = false,
	repeat = false,
}: {
	target: Element;
	key?: string;
	isComposing?: boolean;
	repeat?: boolean;
}): KeyboardEvent {
	const event = new KeyboardEvent('keydown', {
		key,
		isComposing,
		repeat,
		bubbles: true,
		cancelable: true,
		composed: true,
	});
	act(() => {
		target.dispatchEvent(event);
	});
	return event;
}

/**
 * A manual popover inside the subject that closes on Escape with the hook.
 */
function NestedManualPopover({ onClose }: { onClose: () => void }) {
	const popoverRef = useRef<HTMLDivElement>(null);
	useManualLightDismiss({ popoverRef, isOpen: true, onClose });
	return (
		<Popover ref={popoverRef} mode="manual" isOpen role="dialog" label="Nested manual">
			<button type="button">Inside nested manual popover</button>
		</Popover>
	);
}

type TSubjectProps = {
	onClose: () => void;
	isOpen?: boolean;
	hasTriggerRef?: boolean;
	isNestedPopoverOpen?: boolean;
	isNestedDialogOpen?: boolean;
	isNestedNonModalDialogOpen?: boolean;
	isNestedTooltipOpen?: boolean;
	isNestedStaticPopoverOpen?: boolean;
	onNestedManualClose?: () => void;
};

function Subject({
	onClose,
	isOpen = true,
	hasTriggerRef = true,
	isNestedPopoverOpen = false,
	isNestedDialogOpen = false,
	isNestedNonModalDialogOpen = false,
	isNestedTooltipOpen = false,
	isNestedStaticPopoverOpen = false,
	onNestedManualClose,
}: TSubjectProps) {
	const popoverRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const additionalInsideElementRefs = useMemo(
		() => (hasTriggerRef ? [triggerRef] : undefined),
		[hasTriggerRef],
	);
	useManualLightDismiss({
		isOpen,
		popoverRef,
		additionalInsideElementRefs,
		onClose,
	});
	return (
		<>
			<button type="button" ref={triggerRef}>
				Trigger
			</button>
			<div
				ref={popoverRef}
				// @ts-expect-error -- popover attribute not yet in React types
				// eslint-disable-next-line react/no-unknown-property -- popover attribute not yet in React types
				popover="manual"
				data-testid="subject"
			>
				<button type="button">Inside</button>
				<Popover isOpen={isNestedPopoverOpen} role="dialog" label="Nested" onClose={() => {}}>
					<button type="button">Inside nested popover</button>
				</Popover>
				<Popover isOpen={isNestedTooltipOpen} mode="hint" role="tooltip" onClose={() => {}}>
					Nested tooltip
				</Popover>
				<Popover isOpen={isNestedStaticPopoverOpen} mode="manual" role="dialog" label="Error">
					<button type="button">Inside static popover</button>
				</Popover>
				{onNestedManualClose ? <NestedManualPopover onClose={onNestedManualClose} /> : null}
				<Dialog isOpen={isNestedDialogOpen} onClose={() => {}} label="Nested dialog">
					<button type="button">Inside nested dialog</button>
				</Dialog>
				{isNestedNonModalDialogOpen ? (
					<dialog open>
						<button type="button">Inside nested non-modal dialog</button>
					</dialog>
				) : null}
			</div>
			<button type="button">Outside</button>
		</>
	);
}

describe('useManualLightDismiss()', () => {
	it('dismisses on a press outside the popover and the inside elements', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);

		firePress({ start: screen.getByRole('button', { name: 'Outside' }) });

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledWith({ reason: 'light-dismiss' });
	});

	it('does not dismiss on a pointerdown outside (the press must end outside)', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);

		act(() => {
			screen
				.getByRole('button', { name: 'Outside' })
				.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }));
		});

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not dismiss on a drag from inside the popover to outside it', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);

		// For example a text selection that ends outside the popover.
		firePress({
			start: screen.getByRole('button', { name: 'Inside' }),
			end: screen.getByRole('button', { name: 'Outside' }),
		});

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not dismiss on a drag from outside the popover into it', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);

		firePress({
			start: screen.getByRole('button', { name: 'Outside' }),
			end: screen.getByRole('button', { name: 'Inside' }),
		});

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not dismiss on a keyboard or programmatic click outside', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);

		fireClickWithoutPress({ target: screen.getByRole('button', { name: 'Outside' }) });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not dismiss on a keyboard click after an earlier press inside', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);
		firePress({ start: screen.getByRole('button', { name: 'Inside' }) });

		fireClickWithoutPress({ target: screen.getByRole('button', { name: 'Outside' }) });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not dismiss after a cancelled press (a touch scroll or a native drag), even on a later pointerup', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);
		const outside = screen.getByRole('button', { name: 'Outside' });
		act(() => {
			outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
			outside.dispatchEvent(new MouseEvent('pointercancel', { bubbles: true }));
		});

		// A `pointerup` with no `pointerdown` before it must not end the cancelled press.
		act(() => {
			outside.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
		});
		fireClickWithoutPress({ target: outside });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('dismisses when the consumer re-renders with new inside elements in the middle of a press', () => {
		const onClose = jest.fn();
		function InlineInsideElements({ renderCount }: { renderCount: number }) {
			const popoverRef = useRef<HTMLDivElement>(null);
			const triggerRef = useRef<HTMLButtonElement>(null);
			// A new array on every render.
			useManualLightDismiss({
				popoverRef,
				additionalInsideElementRefs: [triggerRef],
				isOpen: true,
				onClose,
			});
			return (
				<>
					<button type="button" ref={triggerRef}>{`Trigger ${renderCount}`}</button>
					<Popover ref={popoverRef} mode="manual" isOpen role="dialog" label="Inline">
						<button type="button">Inside inline</button>
					</Popover>
					<button type="button">Outside inline</button>
				</>
			);
		}
		const { rerender } = render(<InlineInsideElements renderCount={1} />);
		const outside = screen.getByRole('button', { name: 'Outside inline' });

		act(() => {
			outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
		});
		// For example a blur handler inside the popover that sets state.
		rerender(<InlineInsideElements renderCount={2} />);
		act(() => {
			outside.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
			outside.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
		});

		expect(onClose).toHaveBeenCalledWith({ reason: 'light-dismiss' });
	});

	it('dismisses when the press ends, before any click', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);
		const outside = screen.getByRole('button', { name: 'Outside' });

		act(() => {
			outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
			outside.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
		});

		expect(onClose).toHaveBeenCalledWith({ reason: 'light-dismiss' });
	});

	it('does not dismiss on a later keyboard click after a press with no click (for example a right-click)', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);
		const outside = screen.getByRole('button', { name: 'Outside' });
		// WebKit sends only `pointerdown` for a right-click.
		act(() => {
			outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 2 }));
		});

		fireClickWithoutPress({ target: outside });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('throws when popoverRef is not a [popover] element', () => {
		function PlainElement() {
			const popoverRef = useRef<HTMLDivElement>(null);
			useManualLightDismiss({ popoverRef, isOpen: true, onClose: () => {} });
			return <div ref={popoverRef}>Plain</div>;
		}
		// React logs the error it rethrows.
		const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

		expect(() => render(<PlainElement />)).toThrow(/must be a `\[popover\]` element/);
		consoleError.mockRestore();
	});

	it('does not dismiss on a press inside the popover', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);

		firePress({ start: screen.getByRole('button', { name: 'Inside' }) });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not dismiss on a press inside an additional inside element', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);

		firePress({ start: screen.getByRole('button', { name: 'Trigger' }) });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('dismisses on a press on the trigger when it is not an inside element', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} hasTriggerRef={false} />);

		firePress({ start: screen.getByRole('button', { name: 'Trigger' }) });

		expect(onClose).toHaveBeenCalledWith({ reason: 'light-dismiss' });
	});

	it('dismisses on an outside press that a handler stops from propagating', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);
		const outside = screen.getByRole('button', { name: 'Outside' });
		function stopPropagation(event: Event) {
			event.stopPropagation();
		}
		const unbind = bindAll(outside, [
			{ type: 'pointerdown', listener: stopPropagation },
			{ type: 'pointerup', listener: stopPropagation },
			{ type: 'click', listener: stopPropagation },
		]);

		firePress({ start: outside });
		unbind();

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('dismisses on Escape and takes the Escape', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside' }) });

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });
		expect(event.defaultPrevented).toBe(true);
	});

	it('takes a repeated Escape from a held key, but does not ask again', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);

		const event = fireKeyDown({
			target: screen.getByRole('button', { name: 'Inside' }),
			repeat: true,
		});

		expect(event.defaultPrevented).toBe(true);
		expect(onClose).not.toHaveBeenCalled();
	});

	it('ignores other keys', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);

		const event = fireKeyDown({
			target: screen.getByRole('button', { name: 'Inside' }),
			key: 'Enter',
		});

		expect(onClose).not.toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(false);
	});

	it('ignores Escape while a nested auto popover is open', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} isNestedPopoverOpen />);

		const event = fireKeyDown({
			target: screen.getByRole('button', { name: 'Inside nested popover' }),
		});

		expect(onClose).not.toHaveBeenCalled();
		// The browser closes the nested popover, so the hook must not cancel the keydown.
		expect(event.defaultPrevented).toBe(false);
	});

	it('ignores Escape while a nested tooltip is open', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} isNestedTooltipOpen />);

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside' }) });

		expect(onClose).not.toHaveBeenCalled();
		// The browser closes the tooltip, so the hook must not cancel the keydown.
		expect(event.defaultPrevented).toBe(false);
	});

	it('ignores Escape while a nested dialog is open', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} isNestedDialogOpen />);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside nested dialog' }) });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('dismisses on Escape while a nested non-modal dialog is open', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} isNestedNonModalDialogOpen />);

		const event = fireKeyDown({
			target: screen.getByRole('button', { name: 'Inside nested non-modal dialog' }),
		});

		// A non-modal dialog does not close on Escape, so it must not keep the popover open.
		expect(event.defaultPrevented).toBe(true);
		expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });
	});

	it('dismisses on Escape while a nested modal dialog with closedby="none" is open', () => {
		const onClose = jest.fn();
		function PopoverWithModal() {
			const popoverRef = useRef<HTMLDivElement>(null);
			useManualLightDismiss({ popoverRef, isOpen: true, onClose });
			return (
				<Popover ref={popoverRef} mode="manual" isOpen role="dialog" label="Manual">
					<dialog closedby="none" data-testid="inner-modal">
						<button type="button">Inside inner modal</button>
					</dialog>
				</Popover>
			);
		}
		render(<PopoverWithModal />);
		const inner = screen.getByTestId('inner-modal');
		if (!(inner instanceof HTMLDialogElement)) {
			throw new Error('The inner element must be a <dialog>');
		}
		act(() => {
			inner.showModal();
		});

		const event = fireKeyDown({
			target: screen.getByRole('button', { name: 'Inside inner modal' }),
		});

		// The browser sends the close request past a dialog with closedby="none", to the popover.
		expect(event.defaultPrevented).toBe(true);
		expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });
		expect(inner).toHaveAttribute('open');
	});

	it('does not dismiss on a press while the popover element is not attached', () => {
		const onClose = jest.fn();
		function Detached() {
			const popoverRef = useRef<HTMLDivElement>(null);
			useManualLightDismiss({ popoverRef, isOpen: true, onClose });
			return <button type="button">Somewhere</button>;
		}
		render(<Detached />);

		firePress({ start: screen.getByRole('button', { name: 'Somewhere' }) });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not take Escape while the popover element is not attached', () => {
		const onClose = jest.fn();
		function Detached() {
			const popoverRef = useRef<HTMLDivElement>(null);
			useManualLightDismiss({ popoverRef, isOpen: true, onClose });
			return <button type="button">Somewhere</button>;
		}
		render(<Detached />);

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Somewhere' }) });

		// The Escape goes on to the next layer, as if the hook were not there.
		expect(event.defaultPrevented).toBe(false);
		expect(onClose).not.toHaveBeenCalled();
	});

	it('lets a nested manual popover with the hook close first', () => {
		const onClose = jest.fn();
		const onNestedManualClose = jest.fn();
		render(<Subject onClose={onClose} onNestedManualClose={onNestedManualClose} />);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside nested manual popover' }) });

		expect(onNestedManualClose).toHaveBeenCalledTimes(1);
		expect(onClose).not.toHaveBeenCalled();
	});

	// As native light dismiss: a press closes every layer it is outside, in one press. Escape closes
	// one layer per press.
	it('dismisses the popover and a nested manual popover with the hook on one press outside both', () => {
		const onClose = jest.fn();
		const onNestedManualClose = jest.fn();
		render(<Subject onClose={onClose} onNestedManualClose={onNestedManualClose} />);

		firePress({ start: screen.getByRole('button', { name: 'Outside' }) });

		expect(onNestedManualClose).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('dismisses only the nested manual popover on a press inside the popover, outside the nested one', () => {
		const onClose = jest.fn();
		const onNestedManualClose = jest.fn();
		render(<Subject onClose={onClose} onNestedManualClose={onNestedManualClose} />);

		firePress({ start: screen.getByRole('button', { name: 'Inside' }) });

		expect(onNestedManualClose).toHaveBeenCalledTimes(1);
		expect(onClose).not.toHaveBeenCalled();
	});

	it('dismisses on Escape while a nested manual popover without the hook is open', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} isNestedStaticPopoverOpen />);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside static popover' }) });

		expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });
	});

	it('marks the popover as a layer that takes Escape only while open', () => {
		const { rerender } = render(<Subject onClose={jest.fn()} />);
		expect(screen.getByTestId('subject')).toHaveAttribute('data-top-layer-takes-escape');

		rerender(<Subject onClose={jest.fn()} isOpen={false} />);

		expect(screen.getByTestId('subject')).not.toHaveAttribute('data-top-layer-takes-escape');
	});

	it('ignores an Escape that was already handled', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);
		const inside = screen.getByRole('button', { name: 'Inside' });
		const unbind = bind(inside, {
			type: 'keydown',
			listener(event) {
				event.preventDefault();
			},
		});

		fireKeyDown({ target: inside });
		unbind();

		expect(onClose).not.toHaveBeenCalled();
	});

	it('ignores Escape during IME composition', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} />);

		const event = fireKeyDown({
			target: screen.getByRole('button', { name: 'Inside' }),
			isComposing: true,
		});

		expect(onClose).not.toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(false);
	});

	it('does not listen while closed', () => {
		const onClose = jest.fn();
		render(<Subject onClose={onClose} isOpen={false} />);

		firePress({ start: screen.getByRole('button', { name: 'Outside' }) });
		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside' }) });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('stops listening when it closes', () => {
		const onClose = jest.fn();
		const { rerender } = render(<Subject onClose={onClose} />);
		rerender(<Subject onClose={onClose} isOpen={false} />);

		firePress({ start: screen.getByRole('button', { name: 'Outside' }) });
		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside' }) });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('removes its listeners on unmount', () => {
		const onClose = jest.fn();
		const { unmount } = render(<Subject onClose={onClose} />);
		unmount();

		firePress({ start: document.body });
		act(() => {
			document.body.dispatchEvent(
				new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
			);
		});

		expect(onClose).not.toHaveBeenCalled();
	});

	it('uses the latest onClose', () => {
		const first = jest.fn();
		const second = jest.fn();
		const { rerender } = render(<Subject onClose={first} />);
		rerender(<Subject onClose={second} />);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside' }) });

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledTimes(1);
	});
});

describe('useManualLightDismiss() inside a Dialog', () => {
	function PopoverInDialog({
		onDialogClose,
		onPopoverClose,
	}: {
		onDialogClose: () => void;
		onPopoverClose: () => void;
	}) {
		const popoverRef = useRef<HTMLDivElement>(null);
		useManualLightDismiss({ popoverRef, isOpen: true, onClose: onPopoverClose });
		return (
			<Dialog isOpen onClose={onDialogClose} label="Parent dialog">
				<button type="button">Inside dialog</button>
				<Popover ref={popoverRef} mode="manual" isOpen role="dialog" label="Manual popover">
					<button type="button">Inside manual popover</button>
				</Popover>
			</Dialog>
		);
	}

	it.each([['Inside manual popover'], ['Inside dialog']])(
		'one Escape (focus on "%s") closes only the manual popover',
		(name) => {
			const onDialogClose = jest.fn();
			const onPopoverClose = jest.fn();
			render(<PopoverInDialog onDialogClose={onDialogClose} onPopoverClose={onPopoverClose} />);
			const target = screen.getByRole('button', { name });
			act(() => {
				target.focus();
			});

			fireKeyDown({ target });

			expect(onPopoverClose).toHaveBeenCalledWith({ reason: 'escape' });
			expect(onDialogClose).not.toHaveBeenCalled();
		},
	);
});

describe('useManualLightDismiss() with a layer that opens above the popover', () => {
	/**
	 * A manual popover with the hook. `additionalInsideElementRefs` is a new array on every render,
	 * as from a consumer that does not memoize it.
	 */
	function ManualLayer({
		name,
		isOpen = true,
		onClose,
		refVersion = 0,
	}: {
		name: string;
		isOpen?: boolean;
		onClose: () => void;
		/**
		 * A new value gives `popoverRef` a new ref object, as from a consumer that merges refs on each
		 * render. The hook effect then runs again while the popover is open.
		 */
		refVersion?: number;
	}) {
		// eslint-disable-next-line react-hooks/exhaustive-deps -- `refVersion` exists to make a new ref
		const popoverRef = useMemo(() => createRef<HTMLDivElement>(), [refVersion]);
		const triggerRef = useRef<HTMLButtonElement>(null);
		useManualLightDismiss({
			popoverRef,
			additionalInsideElementRefs: [triggerRef],
			isOpen,
			onClose,
		});
		return (
			<>
				<button type="button" ref={triggerRef}>
					{`${name} trigger`}
				</button>
				<Popover
					ref={popoverRef}
					mode="manual"
					isOpen={isOpen}
					role="dialog"
					label={name}
					testId={name}
				>
					<button type="button">{`Inside ${name}`}</button>
				</Popover>
			</>
		);
	}

	type TStackProps = {
		onManualClose?: () => void;
		isManualOpen?: boolean;
		isTooltipOpen?: boolean;
		isAutoPopoverOpen?: boolean;
		isDialogOpen?: boolean;
		onDialogClose?: () => void;
		isStaticPopoverOpen?: boolean;
		onSiblingClose?: () => void;
		isSiblingOpen?: boolean;
		manualRefVersion?: number;
	};

	/**
	 * The subject (`Manual`) and layers outside it. Each test opens them in a set order with
	 * `rerender`, so the order of the props here is not the open order.
	 */
	function Stack({
		onManualClose = () => {},
		isManualOpen = true,
		isTooltipOpen = false,
		isAutoPopoverOpen = false,
		isDialogOpen = false,
		onDialogClose = () => {},
		isStaticPopoverOpen = false,
		onSiblingClose = () => {},
		isSiblingOpen = false,
		manualRefVersion = 0,
	}: TStackProps) {
		return (
			<>
				<ManualLayer
					name="Manual"
					isOpen={isManualOpen}
					onClose={onManualClose}
					refVersion={manualRefVersion}
				/>
				<button type="button">Tooltip trigger</button>
				<Popover
					isOpen={isTooltipOpen}
					mode="hint"
					role="tooltip"
					testId="tooltip"
					onClose={() => {}}
				>
					Tooltip
				</Popover>
				<Popover
					isOpen={isAutoPopoverOpen}
					role="dialog"
					label="Auto"
					testId="auto"
					onClose={() => {}}
				>
					<button type="button">Inside auto</button>
				</Popover>
				<Popover
					isOpen={isStaticPopoverOpen}
					mode="manual"
					role="dialog"
					label="Error"
					testId="static"
				>
					<button type="button">Inside static popover</button>
				</Popover>
				<ManualLayer name="Sibling" isOpen={isSiblingOpen} onClose={onSiblingClose} />
				<Dialog isOpen={isDialogOpen} onClose={onDialogClose} label="Shortcut dialog">
					<button type="button">Inside dialog</button>
				</Dialog>
			</>
		);
	}

	function isOpen({ testId }: { testId: string }): boolean {
		return screen.getByTestId(testId).matches(':popover-open');
	}

	it('lets a tooltip that opens later, outside the popover, close first', () => {
		const onManualClose = jest.fn();
		const { rerender } = render(<Stack onManualClose={onManualClose} />);
		rerender(<Stack onManualClose={onManualClose} isTooltipOpen />);
		const inside = screen.getByRole('button', { name: 'Inside Manual' });

		const first = fireKeyDown({ target: inside });

		// The browser closes the tooltip, so the hook must not cancel the keydown.
		expect(first.defaultPrevented).toBe(false);
		expect(isOpen({ testId: 'tooltip' })).toBe(false);
		expect(onManualClose).not.toHaveBeenCalled();

		const second = fireKeyDown({ target: inside });

		expect(second.defaultPrevented).toBe(true);
		expect(onManualClose).toHaveBeenCalledTimes(1);
		expect(onManualClose).toHaveBeenCalledWith({ reason: 'escape' });
	});

	it('lets the layer above take Escape wherever focus is', () => {
		const onManualClose = jest.fn();
		const { rerender } = render(<Stack onManualClose={onManualClose} />);
		rerender(<Stack onManualClose={onManualClose} isTooltipOpen />);
		const trigger = screen.getByRole('button', { name: 'Tooltip trigger' });
		act(() => {
			trigger.focus();
		});

		fireKeyDown({ target: trigger });

		expect(isOpen({ testId: 'tooltip' })).toBe(false);
		expect(onManualClose).not.toHaveBeenCalled();
	});

	it('takes Escape over a tooltip that opened before the popover', () => {
		const onManualClose = jest.fn();
		const { rerender } = render(<Stack onManualClose={onManualClose} isManualOpen={false} />);
		rerender(<Stack onManualClose={onManualClose} isManualOpen={false} isTooltipOpen />);
		rerender(<Stack onManualClose={onManualClose} isTooltipOpen />);

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside Manual' }) });

		// The popover opened later, so it is above the tooltip.
		expect(event.defaultPrevented).toBe(true);
		expect(onManualClose).toHaveBeenCalledWith({ reason: 'escape' });
		expect(isOpen({ testId: 'tooltip' })).toBe(true);
	});

	it('takes Escape over an auto popover that opened before the popover', () => {
		const onManualClose = jest.fn();
		const { rerender } = render(
			<Stack onManualClose={onManualClose} isManualOpen={false} isAutoPopoverOpen />,
		);
		rerender(<Stack onManualClose={onManualClose} isAutoPopoverOpen />);

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside Manual' }) });

		expect(event.defaultPrevented).toBe(true);
		expect(onManualClose).toHaveBeenCalledWith({ reason: 'escape' });
		expect(isOpen({ testId: 'auto' })).toBe(true);
	});

	it('lets an auto popover that opens later close first', () => {
		const onManualClose = jest.fn();
		const { rerender } = render(<Stack onManualClose={onManualClose} />);
		rerender(<Stack onManualClose={onManualClose} isAutoPopoverOpen />);

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside auto' }) });

		expect(event.defaultPrevented).toBe(false);
		expect(isOpen({ testId: 'auto' })).toBe(false);
		expect(onManualClose).not.toHaveBeenCalled();
	});

	it('lets a Dialog that opens later (for example from a keyboard shortcut) close first', () => {
		const onManualClose = jest.fn();
		const onDialogClose = jest.fn();
		const { rerender } = render(
			<Stack onManualClose={onManualClose} onDialogClose={onDialogClose} />,
		);
		rerender(<Stack onManualClose={onManualClose} onDialogClose={onDialogClose} isDialogOpen />);

		const first = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside dialog' }) });

		expect(first.defaultPrevented).toBe(true);
		expect(onDialogClose).toHaveBeenCalledTimes(1);
		expect(onDialogClose).toHaveBeenCalledWith({ reason: 'escape' });
		expect(onManualClose).not.toHaveBeenCalled();

		// The consumer closes the dialog. The next Escape goes to the popover.
		rerender(<Stack onManualClose={onManualClose} onDialogClose={onDialogClose} />);
		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside Manual' }) });

		expect(onDialogClose).toHaveBeenCalledTimes(1);
		expect(onManualClose).toHaveBeenCalledWith({ reason: 'escape' });
	});

	it('keeps the popover open when the Dialog above decides to stay open', () => {
		const onManualClose = jest.fn();
		const onDialogClose = jest.fn();
		const { rerender } = render(
			<Stack onManualClose={onManualClose} onDialogClose={onDialogClose} />,
		);
		rerender(<Stack onManualClose={onManualClose} onDialogClose={onDialogClose} isDialogOpen />);
		const inside = screen.getByRole('button', { name: 'Inside dialog' });

		// The consumer ignores `onClose`, so the dialog stays open on every press.
		fireKeyDown({ target: inside });
		fireKeyDown({ target: inside });

		expect(onDialogClose).toHaveBeenCalledTimes(2);
		expect(onManualClose).not.toHaveBeenCalled();
	});

	it('lets a sibling manual popover that opens later close first', () => {
		const onManualClose = jest.fn();
		const onSiblingClose = jest.fn();
		const { rerender } = render(
			<Stack onManualClose={onManualClose} onSiblingClose={onSiblingClose} />,
		);
		rerender(<Stack onManualClose={onManualClose} onSiblingClose={onSiblingClose} isSiblingOpen />);
		const inside = screen.getByRole('button', { name: 'Inside Manual' });

		const first = fireKeyDown({ target: inside });

		// The sibling takes the Escape and cancels it, so nothing else closes on this press.
		expect(first.defaultPrevented).toBe(true);
		expect(onSiblingClose).toHaveBeenCalledTimes(1);
		expect(onManualClose).not.toHaveBeenCalled();

		rerender(<Stack onManualClose={onManualClose} onSiblingClose={onSiblingClose} />);
		fireKeyDown({ target: inside });

		expect(onSiblingClose).toHaveBeenCalledTimes(1);
		expect(onManualClose).toHaveBeenCalledTimes(1);
	});

	it('closes the newer of two sibling manual popovers first, whichever was rendered first', () => {
		const onManualClose = jest.fn();
		const onSiblingClose = jest.fn();
		const { rerender } = render(
			<Stack
				onManualClose={onManualClose}
				onSiblingClose={onSiblingClose}
				isManualOpen={false}
				isSiblingOpen
			/>,
		);
		rerender(<Stack onManualClose={onManualClose} onSiblingClose={onSiblingClose} isSiblingOpen />);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside Sibling' }) });

		expect(onManualClose).toHaveBeenCalledTimes(1);
		expect(onSiblingClose).not.toHaveBeenCalled();
	});

	it('keeps the popover open when the sibling above decides to stay open', () => {
		const onManualClose = jest.fn();
		const onSiblingClose = jest.fn();
		const { rerender } = render(
			<Stack onManualClose={onManualClose} onSiblingClose={onSiblingClose} />,
		);
		rerender(<Stack onManualClose={onManualClose} onSiblingClose={onSiblingClose} isSiblingOpen />);
		const inside = screen.getByRole('button', { name: 'Inside Manual' });

		// The consumer ignores the sibling's `onClose`, so it stays open on every press.
		fireKeyDown({ target: inside });
		fireKeyDown({ target: inside });

		expect(onSiblingClose).toHaveBeenCalledTimes(2);
		expect(onManualClose).not.toHaveBeenCalled();
	});

	it('takes Escape over a manual popover without the hook that opens later', () => {
		const onManualClose = jest.fn();
		const { rerender } = render(<Stack onManualClose={onManualClose} />);
		rerender(<Stack onManualClose={onManualClose} isStaticPopoverOpen />);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside static popover' }) });

		// A manual popover without the hook (for example a field error) does not take Escape.
		expect(onManualClose).toHaveBeenCalledWith({ reason: 'escape' });
		expect(isOpen({ testId: 'static' })).toBe(true);
	});

	it('takes Escape over a non-modal dialog that opens later', () => {
		const onManualClose = jest.fn();
		render(<Stack onManualClose={onManualClose} />);
		const dialog = document.createElement('dialog');
		document.body.append(dialog);
		act(() => {
			dialog.show();
		});

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside Manual' }) });

		// A non-modal dialog does not close on Escape, so it must not keep the popover open.
		expect(onManualClose).toHaveBeenCalledWith({ reason: 'escape' });
		dialog.remove();
	});

	it('lets a non-modal dialog with closedby="closerequest" that opens later close first', () => {
		const onManualClose = jest.fn();
		render(<Stack onManualClose={onManualClose} />);
		const dialog = document.createElement('dialog');
		dialog.setAttribute('closedby', 'closerequest');
		document.body.append(dialog);
		act(() => {
			dialog.show();
		});

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside Manual' }) });

		expect(event.defaultPrevented).toBe(false);
		expect(dialog.open).toBe(false);
		expect(onManualClose).not.toHaveBeenCalled();
		dialog.remove();
	});

	it('takes Escape again once the layer above closes', () => {
		const onManualClose = jest.fn();
		const { rerender } = render(<Stack onManualClose={onManualClose} />);
		rerender(<Stack onManualClose={onManualClose} isTooltipOpen />);
		rerender(<Stack onManualClose={onManualClose} />);

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside Manual' }) });

		expect(event.defaultPrevented).toBe(true);
		expect(onManualClose).toHaveBeenCalledWith({ reason: 'escape' });
	});

	it('takes Escape when the open of the layer above is cancelled', () => {
		const onManualClose = jest.fn();
		const { rerender } = render(<Stack onManualClose={onManualClose} />);
		// Bound after the open order listener, so the open is recorded before it is cancelled.
		const unbind = bind(document, {
			type: 'beforetoggle',
			listener(event) {
				if (event.target instanceof HTMLElement && event.target.dataset.testid === 'tooltip') {
					event.preventDefault();
				}
			},
			options: { capture: true },
		});
		rerender(<Stack onManualClose={onManualClose} isTooltipOpen />);
		unbind();

		expect(isOpen({ testId: 'tooltip' })).toBe(false);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside Manual' }) });

		expect(onManualClose).toHaveBeenCalledWith({ reason: 'escape' });
	});

	it('takes Escape over a tooltip that is still open when the popover opens again', () => {
		const onManualClose = jest.fn();
		const { rerender } = render(<Stack onManualClose={onManualClose} />);
		rerender(<Stack onManualClose={onManualClose} isTooltipOpen />);
		rerender(<Stack onManualClose={onManualClose} isTooltipOpen isManualOpen={false} />);
		// Opens again above the tooltip that is still open.
		rerender(<Stack onManualClose={onManualClose} isTooltipOpen />);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside Manual' }) });

		expect(onManualClose).toHaveBeenCalledWith({ reason: 'escape' });
		expect(isOpen({ testId: 'tooltip' })).toBe(true);
	});

	it('lets a tooltip above close first after the popover re-renders with new inside elements', () => {
		const onManualClose = jest.fn();
		const { rerender } = render(<Stack onManualClose={onManualClose} />);
		rerender(<Stack onManualClose={onManualClose} isTooltipOpen />);
		// `ManualLayer` passes a new `additionalInsideElementRefs` array on each render.
		rerender(<Stack onManualClose={onManualClose} isTooltipOpen />);

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside Manual' }) });

		expect(event.defaultPrevented).toBe(false);
		expect(onManualClose).not.toHaveBeenCalled();
		expect(isOpen({ testId: 'tooltip' })).toBe(false);
	});

	it('lets a tooltip above close first after the hook effect runs again while open', () => {
		const onManualClose = jest.fn();
		const { rerender } = render(<Stack onManualClose={onManualClose} />);
		rerender(<Stack onManualClose={onManualClose} isTooltipOpen />);
		// A new `popoverRef` object runs the hook effect again.
		rerender(<Stack onManualClose={onManualClose} isTooltipOpen manualRefVersion={1} />);

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside Manual' }) });

		expect(event.defaultPrevented).toBe(false);
		expect(onManualClose).not.toHaveBeenCalled();
		expect(isOpen({ testId: 'tooltip' })).toBe(false);
	});

	it('lets an auto popover that opens in the same commit as the popover, after it, close first', () => {
		const onManualClose = jest.fn();
		// `Manual` is first in the tree, so its layout effect opens it first.
		render(<Stack onManualClose={onManualClose} isAutoPopoverOpen />);

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside Manual' }) });

		expect(event.defaultPrevented).toBe(false);
		expect(onManualClose).not.toHaveBeenCalled();
		expect(isOpen({ testId: 'auto' })).toBe(false);
	});

	it('lets a tooltip that opens in the same commit as the popover, after it, close first', () => {
		const onManualClose = jest.fn();
		render(<Stack onManualClose={onManualClose} isTooltipOpen />);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside Manual' }) });

		expect(onManualClose).not.toHaveBeenCalled();
		expect(isOpen({ testId: 'tooltip' })).toBe(false);
	});

	it('closes the sibling that opened last when both manual popovers open in one commit', () => {
		const onManualClose = jest.fn();
		const onSiblingClose = jest.fn();
		const props = { onManualClose, onSiblingClose };
		// `Manual` opens first and binds its listener first. `Sibling` opens last, so it is on top.
		const { rerender } = render(<Stack {...props} isSiblingOpen />);
		const inside = screen.getByRole('button', { name: 'Inside Manual' });

		fireKeyDown({ target: inside });

		expect(onSiblingClose).toHaveBeenCalledTimes(1);
		expect(onManualClose).not.toHaveBeenCalled();

		rerender(<Stack {...props} isSiblingOpen={false} />);
		fireKeyDown({ target: inside });

		expect(onManualClose).toHaveBeenCalledTimes(1);
	});

	it('takes Escape over a tooltip that opens in the same commit as the popover, before it', () => {
		const onManualClose = jest.fn();
		// The tooltip is first in the tree, so its layout effect opens it before `Manual`.
		render(
			<>
				<Popover isOpen mode="hint" role="tooltip" testId="earlier-tooltip" onClose={() => {}}>
					Earlier tooltip
				</Popover>
				<ManualLayer name="Manual" onClose={onManualClose} />
			</>,
		);

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside Manual' }) });

		// The popover opened later, so it is above the tooltip.
		expect(event.defaultPrevented).toBe(true);
		expect(onManualClose).toHaveBeenCalledWith({ reason: 'escape' });
		expect(isOpen({ testId: 'earlier-tooltip' })).toBe(true);
	});

	it('lets a layer that opened before the popover close first once it opens again', () => {
		const onManualClose = jest.fn();
		const autoPopover = document.createElement('div');
		autoPopover.setAttribute('popover', 'auto');
		document.body.append(autoPopover);
		const { rerender } = render(<Stack onManualClose={onManualClose} isManualOpen={false} />);
		act(() => {
			autoPopover.showPopover();
		});
		rerender(<Stack onManualClose={onManualClose} />);
		// The same element opens again, after the popover, so it is now above the popover.
		act(() => {
			autoPopover.hidePopover();
			autoPopover.showPopover();
		});

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside Manual' }) });

		expect(event.defaultPrevented).toBe(false);
		expect(onManualClose).not.toHaveBeenCalled();
		expect(autoPopover.matches(':popover-open')).toBe(false);
		autoPopover.remove();
	});

	it('takes Escape over an ancestor layer that opens after the popover', () => {
		const onClose = jest.fn();
		const ancestor = document.createElement('div');
		ancestor.setAttribute('popover', 'auto');
		document.body.append(ancestor);
		render(<Subject onClose={onClose} />, { container: ancestor });
		act(() => {
			ancestor.showPopover();
		});

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside' }) });

		// The ancestor is below the popover, so the popover takes the Escape.
		expect(event.defaultPrevented).toBe(true);
		expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });
		expect(ancestor.matches(':popover-open')).toBe(true);
		ancestor.remove();
	});
});

describe('useManualLightDismiss() inside a Dialog, with a layer that opens above it', () => {
	function PopoverAndTooltipInDialog({
		isTooltipOpen,
		isPopoverOpen = true,
		onDialogClose,
		onPopoverClose,
	}: {
		isTooltipOpen: boolean;
		isPopoverOpen?: boolean;
		onDialogClose: () => void;
		onPopoverClose: () => void;
	}) {
		const popoverRef = useRef<HTMLDivElement>(null);
		useManualLightDismiss({ popoverRef, isOpen: isPopoverOpen, onClose: onPopoverClose });
		return (
			<Dialog isOpen onClose={onDialogClose} label="Parent dialog">
				<button type="button">Inside dialog</button>
				<Popover
					ref={popoverRef}
					mode="manual"
					isOpen={isPopoverOpen}
					role="dialog"
					label="Manual popover"
				>
					<button type="button">Inside manual popover</button>
				</Popover>
				<Popover
					isOpen={isTooltipOpen}
					mode="hint"
					role="tooltip"
					testId="tooltip"
					onClose={() => {}}
				>
					Tooltip
				</Popover>
			</Dialog>
		);
	}

	it('closes the tooltip, then the popover, then the dialog', () => {
		const onDialogClose = jest.fn();
		const onPopoverClose = jest.fn();
		const props = { onDialogClose, onPopoverClose };
		const { rerender } = render(<PopoverAndTooltipInDialog {...props} isTooltipOpen={false} />);
		rerender(<PopoverAndTooltipInDialog {...props} isTooltipOpen />);
		const target = screen.getByRole('button', { name: 'Inside dialog' });
		act(() => {
			target.focus();
		});

		fireKeyDown({ target });

		expect(screen.getByTestId('tooltip').matches(':popover-open')).toBe(false);
		expect(onPopoverClose).not.toHaveBeenCalled();
		expect(onDialogClose).not.toHaveBeenCalled();

		fireKeyDown({ target });

		expect(onPopoverClose).toHaveBeenCalledWith({ reason: 'escape' });
		expect(onDialogClose).not.toHaveBeenCalled();

		// The consumer closes the popover. The next Escape goes to the dialog.
		rerender(<PopoverAndTooltipInDialog {...props} isTooltipOpen isPopoverOpen={false} />);
		fireKeyDown({ target });

		expect(onPopoverClose).toHaveBeenCalledTimes(1);
		expect(onDialogClose).toHaveBeenCalledWith({ reason: 'escape' });
	});
});

describe("useManualLightDismiss() with mode: 'page-surface'", () => {
	function Surface({ onClose, isOpen = true }: { onClose: () => void; isOpen?: boolean }) {
		const surfaceRef = useRef<HTMLDivElement>(null);
		useManualLightDismiss({ popoverRef: surfaceRef, mode: 'page-surface', isOpen, onClose });
		return (
			<div ref={surfaceRef} data-testid="surface">
				<button type="button">Inside surface</button>
			</div>
		);
	}

	type TPageProps = {
		onSurfaceClose: () => void;
		isTooltipOpen?: boolean;
		onPopoverClose?: () => void;
		isPopoverOpen?: boolean;
	};

	function ManualPopover({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
		const popoverRef = useRef<HTMLDivElement>(null);
		useManualLightDismiss({ popoverRef, isOpen, onClose });
		return (
			<Popover ref={popoverRef} mode="manual" isOpen={isOpen} role="dialog" label="Manual">
				<button type="button">Inside manual popover</button>
			</Popover>
		);
	}

	function Page({
		onSurfaceClose,
		isTooltipOpen = false,
		onPopoverClose = () => {},
		isPopoverOpen = false,
	}: TPageProps) {
		return (
			<>
				<Surface onClose={onSurfaceClose} />
				<Popover isOpen={isTooltipOpen} mode="hint" role="tooltip" onClose={() => {}}>
					Tooltip
				</Popover>
				<ManualPopover isOpen={isPopoverOpen} onClose={onPopoverClose} />
				<button type="button">Outside</button>
			</>
		);
	}

	it('accepts an element that is not a popover, and does not mark it as a layer', () => {
		render(<Page onSurfaceClose={() => {}} />);

		expect(screen.getByTestId('surface')).not.toHaveAttribute('data-top-layer-takes-escape');
	});

	it('dismisses on a press outside, with the same press rule', () => {
		const onSurfaceClose = jest.fn();
		render(<Page onSurfaceClose={onSurfaceClose} />);

		firePress({
			start: screen.getByRole('button', { name: 'Inside surface' }),
			end: screen.getByRole('button', { name: 'Outside' }),
		});
		fireClickWithoutPress({ target: screen.getByRole('button', { name: 'Outside' }) });

		expect(onSurfaceClose).not.toHaveBeenCalled();

		firePress({ start: screen.getByRole('button', { name: 'Outside' }) });

		expect(onSurfaceClose).toHaveBeenCalledWith({ reason: 'light-dismiss' });
	});

	it('closes on Escape while no layer is open', () => {
		const onSurfaceClose = jest.fn();
		render(<Page onSurfaceClose={onSurfaceClose} />);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside surface' }) });

		expect(onSurfaceClose).toHaveBeenCalledWith({ reason: 'escape' });
	});

	it('does not close on Escape while a tooltip is open anywhere', () => {
		const onSurfaceClose = jest.fn();
		render(<Page onSurfaceClose={onSurfaceClose} isTooltipOpen />);

		const event = fireKeyDown({ target: screen.getByRole('button', { name: 'Inside surface' }) });

		expect(onSurfaceClose).not.toHaveBeenCalled();
		// The browser closes the tooltip.
		expect(event.defaultPrevented).toBe(false);
	});

	it('lets a manual popover that opens later close first', () => {
		const onSurfaceClose = jest.fn();
		const onPopoverClose = jest.fn();
		const { rerender } = render(
			<Page onSurfaceClose={onSurfaceClose} onPopoverClose={onPopoverClose} />,
		);
		rerender(
			<Page onSurfaceClose={onSurfaceClose} onPopoverClose={onPopoverClose} isPopoverOpen />,
		);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside surface' }) });

		expect(onPopoverClose).toHaveBeenCalledWith({ reason: 'escape' });
		expect(onSurfaceClose).not.toHaveBeenCalled();

		rerender(<Page onSurfaceClose={onSurfaceClose} onPopoverClose={onPopoverClose} />);
		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside surface' }) });

		expect(onSurfaceClose).toHaveBeenCalledWith({ reason: 'escape' });
	});

	it('does not listen while closed', () => {
		const onClose = jest.fn();
		render(<Surface onClose={onClose} isOpen={false} />);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside surface' }) });

		expect(onClose).not.toHaveBeenCalled();
	});
});

describe("useManualLightDismiss() with mode: 'page-surface' inside a Dialog", () => {
	function SurfaceInDialog({
		isSurfaceOpen = true,
		isTooltipOpen = false,
		onSurfaceClose,
		onDialogClose,
	}: {
		isSurfaceOpen?: boolean;
		isTooltipOpen?: boolean;
		onSurfaceClose: () => void;
		onDialogClose: () => void;
	}) {
		const surfaceRef = useRef<HTMLDivElement>(null);
		useManualLightDismiss({
			popoverRef: surfaceRef,
			mode: 'page-surface',
			isOpen: isSurfaceOpen,
			onClose: onSurfaceClose,
		});
		return (
			<Dialog isOpen onClose={onDialogClose} label="Issue">
				<button type="button">Inside dialog</button>
				<div ref={surfaceRef}>
					<button type="button">Inside surface</button>
				</div>
				<Popover isOpen={isTooltipOpen} mode="hint" role="tooltip" onClose={() => {}}>
					Tooltip
				</Popover>
			</Dialog>
		);
	}

	it.each([['Inside surface'], ['Inside dialog']])(
		'closes only the surface on Escape (focus on "%s"), then the dialog',
		(name) => {
			const onSurfaceClose = jest.fn();
			const onDialogClose = jest.fn();
			const props = { onSurfaceClose, onDialogClose };
			const { rerender } = render(<SurfaceInDialog {...props} />);
			const target = screen.getByRole('button', { name });
			act(() => {
				target.focus();
			});

			const event = fireKeyDown({ target });

			// The dialog is around the surface, so it is below it.
			expect(onSurfaceClose).toHaveBeenCalledWith({ reason: 'escape' });
			expect(event.defaultPrevented).toBe(true);
			expect(onDialogClose).not.toHaveBeenCalled();

			rerender(<SurfaceInDialog {...props} isSurfaceOpen={false} />);
			fireKeyDown({ target });

			expect(onSurfaceClose).toHaveBeenCalledTimes(1);
			expect(onDialogClose).toHaveBeenCalledWith({ reason: 'escape' });
		},
	);

	it('lets a tooltip in the dialog, outside the surface, close first', () => {
		const onSurfaceClose = jest.fn();
		const onDialogClose = jest.fn();
		const props = { onSurfaceClose, onDialogClose };
		const { rerender } = render(<SurfaceInDialog {...props} />);
		// Opened after the dialog: `showModal()` closes the popovers that are open before it.
		rerender(<SurfaceInDialog {...props} isTooltipOpen />);
		const target = screen.getByRole('button', { name: 'Inside surface' });
		act(() => {
			target.focus();
		});

		fireKeyDown({ target });

		expect(onSurfaceClose).not.toHaveBeenCalled();
		expect(onDialogClose).not.toHaveBeenCalled();
	});
});

describe("useManualLightDismiss() with mode: 'page-surface' inside a manual popover", () => {
	function SurfaceInPopover({
		isSurfaceOpen,
		onSurfaceClose,
		onPopoverClose,
	}: {
		isSurfaceOpen: boolean;
		onSurfaceClose: () => void;
		onPopoverClose: () => void;
	}) {
		const popoverRef = useRef<HTMLDivElement>(null);
		const surfaceRef = useRef<HTMLDivElement>(null);
		// The popover hook binds after the surface hook in the same commit: React runs the effects of
		// a component in order.
		useManualLightDismiss({
			popoverRef: surfaceRef,
			mode: 'page-surface',
			isOpen: isSurfaceOpen,
			onClose: onSurfaceClose,
		});
		useManualLightDismiss({ popoverRef, isOpen: true, onClose: onPopoverClose });
		return (
			<Popover ref={popoverRef} mode="manual" isOpen role="dialog" label="Manual">
				<button type="button">Inside popover</button>
				<div ref={surfaceRef} data-testid="surface">
					<button type="button">Inside surface</button>
				</div>
			</Popover>
		);
	}

	function PopoverFirst(props: {
		isSurfaceOpen: boolean;
		onSurfaceClose: () => void;
		onPopoverClose: () => void;
	}) {
		const popoverRef = useRef<HTMLDivElement>(null);
		const surfaceRef = useRef<HTMLDivElement>(null);
		// The popover hook binds before the surface hook.
		useManualLightDismiss({ popoverRef, isOpen: true, onClose: props.onPopoverClose });
		useManualLightDismiss({
			popoverRef: surfaceRef,
			mode: 'page-surface',
			isOpen: props.isSurfaceOpen,
			onClose: props.onSurfaceClose,
		});
		return (
			<Popover ref={popoverRef} mode="manual" isOpen role="dialog" label="Manual">
				<button type="button">Inside popover</button>
				<div ref={surfaceRef} data-testid="surface">
					<button type="button">Inside surface</button>
				</div>
			</Popover>
		);
	}

	it.each([
		['the surface binds first, in one commit', SurfaceInPopover, false],
		['the popover binds first, in one commit', PopoverFirst, false],
		// In a later commit, the surface binds after the popover, whatever the hook order.
		['the surface opens in a later commit (surface hook called first)', SurfaceInPopover, true],
		['the surface opens in a later commit (popover hook called first)', PopoverFirst, true],
	])('closes only the surface on Escape when %s, then the popover', (_, Component, isLater) => {
		const onSurfaceClose = jest.fn();
		const onPopoverClose = jest.fn();
		const props = { onSurfaceClose, onPopoverClose };
		const { rerender } = render(<Component {...props} isSurfaceOpen={!isLater} />);
		if (isLater) {
			rerender(<Component {...props} isSurfaceOpen />);
		}
		const target = screen.getByRole('button', { name: 'Inside popover' });

		const event = fireKeyDown({ target });

		// The popover is around the surface, so it is below it. The surface takes the Escape.
		expect(onSurfaceClose).toHaveBeenCalledWith({ reason: 'escape' });
		expect(event.defaultPrevented).toBe(true);
		expect(onPopoverClose).not.toHaveBeenCalled();

		rerender(<Component {...props} isSurfaceOpen={false} />);
		fireKeyDown({ target });

		expect(onSurfaceClose).toHaveBeenCalledTimes(1);
		expect(onPopoverClose).toHaveBeenCalledWith({ reason: 'escape' });
	});

	it('marks the surface while it is open', () => {
		const props = { onSurfaceClose: () => {}, onPopoverClose: () => {} };
		const { rerender } = render(<SurfaceInPopover {...props} isSurfaceOpen />);

		expect(screen.getByTestId('surface')).toHaveAttribute('data-top-layer-surface-takes-escape');

		rerender(<SurfaceInPopover {...props} isSurfaceOpen={false} />);

		expect(screen.getByTestId('surface')).not.toHaveAttribute(
			'data-top-layer-surface-takes-escape',
		);
	});

	it('keeps the popover open when a page surface inside it decides to stay open', () => {
		const onSurfaceClose = jest.fn();
		const onPopoverClose = jest.fn();
		function DecliningSurfaceInPopover() {
			const popoverRef = useRef<HTMLDivElement>(null);
			const surfaceRef = useRef<HTMLDivElement>(null);
			// The popover hook binds first, so its listener runs before the surface listener.
			useManualLightDismiss({ popoverRef, isOpen: true, onClose: onPopoverClose });
			useCloseOnUnclaimedEscape({
				isEnabled: true,
				onClose: onSurfaceClose,
				// For example, a text field in the surface has focus.
				shouldClose: () => false,
				surfaceRef,
			});
			return (
				<Popover ref={popoverRef} mode="manual" isOpen role="dialog" label="Manual">
					<button type="button">Inside popover</button>
					<div ref={surfaceRef}>
						<button type="button">Inside surface</button>
					</div>
				</Popover>
			);
		}
		render(<DecliningSurfaceInPopover />);

		fireKeyDown({ target: screen.getByRole('button', { name: 'Inside surface' }) });

		// The surface is above the popover. It stays open, so the popover also stays open.
		expect(onSurfaceClose).not.toHaveBeenCalled();
		expect(onPopoverClose).not.toHaveBeenCalled();
	});
});
