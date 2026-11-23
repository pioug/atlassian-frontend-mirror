import React, { useState } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { DropdownItem } from '../../dropdown-item';
import { DropdownItemGroup } from '../../dropdown-item-group';
import { DropdownMenu } from '../../dropdown-menu';
import type { OnOpenChangeArgs } from '../../types';

/**
 * On the top layer, `DropdownMenu` asks `onOpenChange` first, and closes only when `isOpen`
 * becomes `false`. See `@atlaskit/top-layer` `notes/decisions/wrappers-ask-first-close.md`.
 */

function isPopoverOpen(element: Element | null): boolean {
	return Boolean(element?.matches(':popover-open'));
}

function getButton(name: string): HTMLElement {
	return screen.getByRole('button', { name });
}

/**
 * Lets queued `toggle` events and the polyfill focus fixup (one frame) run.
 */
async function flushTasks() {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 20));
	});
}

/**
 * A controlled menu. `shouldAccept` decides if a close request closes it.
 */
function ControlledMenu({
	testId,
	label,
	shouldAccept,
	onOpenChange,
	defaultOpen = false,
	children,
}: {
	testId: string;
	label: string;
	shouldAccept: boolean;
	onOpenChange?: (args: OnOpenChangeArgs) => void;
	defaultOpen?: boolean;
	children?: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	return (
		<DropdownMenu
			testId={testId}
			isOpen={isOpen}
			onOpenChange={(args) => {
				onOpenChange?.(args);
				if (args.isOpen || shouldAccept) {
					setIsOpen(args.isOpen);
				}
			}}
			trigger={({ triggerRef, ...triggerProps }) => (
				<button type="button" {...triggerProps} ref={triggerRef}>
					{label}
				</button>
			)}
		>
			<DropdownItemGroup>
				<DropdownItem>{`${label} item`}</DropdownItem>
				{children}
			</DropdownItemGroup>
		</DropdownMenu>
	);
}

describe('DropdownMenu top-layer: ask first on close', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('should stay open and visible when onOpenChange refuses an outside press', async () => {
		const onOpenChange = jest.fn();
		render(
			<>
				<button type="button">Outside</button>
				<ControlledMenu
					testId="menu"
					label="Options"
					shouldAccept={false}
					onOpenChange={onOpenChange}
				/>
			</>,
		);
		await userEvent.click(getButton('Options'));
		onOpenChange.mockClear();

		await userEvent.click(getButton('Outside'));
		await flushTasks();

		expect(onOpenChange).toHaveBeenCalledTimes(1);
		expect(onOpenChange).toHaveBeenCalledWith({ isOpen: false, event: expect.any(MouseEvent) });
		expect(screen.getByTestId('menu--content')).toBeVisible();
		expect(getButton('Options')).toHaveAttribute('aria-expanded', 'true');
		await expect(document.body).toBeAccessible();
	});

	it('should stay open and keep focus when onOpenChange refuses Escape', async () => {
		const onOpenChange = jest.fn();
		render(
			<ControlledMenu
				testId="menu"
				label="Options"
				shouldAccept={false}
				onOpenChange={onOpenChange}
			/>,
		);
		await userEvent.click(getButton('Options'));
		expect(screen.getByRole('menuitem', { name: 'Options item' })).toHaveFocus();
		onOpenChange.mockClear();

		await userEvent.keyboard('{Escape}');
		await flushTasks();

		expect(onOpenChange).toHaveBeenCalledTimes(1);
		expect(onOpenChange.mock.calls[0][0].event).toHaveProperty('key', 'Escape');
		expect(screen.getByTestId('menu--content')).toBeVisible();
		expect(screen.getByRole('menuitem', { name: 'Options item' })).toHaveFocus();
	});

	it('should stay open when onOpenChange refuses Tab', async () => {
		const onOpenChange = jest.fn();
		render(
			<ControlledMenu
				testId="menu"
				label="Options"
				shouldAccept={false}
				onOpenChange={onOpenChange}
			/>,
		);
		await userEvent.click(getButton('Options'));
		onOpenChange.mockClear();

		await userEvent.tab();
		await flushTasks();

		expect(onOpenChange).toHaveBeenCalledTimes(1);
		expect(onOpenChange.mock.calls[0][0].event).toHaveProperty('key', 'Tab');
		expect(screen.getByTestId('menu--content')).toBeVisible();
	});

	it('should ask before it closes on an accepted outside press, and leave focus where the user pressed', async () => {
		const isOpenWhenAsked = jest.fn();
		render(
			<>
				<button type="button">Outside</button>
				<ControlledMenu
					testId="menu"
					label="Options"
					shouldAccept
					onOpenChange={({ isOpen }) => {
						if (!isOpen) {
							isOpenWhenAsked(isPopoverOpen(screen.queryByTestId('menu--content')));
						}
					}}
				/>
			</>,
		);
		await userEvent.click(getButton('Options'));

		await userEvent.click(getButton('Outside'));
		await flushTasks();

		expect(isOpenWhenAsked).toHaveBeenCalledTimes(1);
		expect(isOpenWhenAsked).toHaveBeenCalledWith(true);
		expect(screen.queryByTestId('menu--content')).not.toBeInTheDocument();
		expect(getButton('Outside')).toHaveFocus();
	});

	it('should close on an accepted Escape, and return focus to the trigger', async () => {
		render(<ControlledMenu testId="menu" label="Options" shouldAccept />);
		getButton('Options').focus();
		await userEvent.keyboard('{Enter}');
		expect(screen.getByRole('menuitem', { name: 'Options item' })).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await flushTasks();

		expect(screen.queryByTestId('menu--content')).not.toBeInTheDocument();
		expect(getButton('Options')).toHaveFocus();
	});

	it('should close on an accepted Tab, and move focus on from the trigger', async () => {
		render(
			<>
				<ControlledMenu testId="menu" label="Options" shouldAccept />
				<button type="button">Next</button>
			</>,
		);
		getButton('Options').focus();
		await userEvent.keyboard('{Enter}');

		await userEvent.tab();
		await flushTasks();

		expect(screen.queryByTestId('menu--content')).not.toBeInTheDocument();
		expect(getButton('Next')).toHaveFocus();
	});

	// jsdom and user-event move focus for a Tab from the `keydown` target, so where the Tab lands
	// next is checked in Playwright (`dropdown-menu.spec.tsx`, Tab exit, in three browsers).
	it('should return focus to the trigger within an accepted Tab keydown, before the browser acts on the key', async () => {
		render(<ControlledMenu testId="menu" label="Options" shouldAccept />);
		getButton('Options').focus();
		await userEvent.keyboard('{Enter}');

		// A key sent from script: no microtask runs between the listener and the Tab default action.
		fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Options item' }), { key: 'Tab' });

		expect(getButton('Options')).toHaveFocus();
	});

	it('should not ask on a press on its trigger, so a hover menu can keep itself open', async () => {
		// As `useHoverToOpen` in `@atlassian/conversation-assistant`: a click on the trigger is ignored
		// while the menu is open.
		function TriggerClickIgnoredMenu() {
			const [isOpen, setIsOpen] = useState(true);
			return (
				<DropdownMenu
					testId="menu"
					isOpen={isOpen}
					onOpenChange={({ isOpen: nextIsOpen, event }) => {
						if (!nextIsOpen && event?.type === 'click') {
							return;
						}
						setIsOpen(nextIsOpen);
					}}
					trigger="Options"
				>
					<DropdownItemGroup>
						<DropdownItem>Options item</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>
			);
		}
		render(<TriggerClickIgnoredMenu />);

		await userEvent.click(screen.getByTestId('menu--trigger'));
		await flushTasks();

		expect(screen.getByTestId('menu--content')).toBeVisible();
	});

	describe('nested menus', () => {
		function NestedMenus({
			shouldRootAccept,
			shouldNestedAccept,
			onRootOpenChange,
			onNestedOpenChange,
		}: {
			shouldRootAccept: boolean;
			shouldNestedAccept: boolean;
			onRootOpenChange: (args: OnOpenChangeArgs) => void;
			onNestedOpenChange: (args: OnOpenChangeArgs) => void;
		}) {
			const [isNestedOpen, setIsNestedOpen] = useState(false);
			return (
				<>
					<button type="button">Outside</button>
					<ControlledMenu
						testId="root"
						label="Options"
						shouldAccept={shouldRootAccept}
						onOpenChange={onRootOpenChange}
					>
						<DropdownMenu
							testId="nested"
							isOpen={isNestedOpen}
							onOpenChange={(args) => {
								onNestedOpenChange(args);
								if (args.isOpen || shouldNestedAccept) {
									setIsNestedOpen(args.isOpen);
								}
							}}
							trigger={({ triggerRef, ...triggerProps }) => (
								<DropdownItem {...triggerProps} ref={triggerRef}>
									More
								</DropdownItem>
							)}
						>
							<DropdownItemGroup>
								<DropdownItem>Nested item</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
					</ControlledMenu>
				</>
			);
		}

		async function openBoth() {
			await userEvent.click(getButton('Options'));
			await userEvent.click(screen.getByRole('menuitem', { name: 'More' }));
			expect(screen.getByRole('menuitem', { name: 'Nested item' })).toHaveFocus();
		}

		it('should not ask either menu on a press inside the nested menu', async () => {
			const onRootOpenChange = jest.fn();
			const onNestedOpenChange = jest.fn();
			render(
				<NestedMenus
					shouldRootAccept
					shouldNestedAccept={false}
					onRootOpenChange={onRootOpenChange}
					onNestedOpenChange={onNestedOpenChange}
				/>,
			);
			await openBoth();
			onRootOpenChange.mockClear();
			onNestedOpenChange.mockClear();

			// A press that is not a click on an item (a click on an item closes its menu).
			await userEvent.pointer({
				keys: '[MouseLeft]',
				target: screen.getByTestId('nested--content'),
			});
			await flushTasks();

			expect(onRootOpenChange).not.toHaveBeenCalled();
			expect(onNestedOpenChange).not.toHaveBeenCalled();
			expect(screen.getByTestId('root--content')).toBeVisible();
			expect(screen.getByTestId('nested--content')).toBeVisible();
		});

		it('should ask only the nested menu on a press in the root menu, and keep it open when it refuses', async () => {
			const onRootOpenChange = jest.fn();
			const onNestedOpenChange = jest.fn();
			render(
				<NestedMenus
					shouldRootAccept
					shouldNestedAccept={false}
					onRootOpenChange={onRootOpenChange}
					onNestedOpenChange={onNestedOpenChange}
				/>,
			);
			await openBoth();
			onRootOpenChange.mockClear();
			onNestedOpenChange.mockClear();

			await userEvent.pointer({ keys: '[MouseLeft]', target: screen.getByTestId('root--content') });
			await flushTasks();

			expect(onRootOpenChange).not.toHaveBeenCalled();
			expect(onNestedOpenChange).toHaveBeenCalledTimes(1);
			expect(screen.getByTestId('root--content')).toBeVisible();
			expect(screen.getByTestId('nested--content')).toBeVisible();
		});

		it('should ask the nested menu first on Escape, and ask no other menu when it refuses', async () => {
			const onRootOpenChange = jest.fn();
			const onNestedOpenChange = jest.fn();
			render(
				<NestedMenus
					shouldRootAccept
					shouldNestedAccept={false}
					onRootOpenChange={onRootOpenChange}
					onNestedOpenChange={onNestedOpenChange}
				/>,
			);
			await openBoth();
			onRootOpenChange.mockClear();
			onNestedOpenChange.mockClear();

			await userEvent.keyboard('{Escape}');
			await flushTasks();

			expect(onNestedOpenChange).toHaveBeenCalledTimes(1);
			expect(onRootOpenChange).not.toHaveBeenCalled();
			expect(screen.getByTestId('root--content')).toBeVisible();
			expect(screen.getByTestId('nested--content')).toBeVisible();
		});

		it('should close one menu per accepted Escape, and return focus to each trigger', async () => {
			render(
				<NestedMenus
					shouldRootAccept
					shouldNestedAccept
					onRootOpenChange={jest.fn()}
					onNestedOpenChange={jest.fn()}
				/>,
			);
			await openBoth();

			await userEvent.keyboard('{Escape}');
			await flushTasks();

			expect(screen.queryByTestId('nested--content')).not.toBeInTheDocument();
			expect(screen.getByTestId('root--content')).toBeVisible();
			expect(screen.getByRole('menuitem', { name: 'More' })).toHaveFocus();

			await userEvent.keyboard('{Escape}');
			await flushTasks();

			expect(screen.queryByTestId('root--content')).not.toBeInTheDocument();
			expect(getButton('Options')).toHaveFocus();
		});

		it('should close the whole stack on an accepted Tab, and return focus to the root trigger within the keydown', async () => {
			render(
				<NestedMenus
					shouldRootAccept
					shouldNestedAccept
					onRootOpenChange={jest.fn()}
					onNestedOpenChange={jest.fn()}
				/>,
			);
			await openBoth();

			fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Nested item' }), { key: 'Tab' });

			expect(getButton('Options')).toHaveFocus();
			await flushTasks();
			expect(screen.queryByTestId('nested--content')).not.toBeInTheDocument();
			expect(screen.queryByTestId('root--content')).not.toBeInTheDocument();
		});

		it('should ask every menu in the stack on Tab, and keep the root open when it refuses', async () => {
			const onRootOpenChange = jest.fn();
			const onNestedOpenChange = jest.fn();
			render(
				<NestedMenus
					shouldRootAccept={false}
					shouldNestedAccept
					onRootOpenChange={onRootOpenChange}
					onNestedOpenChange={onNestedOpenChange}
				/>,
			);
			await openBoth();
			onRootOpenChange.mockClear();
			onNestedOpenChange.mockClear();

			await userEvent.tab();
			await flushTasks();

			expect(onNestedOpenChange).toHaveBeenCalledTimes(1);
			expect(onNestedOpenChange.mock.calls[0][0].event).toHaveProperty('key', 'Tab');
			expect(onRootOpenChange).toHaveBeenCalledTimes(1);
			expect(onRootOpenChange.mock.calls[0][0].event).toHaveProperty('key', 'Tab');
			expect(screen.queryByTestId('nested--content')).not.toBeInTheDocument();
			expect(screen.getByTestId('root--content')).toBeVisible();
		});
	});

	describe('sibling menus', () => {
		/**
		 * One open menu at a time, from one piece of state, as Jira `QuickAddItemsCompact` does.
		 */
		function SharedStateMenus() {
			const [openMenu, setOpenMenu] = useState<string | null>(null);
			function getMenuProps(name: string) {
				return {
					testId: name,
					isOpen: openMenu === name,
					onOpenChange: ({ isOpen }: OnOpenChangeArgs) => setOpenMenu(isOpen ? name : null),
					trigger: name,
				};
			}
			return (
				<>
					<DropdownMenu {...getMenuProps('first')}>
						<DropdownItemGroup>
							<DropdownItem>First item</DropdownItem>
						</DropdownItemGroup>
					</DropdownMenu>
					<DropdownMenu {...getMenuProps('second')}>
						<DropdownItemGroup>
							<DropdownItem>Second item</DropdownItem>
						</DropdownItemGroup>
					</DropdownMenu>
				</>
			);
		}

		it('should ask the open menu on a press on the trigger of another menu, which then opens', async () => {
			render(<SharedStateMenus />);
			await userEvent.click(screen.getByTestId('first--trigger'));
			expect(screen.getByTestId('first--content')).toBeVisible();

			await userEvent.click(screen.getByTestId('second--trigger'));
			await flushTasks();

			expect(screen.queryByTestId('first--content')).not.toBeInTheDocument();
			expect(screen.getByTestId('second--content')).toBeVisible();
		});

		it('should keep the first menu open when it refuses, while the other menu opens', async () => {
			const onFirstOpenChange = jest.fn();
			render(
				<>
					<ControlledMenu
						testId="first"
						label="First"
						shouldAccept={false}
						onOpenChange={onFirstOpenChange}
					/>
					<ControlledMenu testId="second" label="Second" shouldAccept />
				</>,
			);
			await userEvent.click(getButton('First'));
			onFirstOpenChange.mockClear();

			await userEvent.click(getButton('Second'));
			await flushTasks();

			expect(onFirstOpenChange).toHaveBeenCalledTimes(1);
			expect(screen.getByTestId('first--content')).toBeVisible();
			expect(screen.getByTestId('second--content')).toBeVisible();
		});
	});
});
