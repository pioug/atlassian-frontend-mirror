import React, { type ReactNode, startTransition, StrictMode, Suspense, useState } from 'react';
import { createPortal } from 'react-dom';

import invariant from 'tiny-invariant';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { Dialog } from '../../src/dialog/dialog-content';
import { Popover } from '../../src/popover/popover';
import { flushPopoverExit } from '../../src/testing/flush-popover-exit';

/**
 * The top layer is ordered by show order: the layer that shows last is on top. React runs child
 * layout effects first, so a layer inside another layer that opens in the same commit must wait for
 * its parent. These tests record the order of `showModal()` and `showPopover()` calls.
 *
 * The show order is a defensive fix for React's effect order, not support for the pattern. Do not
 * design nested layers to open in the same commit (see
 * `notes/decisions/nested-layers-open-together-a11y.md`).
 */

function noop() {}

const shown: string[] = [];
// Read from an element, so the test does not name the `HTMLDialogElement` global.
const dialogPrototype: HTMLDialogElement = Object.getPrototypeOf(document.createElement('dialog'));
const originalShowModal = dialogPrototype.showModal;
const originalShowPopover = HTMLElement.prototype.showPopover;

beforeEach(() => {
	shown.length = 0;
	jest.spyOn(dialogPrototype, 'showModal').mockImplementation(function (this: HTMLDialogElement) {
		shown.push(this.getAttribute('aria-label') ?? '');
		originalShowModal.call(this);
	});
	jest.spyOn(HTMLElement.prototype, 'showPopover').mockImplementation(function (this: HTMLElement) {
		shown.push(this.getAttribute('aria-label') ?? '');
		originalShowPopover.call(this);
	});
});

afterEach(() => {
	jest.restoreAllMocks();
});

function TestPopover({
	label,
	isOpen = true,
	mode = 'manual',
	onClose = noop,
	children,
}: {
	label: string;
	isOpen?: boolean;
	mode?: 'auto' | 'manual';
	onClose?: () => void;
	children?: React.ReactNode;
}) {
	return (
		<Popover isOpen={isOpen} role="menu" label={label} mode={mode} onClose={onClose} testId={label}>
			<button type="button">{label} item</button>
			{children}
		</Popover>
	);
}

function TestDialog({
	label,
	isOpen = true,
	onClose = noop,
	children,
}: {
	label: string;
	isOpen?: boolean;
	onClose?: () => void;
	children?: React.ReactNode;
}) {
	return (
		<Dialog isOpen={isOpen} onClose={onClose} label={label} testId={label}>
			<button type="button">{label} button</button>
			{children}
		</Dialog>
	);
}

/**
 * `MaybeSuspend` suspends after `suspend()`, until `resume()`.
 */
function createSuspender(): {
	MaybeSuspend: () => ReactNode;
	suspend: () => undefined;
	resume: () => Promise<void>;
} {
	const state: { pending: Promise<void> | null; resolve: () => undefined } = {
		pending: null,
		resolve: () => undefined,
	};
	function MaybeSuspend(): ReactNode {
		if (state.pending) {
			throw state.pending;
		}
		return null;
	}
	return {
		MaybeSuspend,
		suspend() {
			state.pending = new Promise<void>((resolvePromise) => {
				state.resolve = () => {
					resolvePromise();
					return undefined;
				};
			});
			return undefined;
		},
		async resume() {
			const pending = state.pending;
			state.pending = null;
			await act(async () => {
				state.resolve();
				await pending;
			});
		},
	};
}

/**
 * `Activity` is in React 19.2 and later. Jest uses React 19 when `USE_REACT_NEXT=true`.
 */
const { Activity } = React as unknown as {
	Activity?: React.ComponentType<{ mode: 'visible' | 'hidden'; children: ReactNode }>;
};
const itWithActivity = Activity ? it : it.skip;

function TestActivity({
	mode,
	children,
}: {
	mode: 'visible' | 'hidden';
	children: ReactNode;
}): ReactNode {
	invariant(Activity, 'Activity needs React 19.2 or later');
	return <Activity mode={mode}>{children}</Activity>;
}

/**
 * A menu (an `auto` popover, as `Popup` and `DropdownMenu` use) in a dialog, with a trigger that is
 * not the dialog's initial focus target.
 */
function MenuInDialog({
	isMenuOpen,
	onDialogClose = noop,
	onMenuClose = noop,
	children,
}: {
	isMenuOpen: boolean;
	onDialogClose?: () => void;
	onMenuClose?: () => void;
	children?: ReactNode;
}): ReactNode {
	return (
		<TestDialog label="dialog" onClose={onDialogClose}>
			<button type="button">trigger</button>
			<TestPopover label="menu" mode="auto" isOpen={isMenuOpen} onClose={onMenuClose} />
			{children}
		</TestDialog>
	);
}

function isDialogOpen(): boolean {
	// The `open` attribute reflects `HTMLDialogElement.open`.
	return screen.getByTestId('dialog').hasAttribute('open');
}

function isMenuOpen(): boolean {
	return screen.getByTestId('menu').matches(':popover-open');
}

describe('layer show order', () => {
	describe('Popover inside Dialog', () => {
		it('shows the popover after the dialog when both mount open', () => {
			render(
				<TestDialog label="dialog">
					<TestPopover label="popover" />
				</TestDialog>,
			);

			expect(shown).toEqual(['dialog', 'popover']);
		});

		it('shows the popover after the dialog when both open in the same update', () => {
			function Tree({ isOpen }: { isOpen: boolean }) {
				return (
					<TestDialog label="dialog" isOpen={isOpen}>
						<TestPopover label="popover" isOpen={isOpen} />
					</TestDialog>
				);
			}
			const { rerender } = render(<Tree isOpen={false} />);

			rerender(<Tree isOpen />);

			expect(shown).toEqual(['dialog', 'popover']);
		});

		it('moves initial focus into the popover, which is the last to show', () => {
			render(
				<TestDialog label="dialog">
					<TestPopover label="popover" />
				</TestDialog>,
			);

			expect(screen.getByRole('button', { name: 'popover item', hidden: true })).toHaveFocus();
		});

		it('shows the popover after the dialog in strict mode', () => {
			render(
				<StrictMode>
					<TestDialog label="dialog">
						<TestPopover label="popover" />
					</TestDialog>
				</StrictMode>,
			);

			// Strict mode runs the effects twice. The last show of each layer decides the order.
			expect(shown.lastIndexOf('dialog')).toBeLessThan(shown.lastIndexOf('popover'));
			// The second run shows both layers again. The dialog's `showModal()` moves focus into it, and
			// the popover takes initial focus again after it shows.
			expect(screen.getByRole('button', { name: 'popover item', hidden: true })).toHaveFocus();
		});
	});

	describe('effects that run again while the layers stay open', () => {
		it('ends with focus in the inner popover after a Suspense hide and reveal', async () => {
			const suspender = createSuspender();
			function Tree() {
				return (
					<Suspense fallback={null}>
						<TestDialog label="dialog">
							<TestPopover label="popover" />
						</TestDialog>
						<suspender.MaybeSuspend />
					</Suspense>
				);
			}
			const { rerender } = render(<Tree />);
			expect(screen.getByRole('button', { name: 'popover item', hidden: true })).toHaveFocus();

			// Suspend: React hides the shown content and runs its layout effect cleanups.
			suspender.suspend();
			rerender(<Tree />);
			// Reveal: React runs the layout effects again with the same inputs.
			await suspender.resume();

			expect(shown).toEqual(['dialog', 'popover', 'dialog', 'popover']);
			expect(screen.getByRole('button', { name: 'popover item', hidden: true })).toHaveFocus();
		});

		it('shows a menu that the user opened again after a Suspense hide and reveal, without onClose', async () => {
			const suspender = createSuspender();
			const onDialogClose = jest.fn();
			const onMenuClose = jest.fn();
			function Tree({ isOpen }: { isOpen: boolean }) {
				return (
					<Suspense fallback={null}>
						<MenuInDialog
							isMenuOpen={isOpen}
							onDialogClose={onDialogClose}
							onMenuClose={onMenuClose}
						/>
						<suspender.MaybeSuspend />
					</Suspense>
				);
			}
			const { rerender } = render(<Tree isOpen={false} />);
			// The user opens the menu: it opens in its own commit, after the dialog.
			rerender(<Tree isOpen />);
			shown.length = 0;

			// An update that suspends, not in a transition: React hides the content, and the layers close.
			suspender.suspend();
			rerender(<Tree isOpen />);
			expect(isDialogOpen()).toBe(false);
			expect(isMenuOpen()).toBe(false);

			await suspender.resume();

			// Both show again in one commit. The menu shows last, so showing the dialog does not close it.
			expect(shown).toEqual(['dialog', 'menu']);
			expect(isDialogOpen()).toBe(true);
			expect(isMenuOpen()).toBe(true);
			expect(screen.getByRole('button', { name: 'menu item', hidden: true })).toHaveFocus();
			expect(onDialogClose).not.toHaveBeenCalled();
			expect(onMenuClose).not.toHaveBeenCalled();
		});

		it('does not hide the layers when the update that suspends is in a transition', async () => {
			const suspender = createSuspender();
			const controls: { update: () => undefined } = { update: () => undefined };
			function Tree({ isOpen }: { isOpen: boolean }) {
				const [, setCount] = useState(0);
				controls.update = () => {
					startTransition(() => {
						setCount((count) => count + 1);
					});
					return undefined;
				};
				return (
					<Suspense fallback={null}>
						<MenuInDialog isMenuOpen={isOpen} />
						<suspender.MaybeSuspend />
					</Suspense>
				);
			}
			const { rerender } = render(<Tree isOpen={false} />);
			rerender(<Tree isOpen />);
			shown.length = 0;

			// React keeps the shown content while a transition suspends.
			suspender.suspend();
			act(() => {
				controls.update();
			});
			expect(isDialogOpen()).toBe(true);
			expect(isMenuOpen()).toBe(true);

			await suspender.resume();

			expect(shown).toEqual([]);
			expect(screen.getByRole('button', { name: 'menu item', hidden: true })).toHaveFocus();
		});

		it('does not hide the layers when the Suspense boundary is inside the layer', async () => {
			const suspender = createSuspender();
			function Tree({ isOpen }: { isOpen: boolean }) {
				return (
					<MenuInDialog isMenuOpen={isOpen}>
						<Suspense fallback={null}>
							<suspender.MaybeSuspend />
						</Suspense>
					</MenuInDialog>
				);
			}
			const { rerender } = render(<Tree isOpen={false} />);
			rerender(<Tree isOpen />);
			shown.length = 0;

			// Only the content inside the inner boundary hides.
			suspender.suspend();
			rerender(<Tree isOpen />);
			expect(isDialogOpen()).toBe(true);
			expect(isMenuOpen()).toBe(true);

			await suspender.resume();

			expect(shown).toEqual([]);
			expect(screen.getByRole('button', { name: 'menu item', hidden: true })).toHaveFocus();
		});

		itWithActivity('closes the layers on an Activity hide, and shows them in order on show', () => {
			const onDialogClose = jest.fn();
			const onMenuClose = jest.fn();
			function Tree({ mode, isOpen }: { mode: 'visible' | 'hidden'; isOpen: boolean }) {
				return (
					<TestActivity mode={mode}>
						<MenuInDialog
							isMenuOpen={isOpen}
							onDialogClose={onDialogClose}
							onMenuClose={onMenuClose}
						/>
					</TestActivity>
				);
			}
			const { rerender } = render(<Tree mode="visible" isOpen={false} />);
			rerender(<Tree mode="visible" isOpen />);
			shown.length = 0;

			// A hidden Activity destroys the effects of its content.
			rerender(<Tree mode="hidden" isOpen />);
			expect(isDialogOpen()).toBe(false);
			expect(isMenuOpen()).toBe(false);

			// It creates them again on show, child first.
			rerender(<Tree mode="visible" isOpen />);

			expect(shown).toEqual(['dialog', 'menu']);
			expect(isMenuOpen()).toBe(true);
			expect(screen.getByRole('button', { name: 'menu item', hidden: true })).toHaveFocus();
			expect(onDialogClose).not.toHaveBeenCalled();
			expect(onMenuClose).not.toHaveBeenCalled();
		});

		itWithActivity('shows the layers in order on the first show of a hidden Activity', () => {
			function Tree({ mode }: { mode: 'visible' | 'hidden' }) {
				return (
					<TestActivity mode={mode}>
						<MenuInDialog isMenuOpen />
					</TestActivity>
				);
			}
			// A hidden Activity renders its content, but does not mount its effects.
			const { rerender } = render(<Tree mode="hidden" />);
			expect(shown).toEqual([]);

			rerender(<Tree mode="visible" />);

			expect(shown).toEqual(['dialog', 'menu']);
			expect(isMenuOpen()).toBe(true);
			expect(screen.getByRole('button', { name: 'menu item', hidden: true })).toHaveFocus();
		});

		it('returns focus to the dialog initial focus target, not the trigger, when the menu closes after a reveal (known limit)', async () => {
			const suspender = createSuspender();
			function Tree({ isOpen }: { isOpen: boolean }) {
				return (
					<Suspense fallback={null}>
						<MenuInDialog isMenuOpen={isOpen} />
						<suspender.MaybeSuspend />
					</Suspense>
				);
			}
			const { rerender } = render(<Tree isOpen={false} />);
			screen.getByRole('button', { name: 'trigger', hidden: true }).focus();
			rerender(<Tree isOpen />);
			suspender.suspend();
			rerender(<Tree isOpen />);
			await suspender.resume();

			rerender(<Tree isOpen={false} />);
			await flushPopoverExit();

			// On the reveal, the menu recorded its restore target after the dialog took initial focus.
			// Without a reveal, focus returns to the trigger. See `notes/architecture/layer-show-order.md`.
			expect(screen.getByRole('button', { name: 'dialog button', hidden: true })).toHaveFocus();
		});
	});

	describe('Popover inside Popover', () => {
		it('shows the inner popover after the outer one', () => {
			render(
				<TestPopover label="outer">
					<TestPopover label="inner" />
				</TestPopover>,
			);

			expect(shown).toEqual(['outer', 'inner']);
			expect(screen.getByRole('button', { name: 'inner item', hidden: true })).toHaveFocus();
		});

		it('shows three levels in order', () => {
			render(
				<TestPopover label="first">
					<TestPopover label="second">
						<TestPopover label="third" />
					</TestPopover>
				</TestPopover>,
			);

			expect(shown).toEqual(['first', 'second', 'third']);
		});
	});

	describe('Dialog inside Popover', () => {
		it('shows the dialog after the popover', () => {
			render(
				<TestPopover label="popover">
					<TestDialog label="dialog" />
				</TestPopover>,
			);

			expect(shown).toEqual(['popover', 'dialog']);
		});
	});

	/**
	 * `auto` is the default mode (for example `Popup` and `DropdownMenu`). Showing an `auto`
	 * popover, or a modal dialog, hides every open `auto` popover that is not its ancestor. So if the
	 * inner popover showed first, its parent would hide it as it shows.
	 */
	describe('auto popovers', () => {
		it('keeps an auto popover inside an auto popover open when both mount open', () => {
			render(
				<TestPopover label="outer" mode="auto">
					<TestPopover label="inner" mode="auto" />
				</TestPopover>,
			);

			expect(shown).toEqual(['outer', 'inner']);
			expect(screen.getByTestId('outer').matches(':popover-open')).toBe(true);
			expect(screen.getByTestId('inner').matches(':popover-open')).toBe(true);
			expect(screen.getByRole('button', { name: 'inner item', hidden: true })).toHaveFocus();
		});

		it('keeps an auto popover inside a modal dialog open when both mount open', () => {
			render(
				<TestDialog label="dialog">
					<TestPopover label="popover" mode="auto" />
				</TestDialog>,
			);

			expect(shown).toEqual(['dialog', 'popover']);
			expect(screen.getByTestId('popover').matches(':popover-open')).toBe(true);
			expect(screen.getByRole('button', { name: 'popover item', hidden: true })).toHaveFocus();
		});
	});

	describe('mixed trees', () => {
		it('shows Dialog > Popover > Dialog in order', () => {
			render(
				<TestDialog label="first">
					<TestPopover label="second">
						<TestDialog label="third" />
					</TestPopover>
				</TestDialog>,
			);

			expect(shown).toEqual(['first', 'second', 'third']);
		});

		it('keeps siblings in DOM order, each after its own parent', () => {
			render(
				<TestDialog label="parent">
					<TestPopover label="a">
						<TestPopover label="a1" />
					</TestPopover>
					<TestPopover label="b" />
				</TestDialog>,
			);

			expect(shown).toEqual(['parent', 'a', 'a1', 'b']);
		});

		// Top-level layers do not wait, so they show in effect order.
		it('keeps top-level siblings in tree order', () => {
			render(
				<>
					<TestPopover label="one" />
					<TestPopover label="two" />
				</>,
			);

			expect(shown).toEqual(['one', 'two']);
		});
	});

	describe('the DOM decides the parent', () => {
		it('does not wait for a layer it is not inside in the DOM', () => {
			function PortalPopover() {
				return createPortal(<TestPopover label="portaled" />, document.body);
			}
			render(
				<TestDialog label="dialog">
					<PortalPopover />
				</TestDialog>,
			);

			// The popover is not inside the dialog in the DOM, so it has no parent layer and shows at once.
			expect(shown).toEqual(['portaled', 'dialog']);
		});

		it('shows a layer after its own parent when portals make the effect order differ from the DOM order', async () => {
			const suspender = createSuspender();
			const onInnerClose = jest.fn();
			// Stable portal targets. React detaches refs on a Suspense hide, so a target kept in state
			// would remove the portals, and the layers would not show again in one commit.
			const outerTarget = document.createElement('div');
			const middleTarget = document.createElement('div');
			function Tree({ hasPortals }: { hasPortals: boolean }) {
				return (
					<Suspense fallback={null}>
						{/* In the React tree, the inner layer is a child of the outer layer. */}
						<TestPopover label="outer" mode="auto">
							<div ref={(node) => node?.appendChild(outerTarget)} />
							{hasPortals &&
								createPortal(
									<TestPopover label="inner" mode="auto" onClose={onInnerClose} />,
									middleTarget,
								)}
						</TestPopover>
						{/* In the DOM, the middle layer is inside the outer one, and the inner one inside it. */}
						{hasPortals &&
							createPortal(
								<TestPopover label="middle" mode="auto">
									<div ref={(node) => node?.appendChild(middleTarget)} />
								</TestPopover>,
								outerTarget,
							)}
						<suspender.MaybeSuspend />
					</Suspense>
				);
			}
			const { rerender } = render(<Tree hasPortals={false} />);
			rerender(<Tree hasPortals />);
			shown.length = 0;

			// On the reveal, the layout effects run inner, outer, middle. The inner layer waits for the
			// middle one, which is its parent in the DOM, not for the outer one.
			suspender.suspend();
			rerender(<Tree hasPortals />);
			await suspender.resume();

			expect(shown).toEqual(['outer', 'middle', 'inner']);
			expect(screen.getByTestId('inner').matches(':popover-open')).toBe(true);
			expect(onInnerClose).not.toHaveBeenCalled();
		});
	});

	describe('a parent that is not opening', () => {
		it('shows a child that opens later at once, above its open parent', () => {
			function OpenLater() {
				const [isChildOpen, setIsChildOpen] = useState(false);
				return (
					<TestDialog label="dialog">
						<button type="button" onClick={() => setIsChildOpen(true)}>
							Open child
						</button>
						<TestPopover label="popover" isOpen={isChildOpen} />
					</TestDialog>
				);
			}
			render(<OpenLater />);
			expect(shown).toEqual(['dialog']);

			act(() => {
				screen.getByRole('button', { name: 'Open child', hidden: true }).click();
			});

			expect(shown).toEqual(['dialog', 'popover']);
		});

		it('shows a child that mounts while its parent is open without waiting', () => {
			function MountLater() {
				const [hasChild, setHasChild] = useState(false);
				return (
					<TestDialog label="dialog">
						<button type="button" onClick={() => setHasChild(true)}>
							Add child
						</button>
						{hasChild && <TestPopover label="popover" />}
					</TestDialog>
				);
			}
			render(<MountLater />);

			act(() => {
				screen.getByRole('button', { name: 'Add child', hidden: true }).click();
			});

			expect(shown).toEqual(['dialog', 'popover']);
		});

		it('shows two levels that open together inside an open grandparent in order', () => {
			function OpenTwoLater() {
				const [isOpen, setIsOpen] = useState(false);
				return (
					<TestDialog label="grandparent">
						<button type="button" onClick={() => setIsOpen(true)}>
							Open both
						</button>
						<TestPopover label="parent" isOpen={isOpen}>
							<TestPopover label="child" isOpen={isOpen} />
						</TestPopover>
					</TestDialog>
				);
			}
			render(<OpenTwoLater />);
			expect(shown).toEqual(['grandparent']);

			act(() => {
				screen.getByRole('button', { name: 'Open both', hidden: true }).click();
			});

			// The parent does not wait for its open grandparent. The child waits for the parent.
			expect(shown).toEqual(['grandparent', 'parent', 'child']);
			expect(screen.getByRole('button', { name: 'child item', hidden: true })).toHaveFocus();
		});
	});

	describe('close and reopen', () => {
		it('shows the layers in order again after they close and reopen', () => {
			function Tree({ isOpen }: { isOpen: boolean }) {
				return (
					<TestDialog label="dialog" isOpen={isOpen}>
						<TestPopover label="popover" isOpen={isOpen} />
					</TestDialog>
				);
			}
			const { rerender } = render(<Tree isOpen />);
			rerender(<Tree isOpen={false} />);
			shown.length = 0;

			rerender(<Tree isOpen />);

			expect(shown).toEqual(['dialog', 'popover']);
			expect(screen.getByRole('button', { name: 'popover item', hidden: true })).toHaveFocus();
		});

		it('returns focus into the parent when the inner popover closes', async () => {
			function Tree({ isInnerOpen }: { isInnerOpen: boolean }) {
				return (
					<TestPopover label="outer">
						<TestPopover label="inner" isOpen={isInnerOpen} />
					</TestPopover>
				);
			}
			const { rerender } = render(<Tree isInnerOpen />);
			expect(screen.getByRole('button', { name: 'inner item', hidden: true })).toHaveFocus();

			rerender(<Tree isInnerOpen={false} />);
			await flushPopoverExit();

			// The inner popover took its restore target after the outer one had focus.
			expect(screen.getByRole('button', { name: 'outer item', hidden: true })).toHaveFocus();
		});
	});
});
