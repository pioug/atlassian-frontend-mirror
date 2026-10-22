import React, { useState } from 'react';

import { bind, bindAll } from 'bind-event-listener';
import invariant from 'tiny-invariant';

import { screen } from '@atlassian/testing-library/screen';
import { act, fireEvent, render, waitFor } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { Dialog } from '../../src/dialog/dialog-content';
import { type TDialogCloseReason, type TDialogDismissedBy } from '../../src/dialog/types';
import { hasOpenDialogOrPopover } from '../../src/page-surface/has-open-dialog-or-popover';
import { requestClosePopovers } from '../../src/page-surface/request-close-popovers';

// An Escape keydown, as a browser sends it. `Dialog` takes it (the dialog has `closedby="none"`).
function fireEscape(target: Element) {
	const event = new KeyboardEvent('keydown', {
		key: 'Escape',
		bubbles: true,
		cancelable: true,
		composed: true,
	});
	act(() => {
		target.dispatchEvent(event);
	});
	return event;
}

// A close request that `Dialog` did not take, in a browser without `closedby` (e.g. Safari 27).
function fireDialogCancel(
	dialog: HTMLElement,
	{ cancelable = true }: { cancelable?: boolean } = {},
) {
	const event = new Event('cancel', { cancelable });
	fireEvent(dialog, event);
	return event;
}

/**
 * Models a browser without `closedby` (e.g. Safari 27) until the returned function runs.
 * The polyfill adds `HTMLDialogElement.prototype.closedBy`, and `Dialog` checks for it.
 */
function removeClosedBySupport(): () => void {
	/* eslint-disable compat/compat -- jsdom has `<dialog>` */
	const descriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'closedBy');
	invariant(descriptor, 'Expected the polyfill to define closedBy');
	Reflect.deleteProperty(HTMLDialogElement.prototype, 'closedBy');
	return () => Object.defineProperty(HTMLDialogElement.prototype, 'closedBy', descriptor);
	/* eslint-enable compat/compat */
}

// Browsers retarget ::backdrop events to the <dialog>.
function clickBackdrop(dialog: HTMLElement) {
	fireEvent.pointerDown(dialog);
	fireEvent.pointerUp(dialog);
	fireEvent.click(dialog);
}

function waitForDialogCloseToggle({ dialog }: { dialog: HTMLElement }): Promise<void> {
	return new Promise((resolve) => {
		bind(dialog, {
			type: 'toggle',
			listener: (event: ToggleEvent) => {
				if (event.newState === 'closed') {
					resolve();
				}
			},
			options: { once: true },
		});
	});
}

describe('Dialog primitive', () => {
	it('opens dialog when isOpen is true', () => {
		render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		expect(dialogEl).toHaveAttribute('open');
		// The browser never closes the dialog for a user action. `Dialog` handles them.
		expect(dialogEl).toHaveAttribute('closedby', 'none');
	});

	it('does not render the dialog element when isOpen is false', async () => {
		render(
			<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		// Host element is unmounted when not open so it does not leave an
		// empty role="dialog" in the accessibility tree.
		await waitFor(() =>
			expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument(),
		);
	});

	it('closes dialog on unmount when dialog is open', () => {
		const { unmount } = render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		expect(dialogEl).toHaveAttribute('open');

		unmount();

		expect(dialogEl).not.toHaveAttribute('open');
	});

	it('closes dialog when isOpen transitions to false', async () => {
		const { rerender } = render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('open');

		rerender(
			<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		// Without an animation preset, the host element unmounts synchronously
		// when isOpen flips to false.
		await waitFor(() =>
			expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument(),
		);
	});

	it('opens dialog when isOpen transitions from false to true', async () => {
		const { rerender } = render(
			<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		await waitFor(() =>
			expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument(),
		);

		rerender(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('open');
	});

	describe('user dismissal asks first', () => {
		function ControlledDialog({
			onClose,
			onExitFinish,
			shouldAnimate,
			dismissedBy,
		}: {
			onClose: (args: { reason: TDialogCloseReason }) => void;
			onExitFinish?: () => void;
			shouldAnimate?: boolean;
			dismissedBy?: TDialogDismissedBy;
		}) {
			const [isOpen, setIsOpen] = useState(true);
			return (
				<Dialog
					onClose={(args) => {
						onClose(args);
						setIsOpen(false);
					}}
					onExitFinish={onExitFinish}
					shouldAnimate={shouldAnimate}
					dismissedBy={dismissedBy}
					isOpen={isOpen}
					label="Test dialog"
				>
					<button type="button">Inside</button>
				</Dialog>
			);
		}

		it('asks before closing on an overlay click', async () => {
			const dialogRef = React.createRef<HTMLDialogElement>();
			const onClose = jest.fn((_args: { reason: TDialogCloseReason }) =>
				expect(dialogRef.current?.open).toBe(true),
			);

			function RefDialog() {
				const [isOpen, setIsOpen] = useState(true);
				return (
					<Dialog
						ref={dialogRef}
						onClose={(args) => {
							onClose(args);
							setIsOpen(false);
						}}
						isOpen={isOpen}
						label="Test dialog"
					>
						<p>Content</p>
					</Dialog>
				);
			}
			render(<RefDialog />);

			const dialogEl = screen.getByRole('dialog', { hidden: true });
			const closeToggle = waitForDialogCloseToggle({ dialog: dialogEl });
			clickBackdrop(dialogEl);
			await act(async () => {
				await closeToggle;
			});

			expect(onClose).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledWith({ reason: 'overlay-click' });
			expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
		});

		it('asks before closing on Escape', async () => {
			const onClose = jest.fn();
			render(<ControlledDialog onClose={onClose} />);

			const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
			const closeToggle = waitForDialogCloseToggle({ dialog: dialogEl });
			const escape = fireEscape(dialogEl);

			expect(escape.defaultPrevented).toBe(true);
			expect(onClose).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });

			await act(async () => {
				await closeToggle;
			});

			expect(onClose).toHaveBeenCalledTimes(1);
			expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
		});

		it('plays the exit and calls onClose once when the consumer closes', async () => {
			const originalGetAnimations = Object.getOwnPropertyDescriptor(
				HTMLElement.prototype,
				'getAnimations',
			);
			const exitAnimation = { resolve: () => {} };
			const animations: { current: Animation[] } = { current: [] };
			Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
				configurable: true,
				value: () => animations.current,
			});

			try {
				const onClose = jest.fn();
				const onExitFinish = jest.fn();
				render(<ControlledDialog onClose={onClose} onExitFinish={onExitFinish} shouldAnimate />);
				const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
				animations.current = [
					{
						finished: new Promise<void>((resolve) => {
							exitAnimation.resolve = resolve;
						}),
					} as unknown as Animation,
				];

				fireEscape(dialogEl);
				// A backdrop click during the exit does not ask again.
				clickBackdrop(dialogEl);
				await act(async () => {
					await waitForDialogCloseToggle({ dialog: dialogEl });
				});

				expect(dialogEl.open).toBe(false);
				expect(screen.getByRole('dialog', { hidden: true })).toBe(dialogEl);
				expect(onExitFinish).not.toHaveBeenCalled();

				await act(async () => {
					exitAnimation.resolve();
				});

				await waitFor(() =>
					expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument(),
				);
				expect(onExitFinish).toHaveBeenCalledTimes(1);
				expect(onClose).toHaveBeenCalledTimes(1);
			} finally {
				if (originalGetAnimations) {
					Object.defineProperty(HTMLElement.prototype, 'getAnimations', originalGetAnimations);
				} else {
					Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations');
				}
			}
		});

		it('calls onClose once for repeated Escapes and backdrop clicks during the exit', async () => {
			const originalGetAnimations = Object.getOwnPropertyDescriptor(
				HTMLElement.prototype,
				'getAnimations',
			);
			const exitAnimation = { resolve: () => {} };
			const animations: { current: Animation[] } = { current: [] };
			Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
				configurable: true,
				value: () => animations.current,
			});

			try {
				const onClose = jest.fn();
				render(<ControlledDialog onClose={onClose} shouldAnimate />);
				const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
				const inside = screen.getByRole('button', { name: 'Inside', hidden: true });
				animations.current = [
					{
						finished: new Promise<void>((resolve) => {
							exitAnimation.resolve = resolve;
						}),
					} as unknown as Animation,
				];

				fireEscape(dialogEl);
				await act(async () => {
					await waitForDialogCloseToggle({ dialog: dialogEl });
				});
				// Still mounted: the exit has not finished.
				expect(dialogEl.isConnected).toBe(true);

				[1, 2, 3].forEach(() => {
					fireEscape(dialogEl);
					fireEscape(inside);
					clickBackdrop(dialogEl);
				});

				expect(onClose).toHaveBeenCalledTimes(1);

				await act(async () => {
					exitAnimation.resolve();
				});
				await waitFor(() =>
					expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument(),
				);
				expect(onClose).toHaveBeenCalledTimes(1);
			} finally {
				if (originalGetAnimations) {
					Object.defineProperty(HTMLElement.prototype, 'getAnimations', originalGetAnimations);
				} else {
					Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations');
				}
			}
		});

		it('does not ask on an overlay click when dismissedBy is "escape"', () => {
			const onClose = jest.fn();
			render(<ControlledDialog onClose={onClose} dismissedBy="escape" />);

			const dialogEl = screen.getByRole('dialog', { hidden: true });
			clickBackdrop(dialogEl);

			expect(onClose).not.toHaveBeenCalled();

			fireEscape(dialogEl);

			expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });
		});
	});

	describe('backdrop click', () => {
		function renderAskingDialog({ dismissedBy }: { dismissedBy?: TDialogDismissedBy } = {}) {
			const onClose = jest.fn();
			render(
				<Dialog onClose={onClose} isOpen={true} dismissedBy={dismissedBy} label="Test dialog">
					<button type="button">Inside</button>
				</Dialog>,
			);
			const dialogEl = screen.getByRole('dialog', { hidden: true });
			const button = screen.getByRole('button', { name: 'Inside', hidden: true });
			return { onClose, dialogEl, button };
		}

		it('asks when the press and the click are on the backdrop', () => {
			const { onClose, dialogEl } = renderAskingDialog();

			fireEvent.pointerDown(dialogEl);
			fireEvent.pointerUp(dialogEl);
			fireEvent.click(dialogEl);

			expect(onClose).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledWith({ reason: 'overlay-click' });
		});

		it('asks for a userEvent click on the backdrop', async () => {
			const { onClose, dialogEl } = renderAskingDialog();

			await userEvent.click(dialogEl);

			expect(onClose).toHaveBeenCalledWith({ reason: 'overlay-click' });
		});

		it('does not ask for a press in the content that is released on the backdrop', () => {
			const { onClose, dialogEl, button } = renderAskingDialog();

			fireEvent.pointerDown(button);
			fireEvent.pointerUp(dialogEl);
			// Browsers fire `click` on the nearest common ancestor: the <dialog>.
			fireEvent.click(dialogEl);

			expect(onClose).not.toHaveBeenCalled();
		});

		it('does not ask for a press on the backdrop that is released on the content', () => {
			const { onClose, dialogEl, button } = renderAskingDialog();

			fireEvent.pointerDown(dialogEl);
			fireEvent.pointerUp(button);
			// Browsers fire `click` on the nearest common ancestor: the <dialog>.
			fireEvent.click(dialogEl);

			expect(onClose).not.toHaveBeenCalled();
		});

		// A keyboard cannot click the backdrop (Escape is the keyboard path), so a click with no
		// press, such as a synthetic `click()`, does not ask.
		it('does not ask for a click with no press', () => {
			const { onClose, dialogEl } = renderAskingDialog();

			fireEvent.click(dialogEl);

			expect(onClose).not.toHaveBeenCalled();
		});

		it('does not ask for a right-click press, then a click', () => {
			const { onClose, dialogEl } = renderAskingDialog();

			// jsdom has no `PointerEvent`, so `fireEvent.pointerDown` drops `button`.
			fireEvent(dialogEl, new MouseEvent('pointerdown', { bubbles: true, button: 2 }));
			fireEvent(dialogEl, new MouseEvent('pointerup', { bubbles: true, button: 2 }));
			fireEvent.click(dialogEl);

			expect(onClose).not.toHaveBeenCalled();
		});

		it('does not ask for a canceled press, then a click', () => {
			const { onClose, dialogEl } = renderAskingDialog();

			fireEvent.pointerDown(dialogEl);
			fireEvent.pointerCancel(dialogEl);
			fireEvent.click(dialogEl);

			expect(onClose).not.toHaveBeenCalled();
		});

		it('uses each press once', () => {
			const { onClose, dialogEl } = renderAskingDialog();

			clickBackdrop(dialogEl);
			fireEvent.click(dialogEl);

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it.each([
			{ dismissedBy: 'escape-and-outside-click' as const, calls: 1 },
			{ dismissedBy: 'escape' as const, calls: 0 },
			{ dismissedBy: 'none' as const, calls: 0 },
		])('asks $calls time(s) when dismissedBy is "$dismissedBy"', ({ dismissedBy, calls }) => {
			const { onClose, dialogEl } = renderAskingDialog({ dismissedBy });

			clickBackdrop(dialogEl);

			expect(onClose).toHaveBeenCalledTimes(calls);
		});
	});

	describe('when the consumer keeps isOpen true', () => {
		function flushTask() {
			return act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});
		}

		async function renderIgnoringDialog() {
			const onClose = jest.fn();
			const onToggle = jest.fn();
			const onNativeClose = jest.fn();
			render(
				<Dialog onClose={onClose} isOpen={true} label="Test dialog">
					<button type="button">Inside</button>
				</Dialog>,
			);
			const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
			// Let the open `toggle` from `showModal()` fire first.
			await flushTask();
			bindAll(dialogEl, [
				{ type: 'toggle', listener: onToggle },
				{ type: 'close', listener: onNativeClose },
			]);
			const button = screen.getByRole('button', { name: 'Inside', hidden: true });
			button.focus();
			return { onClose, onToggle, onNativeClose, dialogEl, button };
		}

		it('keeps the dialog open when onClose ignores an Escape', async () => {
			const { onClose, onToggle, onNativeClose, dialogEl, button } = await renderIgnoringDialog();

			const escape = fireEscape(button);
			await flushTask();

			expect(escape.defaultPrevented).toBe(true);
			expect(onClose).toHaveBeenCalledTimes(1);
			expect(dialogEl.open).toBe(true);
			expect(button).toHaveFocus();
			expect(onToggle).not.toHaveBeenCalled();
			expect(onNativeClose).not.toHaveBeenCalled();
		});

		it('keeps the dialog open when onClose ignores an overlay click', async () => {
			const { onClose, onToggle, onNativeClose, dialogEl, button } = await renderIgnoringDialog();

			clickBackdrop(dialogEl);
			await flushTask();

			expect(onClose).toHaveBeenCalledTimes(1);
			expect(dialogEl.open).toBe(true);
			expect(button).toHaveFocus();
			expect(onToggle).not.toHaveBeenCalled();
			expect(onNativeClose).not.toHaveBeenCalled();

			// The dialog asks again on the next dismissal.
			clickBackdrop(dialogEl);

			expect(onClose).toHaveBeenCalledTimes(2);
		});

		it('keeps the dialog open when the consumer closes and reopens in onClose', () => {
			function BatchingDialog() {
				const [isOpen, setIsOpen] = useState(true);
				return (
					<Dialog
						onClose={() => {
							setIsOpen(false);
							setIsOpen(true);
						}}
						isOpen={isOpen}
						label="Test dialog"
					>
						<p>Content</p>
					</Dialog>
				);
			}
			render(<BatchingDialog />);

			const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
			clickBackdrop(dialogEl);

			expect(dialogEl.open).toBe(true);
		});

		it('keeps the dialog open when isOpen is false and true in one act()', () => {
			// React batches both updates into one render, so `isOpen` never commits as `false`.
			const onEnterFinish = jest.fn();
			const setIsOpenRef: { current: (isOpen: boolean) => void } = { current: () => {} };
			function BatchedDialog() {
				const [isOpen, setIsOpen] = useState(true);
				setIsOpenRef.current = setIsOpen;
				return (
					<Dialog
						onClose={() => {}}
						onEnterFinish={onEnterFinish}
						isOpen={isOpen}
						label="Test dialog"
					>
						<p>Content</p>
					</Dialog>
				);
			}
			render(<BatchedDialog />);
			const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
			expect(onEnterFinish).toHaveBeenCalledTimes(1);

			act(() => {
				setIsOpenRef.current(false);
				setIsOpenRef.current(true);
			});

			expect(screen.getByRole('dialog', { hidden: true })).toBe(dialogEl);
			expect(dialogEl.open).toBe(true);
			expect(onEnterFinish).toHaveBeenCalledTimes(1);
		});

		it('does not reopen a dialog the consumer unmounted in onClose', () => {
			function UnmountingDialog() {
				const [isMounted, setIsMounted] = useState(true);
				if (!isMounted) {
					return null;
				}
				return (
					<Dialog onClose={() => setIsMounted(false)} isOpen={true} label="Test dialog">
						<p>Content</p>
					</Dialog>
				);
			}
			render(<UnmountingDialog />);

			clickBackdrop(screen.getByRole('dialog', { hidden: true }));

			expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
		});
	});

	describe('other close requests', () => {
		function renderOpenDialog({
			dismissedBy,
			children = <button type="button">Inside</button>,
		}: { dismissedBy?: TDialogDismissedBy; children?: React.ReactNode } = {}) {
			const onClose = jest.fn();
			const onExitFinish = jest.fn();
			function getTree(isOpen: boolean) {
				return (
					<Dialog
						onClose={onClose}
						onExitFinish={onExitFinish}
						isOpen={isOpen}
						dismissedBy={dismissedBy}
						label="Test dialog"
					>
						{children}
					</Dialog>
				);
			}
			const { rerender } = render(getTree(true));
			const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
			function rerenderWithIsOpen(isOpen: boolean) {
				rerender(getTree(isOpen));
			}
			return { onClose, onExitFinish, dialogEl, rerenderWithIsOpen };
		}

		// With `closedby` support, the browser fires no `cancel` for a user close request (for
		// example Android back), so `Dialog` has no `cancel` listener.
		it('does not handle `cancel` when the browser supports closedby', () => {
			const { onClose, dialogEl } = renderOpenDialog();

			const cancel = fireDialogCancel(dialogEl);

			expect(cancel.defaultPrevented).toBe(false);
			expect(onClose).not.toHaveBeenCalled();
		});

		describe('in a browser without closedby (fallback)', () => {
			let restoreClosedBySupport: () => void = () => {};
			beforeEach(() => {
				restoreClosedBySupport = removeClosedBySupport();
			});
			afterEach(() => {
				restoreClosedBySupport();
			});

			it.each(['escape-and-outside-click', 'escape', 'none'] as const)(
				'refuses every `cancel`, and does not ask, when dismissedBy is "%s"',
				(dismissedBy) => {
					const { onClose, dialogEl } = renderOpenDialog({ dismissedBy });

					const cancels = [
						fireDialogCancel(dialogEl),
						fireDialogCancel(dialogEl),
						fireDialogCancel(dialogEl),
					];

					expect(cancels.every((cancel) => cancel.defaultPrevented)).toBe(true);
					expect(onClose).not.toHaveBeenCalled();
					expect(dialogEl.open).toBe(true);
				},
			);

			it('still asks on Escape with its own listener, so the browser makes no close request', () => {
				const { onClose, dialogEl } = renderOpenDialog();
				const onCancel = jest.fn();
				const unbind = bind(dialogEl, { type: 'cancel', listener: onCancel });

				const escape = fireEscape(screen.getByRole('button', { name: 'Inside', hidden: true }));

				expect(escape.defaultPrevented).toBe(true);
				expect(onClose).toHaveBeenCalledTimes(1);
				expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });
				expect(onCancel).not.toHaveBeenCalled();
				unbind();
			});

			it('refuses the `cancel` that an open child popover causes (Safari)', async () => {
				const user = userEvent.setup();
				const { onClose, dialogEl } = renderOpenDialog({
					children: (
						<div data-testid="child-popover">
							<button type="button">In popover</button>
						</div>
					),
				});
				const popover = screen.getByTestId('child-popover');
				popover.setAttribute('popover', 'auto');
				act(() => popover.showPopover());
				screen.getByRole('button', { name: 'In popover', hidden: true }).focus();

				await user.keyboard('{Escape}');
				// Safari also sends `cancel` to the dialog for this Escape.
				const cancel = fireDialogCancel(dialogEl);

				expect(popover.matches(':popover-open')).toBe(false);
				expect(cancel.defaultPrevented).toBe(true);
				expect(onClose).not.toHaveBeenCalled();
				expect(dialogEl.open).toBe(true);
			});

			it('shows the dialog again after a `cancel` that is not cancelable', async () => {
				const { onClose, onExitFinish, dialogEl } = renderOpenDialog();
				const closeToggle = waitForDialogCloseToggle({ dialog: dialogEl });

				fireDialogCancel(dialogEl, { cancelable: false });
				// The browser closes the dialog after a `cancel` that is not cancelable.
				await act(async () => {
					dialogEl.close();
					await closeToggle;
				});

				expect(dialogEl.open).toBe(true);
				expect(onClose).not.toHaveBeenCalled();
				expect(onExitFinish).not.toHaveBeenCalled();
			});
		});
	});

	describe('Escape key', () => {
		it('asks on every Escape and never closes natively when the consumer refuses', async () => {
			const user = userEvent.setup();
			const onClose = jest.fn();
			const onNativeClose = jest.fn();
			render(
				<Dialog onClose={onClose} isOpen={true} label="Test dialog">
					<button type="button">Inside</button>
				</Dialog>,
			);
			const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
			const unbind = bind(dialogEl, { type: 'close', listener: onNativeClose });
			const button = screen.getByRole('button', { name: 'Inside', hidden: true });
			button.focus();

			await user.keyboard('{Escape}{Escape}{Escape}');
			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			expect(onClose).toHaveBeenCalledTimes(3);
			expect(onClose).toHaveBeenLastCalledWith({ reason: 'escape' });
			expect(onNativeClose).not.toHaveBeenCalled();
			expect(dialogEl.open).toBe(true);
			expect(button).toHaveFocus();
			unbind();
		});

		/**
		 * As product tests do it: click a trigger, then press Escape with no explicit `focus()`.
		 * `showModal()` moves focus into the dialog, so the Escape is the dialog's. Closing returns
		 * focus to the trigger.
		 */
		it('asks on Escape after opening from a trigger, and returns focus to it on close', async () => {
			const user = userEvent.setup();
			const onCloseSpy = jest.fn();
			function App() {
				const [isOpen, setIsOpen] = useState(false);
				return (
					<>
						<button type="button" onClick={() => setIsOpen(true)}>
							Open
						</button>
						<Dialog
							onClose={(args) => {
								onCloseSpy(args);
								setIsOpen(false);
							}}
							isOpen={isOpen}
							label="Test dialog"
						>
							<button type="button">Inside</button>
						</Dialog>
					</>
				);
			}
			render(<App />);
			const trigger = screen.getByRole('button', { name: 'Open' });

			await user.click(trigger);

			const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
			expect(screen.getByRole('button', { name: 'Inside', hidden: true })).toHaveFocus();

			await user.keyboard('{Escape}');

			expect(onCloseSpy).toHaveBeenCalledTimes(1);
			expect(onCloseSpy).toHaveBeenCalledWith({ reason: 'escape' });
			await waitFor(() => expect(dialogEl.open).toBe(false));
			expect(trigger).toHaveFocus();
		});

		it('lets an open child popover take the Escape first', async () => {
			const user = userEvent.setup();
			const onClose = jest.fn();
			render(
				<Dialog onClose={onClose} isOpen={true} label="Test dialog">
					<div data-testid="child-popover">
						<button type="button">In popover</button>
					</div>
				</Dialog>,
			);
			const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
			const popover = screen.getByTestId('child-popover');
			popover.setAttribute('popover', 'auto');
			act(() => popover.showPopover());
			screen.getByRole('button', { name: 'In popover', hidden: true }).focus();

			await user.keyboard('{Escape}');

			expect(popover.matches(':popover-open')).toBe(false);
			expect(onClose).not.toHaveBeenCalled();
			expect(dialogEl.open).toBe(true);

			await user.keyboard('{Escape}');
			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			expect(onClose).toHaveBeenCalledTimes(1);
		});

		function pressEscape(target: Element, init: KeyboardEventInit = {}) {
			const event = new KeyboardEvent('keydown', {
				key: 'Escape',
				bubbles: true,
				cancelable: true,
				composed: true,
				...init,
			});
			act(() => {
				target.dispatchEvent(event);
			});
			return event;
		}

		// A modal `<dialog>` that is not a `Dialog`.
		function PlainDialog({ children }: { children?: React.ReactNode }) {
			const dialogRef = React.useRef<HTMLDialogElement>(null);
			React.useLayoutEffect(() => {
				const dialog = dialogRef.current;
				dialog?.showModal();
				return () => dialog?.close();
			}, []);
			return (
				<dialog ref={dialogRef} aria-label="Plain">
					{children}
				</dialog>
			);
		}

		function renderOpenDialog(children?: React.ReactNode) {
			const onClose = jest.fn();
			render(
				<Dialog onClose={onClose} isOpen={true} label="Test dialog">
					<button type="button">Inside</button>
					{children}
				</Dialog>,
			);
			const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
			const button = screen.getByRole('button', { name: 'Inside', hidden: true });
			return { onClose, dialogEl, button };
		}

		function openPopover(popover: HTMLElement, value: string) {
			popover.setAttribute('popover', value);
			act(() => popover.showPopover());
		}

		it('takes each Escape, so the browser makes no close request', async () => {
			const { onClose, dialogEl, button } = renderOpenDialog();
			const onCancel = jest.fn();
			const unbind = bind(dialogEl, { type: 'cancel', listener: onCancel });

			const events = [pressEscape(button), pressEscape(button), pressEscape(button)];
			await act(async () => {
				await new Promise((resolve) => setTimeout(resolve, 0));
			});

			expect(events.every((event) => event.defaultPrevented)).toBe(true);
			expect(onClose).toHaveBeenCalledTimes(3);
			expect(onCancel).not.toHaveBeenCalled();
			expect(dialogEl.open).toBe(true);
			unbind();
		});

		it('asks once when Escape is held', () => {
			const { onClose, button } = renderOpenDialog();

			const events = [
				pressEscape(button),
				pressEscape(button, { repeat: true }),
				pressEscape(button, { repeat: true }),
			];

			expect(events.every((event) => event.defaultPrevented)).toBe(true);
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it.each(['', 'auto', 'AUTO', 'hint'])(
			'lets an open child popover with popover="%s" take the Escape',
			(value) => {
				const { onClose, button } = renderOpenDialog(<div data-testid="popover">Popover</div>);
				openPopover(screen.getByTestId('popover'), value);

				const event = pressEscape(button);

				expect(event.defaultPrevented).toBe(false);
				expect(onClose).not.toHaveBeenCalled();
			},
		);

		it('takes the Escape while a manual child popover is open', () => {
			const { onClose, button } = renderOpenDialog(<div data-testid="popover">Popover</div>);
			openPopover(screen.getByTestId('popover'), 'manual');

			const event = pressEscape(button);

			expect(event.defaultPrevented).toBe(true);
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('lets an open child popover in a shadow root take the Escape when focus is in the popover', () => {
			const { onClose, dialogEl } = renderOpenDialog();
			const host = document.createElement('div');
			dialogEl.appendChild(host);
			const popover = document.createElement('div');
			const button = document.createElement('button');
			popover.appendChild(button);
			host.attachShadow({ mode: 'open' }).appendChild(popover);
			openPopover(popover, 'auto');

			const event = pressEscape(button);

			expect(event.defaultPrevented).toBe(false);
			expect(onClose).not.toHaveBeenCalled();
			host.remove();
		});

		it('takes an Escape from inside a shadow root in the dialog', () => {
			const { onClose, dialogEl } = renderOpenDialog();
			const host = document.createElement('div');
			dialogEl.appendChild(host);
			const button = document.createElement('button');
			host.attachShadow({ mode: 'open' }).appendChild(button);

			const event = pressEscape(button);

			expect(event.defaultPrevented).toBe(true);
			expect(onClose).toHaveBeenCalledTimes(1);
			host.remove();
		});

		it('does not take an Escape that an inner handler already canceled', () => {
			const { onClose } = renderOpenDialog(
				<input aria-label="Field" onKeyDown={(event) => event.preventDefault()} />,
			);

			pressEscape(screen.getByRole('textbox', { name: 'Field', hidden: true }));

			expect(onClose).not.toHaveBeenCalled();
		});

		it('does not take an Escape during an IME composition', () => {
			const { onClose, button } = renderOpenDialog();

			const event = pressEscape(button, { isComposing: true });

			expect(event.defaultPrevented).toBe(false);
			expect(onClose).not.toHaveBeenCalled();
		});

		// A `manual` popover does not take Escape, so a native modal `<dialog>` gets it.
		it('takes an Escape from inside an open manual child popover', () => {
			const { onClose } = renderOpenDialog(
				<div data-testid="popover">
					<button type="button">In popover</button>
				</div>,
			);
			openPopover(screen.getByTestId('popover'), 'manual');

			const event = pressEscape(screen.getByRole('button', { name: 'In popover', hidden: true }));

			expect(event.defaultPrevented).toBe(true);
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('does not take an Escape from inside an open auto popover in the dialog', () => {
			const { onClose } = renderOpenDialog(
				<div data-testid="popover">
					<button type="button">In popover</button>
				</div>,
			);
			openPopover(screen.getByTestId('popover'), 'auto');

			const event = pressEscape(screen.getByRole('button', { name: 'In popover', hidden: true }));

			expect(event.defaultPrevented).toBe(false);
			expect(onClose).not.toHaveBeenCalled();
		});

		it('takes an Escape on the body when focus was last in the dialog (the focused element was removed)', () => {
			const { onClose, button } = renderOpenDialog();
			button.focus();
			button.remove();
			expect(document.body).toHaveFocus();

			const event = pressEscape(document.body);

			expect(event.defaultPrevented).toBe(true);
			expect(onClose).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });
		});

		it('takes an Escape on the body after blur()', () => {
			const { onClose, button } = renderOpenDialog();
			button.focus();
			button.blur();

			const event = pressEscape(document.body);

			expect(event.defaultPrevented).toBe(true);
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('takes an Escape on the body when the dialog is in a shadow root and focus was last in it', () => {
			const host = document.createElement('div');
			document.body.appendChild(host);
			const container = document.createElement('div');
			host.attachShadow({ mode: 'open' }).appendChild(container);
			const onClose = jest.fn();
			const { unmount } = render(
				<Dialog onClose={onClose} isOpen={true} label="Test dialog">
					<button type="button">Inside</button>
				</Dialog>,
				{ container },
			);
			// eslint-disable-next-line testing-library/no-node-access -- the button is in a shadow root
			const button = container.querySelector('button');
			invariant(button, 'Expected the button');
			// At `window`, this `focusin` is retargeted to the shadow host.
			button.focus();
			button.blur();

			const event = pressEscape(document.body);

			expect(event.defaultPrevented).toBe(true);
			expect(onClose).toHaveBeenCalledTimes(1);
			unmount();
			host.remove();
		});

		it('gives an Escape on the body only to the nested dialog that focus was last in', () => {
			const outerOnClose = jest.fn();
			const innerOnClose = jest.fn();
			render(
				<Dialog onClose={outerOnClose} isOpen={true} label="Outer">
					<button type="button">Outer button</button>
					<Dialog onClose={innerOnClose} isOpen={true} label="Inner">
						<button type="button">Inner button</button>
					</Dialog>
				</Dialog>,
			);
			const innerButton = screen.getByRole('button', { name: 'Inner button', hidden: true });
			innerButton.focus();
			innerButton.remove();

			const event = pressEscape(document.body);

			expect(event.defaultPrevented).toBe(true);
			expect(innerOnClose).toHaveBeenCalledTimes(1);
			expect(outerOnClose).not.toHaveBeenCalled();
		});

		it('takes an Escape on the body when it is the top modal but earlier in document order', () => {
			const onClose = jest.fn();
			const renderDialogs = (isOpen: boolean) => (
				<>
					<Dialog onClose={onClose} isOpen={isOpen} label="Test dialog">
						<button type="button">Inside</button>
					</Dialog>
					<PlainDialog>
						<button type="button">Lower button</button>
					</PlainDialog>
				</>
			);
			const { rerender } = render(renderDialogs(false));
			screen.getByRole('button', { name: 'Lower button', hidden: true }).focus();
			// Opens above the plain `<dialog>`, which is later in document order.
			rerender(renderDialogs(true));
			const button = screen.getByRole('button', { name: 'Inside', hidden: true });
			button.focus();
			button.remove();

			const event = pressEscape(document.body);

			expect(event.defaultPrevented).toBe(true);
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		it('gives an Escape in the inner dialog only to the inner dialog when dialogs are nested', () => {
			const outerOnClose = jest.fn();
			const innerOnClose = jest.fn();
			render(
				<Dialog onClose={outerOnClose} isOpen={true} label="Outer">
					<Dialog onClose={innerOnClose} isOpen={true} label="Inner">
						<button type="button">Inner button</button>
					</Dialog>
				</Dialog>,
			);

			const event = pressEscape(screen.getByRole('button', { name: 'Inner button', hidden: true }));

			expect(event.defaultPrevented).toBe(true);
			expect(innerOnClose).toHaveBeenCalledTimes(1);
			expect(outerOnClose).not.toHaveBeenCalled();
		});

		it('does not take an Escape meant for a modal `<dialog>` above it', () => {
			const onClose = jest.fn();
			render(
				<>
					<Dialog onClose={onClose} isOpen={true} label="Test dialog">
						<p>Content</p>
					</Dialog>
					<PlainDialog>
						<button type="button">Top button</button>
					</PlainDialog>
				</>,
			);

			const topButton = screen.getByRole('button', { name: 'Top button', hidden: true });
			topButton.focus();
			const events = [pressEscape(topButton)];
			// Focus was last in the `<dialog>` above, so an Escape on the body is not for this dialog.
			topButton.remove();
			events.push(pressEscape(document.body));

			expect(events.some((event) => event.defaultPrevented)).toBe(false);
			expect(onClose).not.toHaveBeenCalled();
		});

		it('does not take an Escape during the exit', async () => {
			const originalGetAnimations = Object.getOwnPropertyDescriptor(
				HTMLElement.prototype,
				'getAnimations',
			);
			// Never settles, so the exit stays open.
			const pendingAnimation = { finished: new Promise<Animation>(() => {}) } as Animation;
			Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
				configurable: true,
				value: () => [pendingAnimation],
			});
			try {
				const onClose = jest.fn();
				const renderDialog = (isOpen: boolean) => (
					<Dialog onClose={onClose} isOpen={isOpen} label="Test dialog" shouldAnimate>
						<button type="button">Inside</button>
					</Dialog>
				);
				const { rerender } = render(renderDialog(true));
				const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
				rerender(renderDialog(false));
				await act(async () => {
					await new Promise((resolve) => setTimeout(resolve, 0));
				});
				// Still mounted: the exit has not finished.
				expect(dialogEl.isConnected).toBe(true);

				const event = pressEscape(screen.getByRole('button', { name: 'Inside', hidden: true }));

				expect(event.defaultPrevented).toBe(false);
				expect(onClose).not.toHaveBeenCalled();
			} finally {
				if (originalGetAnimations) {
					Object.defineProperty(HTMLElement.prototype, 'getAnimations', originalGetAnimations);
				} else {
					Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations');
				}
			}
		});
	});

	it('only asks the dialog that Escape targets when dialogs are nested', () => {
		const outerOnClose = jest.fn();
		const innerOnClose = jest.fn();
		render(
			<Dialog onClose={outerOnClose} isOpen={true} label="Outer" testId="outer">
				<Dialog onClose={innerOnClose} isOpen={true} label="Inner" testId="inner">
					<p>Inner content</p>
				</Dialog>
			</Dialog>,
		);
		const outer = screen.getByTestId('outer') as HTMLDialogElement;
		const inner = screen.getByTestId('inner') as HTMLDialogElement;

		fireEscape(inner);

		expect(innerOnClose).toHaveBeenCalledWith({ reason: 'escape' });
		expect(outerOnClose).not.toHaveBeenCalled();
		expect(outer.open).toBe(true);
		expect(inner.open).toBe(true);
	});

	it('takes a refused Escape, so nothing else closes, when onClose ignores it', async () => {
		const user = userEvent.setup();
		const onClose = jest.fn();

		render(
			<Dialog onClose={onClose} isOpen={true} label="Test dialog">
				<button type="button" autoFocus>
					Content
				</button>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		const onCancel = jest.fn();
		const onKeyDown = jest.fn();
		const unbind = bindAll(dialogEl, [
			{ type: 'cancel', listener: onCancel },
			{ type: 'keydown', listener: onKeyDown },
		]);

		await user.keyboard('{Escape}');

		// A consumer that filters by reason refuses by ignoring the call. The keydown is still
		// canceled, so the browser makes no close request.
		expect(onClose).toHaveBeenCalledWith({ reason: 'escape' });
		expect(onKeyDown.mock.calls[0][0].defaultPrevented).toBe(true);
		expect(onCancel).not.toHaveBeenCalled();
		expect(dialogEl).toHaveAttribute('open');
		unbind();
	});

	it('does not request close from user actions when dismissedBy is "none"', async () => {
		const user = userEvent.setup();
		const onClose = jest.fn();

		render(
			<Dialog onClose={onClose} isOpen={true} label="Test dialog" dismissedBy="none">
				<button type="button" autoFocus>
					Content
				</button>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });

		const onCancel = jest.fn();
		const onKeyDown = jest.fn();
		const unbind = bindAll(dialogEl, [
			{ type: 'cancel', listener: onCancel },
			{ type: 'keydown', listener: onKeyDown },
		]);
		clickBackdrop(dialogEl);

		// eslint-disable-next-line testing-library/no-node-access
		expect(dialogEl).toContainElement(document.activeElement as HTMLElement);
		await user.keyboard('{Escape}');
		await user.keyboard('{Escape}');

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		// Dialog takes each Escape, so the browser makes no close request, and does not ask.
		expect(onKeyDown).toHaveBeenCalledTimes(2);
		expect(onKeyDown.mock.calls.every(([event]) => event.defaultPrevented)).toBe(true);
		expect(onCancel).not.toHaveBeenCalled();
		expect(dialogEl).toHaveAttribute('open');
		expect(onClose).not.toHaveBeenCalled();
		unbind();
	});

	describe('a close that Dialog did not ask about', () => {
		function renderWithCloseSpies() {
			const onClose = jest.fn();
			const onExitFinish = jest.fn();
			render(
				<Dialog onClose={onClose} onExitFinish={onExitFinish} isOpen={true} label="Test dialog">
					<button type="button">Inside</button>
				</Dialog>,
			);
			const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
			return { onClose, onExitFinish, dialogEl };
		}

		it('shows the dialog again after `dialog.close()` while `isOpen` is `true`', async () => {
			const { onClose, onExitFinish, dialogEl } = renderWithCloseSpies();
			const closeToggle = waitForDialogCloseToggle({ dialog: dialogEl });

			await act(async () => {
				dialogEl.close();
				await closeToggle;
			});

			expect(dialogEl.open).toBe(true);
			expect(dialogEl).not.toHaveAttribute('inert');
			expect(dialogEl).not.toHaveAttribute('aria-hidden');
			expect(onClose).not.toHaveBeenCalled();
			expect(onExitFinish).not.toHaveBeenCalled();
		});

		it('stays closed when a layer that contains it is closed', async () => {
			const onClose = jest.fn();
			const onExitFinish = jest.fn();
			// An open modal in a closed layer would be invisible but would still make the page inert.
			render(
				<div data-testid="closed-layer">
					<Dialog onClose={onClose} onExitFinish={onExitFinish} isOpen={true} label="Test dialog">
						<button type="button">Inside</button>
					</Dialog>
				</div>,
			);
			screen.getByTestId('closed-layer').setAttribute('popover', 'manual');
			const dialogEl = screen.getByRole('dialog', { hidden: true }) as HTMLDialogElement;
			const closeToggle = waitForDialogCloseToggle({ dialog: dialogEl });

			await act(async () => {
				dialogEl.close();
				await closeToggle;
			});

			await waitFor(() => expect(onExitFinish).toHaveBeenCalledTimes(1));
			expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
			expect(onClose).not.toHaveBeenCalled();
		});
	});

	it('does NOT fire onClose when a child element is clicked', () => {
		const onClose = jest.fn();

		render(
			<Dialog onClose={onClose} isOpen={true} label="Test dialog">
				<p>Click me</p>
			</Dialog>,
		);

		fireEvent.click(screen.getByText('Click me'));
		expect(onClose).not.toHaveBeenCalled();
	});

	it('applies style prop to the dialog element', () => {
		const testStyle = { width: '800px' };
		render(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- testing style passthrough
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog" style={testStyle}>
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		expect(dialogEl).toHaveStyle(testStyle);
	});

	it('should be accessible', async () => {
		const { container } = render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		await expect(container).toBeAccessible();
	});
});

describe('Dialog primitive - open layers', () => {
	it('counts as an open modal layer while open', () => {
		render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				Dialog content
			</Dialog>,
		);

		expect(hasOpenDialogOrPopover()).toBe(true);
		expect(hasOpenDialogOrPopover({ type: 'modal' })).toBe(true);
	});

	it('does not count as an open layer when closed', () => {
		render(
			<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
				Dialog content
			</Dialog>,
		);

		expect(hasOpenDialogOrPopover()).toBe(false);
	});

	it('stops counting as an open layer when isOpen transitions to false', () => {
		const { rerender } = render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				Dialog content
			</Dialog>,
		);

		expect(hasOpenDialogOrPopover()).toBe(true);

		rerender(
			<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
				Dialog content
			</Dialog>,
		);

		expect(hasOpenDialogOrPopover()).toBe(false);
	});

	it('is not asked to close by requestClosePopovers()', () => {
		const onClose = jest.fn();

		render(
			<Dialog onClose={onClose} isOpen={true} label="Test dialog">
				Dialog content
			</Dialog>,
		);

		act(() => {
			requestClosePopovers();
		});

		// Dialogs are persistent: outside code cannot close them.
		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('open');
		expect(hasOpenDialogOrPopover()).toBe(true);
	});
});
