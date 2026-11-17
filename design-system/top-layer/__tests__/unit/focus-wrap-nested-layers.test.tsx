import React, { type ReactNode, useCallback, useRef } from 'react';

import { bind } from 'bind-event-listener';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { Dialog } from '../../src/dialog/dialog-content';
import { getFocusables } from '../../src/focus/get-focusables';
import { Popover } from '../../src/popover/popover';
import { useArrowNavigation } from '../../src/use-arrow-navigation/use-arrow-navigation';

// The role rule for nested layers in a focus wrap. See notes/decisions/role-and-focus.md.

function noop() {}

// jsdom has no `checkVisibility()`.
function isVisibleByComputedStyle(element: Element): boolean {
	const { display, visibility } = getComputedStyle(element);
	if (display === 'none' || visibility === 'hidden' || visibility === 'collapse') {
		return false;
	}
	if (element.parentElement) {
		return isVisibleByComputedStyle(element.parentElement);
	}
	return true;
}

const originalCheckVisibility = Object.getOwnPropertyDescriptor(
	Element.prototype,
	'checkVisibility',
);

beforeAll(() => {
	Object.defineProperty(Element.prototype, 'checkVisibility', {
		configurable: true,
		value: function checkVisibility(this: Element) {
			return isVisibleByComputedStyle(this);
		},
	});
});

afterAll(() => {
	if (originalCheckVisibility) {
		Object.defineProperty(Element.prototype, 'checkVisibility', originalCheckVisibility);
		return;
	}
	Reflect.deleteProperty(Element.prototype, 'checkVisibility');
});

function getButton({ name }: { name: string }): HTMLElement {
	return screen.getByRole('button', { name });
}

function OuterDialog({ children }: { children: ReactNode }) {
	return (
		<Dialog isOpen onClose={noop} label="Outer">
			{children}
		</Dialog>
	);
}

// A plain `[popover]` element with no focus management.
function RawPopover({
	role,
	label,
	testId,
	isOpen = true,
	children,
}: {
	role?: string;
	label?: string;
	testId?: string;
	isOpen?: boolean;
	children: ReactNode;
}) {
	const ref = useCallback(
		(element: HTMLDivElement | null) => {
			if (!element) {
				return;
			}
			element.setAttribute('popover', 'manual');
			if (isOpen) {
				element.showPopover();
			}
		},
		[isOpen],
	);

	return (
		<div ref={ref} role={role} aria-label={label} data-testid={testId}>
			{children}
		</div>
	);
}

// React 18 does not set `inert` from a prop.
function Inert({ children }: { children: ReactNode }) {
	const ref = useCallback((element: HTMLDivElement | null) => {
		element?.setAttribute('inert', '');
	}, []);

	return <div ref={ref}>{children}</div>;
}

// A non-modal `<dialog>`.
function RawDialog({ children }: { children: ReactNode }) {
	const ref = useCallback((element: HTMLDialogElement | null) => {
		element?.show();
	}, []);

	return (
		<dialog ref={ref} aria-label="Nested dialog">
			{children}
		</dialog>
	);
}

function NestedPopover({ role }: { role: 'none' | 'listbox' | 'menu' }) {
	if (role === 'listbox') {
		return (
			<Popover isOpen mode="manual" role="listbox" label="Nested listbox">
				<div role="option" aria-selected="false" tabIndex={0}>
					Inside 1
				</div>
				<div role="option" aria-selected="false" tabIndex={0}>
					Inside 2
				</div>
			</Popover>
		);
	}
	if (role === 'menu') {
		return (
			<Popover isOpen mode="manual" role="menu" label="Nested menu">
				<button type="button" role="menuitem">
					Inside 1
				</button>
				<button type="button" role="menuitem">
					Inside 2
				</button>
			</Popover>
		);
	}
	return (
		<Popover isOpen mode="manual">
			<button type="button">Inside 1</button>
			<button type="button">Inside 2</button>
		</Popover>
	);
}

function getInside({ index }: { index: 1 | 2 }): HTMLElement {
	return screen.getByText(`Inside ${index}`);
}

describe('focus wrap and nested layers', () => {
	describe('open nested layers that do not own focus are in the Tab order', () => {
		it.each(['none', 'listbox', 'menu'] as const)(
			'Tab enters an open nested popover with role "%s", in DOM order',
			async (role) => {
				const user = userEvent.setup();
				render(
					<OuterDialog>
						<button type="button">Before</button>
						<NestedPopover role={role} />
						<button type="button">After</button>
					</OuterDialog>,
				);
				getButton({ name: 'Before' }).focus();

				await user.tab();
				expect(getInside({ index: 1 })).toHaveFocus();

				await user.tab();
				expect(getInside({ index: 2 })).toHaveFocus();

				await user.tab();
				expect(getButton({ name: 'After' })).toHaveFocus();
			},
		);

		it.each(['none', 'listbox', 'menu'] as const)(
			'Shift+Tab enters an open nested popover with role "%s" from after it, on its last element',
			async (role) => {
				const user = userEvent.setup();
				render(
					<OuterDialog>
						<button type="button">Before</button>
						<NestedPopover role={role} />
						<button type="button">After</button>
					</OuterDialog>,
				);
				getButton({ name: 'After' }).focus();

				await user.tab({ shift: true });
				expect(getInside({ index: 2 })).toHaveFocus();

				await user.tab({ shift: true });
				expect(getInside({ index: 1 })).toHaveFocus();

				await user.tab({ shift: true });
				expect(getButton({ name: 'Before' })).toHaveFocus();
			},
		);

		it('includes an open product-built popover with no role', async () => {
			const user = userEvent.setup();
			render(
				<OuterDialog>
					<button type="button">Before</button>
					<RawPopover>
						<button type="button">Inside</button>
					</RawPopover>
					<button type="button">After</button>
				</OuterDialog>,
			);
			getButton({ name: 'Before' }).focus();

			await user.tab();

			expect(getButton({ name: 'Inside' })).toHaveFocus();
		});

		it('skips a closed nested popover', async () => {
			const user = userEvent.setup();
			render(
				<OuterDialog>
					<button type="button">Before</button>
					<RawPopover isOpen={false}>
						<button type="button">Closed inside</button>
					</RawPopover>
					<button type="button">After</button>
				</OuterDialog>,
			);
			getButton({ name: 'Before' }).focus();

			await user.tab();
			expect(getButton({ name: 'After' })).toHaveFocus();

			await user.tab({ shift: true });
			expect(getButton({ name: 'Before' })).toHaveFocus();
		});

		it('skips a nested popover that was open and is now closed', async () => {
			const user = userEvent.setup();
			render(
				<OuterDialog>
					<button type="button">Before</button>
					<RawPopover testId="closed-later">
						<button type="button">Closed inside</button>
					</RawPopover>
					<button type="button">After</button>
				</OuterDialog>,
			);
			screen.getByTestId('closed-later').hidePopover();
			getButton({ name: 'Before' }).focus();

			await user.tab();

			expect(getButton({ name: 'After' })).toHaveFocus();
		});

		it('leaves out tabindex="-1", disabled, hidden and inert elements inside an included popover', async () => {
			const user = userEvent.setup();
			render(
				<OuterDialog>
					<button type="button">Before</button>
					<Popover isOpen mode="manual">
						<button type="button">First inside</button>
						<button type="button" tabIndex={-1}>
							Negative tabindex
						</button>
						<button type="button" disabled>
							Disabled
						</button>
						<button type="button" hidden>
							Hidden
						</button>
						<Inert>
							<button type="button">Inert</button>
						</Inert>
						<button type="button">Last inside</button>
					</Popover>
					<button type="button">After</button>
				</OuterDialog>,
			);
			getButton({ name: 'Before' }).focus();

			await user.tab();
			expect(getButton({ name: 'First inside' })).toHaveFocus();

			await user.tab();
			expect(getButton({ name: 'Last inside' })).toHaveFocus();

			await user.tab();
			expect(getButton({ name: 'After' })).toHaveFocus();
		});

		it('wraps from the last element of a menu at the end of the dialog to the first element of the dialog', async () => {
			const user = userEvent.setup();
			render(
				<OuterDialog>
					<button type="button">First</button>
					<button type="button">Before</button>
					<NestedPopover role="menu" />
				</OuterDialog>,
			);
			getInside({ index: 2 }).focus();

			await user.tab();
			expect(getButton({ name: 'First' })).toHaveFocus();

			await user.tab({ shift: true });
			expect(getInside({ index: 2 })).toHaveFocus();
		});

		it('moves Shift+Tab from the first element of a menu to the element before it', async () => {
			const user = userEvent.setup();
			render(
				<OuterDialog>
					<button type="button">First</button>
					<button type="button">Before</button>
					<NestedPopover role="menu" />
				</OuterDialog>,
			);
			getInside({ index: 1 }).focus();

			await user.tab({ shift: true });

			expect(getButton({ name: 'Before' })).toHaveFocus();
		});
	});

	describe('nested layers that own focus are not in the Tab order', () => {
		it('skips an open nested <dialog>', async () => {
			const user = userEvent.setup();
			render(
				<OuterDialog>
					<button type="button">Before</button>
					<RawDialog>
						<button type="button">Inside</button>
					</RawDialog>
					<button type="button">After</button>
				</OuterDialog>,
			);
			getButton({ name: 'Before' }).focus();

			await user.tab();
			expect(getButton({ name: 'After' })).toHaveFocus();

			await user.tab({ shift: true });
			expect(getButton({ name: 'Before' })).toHaveFocus();
		});

		it.each(['dialog', 'alertdialog'] as const)(
			'skips an open nested popover with role "%s"',
			async (role) => {
				const user = userEvent.setup();
				render(
					<OuterDialog>
						<button type="button">Before</button>
						<Popover isOpen mode="manual" role={role} label="Nested">
							<button type="button">Inside</button>
						</Popover>
						<button type="button">After</button>
					</OuterDialog>,
				);
				getButton({ name: 'Before' }).focus();

				await user.tab();
				expect(getButton({ name: 'After' })).toHaveFocus();

				await user.tab({ shift: true });
				expect(getButton({ name: 'Before' })).toHaveFocus();
			},
		);
	});

	describe('two-deep nesting', () => {
		it('includes a layer that does not own focus inside another one', async () => {
			const user = userEvent.setup();
			render(
				<OuterDialog>
					<button type="button">Before</button>
					<Popover isOpen mode="manual">
						<button type="button">Level 1</button>
						<Popover isOpen mode="manual" role="menu" label="Level 2 menu">
							<button type="button" role="menuitem">
								Level 2
							</button>
						</Popover>
					</Popover>
					<button type="button">After</button>
				</OuterDialog>,
			);
			getButton({ name: 'Before' }).focus();

			await user.tab();
			expect(getButton({ name: 'Level 1' })).toHaveFocus();

			await user.tab();
			expect(screen.getByRole('menuitem', { name: 'Level 2' })).toHaveFocus();

			await user.tab();
			expect(getButton({ name: 'After' })).toHaveFocus();
		});

		it('leaves out anything under a layer that owns focus, anywhere in the chain', () => {
			render(
				<OuterDialog>
					<button type="button">Before</button>
					<Popover isOpen mode="manual" role="dialog" label="Dialog over a menu">
						<Popover isOpen mode="manual" role="menu" label="Menu under a dialog">
							<button type="button" role="menuitem">
								Under a dialog
							</button>
						</Popover>
					</Popover>
					<Popover isOpen mode="manual" role="menu" label="Menu over a dialog">
						<button type="button" role="menuitem">
							Menu item
						</button>
						<RawPopover role="dialog" label="Dialog under a menu">
							<button type="button">Dialog under a menu</button>
						</RawPopover>
					</Popover>
					<button type="button">After</button>
				</OuterDialog>,
			);
			const outer = screen.getByRole('dialog', { name: 'Outer' });

			const focusables = getFocusables({ container: outer });

			expect(focusables.map((element) => element.textContent)).toEqual([
				'Before',
				'Menu item',
				'After',
			]);
		});
	});

	describe('focus inside a nested layer that owns focus', () => {
		it('leaves Tab to the inner layer, which wraps', async () => {
			const user = userEvent.setup();
			render(
				<OuterDialog>
					<button type="button">Outer before</button>
					<Popover isOpen mode="manual" role="dialog" label="Inner">
						<button type="button">Inner first</button>
						<button type="button">Inner last</button>
					</Popover>
					<button type="button">Outer after</button>
				</OuterDialog>,
			);
			getButton({ name: 'Inner last' }).focus();

			await user.tab();
			expect(getButton({ name: 'Inner first' })).toHaveFocus();

			await user.tab({ shift: true });
			expect(getButton({ name: 'Inner last' })).toHaveFocus();
		});

		it('leaves Tab to the inner layer when focus is in a menu inside it', async () => {
			const user = userEvent.setup();
			render(
				<OuterDialog>
					<button type="button">Outer before</button>
					<Popover isOpen mode="manual" role="dialog" label="Inner">
						<button type="button">Inner first</button>
						<Popover isOpen mode="manual" role="menu" label="Inner menu">
							<button type="button" role="menuitem">
								Inner menu item
							</button>
						</Popover>
					</Popover>
					<button type="button">Outer after</button>
				</OuterDialog>,
			);
			screen.getByRole('menuitem', { name: 'Inner menu item' }).focus();

			await user.tab();

			// The inner dialog wraps, through its own menu.
			expect(getButton({ name: 'Inner first' })).toHaveFocus();
		});
	});

	describe('focus outside the dialog', () => {
		it('enters the dialog on the next Tab when focus is on <body>', async () => {
			const user = userEvent.setup();
			render(
				<OuterDialog>
					<button type="button">First</button>
					<button type="button">Last</button>
				</OuterDialog>,
			);
			getButton({ name: 'First' }).blur();
			expect(document.body).toHaveFocus();

			await user.tab();
			expect(getButton({ name: 'First' })).toHaveFocus();

			getButton({ name: 'First' }).blur();
			await user.tab({ shift: true });
			expect(getButton({ name: 'Last' })).toHaveFocus();
		});
	});

	describe('accepted edges', () => {
		it('does not see Tab inside an iframe that is the last element of the dialog', async () => {
			const user = userEvent.setup();
			render(
				<OuterDialog>
					<button type="button">First</button>
					<iframe title="Frame" />
				</OuterDialog>,
			);
			const frame = screen.getByTitle('Frame');
			invariantIsIframe(frame);
			const frameDocument = frame.contentDocument;
			const frameButton = frameDocument?.createElement('button');
			if (!frameDocument || !frameButton) {
				throw new Error('The iframe has no document');
			}
			frameButton.textContent = 'In frame';
			frameDocument.body.appendChild(frameButton);
			getButton({ name: 'First' }).focus();

			// The iframe itself is the last element of the dialog's Tab order.
			await user.tab();
			expect(frame).toHaveFocus();

			// The dialog does not see keys inside the iframe.
			frameButton.focus();
			const keydown = new KeyboardEvent('keydown', {
				key: 'Tab',
				bubbles: true,
				cancelable: true,
			});
			frameButton.dispatchEvent(keydown);
			expect(keydown.defaultPrevented).toBe(false);
		});

		it('steps aside in a product-built role="dialog" popover with no focus wrap, and leaves it out', async () => {
			const user = userEvent.setup();
			render(
				<OuterDialog>
					<button type="button">Before</button>
					<RawPopover role="dialog" label="Product dialog">
						<button type="button">Product first</button>
						<button type="button">Product last</button>
					</RawPopover>
					<button type="button">After</button>
				</OuterDialog>,
			);
			getButton({ name: 'Before' }).focus();

			// Its elements are not in the outer Tab order.
			await user.tab();
			expect(getButton({ name: 'After' })).toHaveFocus();

			// Inside it, Tab follows the browser.
			getButton({ name: 'Product last' }).focus();
			const keydown = new KeyboardEvent('keydown', {
				key: 'Tab',
				bubbles: true,
				cancelable: true,
			});
			getButton({ name: 'Product last' }).dispatchEvent(keydown);
			expect(keydown.defaultPrevented).toBe(false);
		});
	});
});

function invariantIsIframe(element: HTMLElement): asserts element is HTMLIFrameElement {
	if (!(element instanceof HTMLIFrameElement)) {
		throw new Error('Expected an iframe');
	}
}

describe('useArrowNavigation and nested layers', () => {
	function Menu({ children, onClose = noop }: { children: ReactNode; onClose?: () => void }) {
		const ref = useRef<HTMLDivElement>(null);
		useArrowNavigation({ containerRef: ref, onClose });
		return (
			<Popover ref={ref} isOpen mode="manual" role="menu" label="Menu">
				{children}
			</Popover>
		);
	}

	it('keeps arrow keys in the menu layer when a nested layer is open', async () => {
		const user = userEvent.setup();
		render(
			<Menu>
				<button type="button" role="menuitem">
					Item 1
				</button>
				<Popover isOpen mode="manual">
					<button type="button">Nested</button>
				</Popover>
				<button type="button" role="menuitem">
					Item 2
				</button>
			</Menu>,
		);
		screen.getByRole('menuitem', { name: 'Item 1' }).focus();

		await user.keyboard('{ArrowDown}');

		expect(screen.getByRole('menuitem', { name: 'Item 2' })).toHaveFocus();
	});

	it('closes the menu on Tab before a focus wrap around it sees the key', async () => {
		const user = userEvent.setup();
		const calls: string[] = [];
		render(
			<div data-testid="wrap">
				<Menu onClose={() => calls.push('close')}>
					<button type="button" role="menuitem">
						Item
					</button>
				</Menu>
			</div>,
		);
		const unbind = bind(screen.getByTestId('wrap'), {
			type: 'keydown',
			listener: () => calls.push('wrap'),
			options: { capture: true },
		});
		screen.getByRole('menuitem', { name: 'Item' }).focus();

		await user.tab();
		unbind();

		expect(calls.slice(0, 2)).toEqual(['close', 'wrap']);
	});

	it('does not close the menu on Tab in a layer opened from the menu', async () => {
		const user = userEvent.setup();
		const onClose = jest.fn();
		render(
			<Menu onClose={onClose}>
				<button type="button" role="menuitem">
					Item
				</button>
				<Popover isOpen mode="manual" role="dialog" label="Details">
					<input aria-label="Name" />
				</Popover>
			</Menu>,
		);
		screen.getByRole('textbox', { name: 'Name' }).focus();

		await user.tab();

		expect(onClose).not.toHaveBeenCalled();
	});
});
