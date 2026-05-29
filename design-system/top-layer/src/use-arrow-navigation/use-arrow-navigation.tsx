import { type RefObject, useCallback, useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { getDocument } from '@atlaskit/browser-apis';
import { KEY_DOWN, KEY_END, KEY_HOME, KEY_TAB, KEY_UP } from '@atlaskit/ds-lib/keycodes';

import {
	getFirstFocusable,
	getLastFocusable,
	getNextFocusable,
	type TFocusableFilter,
} from '../focus';

const menuScope = '[role="menu"]';

/**
 * Args for `useArrowNavigation`.
 *
 * Keyboard contract:
 * - `ArrowDown` / `ArrowUp` move within the current menu level.
 * - `Home` / `End` jump to first / last.
 * - `ArrowRight` / `ArrowLeft` opens / closes nested submenus.
 * - `Tab` / `Shift+Tab` dismiss the menu (matching the ARIA APG menu pattern,
 *   plus Radix UI / Headless UI / React Aria / Floating UI conventions).
 *   Symmetric in both directions: there is no special-case for the last
 *   item that lets Tab leave the menu without dismissing it.
 * - `Page Up` / `Page Down`: NOT handled - extend via your own listener if
 *   your menu needs page-style scrolling.
 */
export type TUseArrowNavigationArgs = {
	/**
	 * Ref to the container element that holds the focusable items.
	 */
	containerRef: RefObject<HTMLElement | null>;

	/**
	 * Called when ArrowRight is pressed on a focused element with `aria-haspopup`.
	 *
	 * This follows the WAI-ARIA menu pattern: ArrowRight on a menu item that
	 * controls a submenu should open that submenu. The consumer decides *how*
	 * to open it (e.g. `trigger.click()`, imperative state update, etc.).
	 *
	 * Only fires when `filter` (if provided) confirms the focused element
	 * belongs to the current menu level.
	 */
	onNestedOpen?: ({ trigger }: { trigger: HTMLElement }) => void;

	/**
	 * Called when ArrowLeft is pressed and the current menu is nested
	 * (i.e. the container is inside another `role="menu"`).
	 *
	 * This follows the WAI-ARIA menu pattern: ArrowLeft in a submenu
	 * should close it and return to the parent menu. The consumer
	 * decides *how* to close (e.g. calling their close handler).
	 */
	onNestedClose?: () => void;

	/**
	 * Called when the user presses Tab to exit the menu.
	 */
	onClose: () => void;

	/**
	 * When false, the keydown listener is not attached.
	 * Defaults to true.
	 */
	isEnabled?: boolean;

	/**
	 * Optional filter to restrict which focusable elements are navigated.
	 * When provided, only elements that pass the filter will be focused.
	 *
	 * The filter is also used as a guard on the currently focused element:
	 * if the focused element does not pass the filter, the handler bails out.
	 * This prevents parent menu handlers from acting on events that belong
	 * to a nested menu.
	 *
	 * A common filter is `isAtCurrentMenuLevel` which excludes items inside
	 * nested `role="menu"` sub-containers.
	 */
	filter?: TFocusableFilter;
};

/**
 * Provides arrow key navigation for menu containers.
 *
 * Uses the focusable helpers from `@atlaskit/top-layer/focus` to manage
 * DOM-based focus movement within a container.
 *
 * - **ArrowDown / ArrowUp**: Move focus to the next/previous item (wraps).
 * - **Home / End**: Move focus to the first/last item.
 * - **Tab**: Calls `onClose` to exit the menu.
 *
 * When a `filter` is provided, it is used both for scoping focusable
 * elements and as a guard to prevent parent menu handlers from acting
 * on events that belong to a nested menu.
 *
 * @example Basic usage
 * ```tsx
 * useArrowNavigation({
 *   containerRef: menuRef,
 *   onClose: () => setIsOpen(false),
 *   isEnabled: isOpen,
 * });
 * ```
 *
 * @example With nested menu filter
 * ```tsx
 * import { useArrowNavigation, isAtCurrentMenuLevel } from '@atlaskit/top-layer/use-arrow-navigation';
 *
 * useArrowNavigation({
 *   containerRef: menuRef,
 *   onClose: () => setIsOpen(false),
 *   isEnabled: isOpen,
 *   filter: isAtCurrentMenuLevel,
 * });
 * ```
 */
export function useArrowNavigation({
	containerRef,
	onClose,
	onNestedOpen,
	onNestedClose,
	isEnabled = true,
	filter,
}: TUseArrowNavigationArgs): void {
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const container = containerRef.current;
			if (!container) {
				return;
			}

			// Guard: only handle the event if the currently focused element
			// belongs to this menu level. The focused element's closest
			// [role="menu"] must be this container (not a nested sub-menu).
			// When no filter is provided, fall back to the closest-menu check
			// if the container has role="menu".
			const focused = getDocument()?.activeElement;
			if (focused instanceof HTMLElement) {
				if (filter) {
					if (!filter(focused, container)) {
						return;
					}
				}
				if (
					!filter &&
					container.getAttribute('role') === 'menu' &&
					focused.closest(menuScope) !== container
				) {
					return;
				}
			}

			if (event.key === KEY_DOWN) {
				// Prevent page scroll while navigating menu items.
				event.preventDefault();
				getNextFocusable({ container, direction: 'forwards', filter })?.focus();
				return;
			}

			if (event.key === KEY_UP) {
				// Prevent page scroll while navigating menu items.
				event.preventDefault();
				getNextFocusable({ container, direction: 'backwards', filter })?.focus();
				return;
			}

			if (event.key === KEY_HOME) {
				// Prevent browser default (e.g. scrolling to top of page).
				event.preventDefault();
				getFirstFocusable({ container, filter })?.focus();
				return;
			}

			if (event.key === KEY_END) {
				// Prevent browser default (e.g. scrolling to bottom of page).
				event.preventDefault();
				getLastFocusable({ container, filter })?.focus();
				return;
			}

			if (event.key === KEY_TAB) {
				onClose();
				return;
			}

			// ── Nested menu navigation (WAI-ARIA menu pattern) ──
			// ArrowRight on a menuitem with aria-haspopup opens the submenu.
			if (event.key === 'ArrowRight') {
				if (
					onNestedOpen &&
					focused instanceof HTMLElement &&
					focused.hasAttribute('aria-haspopup')
				) {
					event.preventDefault();
					onNestedOpen({ trigger: focused });
				}
				return;
			}

			// ArrowLeft closes the current menu if it is nested inside a parent menu.
			if (event.key === 'ArrowLeft') {
				if (onNestedClose) {
					// Only close if this container is inside another role="menu"
					// (i.e. it is a submenu, not the top-level menu).
					// Walk up from the parent to avoid matching the container itself.
					const isNested = container.parentElement?.closest(menuScope) !== null;
					if (isNested) {
						event.preventDefault();
						onNestedClose();
					}
				}
				return;
			}
		},
		[containerRef, onClose, onNestedOpen, onNestedClose, filter],
	);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || !isEnabled) {
			return;
		}

		return bind(container, {
			type: 'keydown',
			listener: handleKeyDown,
		});
	}, [containerRef, handleKeyDown, isEnabled]);
}
