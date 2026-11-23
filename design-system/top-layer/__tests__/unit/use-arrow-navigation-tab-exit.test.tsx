import React, { useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { Popover } from '../../src/popover/popover';
import { isAtCurrentMenuLevel } from '../../src/use-arrow-navigation/is-at-current-menu-level';
import { useArrowNavigation } from '../../src/use-arrow-navigation/use-arrow-navigation';

/**
 * A menu of `manual` popovers that closes on Tab in the `keydown` listener of `useArrowNavigation`,
 * as `DropdownMenu` does. With `shouldAccept={false}` the owner refuses the close.
 */
function Menu({ shouldAccept = true }: { shouldAccept?: boolean }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isNestedOpen, setIsNestedOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const nestedMenuRef = useRef<HTMLDivElement>(null);
	const onClose = useCallback(() => {
		if (!shouldAccept) {
			return;
		}
		flushSync(() => {
			setIsNestedOpen(false);
			setIsOpen(false);
		});
	}, [shouldAccept]);
	useArrowNavigation({
		containerRef: menuRef,
		onClose,
		onNestedOpen: () => setIsNestedOpen(true),
		isEnabled: isOpen,
		filter: isAtCurrentMenuLevel,
	});
	useArrowNavigation({
		containerRef: nestedMenuRef,
		onClose,
		isEnabled: isNestedOpen,
		filter: isAtCurrentMenuLevel,
	});
	return (
		<>
			<button type="button">Before</button>
			<button type="button" aria-haspopup="menu" onClick={() => setIsOpen(true)}>
				Options
			</button>
			<Popover ref={menuRef} mode="manual" isOpen={isOpen} role="menu" label="Options">
				<button type="button" role="menuitem">
					Move
				</button>
				<button type="button" role="menuitem" aria-haspopup="menu">
					More
				</button>
				<Popover ref={nestedMenuRef} mode="manual" isOpen={isNestedOpen} role="menu" label="More">
					<button type="button" role="menuitem">
						Archive
					</button>
				</Popover>
			</Popover>
			<button type="button">After</button>
		</>
	);
}

// A `keydown` sent from script, as Playwright sends keys to Firefox and as user-event does: no
// microtask runs between the listeners and the default action.
function pressKey({ target, key }: { target: Element; key: string }): void {
	act(() => {
		target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
	});
}

function openMenu(): void {
	const trigger = screen.getByRole('button', { name: 'Options' });
	act(() => {
		trigger.focus();
		trigger.click();
	});
	expect(screen.getByRole('menuitem', { name: 'Move' })).toHaveFocus();
}

function openNestedMenu(): void {
	openMenu();
	const nestedTrigger = screen.getByRole('menuitem', { name: 'More' });
	act(() => {
		nestedTrigger.focus();
	});
	pressKey({ target: nestedTrigger, key: 'ArrowRight' });
	act(() => {
		screen.getByRole('menuitem', { name: 'Archive' }).focus();
	});
}

/**
 * jsdom does not move focus for a Tab, so these tests check that focus is on the trigger when the
 * `keydown` dispatch returns. The Playwright spec
 * `manual-menu-tab-exit.spec.tsx` checks where the Tab then moves focus, in Chromium, Firefox and
 * WebKit.
 */
describe('useArrowNavigation: Tab out of a menu of manual popovers', () => {
	it('should be accessible with the menu open', async () => {
		const { container } = render(<Menu />);
		openMenu();

		await expect(container).toBeAccessible();
	});

	it('returns focus to the trigger within the Tab keydown, before the browser acts on the key', () => {
		render(<Menu />);
		openMenu();

		pressKey({ target: screen.getByRole('menuitem', { name: 'Move' }), key: 'Tab' });

		expect(screen.getByRole('button', { name: 'Options' })).toHaveFocus();
	});

	it('closes the nested menu too, and returns focus to the root trigger within the Tab keydown', () => {
		render(<Menu />);
		openNestedMenu();

		pressKey({ target: screen.getByRole('menuitem', { name: 'Archive' }), key: 'Tab' });

		expect(screen.getByRole('button', { name: 'Options' })).toHaveFocus();
	});

	it('leaves focus in the menu when the owner refuses the Tab close', () => {
		render(<Menu shouldAccept={false} />);
		openMenu();

		pressKey({ target: screen.getByRole('menuitem', { name: 'Move' }), key: 'Tab' });

		expect(screen.getByRole('menu', { name: 'Options' })).toBeInTheDocument();
		expect(screen.getByRole('menuitem', { name: 'Move' })).toHaveFocus();
	});
});
